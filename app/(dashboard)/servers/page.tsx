"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Button, 
  Input, 
  Select, 
  SelectItem, 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Chip,
  Tooltip,
  Pagination
} from "@nextui-org/react";
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Play, 
  Square, 
  RotateCw,
  Server
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import LoadingState from "@/components/ui/LoadingState";

interface Server {
  id: string;
  name: string;
  game: {
    name: string;
  };
  node: {
    name: string;
  };
  status: string;
  os: string;
  players?: string;
  createdAt: string;
}

export default function ServersPage() {
  const router = useRouter();
  const [servers, setServers] = useState<Server[]>([]);
  const [filteredServers, setFilteredServers] = useState<Server[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [gameFilter, setGameFilter] = useState("");
  const [games, setGames] = useState<{ id: string, name: string }[]>([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const [serversRes, gamesRes] = await Promise.all([
          fetch("/api/servers"),
          fetch("/api/games")
        ]);

        if (!serversRes.ok || !gamesRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const serversData = await serversRes.json();
        const gamesData = await gamesRes.json();

        setServers(serversData.servers);
        setFilteredServers(serversData.servers);
        setGames(gamesData.games);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchServers();
  }, []);

  useEffect(() => {
    let result = [...servers];
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(server => 
        server.name.toLowerCase().includes(searchLower) ||
        server.game.name.toLowerCase().includes(searchLower) ||
        server.node.name.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(server => server.status === statusFilter);
    }
    
    // Apply game filter
    if (gameFilter) {
      result = result.filter(server => server.game.name === gameFilter);
    }
    
    setFilteredServers(result);
  }, [search, statusFilter, gameFilter, servers]);

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleGameFilterChange = (value: string) => {
    setGameFilter(value);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ONLINE":
        return "success";
      case "STARTING":
      case "RESTARTING":
      case "INSTALLING":
      case "DOWNLOADING":
      case "UPDATING":
        return "warning";
      case "OFFLINE":
      case "STOPPED":
        return "default";
      case "FAILED":
      case "CANCELED":
      case "SUSPENDED":
      case "DELETED":
        return "danger";
      default:
        return "default";
    }
  };

  const handleServerAction = async (serverId: string, action: string) => {
    if (action === "view") {
      router.push(`/servers/${serverId}`);
    } else if (action === "edit") {
      router.push(`/servers/${serverId}/edit`);
    } else if (action === "delete") {
      // Implement delete confirmation modal here
      if (window.confirm("Are you sure you want to delete this server?")) {
        try {
          const response = await fetch(`/api/servers/${serverId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            // Remove server from state
            setServers(servers.filter(server => server.id !== serverId));
          } else {
            console.error("Failed to delete server");
          }
        } catch (error) {
          console.error("Error deleting server:", error);
        }
      }
    } else if (["start", "stop", "restart"].includes(action)) {
      try {
        const response = await fetch(`/api/servers/${serverId}/${action}`, {
          method: "POST",
        });

        if (response.ok) {
          // Refresh server list
          const serversRes = await fetch("/api/servers");
          if (serversRes.ok) {
            const serversData = await serversRes.json();
            setServers(serversData.servers);
          }
        }
      } catch (error) {
        console.error(`Error ${action}ing server:`, error);
      }
    }
  };

  const pages = Math.ceil(filteredServers.length / rowsPerPage);
  const items = filteredServers.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Servers</h1>
        <Button 
          color="primary" 
          startContent={<Plus size={16} />}
          onPress={() => router.push("/servers/new")}
          size="md"
        >
          New Server
        </Button>
      </div>

      <div className="flex w-full flex-col">
        <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
          <Input
            className="mb-4 max-w-md w-full"
            placeholder="Search servers..."
            startContent={<Search size={18} className="text-gray-400" />}
            type="search"
            value={search}
            onValueChange={handleSearchChange}
            aria-label="Search servers"
          />
          <div className="flex gap-2 w-full sm:w-auto mb-4">
            <Select
              placeholder="Status"
              selectedKeys={statusFilter ? [statusFilter] : []}
              onSelectionChange={(keys) => handleStatusFilterChange(Array.from(keys)[0] as string)}
              className="w-full sm:w-36"
            >
              <SelectItem key="" value="">All Status</SelectItem>
              <SelectItem key="ONLINE" value="ONLINE">Online</SelectItem>
              <SelectItem key="OFFLINE" value="OFFLINE">Offline</SelectItem>
              <SelectItem key="INSTALLING" value="INSTALLING">Installing</SelectItem>
              <SelectItem key="STOPPED" value="STOPPED">Stopped</SelectItem>
            </Select>
            <Select
              placeholder="Game"
              selectedKeys={gameFilter ? [gameFilter] : []}
              onSelectionChange={(keys) => handleGameFilterChange(Array.from(keys)[0] as string)}
              className="w-full sm:w-36"
            >
              <SelectItem key="" value="">All Games</SelectItem>
              {games.map((game) => (
                <SelectItem key={game.name} value={game.name}>{game.name}</SelectItem>
              ))}
            </Select>
          </div>
        </div>

        {filteredServers.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-700 rounded-lg bg-gray-900/40">
            <Server className="h-12 w-12 mx-auto text-gray-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">No servers found</h3>
            <p className="text-gray-400 mb-6">
              {search || statusFilter || gameFilter ? "Try different search criteria" : "Create your first server to get started"}
            </p>
            {!search && !statusFilter && !gameFilter && (
              <Button 
                color="primary" 
                startContent={<Plus size={16} />}
                onPress={() => router.push("/servers/new")}
                size="md"
              >
                New Server
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table 
              aria-label="Servers table"
              className="min-w-full shadow-md rounded-lg border border-gray-800"
            >
              <TableHeader>
                <TableColumn key="name" className="bg-gray-900/60 text-center">NAME</TableColumn>
                <TableColumn key="game" className="bg-gray-900/60 text-center">GAME</TableColumn>
                <TableColumn key="node" className="bg-gray-900/60 text-center">NODE</TableColumn>
                <TableColumn key="status" className="bg-gray-900/60 text-center">STATUS</TableColumn>
                <TableColumn key="os" className="bg-gray-900/60 text-center">OS</TableColumn>
                <TableColumn key="players" className="bg-gray-900/60 text-center">PLAYERS</TableColumn>
                <TableColumn key="actions" className="bg-gray-900/60 text-center">ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {/* Only show this empty state when filtered results exist but none match the current page */}
                {filteredServers.length > 0 && items.length === 0 && (
                  <TableRow key="no-results">
                    <TableCell className="text-center py-10">
                      <div className="flex flex-col items-center justify-center">
                        <div className="bg-gray-800/50 p-3 rounded-full mb-3">
                          <Server size={24} className="text-gray-500" />
                        </div>
                        <p className="text-gray-500 mb-2">No servers found</p>
                        {(search || statusFilter || gameFilter) && (
                          <p className="text-sm text-gray-600">Try different search criteria</p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {items.map((server) => (
                  <TableRow key={server.id} className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors">
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        <div className="bg-primary-500/20 p-2 rounded-lg mr-3">
                          <Server size={18} className="text-primary-500" />
                        </div>
                        <span className="font-medium">{server.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium">{server.game.name}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <code className="text-sm bg-gray-800 px-2 py-1 rounded">{server.node.name}</code>
                    </TableCell>
                    <TableCell className="text-center">
                      <Chip
                        color={getStatusColor(server.status) as any}
                        variant="flat"
                        size="sm"
                        className="capitalize"
                      >
                        {server.status.toLowerCase()}
                      </Chip>
                    </TableCell>
                    <TableCell className="text-center">
                      <code className="text-sm bg-gray-800 px-2 py-1 rounded uppercase">{server.os}</code>
                    </TableCell>
                    <TableCell className="text-center">
                      <Chip
                        size="sm"
                        variant="flat"
                        color="default"
                        className="px-2"
                      >
                        {server.players || "0/0"}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        {server.status === "ONLINE" && (
                          <Tooltip content="Stop Server">
                            <Button 
                              isIconOnly 
                              size="sm" 
                              variant="flat" 
                              aria-label="Stop Server"
                              className="bg-red-600/20 text-red-500"
                              onPress={() => handleServerAction(server.id, "stop")}
                            >
                              <Square size={16} />
                            </Button>
                          </Tooltip>
                        )}
                        {(server.status === "OFFLINE" || server.status === "STOPPED") && (
                          <Tooltip content="Start Server">
                            <Button 
                              isIconOnly 
                              size="sm" 
                              variant="flat" 
                              aria-label="Start Server"
                              className="bg-green-600/20 text-green-500"
                              onPress={() => handleServerAction(server.id, "start")}
                            >
                              <Play size={16} />
                            </Button>
                          </Tooltip>
                        )}
                        <Tooltip content="Restart Server">
                          <Button 
                            isIconOnly 
                            size="sm" 
                            variant="flat" 
                            aria-label="Restart Server"
                            className="bg-amber-600/20 text-amber-500"
                            onPress={() => handleServerAction(server.id, "restart")}
                          >
                            <RotateCw size={16} />
                          </Button>
                        </Tooltip>
                        <Tooltip content="View Server">
                          <Button 
                            isIconOnly 
                            size="sm" 
                            variant="flat" 
                            aria-label="View Server"
                            className="bg-blue-600/20 text-blue-500"
                            onPress={() => handleServerAction(server.id, "view")}
                          >
                            <Eye size={16} />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Edit Server">
                          <Button 
                            isIconOnly 
                            size="sm" 
                            variant="flat" 
                            aria-label="Edit Server"
                            className="bg-purple-600/20 text-purple-500"
                            onPress={() => handleServerAction(server.id, "edit")}
                          >
                            <Edit size={16} />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Delete Server">
                          <Button 
                            isIconOnly 
                            size="sm" 
                            variant="flat" 
                            aria-label="Delete Server"
                            className="bg-red-600/20 text-red-500"
                            onPress={() => handleServerAction(server.id, "delete")}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {pages > 1 && (
              <div className="flex justify-center py-4 mt-4">
                <Pagination
                  total={pages}
                  page={page}
                  onChange={setPage}
                  className="gap-2"
                />
              </div>
            )}
          </div>
        )}

        <div className="mt-4 text-center text-xs text-gray-500">
          {filteredServers.length > 0 && (
            <p>Showing {items.length} of {filteredServers.length} servers</p>
          )}
        </div>
      </div>
    </div>
  );
}
