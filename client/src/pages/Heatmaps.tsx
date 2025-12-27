import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MousePointer2, Eye, Loader2, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AnalyticsEvent {
  id: string;
  sessionId: string;
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

export default function Heatmaps() {
  const { user } = useAuth();
  const [selectedPage, setSelectedPage] = useState<string>("");
  const [viewportWidth] = useState(1200);
  const [viewportHeight] = useState(800);

  const isStaff = user?.role === "pigbank_staff" || user?.role === "pigbank_admin";

  const { data: stats, isLoading: isLoadingStats } = useQuery<{ totalEvents: number; topPages: PageStats[] }>({
    queryKey: ["/api/analytics/stats"],
    enabled: isStaff,
  });

  const { data: events, isLoading: isLoadingEvents, refetch } = useQuery<AnalyticsEvent[]>({
    queryKey: ["/api/analytics/events", selectedPage],
    queryFn: async () => {
      const url = selectedPage 
        ? `/api/analytics/events?pageUrl=${encodeURIComponent(selectedPage)}&limit=5000`
        : `/api/analytics/events?limit=5000`;
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

  return (
    <Layout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Heatmaps</h1>
            <p className="text-gray-500">Visualize where users click and tap on your pages</p>
          </div>
          <Button onClick={() => refetch()} variant="outline" data-testid="button-refresh">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-100">
                  <MousePointer2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.totalEvents?.toLocaleString() || 0}</p>
                  <p className="text-sm text-gray-500">Total Clicks</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-100">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.topPages?.length || 0}</p>
                  <p className="text-sm text-gray-500">Pages Tracked</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <label className="text-sm font-medium text-gray-500 block mb-2">Select Page</label>
              <Select value={selectedPage} onValueChange={setSelectedPage}>
                <SelectTrigger data-testid="select-page">
                  <SelectValue placeholder="All pages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All pages</SelectItem>
                  {stats?.topPages?.map((page) => (
                    <SelectItem key={page.pageUrl} value={page.pageUrl}>
                      {page.pageUrl} ({page.count} clicks)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Click Heatmap</span>
              {selectedPage && <Badge variant="outline">{selectedPage}</Badge>}
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
                <h3 className="text-lg font-medium text-gray-900 mb-1">No click data yet</h3>
                <p className="text-gray-500 max-w-md">
                  Click data will appear here as users interact with your site. 
                  Start browsing around to generate some data!
                </p>
              </div>
            ) : (
              <div 
                className="relative bg-gray-100 rounded-lg overflow-hidden"
                style={{ width: "100%", height: viewportHeight, maxWidth: viewportWidth }}
                data-testid="heatmap-canvas"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200">
                  <div className="absolute top-4 left-4 right-4 h-12 bg-white rounded shadow-sm flex items-center px-4">
                    <div className="w-3 h-3 rounded-full bg-red-400 mr-2" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2" />
                    <div className="w-3 h-3 rounded-full bg-green-400 mr-4" />
                    <div className="flex-1 h-6 bg-gray-100 rounded text-xs flex items-center justify-center text-gray-400">
                      {selectedPage || "All Pages"}
                    </div>
                  </div>
                  <div className="absolute top-20 left-4 right-4 bottom-4 bg-white rounded shadow-sm" />
                </div>
                
                <svg 
                  className="absolute inset-0 pointer-events-none"
                  width="100%" 
                  height="100%"
                  viewBox={`0 0 ${viewportWidth} ${viewportHeight}`}
                  preserveAspectRatio="xMidYMid meet"
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

                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm">
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

                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
                  <p className="text-sm font-medium text-gray-900">{events?.length.toLocaleString()} clicks</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {stats?.topPages && stats.topPages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Top Pages by Clicks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topPages.slice(0, 10).map((page, index) => (
                  <div 
                    key={page.pageUrl} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setSelectedPage(page.pageUrl)}
                    data-testid={`page-row-${index}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-400 w-6">{index + 1}</span>
                      <span className="font-medium">{page.pageUrl}</span>
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
