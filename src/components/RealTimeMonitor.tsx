import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { Activity, Cpu, MemoryStick, HardDrive, Wifi, TrendingUp, TrendingDown } from 'lucide-react';

interface ResourceData {
  timestamp: string;
  cpu: number;
  memory: number;
  storage: number;
  network: number;
}

interface Metric {
  name: string;
  value: number;
  change: number;
  icon: React.ElementType;
  color: string;
}

const RealTimeMonitor = () => {
  const [data, setData] = useState<ResourceData[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Simulate WebSocket connection
  useEffect(() => {
    setIsConnected(true);
    
    const interval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString();
      const newData: ResourceData = {
        timestamp,
        cpu: Math.floor(Math.random() * 40) + 30, // 30-70%
        memory: Math.floor(Math.random() * 30) + 40, // 40-70%
        storage: Math.floor(Math.random() * 20) + 60, // 60-80%
        network: Math.floor(Math.random() * 50) + 20, // 20-70%
      };

      setData(prev => {
        const updated = [...prev, newData];
        return updated.slice(-20); // Keep last 20 data points
      });
    }, 2000);

    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, []);

  const currentMetrics: Metric[] = data.length > 0 ? [
    {
      name: 'CPU Usage',
      value: data[data.length - 1]?.cpu || 0,
      change: data.length > 1 ? data[data.length - 1].cpu - data[data.length - 2].cpu : 0,
      icon: Cpu,
      color: 'hsl(var(--chart-1))'
    },
    {
      name: 'Memory',
      value: data[data.length - 1]?.memory || 0,
      change: data.length > 1 ? data[data.length - 1].memory - data[data.length - 2].memory : 0,
      icon: MemoryStick,
      color: 'hsl(var(--chart-2))'
    },
    {
      name: 'Storage',
      value: data[data.length - 1]?.storage || 0,
      change: data.length > 1 ? data[data.length - 1].storage - data[data.length - 2].storage : 0,
      icon: HardDrive,
      color: 'hsl(var(--chart-3))'
    },
    {
      name: 'Network',
      value: data[data.length - 1]?.network || 0,
      change: data.length > 1 ? data[data.length - 1].network - data[data.length - 2].network : 0,
      icon: Wifi,
      color: 'hsl(var(--chart-4))'
    }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full animate-pulse ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-sm text-muted-foreground">
          {isConnected ? 'Connected - Real-time monitoring active' : 'Disconnected'}
        </span>
      </div>

      {/* Current Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentMetrics.map((metric) => {
          const Icon = metric.icon;
          const isPositive = metric.change > 0;
          const ChangeIcon = isPositive ? TrendingUp : TrendingDown;
          
          return (
            <Card key={metric.name} className="animate-fade-in">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" style={{ color: metric.color }} />
                    <span className="text-sm font-medium">{metric.name}</span>
                  </div>
                  <Badge variant={isPositive ? "destructive" : "secondary"} className="text-xs">
                    <ChangeIcon className="h-3 w-3 mr-1" />
                    {Math.abs(metric.change).toFixed(1)}%
                  </Badge>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold">{metric.value}%</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Real-time Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU & Memory Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              CPU & Memory Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="timestamp" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="cpu" 
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth={2}
                  dot={false}
                  name="CPU %"
                />
                <Line 
                  type="monotone" 
                  dataKey="memory" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  dot={false}
                  name="Memory %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Storage & Network Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Storage & Network
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="timestamp" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="storage"
                  stackId="1"
                  stroke="hsl(var(--chart-3))"
                  fill="hsl(var(--chart-3))"
                  fillOpacity={0.6}
                  name="Storage %"
                />
                <Area
                  type="monotone"
                  dataKey="network"
                  stackId="1"
                  stroke="hsl(var(--chart-4))"
                  fill="hsl(var(--chart-4))"
                  fillOpacity={0.6}
                  name="Network %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeMonitor;