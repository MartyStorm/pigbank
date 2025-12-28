import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MousePointer2, Eye, Loader2, RefreshCw, Users, User, Circle, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";

interface AnalyticsEvent {
  id: string;
  sessionId: string;
  userId: string | null;
  isAuthenticated: boolean;
  pageUrl: string;
  pageTitle: string | null;
  eventType: string;
  x: number;
  y: number;
  viewportWidth: number;
  viewportHeight: number;
  elementTag: string | null;
  elementId: string | null;
  elementClass: string | null;
  elementText: string | null;
  createdAt: string;
}

interface PageStats {
  pageUrl: string;
  count: number;
}

interface TrackedUser {
  userId: string | null;
  sessionId: string;
  isAuthenticated: boolean;
  user?: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  } | null;
  clickCount: number;
  lastSeen: string;
}

interface ActiveSession {
  sessionId: string;
  userId: string | null;
  isAuthenticated: boolean;
  lastPageUrl: string | null;
  lastSeen: string;
  user?: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  } | null;
}

export default function Heatmaps() {
  const { user } = useAuth();
  const [selectedPage, setSelectedPage] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<{ type: "session" | "user"; id: string } | null>(null);
  const [viewportWidth] = useState(1200);
  const [viewportHeight] = useState(800);

  const isStaff = user?.role === "pigbank_staff" || user?.role === "pigbank_admin";

  const { data: stats, isLoading: isLoadingStats } = useQuery<{ totalEvents: number; topPages: PageStats[]; activeUsers: number }>({
    queryKey: ["/api/analytics/stats"],
    queryFn: async () => {
      const res = await fetch("/api/analytics/stats", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    enabled: isStaff,
    refetchInterval: 30000,
  });

  const { data: trackedUsers, isLoading: isLoadingUsers, refetch: refetchUsers } = useQuery<TrackedUser[]>({
    queryKey: ["/api/analytics/users"],
    queryFn: async () => {
      const res = await fetch("/api/analytics/users", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch tracked users");
      return res.json();
    },
    enabled: isStaff,
  });

  const { data: activeSessions } = useQuery<ActiveSession[]>({
    queryKey: ["/api/analytics/active"],
    queryFn: async () => {
      const res = await fetch("/api/analytics/active?minutes=5", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch active sessions");
      return res.json();
    },
    enabled: isStaff,
    refetchInterval: 30000,
  });

  const { data: events, isLoading: isLoadingEvents, refetch } = useQuery<AnalyticsEvent[]>({
    queryKey: ["/api/analytics/events", selectedPage, selectedUser],
    queryFn: async () => {
      let url: string;
      if (selectedUser) {
        if (selectedUser.type === "user") {
          url = `/api/analytics/events/user/${selectedUser.id}?limit=5000`;
        } else {
          url = `/api/analytics/events/session/${selectedUser.id}?limit=5000`;
        }
      } else if (selectedPage) {
        url = `/api/analytics/events?pageUrl=${encodeURIComponent(selectedPage)}&limit=5000`;
      } else {
        url = `/api/analytics/events?limit=5000`;
      }
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    },
    enabled: isStaff,
  });

  if (!isStaff) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <MousePointer2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Staff Access Required</h2>
              <p className="text-gray-500">This page is only available to PigBank staff members.</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const normalizeCoordinates = (event: AnalyticsEvent) => {
    const scaleX = viewportWidth / event.viewportWidth;
    const scaleY = viewportHeight / event.viewportHeight;
    return {
      x: Math.round(event.x * scaleX),
      y: Math.round(event.y * scaleY),
    };
  };

  const generateHeatmapPoints = () => {
    if (!events || events.length === 0) return [];
    
    const pointCounts: Record<string, number> = {};
    const gridSize = 20;
    
    events.forEach(event => {
      const { x, y } = normalizeCoordinates(event);
      const gridX = Math.floor(x / gridSize) * gridSize;
      const gridY = Math.floor(y / gridSize) * gridSize;
      const key = `${gridX},${gridY}`;
      pointCounts[key] = (pointCounts[key] || 0) + 1;
    });
    
    const maxCount = Math.max(...Object.values(pointCounts), 1);
    
    return Object.entries(pointCounts).map(([key, count]) => {
      const [x, y] = key.split(",").map(Number);
      const intensity = count / maxCount;
      return { x, y, count, intensity };
    });
  };

  const heatmapPoints = generateHeatmapPoints();

  const getHeatColor = (intensity: number) => {
    if (intensity > 0.8) return "rgba(255, 0, 0, 0.7)";
    if (intensity > 0.6) return "rgba(255, 100, 0, 0.6)";
    if (intensity > 0.4) return "rgba(255, 200, 0, 0.5)";
    if (intensity > 0.2) return "rgba(200, 255, 0, 0.4)";
    return "rgba(0, 255, 100, 0.3)";
  };

  const getUserDisplayName = (trackedUser: TrackedUser | ActiveSession) => {
    if (trackedUser.user) {
      const name = [trackedUser.user.firstName, trackedUser.user.lastName].filter(Boolean).join(" ");
      return name || trackedUser.user.email;
    }
    return `Guest #${trackedUser.sessionId.slice(0, 6)}`;
  };

  const isUserOnline = (sessionId: string) => {
    return activeSessions?.some(s => s.sessionId === sessionId) || false;
  };

  const handleRefreshAll = () => {
    refetch();
    refetchUsers();
  };

  const handleUserClick = (trackedUser: TrackedUser) => {
    if (trackedUser.isAuthenticated && trackedUser.userId) {
      setSelectedUser({ type: "user", id: trackedUser.userId });
    } else {
      setSelectedUser({ type: "session", id: trackedUser.sessionId });
    }
    setSelectedPage("");
  };

  const clearUserFilter = () => {
    setSelectedUser(null);
  };

  return (
    <Layout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Heatmaps</h1>
            <p className="text-muted-foreground">Visualize where users click and tap on your pages</p>
          </div>
          <Button onClick={handleRefreshAll} variant="outline" data-testid="button-refresh">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-[#73cb43]/20">
                  <MousePointer2 className="h-6 w-6 text-[#73cb43]" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.totalEvents?.toLocaleString() || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Clicks</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-[#73cb43]/20">
                  <Eye className="h-6 w-6 text-[#73cb43]" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.topPages?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Pages Tracked</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-[#73cb43]/20">
                  <Users className="h-6 w-6 text-[#73cb43]" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{trackedUsers?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-100 relative">
                  <User className="h-6 w-6 text-green-600" />
                  <Circle className="h-3 w-3 text-green-500 fill-green-500 absolute -top-1 -right-1 animate-pulse" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-700">{stats?.activeUsers || 0}</p>
                  <p className="text-sm text-green-600">Online Now</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <label className="text-sm font-medium text-muted-foreground block mb-2">Filter by Page</label>
              <Select 
                value={selectedPage || "all"} 
                onValueChange={(v) => {
                  setSelectedPage(v === "all" ? "" : v);
                  setSelectedUser(null);
                }}
              >
                <SelectTrigger data-testid="select-page">
                  <SelectValue placeholder="All pages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All pages</SelectItem>
                  {stats?.topPages?.map((page) => (
                    <SelectItem key={page.pageUrl} value={page.pageUrl}>
                      {page.pageUrl} ({page.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Click Heatmap</span>
                  <div className="flex items-center gap-2">
                    {selectedUser && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {selectedUser.type === "user" ? "User" : "Session"}: {selectedUser.id.slice(0, 8)}...
                        <button onClick={clearUserFilter} className="ml-1 hover:text-red-500">×</button>
                      </Badge>
                    )}
                    {selectedPage && <Badge variant="outline">{selectedPage}</Badge>}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingStats || isLoadingEvents ? (
                  <div className="flex items-center justify-center h-[500px]">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : events && events.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[500px] text-center">
                    <MousePointer2 className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-1">No click data yet</h3>
                    <p className="text-muted-foreground max-w-md">
                      {selectedUser 
                        ? "This user hasn't generated any click data yet."
                        : "Click data will appear here as users interact with your site."
                      }
                    </p>
                  </div>
                ) : (
                  <div 
                    className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
                    style={{ width: "100%", height: viewportHeight, maxWidth: viewportWidth }}
                    data-testid="heatmap-canvas"
                  >
                    {selectedPage ? (
                      <iframe
                        src={selectedPage}
                        className="absolute inset-0 w-full h-full border-0 pointer-events-none"
                        title="Page Preview"
                        style={{ transform: "scale(1)", transformOrigin: "top left" }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center justify-center">
                        <Eye className="h-12 w-12 text-muted-foreground mb-3" />
                        <p className="text-foreground font-medium">Select a specific page above</p>
                        <p className="text-muted-foreground text-sm">to see the heatmap overlaid on the actual page</p>
                      </div>
                    )}
                    
                    <svg 
                      className="absolute inset-0 pointer-events-none"
                      width="100%" 
                      height="100%"
                      viewBox={`0 0 ${viewportWidth} ${viewportHeight}`}
                      preserveAspectRatio="xMidYMid meet"
                      style={{ mixBlendMode: "multiply" }}
                    >
                      <defs>
                        <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
                        </filter>
                      </defs>
                      {heatmapPoints.map((point, index) => (
                        <circle
                          key={index}
                          cx={point.x}
                          cy={point.y}
                          r={20 + point.intensity * 20}
                          fill={getHeatColor(point.intensity)}
                          filter="url(#blur)"
                        />
                      ))}
                    </svg>

                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm z-10">
                      <p className="text-xs font-medium text-gray-700 mb-2">Intensity</p>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded" style={{ background: "rgba(0, 255, 100, 0.5)" }} />
                        <div className="w-4 h-4 rounded" style={{ background: "rgba(200, 255, 0, 0.5)" }} />
                        <div className="w-4 h-4 rounded" style={{ background: "rgba(255, 200, 0, 0.5)" }} />
                        <div className="w-4 h-4 rounded" style={{ background: "rgba(255, 100, 0, 0.6)" }} />
                        <div className="w-4 h-4 rounded" style={{ background: "rgba(255, 0, 0, 0.7)" }} />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Low</span>
                        <span>High</span>
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm z-10">
                      <p className="text-sm font-medium text-gray-900">{events?.length.toLocaleString()} clicks</p>
                    </div>
                    
                    {selectedPage && (
                      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm z-10">
                        <p className="text-sm font-medium text-white">{selectedPage}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Circle className="h-3 w-3 text-green-500 fill-green-500 animate-pulse" />
                  Online Now ({activeSessions?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {isLoadingUsers ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  </div>
                ) : activeSessions && activeSessions.length > 0 ? (
                  <ScrollArea className="h-[150px]">
                    <div className="space-y-2">
                      {activeSessions.map((session) => (
                        <div 
                          key={session.sessionId}
                          className="flex items-center gap-2 p-2 rounded-lg bg-green-50 border border-green-100 cursor-pointer hover:bg-green-100 transition-colors"
                          onClick={() => {
                            if (session.userId) {
                              setSelectedUser({ type: "user", id: session.userId });
                            } else {
                              setSelectedUser({ type: "session", id: session.sessionId });
                            }
                            setSelectedPage("");
                          }}
                          data-testid={`active-user-${session.sessionId.slice(0, 6)}`}
                        >
                          <Circle className="h-2 w-2 text-green-500 fill-green-500 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {getUserDisplayName(session)}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {session.lastPageUrl || "Unknown page"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No users online</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  All Tracked Users
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {isLoadingUsers ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  </div>
                ) : trackedUsers && trackedUsers.length > 0 ? (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {trackedUsers.map((trackedUser) => {
                        const isOnline = isUserOnline(trackedUser.sessionId);
                        const isSelected = selectedUser && (
                          (selectedUser.type === "user" && selectedUser.id === trackedUser.userId) ||
                          (selectedUser.type === "session" && selectedUser.id === trackedUser.sessionId)
                        );
                        
                        return (
                          <div 
                            key={trackedUser.sessionId}
                            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                              isSelected 
                                ? "bg-[#73cb43]/20 border border-[#73cb43]/30" 
                                : "bg-muted hover:bg-muted/80 border border-transparent"
                            }`}
                            onClick={() => handleUserClick(trackedUser)}
                            data-testid={`tracked-user-${trackedUser.sessionId.slice(0, 6)}`}
                          >
                            <div className="relative shrink-0">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                                trackedUser.isAuthenticated 
                                  ? "bg-[#73cb43]/20 text-[#73cb43]" 
                                  : "bg-muted text-muted-foreground"
                              }`}>
                                {trackedUser.isAuthenticated ? (
                                  trackedUser.user?.firstName?.charAt(0) || trackedUser.user?.email?.charAt(0).toUpperCase() || "U"
                                ) : (
                                  "G"
                                )}
                              </div>
                              {isOnline && (
                                <Circle className="h-2.5 w-2.5 text-green-500 fill-green-500 absolute -bottom-0.5 -right-0.5 border-2 border-white rounded-full" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1">
                                <p className="text-sm font-medium truncate">
                                  {getUserDisplayName(trackedUser)}
                                </p>
                                {trackedUser.isAuthenticated && (
                                  <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">Auth</Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{trackedUser.clickCount} clicks</span>
                                <span>•</span>
                                <span className="flex items-center gap-0.5">
                                  <Clock className="h-3 w-3" />
                                  {formatDistanceToNow(new Date(trackedUser.lastSeen), { addSuffix: true })}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No tracked users yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {stats?.topPages && stats.topPages.length > 0 && !selectedUser && (
          <Card>
            <CardHeader>
              <CardTitle>Top Pages by Clicks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topPages.slice(0, 10).map((page, index) => (
                  <div 
                    key={page.pageUrl} 
                    className="flex items-center justify-between p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                    onClick={() => {
                      setSelectedPage(page.pageUrl);
                      setSelectedUser(null);
                    }}
                    data-testid={`page-row-${index}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground w-6">{index + 1}</span>
                      <span className="font-medium text-foreground">{page.pageUrl}</span>
                    </div>
                    <Badge variant="secondary">{page.count.toLocaleString()} clicks</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
