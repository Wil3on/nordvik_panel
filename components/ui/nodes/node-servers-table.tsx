"use client";

import { useState } from "react";
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@nextui-org/react";
import { Play, Pause, RefreshCw, MoreVertical, Trash } from "lucide-react";
import NodeStatusIndicator from "./node-status-indicator";

interface Server {
  id: string;
  name: string;
  game: string;
  status: string;
  ports: string;
}

interface NodeServersTableProps {
  nodeId: string;
  servers?: Server[];
  isLoading?: boolean;
}

export default function NodeServersTable({
  nodeId,
  servers = [],
  isLoading = false
}: NodeServersTableProps) {
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  
  const pages = Math.ceil(servers.length / rowsPerPage);
  const items = servers.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  
  const handleStartServer = (serverId: string) => {
    console.log(`Starting server ${serverId}`);
    // Implementation for starting server
  };
  
  const handleStopServer = (serverId: string) => {
    console.log(`Stopping server ${serverId}`);
    // Implementation for stopping server
  };
  
  const handleRestartServer = (serverId: string) => {
    console.log(`Restarting server ${serverId}`);
    // Implementation for restarting server
  };
  
  const handleDeleteServer = (serverId: string) => {
    console.log(`Deleting server ${serverId}`);
    // Implementation for deleting server
  };
  
  const renderServerActions = (server: Server) => {
    const isOnline = server.status.toUpperCase() === "ONLINE";
    
    return (
      <div className="flex items-center gap-2">
        <Button
          isIconOnly
          size="sm"
          color="primary"
          variant="light"
          onClick={() => isOnline ? handleStopServer(server.id) : handleStartServer(server.id)}
          aria-label={isOnline ? "Stop server" : "Start server"}
        >
          {isOnline ? <Pause size={16} /> : <Play size={16} />}
        </Button>
        
        <Button
          isIconOnly
          size="sm"
          color="primary"
          variant="light"
          onClick={() => handleRestartServer(server.id)}
          aria-label="Restart server"
          isDisabled={!isOnline}
        >
          <RefreshCw size={16} />
        </Button>
        
        <Dropdown>
          <DropdownTrigger>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              aria-label="More actions"
            >
              <MoreVertical size={16} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Server actions">
            <DropdownItem
              key="delete"
              color="danger"
              startContent={<Trash size={16} />}
              onPress={() => handleDeleteServer(server.id)}
            >
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  };
  
  return (
    <div className="w-full">
      <Table aria-label="Servers table">
        <TableHeader>
          <TableColumn key="name">Name</TableColumn>
          <TableColumn key="game">Game</TableColumn>
          <TableColumn key="status">Status</TableColumn>
          <TableColumn key="ports">Ports</TableColumn>
          <TableColumn key="actions">Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow key="loading">
              <TableCell>
                <div className="flex justify-center py-4 col-span-5">Loading servers...</div>
              </TableCell>
            </TableRow>
          ) : items.length === 0 ? (
            <TableRow key="empty">
              <TableCell>
                <div className="flex justify-center py-4 col-span-5">No servers found on this node.</div>
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.game}</TableCell>
                <TableCell>
                  <NodeStatusIndicator status={item.status} size="sm" />
                </TableCell>
                <TableCell>{item.ports}</TableCell>
                <TableCell>{renderServerActions(item)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {pages > 0 && (
        <div className="flex w-full justify-center mt-4">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="flat"
              isDisabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="flat"
              isDisabled={page === pages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
      <div className="text-center text-small text-default-400 mt-2">
        {pages > 0 ? `Page ${page} of ${pages}` : ""}
      </div>
    </div>
  );
}
