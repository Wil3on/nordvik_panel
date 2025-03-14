"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Edit, Trash, Server, AlertTriangle, GamepadIcon, Users, Clock } from "lucide-react";
import { DashboardCard } from "@/components/ui/DashboardCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { isAdmin } from "@/lib/client-auth";
import { Button, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";

// Define interfaces for type safety
interface Server {
  id: string;
  name: string;
  status: string;
  players: string;
}

interface Game {
  id: string;
  name: string;
  gameCode: string;
  steamAppId: string | null;
  description: string;
  supportedOS: {
    windows: boolean;
    linux: boolean;
  };
  startupCommands: string | null;
  defaultConfig: any | null;
  servers: Server[];
  createdAt: string;
  updatedAt: string;
}

// Custom hook for modal disclosure state
const useDisclosure = () => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  return { isOpen, onOpen, onClose };
};

export default function GameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params at the component top level using React.use()
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  
  const router = useRouter();
  const { data: session } = useSession();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // For deletion confirmation modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Check if user is admin
  const admin = isAdmin(session?.user?.role);
  
  // Fetch game data from API
  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/games/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setGame(null);
          } else {
            throw new Error('Failed to load game data');
          }
          return;
        }
        
        const data = await response.json();
        setGame(data.game || data); // Handle both response formats
      } catch (error) {
        console.error("Error fetching game:", error);
        setError('Failed to load game data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGame();
  }, [id]);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  // Handle edit button click
  const handleEdit = () => {
    router.push(`/games/${id}/edit`);
  };
  
  // Handle delete button click
  const handleDelete = () => {
    onOpen();
  };
  
  // Handle confirm delete
  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      
      const response = await fetch(`/api/games/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete game');
      }
      
      // Close modal and redirect to games list
      onClose();
      router.push('/games');
    } catch (error) {
      console.error("Error deleting game:", error);
      alert(`Failed to delete game: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDeleting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p>Loading game data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <Button color="primary" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }
  
  if (!game) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Game Not Found</h2>
        <p className="text-gray-400 mb-6">The game you're looking for doesn't exist or has been removed.</p>
        <Link href="/games">
          <Button 
            color="primary"
          >
            Back to Games
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/games"
            className="mr-4 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{game.name}</h1>
            <p className="text-gray-400 mt-1">
              {game.steamAppId 
                ? `Steam App ID: ${game.steamAppId} | Game Code: ${game.gameCode}`
                : `Game Code: ${game.gameCode}`
              }
            </p>
          </div>
        </div>
        
        {admin && (
          <div className="flex space-x-2">
            <Button
              color="warning"
              startContent={<Edit className="h-4 w-4" />}
              onPress={handleEdit}
              variant="flat"
            >
              Edit
            </Button>
            <Button
              color="danger"
              startContent={<Trash className="h-4 w-4" />}
              onPress={handleDelete}
              variant="flat"
            >
              Delete
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game information */}
        <div className="lg:col-span-2 space-y-6">
          <DashboardCard title="Game Information" icon={<GamepadIcon className="h-5 w-5" />}>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400">Description</h3>
                <p className="mt-1">{game.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Supported OS</h3>
                  <div className="mt-1 flex space-x-2">
                    {game.supportedOS.windows && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                        Windows
                      </span>
                    )}
                    {game.supportedOS.linux && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                        Linux
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Last Updated</h3>
                  <p className="mt-1 text-sm">{formatDate(game.updatedAt)}</p>
                </div>
              </div>
              
              {game.startupCommands && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Default Startup Commands</h3>
                  <pre className="mt-1 p-2 bg-gray-800 rounded text-sm overflow-auto">
                    {game.startupCommands}
                  </pre>
                </div>
              )}
              
              {game.defaultConfig && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Default Configuration</h3>
                  <pre className="mt-1 p-2 bg-gray-800 rounded text-sm overflow-auto">
                    {JSON.stringify(game.defaultConfig, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </DashboardCard>
          
          <DashboardCard title="Servers" icon={<Server className="h-5 w-5" />}>
            {game.servers && game.servers.length > 0 ? (
              <div className="space-y-4">
                {game.servers.map((server) => (
                  <div key={server.id} className="flex items-center justify-between p-3 bg-gray-800 rounded">
                    <div>
                      <h4 className="font-medium">{server.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <StatusBadge status={server.status} />
                        <span className="text-xs text-gray-400">
                          <Users className="inline h-3 w-3 mr-1" />
                          {server.players}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/servers/${server.id}`}
                      className="text-xs text-blue-500 hover:text-blue-400"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <AlertTriangle className="h-8 w-8 mx-auto text-gray-500 mb-2" />
                <p className="text-gray-400">No servers found for this game.</p>
                {admin && (
                  <Link href={`/servers/new?game=${game.id}`}>
                    <Button
                      color="primary"
                      variant="flat"
                      size="sm"
                      className="mt-4"
                    >
                      Create Server
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </DashboardCard>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <DashboardCard title="Management" icon={<Clock className="h-5 w-5" />}>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-400">Created on</span>
                <p>{formatDate(game.createdAt)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-400">Last updated</span>
                <p>{formatDate(game.updatedAt)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-400">Total Servers</span>
                <p>{game.servers?.length || 0}</p>
              </div>
              
              {admin && (
                <div className="grid grid-cols-1 gap-2 mt-4">
                  <Link href={`/servers/new?game=${game.id}`}>
                    <Button
                      color="primary"
                      variant="flat"
                      fullWidth
                    >
                      Create New Server
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </DashboardCard>
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Confirm Deletion</ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to delete <strong>{game.name}</strong>? This action cannot be undone.
            </p>
            {game.servers && game.servers.length > 0 && (
              <p className="text-red-500 mt-2">
                Warning: This game has {game.servers.length} server(s) associated with it. 
                Deleting this game may affect these servers.
              </p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button 
              color="danger" 
              onPress={handleConfirmDelete}
              isLoading={isDeleting}
            >
              Delete Game
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

// Helper component for server status badge
function StatusBadge({ status }: { status: string }) {
  let color = "default";
  
  switch (status.toLowerCase()) {
    case "online":
      color = "success";
      break;
    case "offline":
      color = "danger";
      break;
    case "maintenance":
      color = "warning";
      break;
    case "installing":
    case "updating":
      color = "secondary";
      break;
  }
  
  return (
    <Chip size="sm" color={color as any} variant="flat">{status}</Chip>
  );
}
