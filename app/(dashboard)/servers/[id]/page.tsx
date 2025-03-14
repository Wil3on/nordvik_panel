"use client";

import React, { useCallback, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardBody, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tabs, Tab } from "@nextui-org/react";
import useSWR from "swr";
import { toast } from "sonner";
import { ArrowLeft, RotateCw, Power, AlertTriangle, HardDrive, Globe, Terminal, Cog, FileText, Files, Trash2, Activity, RefreshCw } from "lucide-react";
import { ServerDetailsTab } from "@/components/server/ServerDetailsTab";
import ServerConsoleTab from "@/components/server/ServerConsoleTab";
import ServerLogsTab from "@/components/server/ServerLogsTab";
import ServerSettingsTab from "@/components/server/ServerSettingsTab";
import ServerEventsTab from "@/components/server/ServerEventsTab";
import ServerFileManagerTab from "@/components/server/ServerFileManagerTab";
import { Info } from "lucide-react";

const fetcher = (url: string) => 
  fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      console.log('API response data:', data);
      return data;
    })
    .catch(err => {
      console.error('Fetch error:', err);
      throw err;
    });

type ServerActionType = "start" | "stop" | "restart" | "delete";

export default function ServerPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params at the component top level using React.use()
  const { id } = use(params);
  
  const { data, error, isLoading, mutate } = useSWR(`/api/servers/${id}`, fetcher, {
    refreshInterval: 10000, // Refresh every 10 seconds
    onError: (err) => console.error('SWR Error:', err)
  });

  // Handle both response formats (with or without server wrapper)
  const server = data?.server || data;
  
  console.log('Server data:', server);

  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState<ServerActionType>("start");

  const onOpen = () => setIsModalOpen(true);
  const onClose = () => setIsModalOpen(false);

  const handleBackNavigation = useCallback(() => {
    router.push("/servers");
  }, [router]);

  const handleServerAction = useCallback(
    async (action: ServerActionType) => {
      try {
        // The API has separate endpoints for each action
        let endpoint = `/api/servers/${id}`;
        switch (action) {
          case "start":
            endpoint += "/start";
            break;
          case "stop":
            endpoint += "/stop";
            break;
          case "restart":
            endpoint += "/restart";
            break;
          case "delete":
            endpoint += "/delete";
            break;
        }
        const response = await fetch(endpoint, {
          method: "POST",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to ${action} server`);
        }

        // Show success toast
        toast.success(
          `Server ${
            action === "start"
              ? "started"
              : action === "stop"
              ? "stopped"
              : action === "restart"
              ? "restarted"
              : "deleted"
          } successfully`,
          {
            description: action === "delete" 
              ? "You will be redirected to the servers list" 
              : "The server status will update shortly",
          }
        );

        // Redirect to servers list if server was deleted
        if (action === "delete") {
          router.push("/servers");
          return;
        }

        // Refresh the data
        mutate();
      } catch (error: any) {
        console.error(`Error ${action}ing server:`, error);
        toast.error(`Failed to ${action} server`, {
          description: error.message || "An unexpected error occurred",
        });
      }
    },
    [id, mutate, router]
  );

  const confirmServerAction = useCallback(
    (action: ServerActionType) => {
      setActionType(action);
      onOpen();
    },
    [onOpen]
  );

  const handleConfirm = useCallback(() => {
    handleServerAction(actionType);
    onClose();
  }, [actionType, handleServerAction, onClose]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-12 h-12 bg-blue-900/50 rounded-full flex items-center justify-center">
            <RotateCw className="h-6 w-6 text-blue-500 animate-spin" />
          </div>
          <div className="text-gray-500">Loading server data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-center text-white mb-2">Error Loading Server</h2>
          <p className="text-gray-400 text-center mb-6">
            {error.message || "Failed to load server data. Please try again."}
          </p>
          <div className="flex justify-center gap-4">
            <Button
              color="primary"
              variant="flat"
              startContent={<RefreshCw className="h-4 w-4" />}
              onClick={() => mutate()}
              className="bg-primary-900/20 text-primary-500 font-medium"
            >
              Retry
            </Button>
            <Button
              variant="flat"
              startContent={<ArrowLeft className="h-4 w-4" />}
              onClick={() => router.push("/servers")}
              className="bg-gray-800 text-gray-300 font-medium"
            >
              Back to Servers
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!server) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 max-w-md w-full text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-amber-900/30 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Server Not Found</h2>
          <p className="text-gray-400 mb-6">
            The server you are looking for does not exist or has been deleted.
          </p>
          <Button
            variant="flat"
            className="bg-gray-700 text-white font-medium"
            startContent={<ArrowLeft className="h-4 w-4" />}
            onClick={() => router.push("/servers")}
          >
            Back to Servers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6 bg-gradient-to-b from-gray-900 to-gray-950 min-h-screen">
      {/* Header with back button and server info */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-800/50 shadow-md">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center">
              <Button 
                onClick={() => router.push("/servers")}
                variant="flat"
                className="mr-4 bg-gray-800/80 text-gray-300"
                size="sm"
                isIconOnly
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight flex items-center">
                  {server.name}
                  <Chip 
                    className="ml-4"
                    color={server.status === "online" ? "success" : server.status === "offline" ? "danger" : "warning"}
                    variant="flat"
                    size="sm"
                  >
                    {server.status === "online" ? "Online" : server.status === "offline" ? "Offline" : "Starting"}
                  </Chip>
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  {typeof server.gameType === 'object' ? server.gameType.name || server.game?.name || "Unknown Game" : server.gameType || server.game?.name || "Unknown Game"} • ID: {server.id ? server.id.substring(0, 8) + "..." : "Unknown"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <Button
                size="sm"
                variant="flat"
                className="bg-blue-900/20 text-blue-400 border border-blue-800/50"
                onClick={mutate}
                startContent={<RefreshCw className="h-4 w-4" />}
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Server Info & Actions */}
        <div className="mb-6">
          <Card className="bg-gray-900/80 border-gray-800/60 shadow-lg">
            <CardBody>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex-shrink-0 bg-gray-800/80 p-3 rounded-lg">
                  <Globe className="h-8 w-8 text-blue-400" />
                </div>
                
                <div className="flex-grow">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">IP Address</p>
                      <p className="text-white font-medium">{server.ipAddress || "127.0.0.1"}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Port</p>
                      <p className="text-white font-medium">{server.port || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Node</p>
                      <p className="text-white font-medium">{typeof server.node === 'object' ? server.node.name || "Primary Node" : server.node || "Primary Node"}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-800/60 my-4"></div>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center flex-wrap gap-2">
                  <Button
                    color="success"
                    variant="flat"
                    className="flex-1 sm:flex-initial bg-success-900/20 text-success hover:bg-success-900/40 transition-all duration-200"
                    startContent={<Power className="h-4 w-4" />}
                    isDisabled={server?.status === "online"}
                    onClick={() => confirmServerAction("start")}
                    radius="sm"
                    size="md"
                  >
                    Start
                  </Button>
                  <Button
                    color="danger"
                    variant="flat"
                    className="flex-1 sm:flex-initial bg-danger-900/20 text-danger hover:bg-danger-900/40 transition-all duration-200"
                    startContent={<Power className="h-4 w-4" />}
                    isDisabled={server?.status === "offline"}
                    onClick={() => confirmServerAction("stop")}
                    radius="sm"
                    size="md"
                  >
                    Stop
                  </Button>
                  <Button
                    color="warning"
                    variant="flat"
                    className="flex-1 sm:flex-initial bg-warning-900/20 text-warning hover:bg-warning-900/40 transition-all duration-200"
                    startContent={<RotateCw className="h-4 w-4" />}
                    isDisabled={server?.status === "offline"}
                    onClick={() => confirmServerAction("restart")}
                    radius="sm"
                    size="md"
                  >
                    Restart
                  </Button>
                </div>
                <div className="ml-auto">
                  <Button
                    color="danger"
                    variant="flat"
                    className="bg-danger-900/20 text-danger hover:bg-danger-900/40 transition-all duration-200"
                    startContent={<Trash2 className="h-4 w-4" />}
                    onClick={() => confirmServerAction("delete")}
                    radius="sm"
                    size="md"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Server Tabs */}
        <Tabs 
          aria-label="Server management tabs" 
          variant="underlined" 
          classNames={{
            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-gray-800",
            cursor: "w-full bg-blue-500",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-blue-500"
          }}
        >
          <Tab
            key="details"
            title={
              <div className="flex items-center space-x-2">
                <Info className="h-4 w-4" />
                <span>Details</span>
              </div>
            }
          >
            <Card className="bg-gray-900 border border-gray-800 shadow-none">
              <CardBody className="p-6">
                <ServerDetailsTab server={server} />
              </CardBody>
            </Card>
          </Tab>
          <Tab
            key="console"
            title={
              <div className="flex items-center space-x-2">
                <Terminal className="h-4 w-4" />
                <span>Console</span>
              </div>
            }
            disabled={server?.status?.toLowerCase() === "offline"}
          >
            <Card className="bg-gray-900 border border-gray-800 shadow-none">
              <CardBody className="p-6">
                {server?.id && server?.status && <ServerConsoleTab serverId={server.id} serverStatus={server.status} />}
              </CardBody>
            </Card>
          </Tab>
          <Tab
            key="logs"
            title={
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Logs</span>
              </div>
            }
          >
            <Card className="bg-gray-900 border border-gray-800 shadow-none">
              <CardBody className="p-6">
                {server?.id && <ServerLogsTab serverId={server.id} />}
              </CardBody>
            </Card>
          </Tab>
          <Tab
            key="settings"
            title={
              <div className="flex items-center space-x-2">
                <Cog className="h-4 w-4" />
                <span>Settings</span>
              </div>
            }
          >
            <Card className="bg-gray-900 border border-gray-800 shadow-none">
              <CardBody className="p-6">
                <ServerSettingsTab 
                  serverId={server?.id || ""} 
                  gameId={typeof server?.game === 'object' ? server?.game?.id : server?.gameId} 
                  serverStatus={server?.status || "offline"} 
                  onRefresh={() => mutate()} 
                />
              </CardBody>
            </Card>
          </Tab>
          <Tab
            key="events"
            title={
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>Events</span>
              </div>
            }
          >
            <Card className="bg-gray-900 border border-gray-800 shadow-none">
              <CardBody className="p-6">
                <ServerEventsTab serverId={server?.id || ""} />
              </CardBody>
            </Card>
          </Tab>
          <Tab
            key="files"
            title={
              <div className="flex items-center space-x-2">
                <Files className="h-4 w-4" />
                <span>Files</span>
              </div>
            }
          >
            <Card className="bg-gray-900 border border-gray-800 shadow-none">
              <CardBody className="p-6">
                <ServerFileManagerTab 
                  serverId={server?.id || ""} 
                  serverStatus={server?.status || "offline"} 
                  gameCode={typeof server.game === 'object' ? server.game?.gameCode : server.gameCode} 
                />
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>

      {/* Confirmation Modal */}
      <Modal isOpen={isModalOpen} onClose={onClose}>
        <ModalContent className="bg-gray-900 border border-gray-800 text-white">
          <ModalHeader className="text-white">
            Confirm {actionType === "start" ? "Start" : actionType === "stop" ? "Stop" : actionType === "restart" ? "Restart" : "Delete"} Server
          </ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to {actionType === "start" ? "start" : actionType === "stop" ? "stop" : actionType === "restart" ? "restart" : "delete"} the server "{typeof server?.name === 'object' ? JSON.stringify(server?.name) : server?.name}"?
            </p>
            {actionType === "stop" && (
              <div className="flex items-center mt-2 p-2 bg-red-900/20 text-red-400 rounded-md">
                <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p className="text-sm">
                  Warning: Stopping the server will disconnect all players.
                </p>
              </div>
            )}
            {actionType === "delete" && (
              <div className="flex items-center mt-2 p-2 bg-red-900/20 text-red-400 rounded-md">
                <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p className="text-sm">
                  Warning: This action is permanent and cannot be undone. All server data will be lost.
                </p>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button 
              variant="flat" 
              className="bg-transparent text-gray-400"  
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              color={actionType === "start" ? "success" : actionType === "stop" ? "danger" : actionType === "restart" ? "warning" : "danger"} 
              variant="flat"
              className={
                actionType === "start" 
                  ? "bg-green-900/20 text-green-500 hover:bg-green-900/40" 
                  : actionType === "stop" 
                    ? "bg-red-900/20 text-red-500 hover:bg-red-900/40" 
                    : actionType === "restart" 
                      ? "bg-yellow-900/20 text-yellow-500 hover:bg-yellow-900/40"
                      : "bg-red-900/20 text-red-500 hover:bg-red-900/40"
              }
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
