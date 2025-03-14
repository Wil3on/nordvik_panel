"use client";

import { useState, useEffect, use } from "react";
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
  Spinner
} from "@nextui-org/react";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Server as ServerIcon,
  HardDrive,
  Cpu,
  MemoryStick as Memory,
  Network,
  Calendar,
  Info,
  RefreshCw,
  CheckCircle2,
  Terminal,
  Copy,
  Wifi,
  XCircle,
  CircleOff,
  Activity,
  Layers,
  Download,
  Trash,
  RotateCw,
  AlertTriangle
} from "lucide-react";
import PageHeader from "@/components/ui/page-header";
import LoadingState from "@/components/ui/loading-state";
import ConfirmationModal from "@/components/ui/confirmation-modal";
import { toast } from "sonner";

interface NodeDetails {
  id: string;
  name: string;
  uid: string;
  os: string;
  ipAddress: string;
  port: number;
  description: string;
  username: string;
  status: string;
  stats: {
    cpuUsage: number;
    ramUsage: number;
    diskUsage: number;
    uptime: string;
  };
  systemInfo?: {
    cpuModel: string;
    cpuCores: number;
    cpuSpeed: number;
    ramTotal: number;
    diskTotal: number;
    diskFree: number;
    platform: string;
    architecture: string;
  };
  steamCmdConfig?: {
    steamCmdPath: string;
    installDir: string;
    isInstalled: boolean;
    platform: string;
  };
  createdAt: string;
  updatedAt: string;
  _count?: {
    servers: number;
  };
}

