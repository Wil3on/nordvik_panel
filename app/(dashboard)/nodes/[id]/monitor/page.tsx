"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Card, 
  CardHeader,
  CardBody,
  Button, 
  Chip,
  Divider,
  Progress,
  Tabs, 
  Tab, 
  Tooltip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from "@nextui-org/react";
import { 
  ArrowLeft, 
  Activity,
  HardDrive,
  Cpu,
  MemoryStick as Memory,
  Network,
  Clock,
  RefreshCw,
  BarChart3,
  List
} from "lucide-react";
import PageHeader from "@/components/ui/page-header";
import LoadingState from "@/components/ui/loading-state";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface MonitoringData {
  timestamp: string;
  status: string;
  uptime: string;
  cpu: {
    usage: number;
    cores: number;
    model: string;
    loadAverage: string[];
  };
  ram: {
    usage: number;
    total: number;
    used: number;
    free: number;
  };
  disk: {
    usage: number;
    total: number;
    used: number;
    free: number;
  };
  network: {
    inbound: number;
    outbound: number;
    totalReceived: number;
    totalSent: number;
  };
  processes: {
    total: number;
    running: number;
    sleeping: number;
    stopped: number;
    zombie: number;
  };
  historical: {
    cpu: number[];
    ram: number[];
    disk: number[];
    network: {
      inbound: number[];
      outbound: number[];
    };
  };
}

interface NodeBasicInfo {
  id: string;
  name: string;
  os: string;
  status: string;
}

