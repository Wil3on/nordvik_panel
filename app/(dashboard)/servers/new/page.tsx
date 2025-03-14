"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Button, 
  Input, 
  Select, 
  SelectItem, 
  Tooltip, 
  Chip,
  Progress,
  Card,
  CardBody,
  CardFooter,
  Spinner
} from "@nextui-org/react";
import { 
  Server as ServerIcon, 
  HardDrive, 
  Shield, 
  Info, 
  Check, 
  Download, 
  Terminal, 
  CheckCircle, 
  ServerCrash, 
  AlertCircle, 
  HelpCircle, 
  Loader2, 
  X,
  RefreshCw,
  Wifi,
  Database,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import PageHeader from "@/components/ui/page-header";

interface Game {
  id: string;
  name: string;
  gameCode: string;
  supportedOS: {
    windows: boolean;
    linux: boolean;
  };
  steamAppId: string;
}

interface Node {
  id: string;
  name: string;
  os: string;
  ipAddress: string;
  apiUrl: string;
}

interface Port {
  name: string;
  port: string;
}

// Custom styles to improve visibility in dark mode
const formStyles = {
  input: {
    color: "text-white",
    labelColor: "text-gray-400",
    placeholderColor: "text-gray-500",
    backgroundColor: "bg-gray-800",
    borderColor: "border-gray-700",
    focusRing: "focus:ring-2 focus:ring-blue-600 focus:border-transparent",
  },
  text: {
    standard: "text-white",
    muted: "text-gray-400",
    helper: "text-gray-500",
  },
  card: {
    base: "bg-[#111827] border border-gray-800 hover:border-gray-700 transition-all duration-200",
    selected: "bg-[#162032] border-2 border-blue-500 shadow-lg shadow-blue-900/20",
  },
  transitions: {
    standard: "transition-all duration-200 ease-in-out",
  }
};

export default function NewServerPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [installationProgress, setInstallationProgress] = useState<string[]>([]);
  const [installationStatus, setInstallationStatus] = useState<"idle" | "installing" | "downloading" | "validating" | "installing_files" | "completed" | "failed">("idle");
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [consoleMessages, setConsoleMessages] = useState<{message: string, type: string}[]>([]);
  const consoleRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Form data
  const [games, setGames] = useState<Game[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedNode, setSelectedNode] = useState("");
  const [serverName, setServerName] = useState("");
  const [serverOS, setServerOS] = useState("");
  const [ports, setPorts] = useState<Port[]>([
    { name: "Game Port", port: "" },
    { name: "Query Port", port: "" }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gamesRes, nodesRes] = await Promise.all([
          fetch("/api/games"),
          fetch("/api/nodes")
        ]);

        if (!gamesRes.ok || !nodesRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const gamesData = await gamesRes.json();
        const nodesData = await nodesRes.json();

        setGames(gamesData.games);
        setNodes(nodesData.nodes);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGameChange = (gameId: string) => {
    setSelectedGame(gameId);
    
    // Reset server OS if the selected game doesn't support it
    const selectedGameData = games.find(game => game.id === gameId);
    if (selectedGameData && serverOS && !selectedGameData.supportedOS[serverOS.toLowerCase() as keyof typeof selectedGameData.supportedOS]) {
      setServerOS("");
    }
  };

  const handleNodeChange = (nodeId: string) => {
    setSelectedNode(nodeId);
    
    // Set server OS based on node OS
    const selectedNodeData = nodes.find(node => node.id === nodeId);
    if (selectedNodeData) {
      setServerOS(selectedNodeData.os);
    }
  };

  const handlePortChange = (index: number, value: string) => {
    const updatedPorts = [...ports];
    updatedPorts[index].port = value;
    setPorts(updatedPorts);
  };

  const getSelectedGameData = () => {
    return games.find(game => game.id === selectedGame);
  };

  const getSelectedNodeData = () => {
    return nodes.find(node => node.id === selectedNode);
  };

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setConsoleMessages([]);
    setDownloadProgress(0);
    
    try {
      // Prepare server data
      const gameData = getSelectedGameData();
      const nodeData = getSelectedNodeData();
      
      const serverData = {
        name: serverName,
        gameId: selectedGame,
        nodeId: selectedNode,
        os: serverOS,
        gameName: gameData?.name || "",
        gameCode: gameData?.gameCode || "",
        steamAppId: gameData?.steamAppId || "",
        nodeUrl: nodeData?.apiUrl || "",
        ports: ports.reduce((acc, port) => {
          acc[port.name] = port.port;
          return acc;
        }, {} as Record<string, string>)
      };
      
      // Start installation
      const response = await fetch("/api/servers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serverData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create server");
      }
      
      const data = await response.json();
      const server = data.server;
      
      // Move to installation step
      handleNextStep();
      
      // Setup the real-time connection for server installation progress
      setInstallationStatus("installing");
      setInstallationProgress(["Setting up server...", "Connecting to node daemon..."]);
      
      // Connect to WebSocket for real-time updates
      if (socketRef.current) {
        socketRef.current.close();
      }
      
      // Create WebSocket connection to the node daemon
      const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const wsUrl = nodeData?.apiUrl ? 
        `${wsProtocol}://${new URL(nodeData.apiUrl).host}/socket` :
        `${wsProtocol}://${window.location.hostname}:3001/socket`;
        
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;
      
      // WebSocket event handlers
      socket.onopen = () => {
        setConsoleMessages(prev => [...prev, {
          message: "Connected to node daemon WebSocket",
          type: "info"
        }]);
        
        // Subscribe to server events
        if (server?.id) {
          socket.send(JSON.stringify({
            event: 'subscribe',
            serverId: server.id
          }));
        }
      };
      
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Handle different event types
          if (data.event === 'console') {
            // Console message
            setConsoleMessages(prev => [...prev, {
              message: data.message || "No message content",
              type: data.level || "info"
            }]);
            
            // Check for specific phases of installation in the console messages
            const lowerMessage = data.message?.toLowerCase() || "";
            
            if (lowerMessage.includes("downloading")) {
              if (!installationProgress.includes("Downloading game files from Steam...")) {
                setInstallationProgress(prev => [...prev, "Downloading game files from Steam..."]);
                setInstallationStatus("downloading");
              }
            } else if (lowerMessage.includes("validating")) {
              if (!installationProgress.includes("Validating downloaded files...")) {
                setInstallationProgress(prev => [...prev, "Validating downloaded files..."]);
                setInstallationStatus("validating");
              }
            } else if (lowerMessage.includes("installing")) {
              if (!installationProgress.includes("Installing game files...")) {
                setInstallationProgress(prev => [...prev, "Installing game files..."]);
                setInstallationStatus("installing_files");
              }
            } else if (lowerMessage.includes("success") && lowerMessage.includes("complete")) {
              if (!installationProgress.includes("Installation files verified and completed!")) {
                setInstallationProgress(prev => [...prev, "Installation files verified and completed!"]);
              }
            }
            
            // Detect common error patterns
            if (lowerMessage.includes("error") || lowerMessage.includes("failed") || lowerMessage.includes("invalid")) {
              // Track specific error types to provide more helpful messages
              if (lowerMessage.includes("disk space")) {
                setInstallationProgress(prev => [...prev, "Error: Insufficient disk space for installation"]);
                setInstallationStatus("failed");
              } else if (lowerMessage.includes("network") || lowerMessage.includes("timeout") || lowerMessage.includes("connect")) {
                setInstallationProgress(prev => [...prev, "Error: Network connection issue"]);
                setInstallationStatus("failed");
              } else if (lowerMessage.includes("permission") || lowerMessage.includes("access denied")) {
                setInstallationProgress(prev => [...prev, "Error: Permission issue - check folder permissions"]);
                setInstallationStatus("failed");
              } else if (lowerMessage.includes("appid")) {
                setInstallationProgress(prev => [...prev, "Error: Invalid Steam App ID"]);
                setInstallationStatus("failed");
              }
            }
            
            // Scroll console to bottom
            if (consoleRef.current) {
              consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
            }
          } 
          else if (data.event === 'status') {
            // Server status update
            if (data.status === 'DOWNLOADING' && data.data && typeof data.data.progress === 'number') {
              setDownloadProgress(data.data.progress);
              setInstallationStatus("downloading");
              
              // Add download percentage to console messages if it's changed significantly
              if (data.data.progress % 10 === 0) { // Show every 10%
                setConsoleMessages(prev => [...prev, {
                  message: `Download progress: ${Math.round(data.data.progress)}%`,
                  type: "info"
                }]);
              }
            } else if (data.status === 'VALIDATING') {
              setInstallationStatus("validating");
              if (!installationProgress.includes("Validating installation files...")) {
                setInstallationProgress(prev => [...prev, "Validating installation files..."]);
              }
            }
            
            // Only consider installation completed if the status is INSTALLED AND validation is verified
            if (data.status === 'INSTALLED' && (data.data?.validated === true || installationStatus === "validating")) {
              setInstallationStatus("completed");
              setInstallationProgress(prev => [...prev, "Installation completed successfully!"]);
              
              // Wait 2 seconds before redirecting
              redirectTimeoutRef.current = setTimeout(() => {
                router.push(`/servers/${server.id}`);
              }, 2000);
            } 
            else if (data.status === 'INSTALLATION_FAILED' || (data.status === 'OFFLINE' && data.data?.message?.includes('failed'))) {
              setInstallationStatus("failed");
              
              // Provide a more descriptive error message
              let errorMessage = data.data?.message || "Unknown error";
              let detailedMessage = "Installation failed";
              
              if (errorMessage.includes("disk space")) {
                detailedMessage = "Installation failed: Insufficient disk space";
              } else if (errorMessage.includes("network") || errorMessage.includes("timeout") || errorMessage.includes("connect")) {
                detailedMessage = "Installation failed: Network connection issue";
              } else if (errorMessage.includes("permission") || errorMessage.includes("access denied")) {
                detailedMessage = "Installation failed: Permission issue";
              } else if (errorMessage.includes("appid")) {
                detailedMessage = "Installation failed: Invalid Steam App ID";
              } else if (errorMessage.includes("validation")) {
                detailedMessage = "Installation failed: File validation error";
              } else {
                detailedMessage = `Installation failed: ${errorMessage}`;
              }
              
              setInstallationProgress(prev => [...prev, detailedMessage]);
              
              // Clear the redirect timeout if it was set
              if (redirectTimeoutRef.current) {
                clearTimeout(redirectTimeoutRef.current);
              }
              
              // Display a visible error message that stays on screen
              setConsoleMessages(prev => [...prev, {
                message: `INSTALLATION FAILED: ${errorMessage}`,
                type: "error"
              }]);
            }
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
          setConsoleMessages(prev => [...prev, {
            message: `Error parsing WebSocket message: ${error}`,
            type: "error"
          }]);
        }
      };
      
      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setConsoleMessages(prev => [...prev, {
          message: "WebSocket connection error",
          type: "error"
        }]);
      };
      
      socket.onclose = () => {
        setConsoleMessages(prev => [...prev, {
          message: "WebSocket connection closed",
          type: "warning"
        }]);
      };
      
      // Poll server status every 3 seconds as fallback
      const checkServerStatus = setInterval(async () => {
        try {
          // Use the server ID from the response
          const serverId = server.id;
          
          // Make sure we have a valid server ID
          if (!serverId) {
            throw new Error("Invalid server ID");
          }
          
          // Fetch the server status
          const statusResponse = await fetch(`/api/servers/${serverId}`, {
            // Add cache: 'no-store' to prevent caching
            cache: 'no-store',
            // Add next.js specific headers to prevent caching
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          });
          
          if (statusResponse.ok) {
            const statusData = await statusResponse.json();
            
            if (statusData.server && statusData.server.status !== "INSTALLING") {
              clearInterval(checkServerStatus);
              
              if (statusData.server.status === "INSTALLED") {
                setInstallationStatus("completed");
                setInstallationProgress(prev => [...prev, "Installation completed successfully!"]);
                // Wait 2 seconds before redirecting
                redirectTimeoutRef.current = setTimeout(() => {
                  router.push(`/servers/${serverId}`);
                }, 2000);
              } else if (statusData.server.status === "FAILED" || (statusData.server.status === "OFFLINE" && statusData.server.data?.message?.includes('failed'))) {
                setInstallationStatus("failed");
                setInstallationProgress(prev => [...prev, "Installation failed."]);
              }
            } else if (statusData.server) {
              // Only add a new progress message every 3 poll cycles to avoid flooding
              const shouldAddMessage = Math.random() < 0.3;
              if (shouldAddMessage) {
                setInstallationProgress(prev => [...prev, "Still installing..."]);
              }
            } else {
              throw new Error("Server data not found in response");
            }
          } else {
            const errorData = await statusResponse.json().catch(() => ({}));
            throw new Error(errorData.error || "Failed to get server status");
          }
        } catch (error: any) {
          console.error("Error checking server status:", error);
          // Don't immediately clear the interval on first error - retry a few times
          const errorMessage = error.message || "Error checking installation status";
          
          // Add the error message to the progress if it's not already there
          setInstallationProgress(prev => {
            if (!prev.includes(errorMessage)) {
              return [...prev, errorMessage];
            }
            return prev;
          });
          
          // After 3 consecutive errors, stop polling and mark as failed
          if (errorMessage.includes("Server not found") || errorMessage.includes("Invalid server ID")) {
            clearInterval(checkServerStatus);
            setInstallationStatus("failed");
          }
        }
      }, 3000);
    } catch (error: any) {
      console.error("Error creating server:", error);
      setIsSubmitting(false);
      setInstallationStatus("failed");
      setInstallationProgress(["Installation failed", error.message || "Unknown error"]);
      handleNextStep(); // Move to installation step to show the error
    }
  };

  // Clean up WebSocket on component unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return !!selectedGame && !!selectedNode;
      case 1:
        return (
          !!serverName && 
          ports.every(port => !!port.port) && 
          ports.every(port => /^\d+$/.test(port.port)) // Ensure ports contain only digits
        );
      default:
        return true;
    }
  };

  const renderGameSelection = () => {
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
            <ServerIcon size={20} className="text-blue-500 mr-2" />
            Select Game
          </h3>
          <div className="bg-[#111827] rounded-xl p-6 border border-gray-700 shadow-md">
            <div className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <span>Game</span>
                  <Tooltip content="Select the game you want to install">
                    <Info size={14} className="ml-1.5 text-gray-500 cursor-help" />
                  </Tooltip>
                </label>
                <div className="relative">
                  <select
                    value={selectedGame}
                    onChange={(e) => handleGameChange(e.target.value)}
                    className="w-full h-12 bg-[#0b101b78] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer px-4 py-2 appearance-none"
                    aria-label="Select game"
                  >
                    <option value="" disabled>Select a game</option>
                    {games.map(game => (
                      <option key={game.id} value={game.id}>
                        {game.name} (App ID: {game.steamAppId})
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {selectedGame && (
                <div className="pt-4">
                  <div className="p-3 rounded-md bg-blue-900/20 border border-blue-800/30 flex items-start">
                    <Info size={18} className="text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-blue-300">Selected: {getSelectedGameData()?.name}</p>
                      <p className="text-xs text-blue-200/70 mt-1">
                        Steam App ID: {getSelectedGameData()?.steamAppId} • 
                        Supports: {getSelectedGameData()?.supportedOS.windows ? 'Windows' : ''} 
                        {getSelectedGameData()?.supportedOS.windows && getSelectedGameData()?.supportedOS.linux ? ' & ' : ''}
                        {getSelectedGameData()?.supportedOS.linux ? 'Linux' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
            <HardDrive size={20} className="text-green-500 mr-2" />
            Select Node
          </h3>
          <div className="bg-[#111827] rounded-xl p-6 border border-gray-700 shadow-md">
            <div className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <span>Node</span>
                  <Tooltip content="Select the node where you want to install the server">
                    <Info size={14} className="ml-1.5 text-gray-500 cursor-help" />
                  </Tooltip>
                </label>
                <div className="relative">
                  <select
                    value={selectedNode}
                    onChange={(e) => handleNodeChange(e.target.value)}
                    className="w-full h-12 bg-[#0b101b78] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer px-4 py-2 appearance-none"
                    aria-label="Select node"
                  >
                    <option value="" disabled>Select a node</option>
                    {nodes.map(node => (
                      <option key={node.id} value={node.id}>
                        {node.name} ({node.ipAddress}) - {node.os}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {selectedNode && (
                <div className="pt-4">
                  <div className={`p-3 rounded-md ${
                    getSelectedNodeData()?.os.toLowerCase() === 'windows' 
                      ? 'bg-blue-900/20 border-blue-800/30' 
                      : 'bg-green-900/20 border-green-800/30'
                    } border flex items-start`}>
                    <Info size={18} className="text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-blue-300">Selected: {getSelectedNodeData()?.name}</p>
                      <p className="text-xs text-blue-200/70 mt-1">
                        IP Address: {getSelectedNodeData()?.ipAddress} • 
                        OS: {getSelectedNodeData()?.os}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderServerConfiguration = () => {
    const selectedGameData = getSelectedGameData();
    const selectedNodeData = getSelectedNodeData();
    
    if (!selectedGameData || !selectedNodeData) {
      return null;
    }
    
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
            <ServerIcon size={20} className="text-blue-500 mr-2" />
            Server Details
          </h3>
          <div className="bg-[#111827] rounded-xl p-6 border border-gray-700 shadow-md hover:border-gray-600 transition-all">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <span>Server Name</span>
                  <Tooltip content="Enter a unique name for your server">
                    <Info size={14} className="ml-1.5 text-gray-500 cursor-help" />
                  </Tooltip>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                    placeholder="Enter server name"
                    className="w-full bg-[#0b101b78] border border-gray-700 rounded-md text-white h-12 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ServerIcon size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-300 flex items-center">
                    <span>Server Ports</span>
                    <Tooltip content="Specify the ports for game server connection and query">
                      <Info size={14} className="ml-1.5 text-gray-500 cursor-help" />
                    </Tooltip>
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ports.map((port, index) => (
                    <div key={index} className="space-y-2">
                      <label className="text-xs text-gray-400">
                        {port.name}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={port.port}
                          onChange={(e) => handlePortChange(index, e.target.value)}
                          placeholder={`Enter ${port.name.toLowerCase()} port`}
                          className="w-full bg-[#0b101b78] border border-gray-700 rounded-md text-white h-12 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <div className="px-1.5 py-0.5 bg-primary-100 rounded text-xs text-primary-500">
                            {index + 1}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        {index === 0 
                          ? "The main port used for game client connections" 
                          : "Used for server browser listings and queries"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-blue-900/20 rounded-xl p-4 border border-blue-600/20 inline-flex items-center">
            <Info size={20} className="text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-300">Important Port Information</p>
              <p className="text-xs text-blue-200/70 mt-1">Make sure these ports are open in your firewall and/or forwarded in your router if you want the server to be accessible from the internet.</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
              <ServerIcon size={20} className="text-blue-500 mr-2" />
              Selected Game
            </h3>
            <div className="bg-[#162032] rounded-xl p-6 border-2 border-blue-500/30 shadow-lg shadow-blue-900/10">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-full p-3 mr-4 shadow-inner shadow-blue-500/20">
                  <ServerIcon size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="text-white font-medium text-lg">{selectedGameData.name}</h4>
                  <p className="text-sm text-gray-400">Steam App ID: {selectedGameData.steamAppId}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {selectedGameData.supportedOS.windows && (
                  <div className="px-2 py-1 bg-blue-900/20 text-blue-400 rounded text-xs">
                    <Shield size={14} className="mr-1" />
                    Windows
                  </div>
                )}
                {selectedGameData.supportedOS.linux && (
                  <div className="px-2 py-1 bg-green-900/20 text-green-400 rounded text-xs">
                    <Shield size={14} className="mr-1" />
                    Linux
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
              <Database size={20} className="text-green-500 mr-2" />
              Selected Node
            </h3>
            <div className={`${
              selectedNodeData.os.toLowerCase() === 'windows' 
                ? 'bg-[#162032] border-blue-500/30' 
                : 'bg-[#162216] border-green-500/30'
              } rounded-xl p-6 border-2 shadow-lg shadow-blue-900/10`}>
              <div className="flex items-center mb-4">
                <div className={`${
                  selectedNodeData.os.toLowerCase() === 'windows' 
                    ? 'bg-gradient-to-br from-blue-600 to-blue-800 shadow-blue-500/20' 
                    : 'bg-gradient-to-br from-green-600 to-green-800 shadow-green-500/20'
                } rounded-full p-3 mr-4 shadow-inner`}>
                  <HardDrive size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="text-white font-medium text-lg">{selectedNodeData.name}</h4>
                  <p className="text-sm text-gray-400">{selectedNodeData.ipAddress}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="px-2 py-1 bg-blue-900/20 text-blue-400 rounded text-xs">
                  <Shield size={14} className="mr-1" />
                  {selectedNodeData.os}
                </div>
                <div className="px-2 py-1 bg-gray-900/20 text-gray-400 rounded text-xs">
                  <Wifi size={14} className="mr-1" />
                  Online
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderInstallation = () => {
    return (
      <div className="text-center my-4">
        {installationStatus === "idle" || installationStatus === "installing" || installationStatus === "downloading" || installationStatus === "validating" || installationStatus === "installing_files" || installationStatus === "completed" || installationStatus === "failed" ? (
          <div className="w-full max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-blue-900/30 flex items-center justify-center mx-auto mb-6">
                {installationStatus === "downloading" ? (
                  <Download size={32} className="text-blue-400 animate-pulse" />
                ) : installationStatus === "validating" ? (
                  <CheckCircle size={32} className="text-yellow-400 animate-pulse" />
                ) : installationStatus === "installing_files" ? (
                  <HardDrive size={32} className="text-purple-400 animate-pulse" />
                ) : (
                  <Loader2 size={32} className="text-blue-400 animate-spin" />
                )}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">
                {installationStatus === "downloading" ? "Downloading Game Files" : 
                 installationStatus === "validating" ? "Validating Installation" :
                 installationStatus === "installing_files" ? "Installing Game Files" :
                 "Setting Up Server"}
              </h3>
              <p className="text-gray-400 mb-4">
                {installationStatus === "downloading" ? 
                  "Downloading game files from Steam. This may take a while depending on your connection speed." : 
                 installationStatus === "validating" ? 
                  "Validating downloaded files to ensure integrity." :
                 installationStatus === "installing_files" ? 
                  "Installing and configuring game files." :
                  "Please wait while your server is being set up..."}
              </p>
              
              {/* Download Progress */}
              {downloadProgress > 0 && (
                <div className="w-full max-w-lg mx-auto mb-6">
                  <div className="flex justify-between text-sm text-gray-300 mb-2">
                    <span>Download Progress</span>
                    <span className="font-medium">{Math.round(downloadProgress)}%</span>
                  </div>
                  <Progress 
                    value={downloadProgress} 
                    color={downloadProgress < 30 ? "primary" : downloadProgress < 80 ? "secondary" : "success"}
                    size="md"
                    className="max-w-md mx-auto h-2 bg-gray-800"
                    showValueLabel={false}
                  />
                  <p className="text-xs text-gray-500 mt-2 flex items-center justify-center">
                    <Download size={12} className="mr-1" />
                    {downloadProgress < 25 ? "Starting download..." : 
                     downloadProgress < 50 ? "Downloading game files..." : 
                     downloadProgress < 75 ? "Download in progress..." : 
                     "Almost done..."}
                  </p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {/* Installation Log */}
              <div className="bg-[#111827] rounded-xl p-4 border border-gray-700 mb-4 shadow-md">
                <h4 className="text-white font-medium mb-3 flex items-center">
                  {installationStatus === "downloading" ? (
                    <Download size={16} className="text-blue-500 mr-2" />
                  ) : installationStatus === "validating" ? (
                    <CheckCircle size={16} className="text-yellow-500 mr-2" />
                  ) : installationStatus === "installing_files" ? (
                    <HardDrive size={16} className="text-purple-500 mr-2" />
                  ) : (
                    <Check size={16} className="text-green-500 mr-2" />
                  )}
                  Installation Progress
                </h4>
                <div className="space-y-3 text-sm text-left">
                  {installationProgress.map((message, index) => (
                    <div key={index} className="flex items-start">
                      {index === installationProgress.length - 1 ? (
                        <div className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0">
                          <Loader2 size={16} className="text-blue-500 animate-spin" />
                        </div>
                      ) : (
                        <Check size={16} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      )}
                      <p className={`text-gray-300 ${message.toLowerCase().includes('error') ? 'text-red-400' : ''}`}>{message}</p>
                    </div>
                  ))}
                </div>
                
                {/* Download Progress Bar */}
                {downloadProgress > 0 && downloadProgress < 100 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Download Progress</span>
                      <span>{Math.round(downloadProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-blue-400 h-full transition-all duration-300 ease-in-out" 
                        style={{ width: `${downloadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* SteamCMD Console */}
              <div className="bg-[#0d1117] rounded-xl p-4 border border-gray-800 shadow-md">
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <Terminal size={16} className="text-blue-400 mr-2" />
                  SteamCMD Output
                </h4>
                <div 
                  ref={consoleRef}
                  className="h-80 overflow-y-auto text-xs font-mono p-3 bg-[#080c14] rounded border border-gray-800"
                >
                  {consoleMessages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`mb-1 ${
                        msg.type === 'error' ? 'text-red-400' : 
                        msg.type === 'warning' ? 'text-yellow-400' : 
                        msg.type === 'success' ? 'text-green-400' : 'text-gray-300'
                      }`}
                    >
                      {msg.message}
                    </div>
                  ))}
                  {consoleMessages.length === 0 && (
                    <div className="text-gray-500 italic">Waiting for SteamCMD output...</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : installationStatus === "completed" ? (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-green-900/30 flex items-center justify-center mx-auto mb-6">
              <Check size={32} className="text-green-500" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">Installation Complete</h3>
            <p className="text-gray-400 mb-8">Your server has been successfully installed and verified.</p>
            
            <div className="bg-[#111827] rounded-xl p-5 max-w-md w-full mx-auto border border-green-600/20 shadow-lg shadow-green-900/10">
              <div className="space-y-3 text-sm text-left">
                {installationProgress.map((message, index) => (
                  <div key={index} className="flex items-start">
                    <Check size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300">{message}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 bg-green-900/20 p-4 rounded-xl border border-green-600/20 inline-flex items-center">
              <CheckCircle size={20} className="text-green-500 mr-2" />
              <p className="text-green-300">Redirecting to server management page...</p>
            </div>
          </div>
        ) : installationStatus === "failed" ? (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-red-900/30 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <ServerCrash size={32} className="text-red-500" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">Installation Failed</h3>
            <p className="text-gray-400 mb-6">There was a problem installing your server.</p>
            
            <div className="bg-[#111827] rounded-xl p-5 max-w-md w-full mx-auto border border-red-600/20 shadow-md">
              <div className="space-y-3 text-sm text-left">
                {installationProgress.map((message, index) => (
                  <div key={index} className="flex items-start">
                    {message.toLowerCase().includes('error') || 
                     message.toLowerCase().includes('failed') ? (
                      <AlertCircle size={16} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Check size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    )}
                    <p className={`${
                      message.toLowerCase().includes('error') || 
                      message.toLowerCase().includes('failed') ? 
                      'text-red-400 font-medium' : 'text-gray-300'
                    }`}>
                      {message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 space-y-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                color="primary" 
                variant="solid" 
                onPress={() => {
                  // Reset installation status and go back to previous step
                  setInstallationStatus("idle");
                  setInstallationProgress([]);
                  setConsoleMessages([]);
                  setDownloadProgress(0);
                  handlePreviousStep();
                }}
                startContent={<RefreshCw size={16} />}
                className="px-6"
              >
                Try Again
              </Button>
              
              <Button 
                color="danger" 
                variant="light" 
                onPress={() => router.push('/servers')}
                startContent={<X size={16} />}
              >
                Cancel
              </Button>
            </div>
            
            <div className="mt-8 p-5 bg-[#111827] rounded-xl border border-red-800/30 max-w-md mx-auto shadow-md">
              <h4 className="text-white font-medium mb-3 flex items-center">
                <HelpCircle size={16} className="text-red-400 mr-2" />
                Troubleshooting Tips
              </h4>
              <ul className="text-left text-sm text-gray-400 space-y-2">
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 mr-2"></div>
                  <span>Ensure your node has sufficient disk space</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 mr-2"></div>
                  <span>Check your network connection</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 mr-2"></div>
                  <span>Verify the Steam App ID is correct</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 mr-2"></div>
                  <span>Check the logs for detailed error information</span>
                </li>
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderGameSelection();
      case 1:
        return renderServerConfiguration();
      case 2:
        return renderInstallation();
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Create New Server"
        description="Set up a new game server"
        actions={
          <Button 
            color="default" 
            variant="light" 
            onPress={() => router.push('/servers')}
          >
            Cancel
          </Button>
        }
      />
      
      <div className="my-10 w-full">
        {/* Custom Progress Indicator */}
        <div className="bg-gray-800 rounded-xl shadow-md p-6 flex w-full justify-between">
          <div className={`text-white flex-1 mx-2 p-2 ${currentStep === 0 ? 'opacity-100' : 'opacity-70'}`}>
            <div className="flex flex-col items-center w-full py-3 px-2">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${currentStep === 0 ? 'bg-blue-600' : currentStep > 0 ? 'bg-green-500' : 'bg-gray-800 border border-gray-600'} ${formStyles.transitions.standard} mb-3 shadow-md`}>
                {currentStep > 0 ? <Check size={22} className="text-white" /> : <span className="text-base text-white font-medium">1</span>}
              </div>
              <span className={`${currentStep >= 0 ? 'text-white' : 'text-gray-400'} ${formStyles.transitions.standard} text-sm md:text-base text-center font-medium px-2 whitespace-nowrap`}>
                Select Game & Node
              </span>
            </div>
          </div>
          
          <div className={`text-white flex-1 mx-2 p-2 ${currentStep === 1 ? 'opacity-100' : 'opacity-70'}`}>
            <div className="flex flex-col items-center w-full py-3 px-2">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${currentStep === 1 ? 'bg-blue-600' : currentStep > 1 ? 'bg-green-500' : 'bg-gray-800 border border-gray-600'} ${formStyles.transitions.standard} mb-3 shadow-md`}>
                {currentStep > 1 ? <Check size={22} className="text-white" /> : <span className="text-base text-white font-medium">2</span>}
              </div>
              <span className={`${currentStep >= 1 ? 'text-white' : 'text-gray-400'} ${formStyles.transitions.standard} text-sm md:text-base text-center font-medium px-2 whitespace-nowrap`}>
                Configure Server
              </span>
            </div>
          </div>
          
          <div className={`text-white flex-1 mx-2 p-2 ${currentStep === 2 ? 'opacity-100' : 'opacity-70'}`}>
            <div className="flex flex-col items-center w-full py-3 px-2">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${currentStep === 2 ? 'bg-blue-600' : currentStep > 2 ? 'bg-green-500' : 'bg-gray-800 border border-gray-600'} ${formStyles.transitions.standard} mb-3 shadow-md`}>
                {currentStep > 2 ? <Check size={22} className="text-white" /> : <span className="text-base text-white font-medium">3</span>}
              </div>
              <span className={`${currentStep >= 2 ? 'text-white' : 'text-gray-400'} ${formStyles.transitions.standard} text-sm md:text-base text-center font-medium px-2 whitespace-nowrap`}>
                Installation
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <Card className="bg-gray-900 border-gray-800 text-white shadow-xl rounded-xl overflow-hidden">
        <CardBody className="p-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-16">
              <Spinner size="lg" color="primary" className="mb-4" />
              <p className="text-center text-gray-300">Loading available games and nodes...</p>
            </div>
          ) : (
            renderStepContent()
          )}
        </CardBody>
        
        <CardFooter className="flex justify-between px-8 py-5 border-t border-gray-800 bg-gray-850">
          <Button
            color="default"
            variant="flat"
            startContent={<ArrowLeft size={16} />}
            onPress={handlePreviousStep}
            isDisabled={currentStep === 0 || currentStep === 2}
            className={formStyles.transitions.standard}
          >
            Previous
          </Button>
          
          <div className="flex gap-3">
            <Button
              color="default"
              variant="flat"
              onPress={() => router.push('/servers')}
              isDisabled={currentStep === 2 && installationStatus !== "failed"}
              className={formStyles.transitions.standard}
            >
              Cancel
            </Button>
            
            {currentStep < 1 ? (
              <Button
                color="primary"
                endContent={<ArrowRight size={16} />}
                onPress={handleNextStep}
                isDisabled={!isStepValid()}
                className={`${formStyles.transitions.standard} px-6`}
              >
                Next
              </Button>
            ) : currentStep === 1 ? (
              <Button
                color="primary"
                endContent={<ArrowRight size={16} />}
                onPress={handleSubmit}
                isDisabled={!isStepValid() || isSubmitting}
                isLoading={isSubmitting}
                className={`${formStyles.transitions.standard} px-6`}
              >
                Create Server
              </Button>
            ) : (
              installationStatus === "failed" && (
                <Button
                  color="primary"
                  onPress={() => router.push('/servers')}
                  className={`${formStyles.transitions.standard} px-6`}
                >
                  Back to Servers
                </Button>
              )
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