export default function NodeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params at the component top level using React.use()
  const unwrappedParams = use(params);
  const nodeId = unwrappedParams.id;

  const router = useRouter();
  const [node, setNode] = useState<NodeDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'checking' | 'connected' | 'failed'>('idle');
  
  useEffect(() => {
    fetchNodeDetails();

    // Set up regular refresh interval
    const intervalId = setInterval(fetchNodeDetails, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [nodeId]);

  const fetchNodeDetails = async () => {
    try {
      const response = await fetch(`/api/nodes/${nodeId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch node details");
      }
      
      const data = await response.json();
      setNode(data.node);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching node details:", error);
      setIsLoading(false);
    }
  };

  const handleDeleteNode = async () => {
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/nodes/${nodeId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete node");
      }
      
      router.push("/nodes");
    } catch (error) {
      console.error("Error deleting node:", error);
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
    }
  };

  // State for tracking SteamCMD operations
  const [steamCmdOperation, setSteamCmdOperation] = useState<{
    action: string;
    loading: boolean;
  } | null>(null);

  // Function to handle SteamCMD actions (install, update, reinstall, uninstall)
  const handleSteamCmdAction = async (action: string) => {
    if (node?.status !== "ONLINE") {
      toast.error("Node must be online to manage SteamCMD", {
        description: "Please ensure the node is online before managing SteamCMD."
      });
      return;
    }
    
    // Set the current operation
    setSteamCmdOperation({ action, loading: true });
    
    // Show loading toast
    const loadingToast = toast.loading(`${action.charAt(0).toUpperCase() + action.slice(1)}ing SteamCMD...`, {
      description: `Please wait while we ${action} SteamCMD on ${node.name}`
    });
    
    try {      
      const response = await fetch(`/api/nodes/${nodeId}/steamcmd/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      // Get the response data
      const data = await response.json();
      console.log(`SteamCMD ${action} response:`, data);
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      if (response.ok) {
        // Success message
        const successMessage = data.message || `SteamCMD ${action} successful`;
        const actionPast = action === 'install' ? 'installed' : 
                          action === 'update' ? 'updated' : 
                          action === 'reinstall' ? 'reinstalled' : 
                          'uninstalled';
        
        toast.success(successMessage, {
          description: `Successfully ${actionPast} SteamCMD on ${node.name}`
        });
        
        // Refresh node data
        fetchNodeDetails();
      } else {
        // Error message
        const errorMessage = data.error || `Failed to ${action} SteamCMD`;
        
        toast.error(errorMessage, {
          description: `There was an error while trying to ${action} SteamCMD on ${node.name}`
        });
      }
    } catch (error) {
      console.error(`Error during SteamCMD ${action}:`, error);
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      toast.error(`Error during SteamCMD ${action}`, {
        description: `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setSteamCmdOperation(null);
    }
  };

  const checkNodeConnection = async () => {
    setConnectionStatus('checking');
    
    try {
      const response = await fetch(`/api/nodes/${nodeId}/check-connection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.connected) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('failed');
      }
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setConnectionStatus('idle');
      }, 5000);
      
    } catch (error) {
      console.error("Error checking node connection:", error);
      setConnectionStatus('failed');
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setConnectionStatus('idle');
      }, 5000);
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

  // Format size to appropriate units (KB, MB, GB, TB)
  const formatSize = (size: number, unit: string = "MB") => {
    if (size <= 0) {
      return unit === "MB" ? "0 MB" : "0 GB";
    }
    
    if (unit === "MB") {
      if (size >= 1024) {
        return `${(size / 1024).toFixed(1)} GB`;
      }
      return `${size.toFixed(1)} MB`;
    }
    
    if (unit === "GB") {
      if (size >= 1024) {
        return `${(size / 1024).toFixed(1)} TB`;
      }
      return `${size.toFixed(1)} GB`;
    }
    
    return `${size.toFixed(1)} ${unit}`;
  };

  // Calculate percentage
  const calculatePercentage = (part?: number, total?: number): number => {
    if (!part || !total || total === 0) return 0;
    return Math.round((part / total) * 100);
  };

  if (isLoading) {
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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{node.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Chip
              className="uppercase font-medium text-xs"
              color={node.os === "WINDOWS" ? "primary" : "secondary"}
              variant="flat"
            >
              {node.os} Node
            </Chip>
            <div className="flex items-center gap-1">
              <span className={`inline-block h-2.5 w-2.5 rounded-full animate-pulse ${node.status.toUpperCase() === "ONLINE" ? "bg-green-500" : "bg-red-500"}`}></span>
              <Chip
                className="uppercase font-medium text-xs"
                color={getStatusColor(node.status) as any}
                variant="flat"
              >
                {node.status.toUpperCase() === "ONLINE" ? 
                  <div className="flex items-center gap-1"><Activity size={14} /> {node.status}</div> : 
                  <div className="flex items-center gap-1"><CircleOff size={14} /> {node.status}</div>
                }
              </Chip>
            </div>
          </div>
        </div>
        <div className="flex gap-2 self-end md:self-auto">
          <Button 
            variant="light" 
            startContent={<ArrowLeft size={16} />}
            onPress={() => router.push("/nodes")}
            className="bg-gray-900 text-gray-300 hover:text-white"
          >
            Back
          </Button>
          <Button 
            color="primary" 
            variant="flat" 
            startContent={<Edit size={16} />}
            onPress={() => router.push(`/nodes/${nodeId}/edit`)}
          >
            Edit
          </Button>
          <Button 
            color="danger" 
            variant="flat" 
            startContent={<Trash2 size={16} />}
            onPress={() => setShowDeleteConfirmation(true)}
          >
            Delete
          </Button>
          <Button
            color="success"
            variant="flat"
            startContent={
              connectionStatus === 'checking' ? <Spinner size="sm" color="default" /> : 
              connectionStatus === 'connected' ? <CheckCircle2 size={16} /> :
              connectionStatus === 'failed' ? <XCircle size={16} /> :
              <Wifi size={16} />
            }
            onPress={checkNodeConnection}
            isDisabled={connectionStatus === 'checking'}
          >
            {connectionStatus === 'idle' && 'Check Connection'}
            {connectionStatus === 'checking' && 'Checking...'}
            {connectionStatus === 'connected' && 'Connected!'}
            {connectionStatus === 'failed' && 'Connection Failed'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Node Information */}
        <div className="lg:col-span-8">
          <Card className="bg-gray-900 border border-gray-800 shadow-xl mb-6">
            <CardHeader className="px-6 py-4 bg-gray-800 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-medium text-white">Node Information</h3>
              </div>
            </CardHeader>
            <CardBody className="px-6 py-5 space-y-6">
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <h4 className="text-xs font-medium text-gray-400 uppercase mb-1">Node ID</h4>
                  <p className="text-sm font-medium">{node.uid}</p>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-400 uppercase mb-1">Status</h4>
                  <div className="flex items-center gap-2">
                    <span className={`inline-block h-3 w-3 rounded-full animate-pulse ${node.status.toUpperCase() === "ONLINE" ? "bg-green-500" : "bg-red-500"}`}></span>
                    <span className={`text-sm font-medium ${node.status.toUpperCase() === "ONLINE" ? "text-green-500" : "text-red-500"}`}>
                      {node.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-400 uppercase mb-1">Operating System</h4>
                  <div className="text-sm">
                    <Chip color={node.os === "WINDOWS" ? "primary" : "secondary"} variant="flat" className="uppercase">
                      {node.os}
                    </Chip>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-400 uppercase mb-1">IP Address</h4>
                  <p className="text-sm font-medium">{node.ipAddress}</p>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-400 uppercase mb-1">Port</h4>
                  <p className="text-sm font-medium">{node.port}</p>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-400 uppercase mb-1">Created</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={14} className="text-gray-400" />
                    <span>{new Date(node.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-400 uppercase mb-1">Last Updated</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={14} className="text-gray-400" />
                    <span>{new Date(node.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              {node.description && (
                <div className="pt-2 border-t border-gray-800">
                  <h4 className="text-xs font-medium text-gray-400 uppercase mb-2">Description</h4>
                  <p className="text-sm text-gray-300">{node.description}</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Resource Usage */}
        <div className="lg:col-span-4">
          <Card className="bg-gray-900 border border-gray-800 shadow-xl">
            <CardHeader className="px-6 py-4 bg-gray-800 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <HardDrive className="h-5 w-5 text-purple-400" />
                <h3 className="text-lg font-medium text-white">Resource Usage</h3>
              </div>
            </CardHeader>
            <CardBody className="px-6 py-5 space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Cpu size={16} className="text-blue-400" />
                    <span className="text-sm font-medium">CPU Usage</span>
                  </div>
                  <span className="text-sm font-bold">{node.stats.cpuUsage?.toFixed(1) || 0}%</span>
                </div>
                <Progress 
                  value={node.stats.cpuUsage || 0} 
                  color={getProgressColor(node.stats.cpuUsage || 0) as any}
                  className="h-3"
                  showValueLabel={false}
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Memory size={16} className="text-green-400" />
                    <span className="text-sm font-medium">RAM Usage</span>
                  </div>
                  <span className="text-sm font-bold">{node.stats.ramUsage?.toFixed(1) || 0}%</span>
                </div>
                <Progress 
                  value={node.stats.ramUsage || 0} 
                  color={getProgressColor(node.stats.ramUsage || 0) as any}
                  className="h-3"
                  showValueLabel={false}
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <HardDrive size={16} className="text-yellow-400" />
                    <span className="text-sm font-medium">Disk Usage</span>
                  </div>
                  <span className="text-sm font-bold">{node.stats.diskUsage?.toFixed(1) || 0}%</span>
                </div>
                <Progress 
                  value={node.stats.diskUsage || 0} 
                  color={getProgressColor(node.stats.diskUsage || 0) as any}
                  className="h-3"
                  showValueLabel={false}
                />
              </div>
              
              <div className="pt-4 border-t border-gray-800">
                <h4 className="text-xs font-medium text-gray-400 uppercase mb-2">System Uptime</h4>
                <div className="flex items-center gap-2 bg-gray-800 p-3 rounded border border-gray-700">
                  <Network size={16} className="text-purple-400" />
                  <span className="font-medium">{node.stats.uptime}</span>
                </div>
              </div>
              
              {/* System Info Section */}
              <div className="border border-gray-800 rounded-lg p-4 mb-4">
                <h3 className="text-md font-medium mb-3 flex items-center">
                  <ServerIcon className="w-4 h-4 mr-2" />
                  System Info
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 min-w-[80px]">CPU Model:</span>
                    <Tooltip 
                      content={node.systemInfo?.cpuModel || "Unknown"} 
                      placement="left"
                      className="py-2 px-4 shadow-xl bg-gray-800 text-white border border-gray-700"
                    >
                      <span className="font-medium truncate max-w-[200px] text-right hover:text-blue-400 cursor-help">
                        {node.systemInfo?.cpuModel || "Unknown"}
                      </span>
                    </Tooltip>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400 min-w-[80px]">CPU Cores:</span>
                    <Tooltip 
                      content={`${node.systemInfo?.cpuCores || 0} cores`} 
                      placement="left"
                      className="py-2 px-4 shadow-xl bg-gray-800 text-white border border-gray-700"
                    >
                      <span className="font-medium cursor-help hover:text-blue-400">{node.systemInfo?.cpuCores || 0}</span>
                    </Tooltip>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400 min-w-[80px]">CPU Speed:</span>
                    <Tooltip 
                      content={`${node.systemInfo?.cpuSpeed || 0} MHz`} 
                      placement="left"
                      className="py-2 px-4 shadow-xl bg-gray-800 text-white border border-gray-700"
                    >
                      <span className="font-medium cursor-help hover:text-blue-400">{node.systemInfo?.cpuSpeed || 0} MHz</span>
                    </Tooltip>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400 min-w-[80px]">RAM:</span>
                    <Tooltip 
                      content={`Total RAM: ${formatSize(node.systemInfo?.ramTotal || 0, "MB")}`} 
                      placement="left"
                      className="py-2 px-4 shadow-xl bg-gray-800 text-white border border-gray-700"
                    >
                      <span className="font-medium cursor-help hover:text-blue-400">{formatSize(node.systemInfo?.ramTotal || 0, "MB")}</span>
                    </Tooltip>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400 min-w-[80px]">Disk:</span>
                    <Tooltip 
                      content={`Free: ${formatSize(node.systemInfo?.diskFree || 0, "GB")} of ${formatSize(node.systemInfo?.diskTotal || 0, "GB")} (${calculatePercentage(node.systemInfo?.diskFree, node.systemInfo?.diskTotal)}% free)`} 
                      placement="left"
                      className="py-2 px-4 shadow-xl bg-gray-800 text-white border border-gray-700"
                    >
                      <span className="font-medium cursor-help hover:text-blue-400">
                        {formatSize(node.systemInfo?.diskFree || 0, "GB")} / {formatSize(node.systemInfo?.diskTotal || 0, "GB")}
                      </span>
                    </Tooltip>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400 min-w-[80px]">Platform:</span>
                    <Tooltip 
                      content={node.systemInfo?.platform || "Unknown"} 
                      placement="left"
                      className="py-2 px-4 shadow-xl bg-gray-800 text-white border border-gray-700"
                    >
                      <span className="font-medium capitalize cursor-help hover:text-blue-400">{node.systemInfo?.platform || "Unknown"}</span>
                    </Tooltip>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400 min-w-[80px]">Architecture:</span>
                    <Tooltip 
                      content={node.systemInfo?.architecture || "Unknown"} 
                      placement="left"
                      className="py-2 px-4 shadow-xl bg-gray-800 text-white border border-gray-700"
                    >
                      <span className="font-medium cursor-help hover:text-blue-400">{node.systemInfo?.architecture || "Unknown"}</span>
                    </Tooltip>
                  </div>
                </div>
              </div>
              
              {/* SteamCMD Management Section */}
              <div className="border border-gray-800 rounded-lg p-4 mb-4">
                <h3 className="text-md font-medium mb-3 flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  SteamCMD Management
                </h3>
                
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 min-w-[80px]">Status:</span>
                    <div className="flex items-center">
                      {node.steamCmdConfig?.isInstalled ? (
                        <>
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                          <span className="font-medium text-green-500">Installed</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                          <span className="font-medium text-red-500">Not Installed</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 min-w-[80px]">Platform:</span>
                    <Tooltip 
                      content={`Node operating system: ${node.steamCmdConfig?.platform || "Unknown"}`} 
                      placement="left"
                      className="py-2 px-4 shadow-xl bg-gray-800 text-white border border-gray-700"
                    >
                      <span className="font-medium capitalize cursor-help hover:text-blue-400">
                        {node.steamCmdConfig?.platform || "Unknown"}
                      </span>
                    </Tooltip>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 min-w-[80px]">Path:</span>
                    <Tooltip 
                      content={node.steamCmdConfig?.steamCmdPath || "Unknown"} 
                      placement="left"
                      className="py-2 px-4 shadow-xl bg-gray-800 text-white border border-gray-700"
                    >
                      <span className="font-medium truncate max-w-[200px] text-right hover:text-blue-400 cursor-help">
                        {node.steamCmdConfig?.steamCmdPath || "Unknown"}
                      </span>
                    </Tooltip>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 min-w-[80px]">Install Dir:</span>
                    <Tooltip 
                      content={node.steamCmdConfig?.installDir || "Unknown"} 
                      placement="left"
                      className="py-2 px-4 shadow-xl bg-gray-800 text-white border border-gray-700"
                    >
                      <span className="font-medium truncate max-w-[200px] text-right hover:text-blue-400 cursor-help">
                        {node.steamCmdConfig?.installDir || "Unknown"}
                      </span>
                    </Tooltip>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        size="sm"
                        color={node.steamCmdConfig?.isInstalled ? "default" : "primary"}
                        startContent={steamCmdOperation?.action === "install" ? <Spinner size="sm" /> : <Download size={16} />}
                        className={node.steamCmdConfig?.isInstalled ? "opacity-50 cursor-not-allowed" : ""}
                        isDisabled={node.steamCmdConfig?.isInstalled || node.status !== "ONLINE" || steamCmdOperation !== null}
                        onClick={() => handleSteamCmdAction("install")}
                      >
                        {steamCmdOperation?.action === "install" ? "Installing..." : "Install SteamCMD"}
                      </Button>
                      
                      <Button 
                        size="sm"
                        color="default"
                        startContent={steamCmdOperation?.action === "update" ? <Spinner size="sm" /> : <RefreshCw size={16} />}
                        isDisabled={!node.steamCmdConfig?.isInstalled || node.status !== "ONLINE" || steamCmdOperation !== null}
                        onClick={() => handleSteamCmdAction("update")}
                      >
                        {steamCmdOperation?.action === "update" ? "Updating..." : "Update SteamCMD"}
                      </Button>
                      
                      <Button 
                        size="sm"
                        color="warning"
                        startContent={steamCmdOperation?.action === "reinstall" ? <Spinner size="sm" /> : <RotateCw size={16} />}
                        isDisabled={!node.steamCmdConfig?.isInstalled || node.status !== "ONLINE" || steamCmdOperation !== null}
                        onClick={() => handleSteamCmdAction("reinstall")}
                      >
                        {steamCmdOperation?.action === "reinstall" ? "Reinstalling..." : "Reinstall SteamCMD"}
                      </Button>
                      
                      <Button 
                        size="sm"
                        color="danger"
                        startContent={steamCmdOperation?.action === "uninstall" ? <Spinner size="sm" /> : <Trash size={16} />}
                        isDisabled={!node.steamCmdConfig?.isInstalled || node.status !== "ONLINE" || steamCmdOperation !== null}
                        onClick={() => handleSteamCmdAction("uninstall")}
                      >
                        {steamCmdOperation?.action === "uninstall" ? "Uninstalling..." : "Uninstall SteamCMD"}
                      </Button>
                    </div>
                    
                    {node.status !== "ONLINE" && (
                      <div className="mt-2 flex items-center text-amber-500 text-xs">
                        <AlertTriangle size={12} className="mr-1" />
                        <span>Node must be online to manage SteamCMD</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <h4 className="text-xs font-medium text-gray-400 uppercase mb-2">Hosted Servers</h4>
                <div className="flex items-center justify-between bg-gray-800 p-3 rounded border border-gray-700">
                  <div className="flex items-center gap-2">
                    <ServerIcon size={16} className="text-blue-400" />
                    <span className="font-medium">Servers</span>
                  </div>
                  <span className="text-xl font-bold">{node._count?.servers || 0}</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Installation Command Section */}
      <div className="mt-6">
        <Card className="bg-gray-900 border border-gray-800 shadow-xl">
          <CardHeader className="px-6 py-4 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-green-400" />
              <h3 className="text-lg font-medium text-white">Installation Instructions</h3>
            </div>
          </CardHeader>
          <CardBody className="px-6 py-5">
            <div>
              <h4 className="text-xs font-medium text-gray-400 uppercase mb-2">Installation Instructions</h4>
              <div className="text-xs text-gray-400 mt-3 space-y-4">
                <p className="text-sm font-medium text-gray-300">
                  <span className="bg-gray-800 text-yellow-500 px-2 py-0.5 rounded mr-2">1</span>
                  <span>Clone or download the Nordvik node app to your server:</span>
                </p>
                <div className="ml-7 bg-gray-800 p-2 rounded border border-gray-700 font-mono text-xs mb-3">
                  <span>git clone https://github.com/nordvik/node-app.git</span><br />
                  <span>cd node-app</span>
                </div>
                
                <p className="text-sm font-medium text-gray-300">
                  <span className="bg-gray-800 text-yellow-500 px-2 py-0.5 rounded mr-2">2</span>
                  <span>Install dependencies:</span>
                </p>
                <div className="ml-7 bg-gray-800 p-2 rounded border border-gray-700 font-mono text-xs mb-3">
                  <span>npm install</span>
                </div>
                
                <p className="text-sm font-medium text-gray-300">
                  <span className="bg-gray-800 text-yellow-500 px-2 py-0.5 rounded mr-2">3</span>
                  <span>Configure the node using the command below:</span>
                </p>
                <div className="relative ml-7">
                  <div className="flex items-center justify-between bg-gray-800 p-3 rounded border border-gray-700 font-mono text-xs overflow-x-auto">
                    <code className="whitespace-nowrap pr-10">
                      node src/cli.js configure --panel-url {window.location.origin} --token {node.uid} --node {node.id}
                    </code>
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      className="absolute right-2 text-gray-400 hover:text-white"
                      onPress={() => {
                        navigator.clipboard.writeText(`node src/cli.js configure --panel-url ${window.location.origin} --token ${node.uid} --node ${node.id}`);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                    >
                      {copied ? (
                        <span className="text-green-500 text-xs">Copied!</span>
                      ) : (
                        <Copy size={16} />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs mt-2 text-yellow-400">
                    <strong>Note:</strong> The command must be run exactly as shown above. Using npm run will not work correctly with the arguments.
                  </p>
                </div>
                
                <p className="text-sm font-medium text-gray-300 mt-4">
                  <span className="bg-gray-800 text-yellow-500 px-2 py-0.5 rounded mr-2">4</span>
                  <span>Start the node service:</span>
                </p>
                <div className="ml-7 bg-gray-800 p-2 rounded border border-gray-700 font-mono text-xs mb-3">
                  <span># For development</span><br />
                  <span>npm run dev</span><br /><br />
                  <span># For production with PM2 (recommended)</span><br />
                  <span>npm run pm2</span>
                </div>
                
                <div className="bg-gray-800 border-l-4 border-blue-500 p-3 rounded mt-4">
                  <p className="text-sm text-gray-200">
                    <span className="font-bold">Note:</span> The node service will connect to this panel using the configuration 
                    provided and report system statistics and handle server operations automatically.
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDeleteNode}
        title="Delete Node"
        description={`Are you sure you want to delete "${node.name}"? This node has ${node._count?.servers || 0} servers.`}
        confirmText="Delete"
        confirmColor="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
