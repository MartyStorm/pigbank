import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { storage } from "./storage";
import { z } from "zod";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET || "pigbank-secret-key-change-in-production",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: sessionTtl,
    },
  });
}

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

function getRedirectUrlForRole(role: string | null): string {
  switch (role) {
    case 'merchant_pending':
      return '/onboarding';
    case 'merchant':
      return '/dashboard';
    case 'pigbank_staff':
    case 'pigbank_admin':
      return '/team/merchants';
    default:
      return '/onboarding';
  }
}

function setupGoogleAuth() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    console.log("Google OAuth not configured - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET required");
    return false;
  }

  let callbackURL: string;
  if (process.env.GOOGLE_CALLBACK_URL) {
    callbackURL = process.env.GOOGLE_CALLBACK_URL;
  } else if (process.env.REPLIT_DEPLOYMENT && process.env.REPLIT_DEPLOYMENT_URL) {
    callbackURL = `https://${process.env.REPLIT_DEPLOYMENT_URL}/api/auth/google/callback`;
  } else if (process.env.REPLIT_DEV_DOMAIN) {
    callbackURL = `https://${process.env.REPLIT_DEV_DOMAIN}/api/auth/google/callback`;
  } else {
    callbackURL = `http://localhost:5000/api/auth/google/callback`;
  }

  passport.use(new GoogleStrategy({
    clientID: clientId,
    clientSecret: clientSecret,
    callbackURL: callbackURL,
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error("No email found in Google profile"), undefined);
      }

      const profileImageUrl = profile.photos?.[0]?.value;
      let user = await storage.getUserByEmail(email);
      
      if (!user) {
        user = await storage.createUser({
          email: email,
          password: null,
          firstName: profile.name?.givenName,
          lastName: profile.name?.familyName,
          profileImageUrl: profileImageUrl,
        });
      } else {
        // Update profile picture and name if changed
        user = await storage.updateUser(user.id, {
          firstName: profile.name?.givenName,
          lastName: profile.name?.familyName,
          profileImageUrl: profileImageUrl,
        }) || user;
      }

      return done(null, user);
    } catch (error) {
      return done(error as Error, undefined);
    }
  }));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user || null);
    } catch (error) {
      done(error, null);
    }
  });

  return true;
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  const googleConfigured = setupGoogleAuth();
  
  if (googleConfigured) {
    app.use(passport.initialize());
    app.use(passport.session());

    app.get("/api/auth/google", passport.authenticate("google", {
      scope: ["profile", "email"],
    }));

    app.get("/api/auth/google/callback", 
      passport.authenticate("google", { 
        failureRedirect: "/login?error=google_auth_failed",
      }),
      (req, res) => {
        const user = req.user as any;
        if (user) {
          (req.session as any).userId = user.id;
          const redirectUrl = getRedirectUrlForRole(user.role);
          res.redirect(redirectUrl);
        } else {
          res.redirect("/");
        }
      }
    );
  }

  app.get("/api/auth/google/available", (req, res) => {
    res.json({ available: googleConfigured });
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      const user = await storage.createUser({
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
      });

      (req.session as any).userId = user.id;
      
      res.status(201).json({ 
        id: user.id, 
        email: user.email, 
        firstName: user.firstName, 
        lastName: user.lastName,
        role: user.role,
        merchantId: user.merchantId,
        redirectUrl: getRedirectUrlForRole(user.role)
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      if (!user.password || user.password === '') {
        return res.status(401).json({ message: "Account requires password reset. Please contact support." });
      }

      const isValidPassword = await bcrypt.compare(validatedData.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      (req.session as any).userId = user.id;
      
      res.json({ 
        id: user.id, 
        email: user.email, 
        firstName: user.firstName, 
        lastName: user.lastName,
        role: user.role,
        merchantId: user.merchantId,
        redirectUrl: getRedirectUrlForRole(user.role)
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/user", async (req, res) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    
    const userId = (req.session as any).userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      // Fetch merchant info if user has a merchantId
      let merchantName: string | null = null;
      if (user.merchantId) {
        const merchant = await storage.getMerchant(user.merchantId);
        if (merchant) {
          merchantName = merchant.dba || merchant.legalBusinessName || null;
        }
      }
      
      res.json({ 
        id: user.id, 
        email: user.email, 
        firstName: user.firstName, 
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        role: user.role,
        merchantId: user.merchantId,
        merchantName,
        redirectUrl: getRedirectUrlForRole(user.role),
        demoActive: user.demoActive
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const userId = (req.session as any).userId;
  
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    (req as any).user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export function requireRole(...allowedRoles: string[]): RequestHandler {
  return async (req, res, next) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient permissions" });
    }
    next();
  };
}

export const isPigBankStaff: RequestHandler = requireRole('pigbank_staff', 'pigbank_admin');
export const isPigBankAdmin: RequestHandler = requireRole('pigbank_admin');
export const isMerchant: RequestHandler = requireRole('merchant', 'merchant_pending');
export const isApprovedMerchant: RequestHandler = requireRole('merchant');