export default function NodeMonitorPage() {
  const router = useRouter();
  const { id } = useParams();
  const [node, setNode] = useState<NodeBasicInfo | null>(null);
  const [monitoringData, setMonitoringData] = useState<MonitoringData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState<number>(30); // seconds
  const [activeTab, setActiveTab] = useState("overview");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchNodeBasicInfo();
    fetchMonitoringData();

    // Set up regular refresh interval
    const intervalId = setInterval(fetchMonitoringData, refreshInterval * 1000);
    
    return () => clearInterval(intervalId);
  }, [id, refreshInterval]);

  const fetchNodeBasicInfo = async () => {
    try {
      const response = await fetch(`/api/nodes/${id}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch node details");
      }
      
      const data = await response.json();
      setNode({
        id: data.node.id,
        name: data.node.name,
        os: data.node.os,
        status: data.node.status
      });
    } catch (error) {
      console.error("Error fetching node details:", error);
    }
  };

  const fetchMonitoringData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/nodes/${id}/monitor`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch monitoring data");
      }
      
      const data = await response.json();
      setMonitoringData(data.monitoring);
      setLastUpdated(new Date());
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching monitoring data:", error);
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "ONLINE":
        return "success";
      case "OFFLINE":
        return "danger";
      case "MAINTENANCE":
        return "warning";
      default:
        return "default";
    }
  };

  const getProgressColor = (value: number) => {
    if (value < 50) return "success";
    if (value < 80) return "warning";
    return "danger";
  };

  // Format historical data for charts
  const formatHistoricalData = (type: 'cpu' | 'ram' | 'disk') => {
    if (!monitoringData) return [];
    
    return monitoringData.historical[type].map((value, index) => {
      // Create time labels (last 24 hours, hourly)
      const hour = new Date();
      hour.setHours(hour.getHours() - (23 - index));
      
      return {
        time: `${hour.getHours()}:00`,
        value: value
      };
    });
  };

  // Format network historical data
  const formatNetworkData = () => {
    if (!monitoringData) return [];
    
    return monitoringData.historical.network.inbound.map((inbound, index) => {
      const hour = new Date();
      hour.setHours(hour.getHours() - (23 - index));
      
      return {
        time: `${hour.getHours()}:00`,
        inbound: inbound,
        outbound: monitoringData.historical.network.outbound[index]
      };
    });
  };

  if (isLoading && !monitoringData) {
    return <LoadingState />;
  }

  if (!node) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Node Not Found</h2>
          <p className="mb-6">The node you are looking for does not exist or you don't have permission to view it.</p>
          <Button color="primary" onPress={() => router.push("/nodes")}>
            Back to Nodes
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title={`${node.name} - Monitoring`}
        description={
          <div className="flex items-center gap-2">
            <span>{node.os} Node</span>
            <Chip
              color={getStatusColor(node.status) as any}
              variant="flat"
              size="sm"
            >
              {node.status.toUpperCase()}
            </Chip>
          </div>
        }
        actions={
          <div className="flex gap-2">
            <Button 
              variant="light" 
              startContent={<ArrowLeft size={16} />}
              onPress={() => router.push(`/nodes/${id}`)}
            >
              Back
            </Button>
            <Button 
              color="primary" 
              variant="flat" 
              startContent={<RefreshCw size={16} />}
              onPress={fetchMonitoringData}
              isLoading={isLoading}
            >
              Refresh
            </Button>
          </div>
        }
      />

      <div className="flex justify-between items-center mt-2 mb-4">
        <div className="text-sm text-gray-500">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Refresh interval:</span>
          <select 
            className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
          >
            <option value="10">10 seconds</option>
            <option value="30">30 seconds</option>
            <option value="60">1 minute</option>
            <option value="300">5 minutes</option>
          </select>
        </div>
      </div>

      <Tabs 
        aria-label="Node monitoring tabs" 
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        className="mt-6"
      >
        <Tab
          key="overview"
          title={
            <div className="flex items-center gap-2">
              <Activity size={16} />
              <span>Overview</span>
            </div>
          }
        >
          {monitoringData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {/* CPU Usage Card */}
              <Card>
                <CardHeader className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-5 w-5" />
                    <h3 className="text-lg font-medium">CPU</h3>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="px-6 py-4">
                  <div className="text-3xl font-bold mb-2">{monitoringData.cpu.usage}%</div>
                  <Progress 
                    value={monitoringData.cpu.usage} 
                    color={getProgressColor(monitoringData.cpu.usage) as any}
                    className="h-2 mb-4"
                    showValueLabel={false}
                  />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Cores:</span>
                      <span>{monitoringData.cpu.cores}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Load Avg:</span>
                      <span>{monitoringData.cpu.loadAverage.join(', ')}</span>
                    </div>
                    <div className="text-gray-500 text-xs mt-2 truncate" title={monitoringData.cpu.model}>
                      {monitoringData.cpu.model}
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* RAM Usage Card */}
              <Card>
                <CardHeader className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Memory className="h-5 w-5" />
                    <h3 className="text-lg font-medium">Memory</h3>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="px-6 py-4">
                  <div className="text-3xl font-bold mb-2">{monitoringData.ram.usage}%</div>
                  <Progress 
                    value={monitoringData.ram.usage} 
                    color={getProgressColor(monitoringData.ram.usage) as any}
                    className="h-2 mb-4"
                    showValueLabel={false}
                  />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total:</span>
                      <span>{monitoringData.ram.total} GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Used:</span>
                      <span>{monitoringData.ram.used} GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Free:</span>
                      <span>{monitoringData.ram.free} GB</span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Disk Usage Card */}
              <Card>
                <CardHeader className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5" />
                    <h3 className="text-lg font-medium">Disk</h3>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="px-6 py-4">
                  <div className="text-3xl font-bold mb-2">{monitoringData.disk.usage}%</div>
                  <Progress 
                    value={monitoringData.disk.usage} 
                    color={getProgressColor(monitoringData.disk.usage) as any}
                    className="h-2 mb-4"
                    showValueLabel={false}
                  />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total:</span>
                      <span>{monitoringData.disk.total} GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Used:</span>
                      <span>{monitoringData.disk.used} GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Free:</span>
                      <span>{monitoringData.disk.free} GB</span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Network Usage Card */}
              <Card>
                <CardHeader className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Network className="h-5 w-5" />
                    <h3 className="text-lg font-medium">Network</h3>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="px-6 py-4">
                  <div className="space-y-4 text-sm">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-500">Inbound:</span>
                        <span>{monitoringData.network.inbound} KB/s</span>
                      </div>
                      <Progress 
                        value={Math.min(monitoringData.network.inbound / 10, 100)} 
                        color="primary"
                        className="h-2"
                        showValueLabel={false}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-500">Outbound:</span>
                        <span>{monitoringData.network.outbound} KB/s</span>
                      </div>
                      <Progress 
                        value={Math.min(monitoringData.network.outbound / 5, 100)} 
                        color="secondary"
                        className="h-2"
                        showValueLabel={false}
                      />
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-gray-500">Total Received:</span>
                      <span>{monitoringData.network.totalReceived} GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Sent:</span>
                      <span>{monitoringData.network.totalSent} GB</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {monitoringData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* System Info Card */}
              <Card>
                <CardHeader className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <h3 className="text-lg font-medium">System Information</h3>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="px-6 py-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">System Uptime</h4>
                      <p className="text-lg font-semibold">{monitoringData.uptime}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Processes</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xl font-semibold">{monitoringData.processes.total}</div>
                          <div className="text-xs text-gray-500">Total</div>
                        </div>
                        <div>
                          <div className="text-xl font-semibold">{monitoringData.processes.running}</div>
                          <div className="text-xs text-gray-500">Running</div>
                        </div>
                        <div>
                          <div className="text-xl font-semibold">{monitoringData.processes.sleeping}</div>
                          <div className="text-xs text-gray-500">Sleeping</div>
                        </div>
                        <div>
                          <div className="text-xl font-semibold">{monitoringData.processes.stopped}</div>
                          <div className="text-xs text-gray-500">Stopped</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h4>
                      <p>{new Date(monitoringData.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* CPU Chart */}
              <Card>
                <CardHeader className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    <h3 className="text-lg font-medium">CPU Usage (24h)</h3>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="px-6 py-4">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={formatHistoricalData('cpu')}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="time" stroke="#888" />
                        <YAxis stroke="#888" domain={[0, 100]} />
                        <RechartsTooltip 
                          contentStyle={{ 
                            backgroundColor: '#333', 
                            border: '1px solid #555',
                            borderRadius: '4px'
                          }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#0070F3" 
                          fill="#0070F3" 
                          fillOpacity={0.2} 
                          name="CPU Usage (%)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
        </Tab>

        <Tab
          key="charts"
          title={
            <div className="flex items-center gap-2">
              <BarChart3 size={16} />
              <span>Charts</span>
            </div>
          }
        >
          {monitoringData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* RAM Chart */}
              <Card>
                <CardHeader className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Memory className="h-5 w-5" />
                    <h3 className="text-lg font-medium">Memory Usage (24h)</h3>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="px-6 py-4">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={formatHistoricalData('ram')}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="time" stroke="#888" />
                        <YAxis stroke="#888" domain={[0, 100]} />
                        <RechartsTooltip 
                          contentStyle={{ 
                            backgroundColor: '#333', 
                            border: '1px solid #555',
                            borderRadius: '4px'
                          }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#9333EA" 
                          fill="#9333EA" 
                          fillOpacity={0.2} 
                          name="RAM Usage (%)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>

              {/* Disk Chart */}
              <Card>
                <CardHeader className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5" />
                    <h3 className="text-lg font-medium">Disk Usage (24h)</h3>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="px-6 py-4">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={formatHistoricalData('disk')}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="time" stroke="#888" />
                        <YAxis stroke="#888" domain={[0, 100]} />
                        <RechartsTooltip 
                          contentStyle={{ 
                            backgroundColor: '#333', 
                            border: '1px solid #555',
                            borderRadius: '4px'
                          }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#10B981" 
                          fill="#10B981" 
                          fillOpacity={0.2} 
                          name="Disk Usage (%)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>

              {/* Network Chart */}
              <Card className="lg:col-span-2">
                <CardHeader className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Network className="h-5 w-5" />
                    <h3 className="text-lg font-medium">Network Traffic (24h)</h3>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="px-6 py-4">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={formatNetworkData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="time" stroke="#888" />
                        <YAxis stroke="#888" />
                        <RechartsTooltip 
                          contentStyle={{ 
                            backgroundColor: '#333', 
                            border: '1px solid #555',
                            borderRadius: '4px'
                          }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="inbound" 
                          stroke="#0070F3" 
                          name="Inbound (KB/s)" 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="outbound" 
                          stroke="#F31260" 
                          name="Outbound (KB/s)" 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
        </Tab>

        <Tab
          key="processes"
          title={
            <div className="flex items-center gap-2">
              <List size={16} />
              <span>Processes</span>
            </div>
          }
        >
          <Card className="mt-6">
            <CardHeader className="px-6 py-4">
              <div className="flex items-center gap-2">
                <List className="h-5 w-5" />
                <h3 className="text-lg font-medium">Process List</h3>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="px-6 py-4">
              <div className="text-center p-6">
                <h3 className="text-xl font-semibold mb-2">Process List Coming Soon</h3>
                <p className="text-gray-500">
                  This feature is under development. In a future update, you'll be able to view and manage processes running on this node.
                </p>
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
