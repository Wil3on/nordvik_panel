"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Button, 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Input,
  Chip,
  Tooltip,
  Spinner
} from "@nextui-org/react";
import { Plus, Search, Gamepad2, Edit, Trash, Eye } from "lucide-react";
import { useSession } from "next-auth/react";
import { isAdmin } from "@/lib/client-auth";
import LoadingState from "@/components/ui/LoadingState";

interface Game {
  id: string;
  name: string;
  gameCode: string;
  steamAppId: string | null;
  description: string;
  supportedOS: any;
  startupCommands: string | null;
  defaultConfig: any | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    servers: number;
  };
}

// Game status badge component
function GameStatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, any> = {
    active: "success",
    inactive: "danger",
    maintenance: "warning",
    beta: "secondary",
  };

  return (
    <Chip
      size="sm"
      variant="flat"
      color={colorMap[status.toLowerCase()] || "default"}
    >
      {status}
    </Chip>
  );
}

export default function GamesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingGameId, setDeletingGameId] = useState<string | null>(null);
  const admin = isAdmin(session?.user?.role);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/games');
        if (!response.ok) {
          throw new Error('Failed to fetch games');
        }
        const data = await response.json();
        setGames(data.games || []);
        setFilteredGames(data.games || []);
      } catch (err) {
        console.error('Error fetching games:', err);
        setError('Failed to load games. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredGames(games);
    } else {
      const filtered = games.filter(game => 
        game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.gameCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (game.steamAppId && game.steamAppId.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredGames(filtered);
    }
  }, [searchTerm, games]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const handleAddNew = () => {
    router.push('/games/new');
  };

  const handleViewGame = (gameId: string) => {
    router.push(`/games/${gameId}`);
  };

  const handleEditGame = (gameId: string) => {
    router.push(`/games/${gameId}/edit`);
  };

  const handleDeleteGame = async (gameId: string) => {
    if (confirm("Are you sure you want to delete this game? This action cannot be undone.")) {
      try {
        setDeletingGameId(gameId);
        const response = await fetch(`/api/games/${gameId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete game');
        }
        setGames(prevGames => prevGames.filter(game => game.id !== gameId));
        setFilteredGames(prevGames => prevGames.filter(game => game.id !== gameId));
      } catch (error) {
        console.error('Error deleting game:', error);
        alert(`Failed to delete game: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setDeletingGameId(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="text-center">
          <Spinner size="lg" color="primary" className="mb-4" />
          <p className="text-gray-400">Loading games...</p>
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Games</h1>
        {admin && (
          <Button 
            color="primary" 
            startContent={<Plus size={16} />}
            onPress={handleAddNew}
            size="md"
          >
            Add New Game
          </Button>
        )}
      </div>
      
      <div className="flex w-full flex-col">
        <Input
          className="mb-6 max-w-md"
          placeholder="Search by name, code or Steam App ID..."
          startContent={<Search size={18} className="text-gray-400" />}
          type="search"
          value={searchTerm}
          onValueChange={setSearchTerm}
          aria-label="Search games"
        />
      </div>
      
      {filteredGames.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-700 rounded-lg bg-gray-900/40">
          <Gamepad2 className="h-12 w-12 mx-auto text-gray-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">No games found</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm ? "Try a different search term" : "Add a new game to get started"}
          </p>
          {admin && !searchTerm && (
            <Button 
              color="primary" 
              startContent={<Plus size={16} />}
              onPress={handleAddNew}
              size="md"
            >
              Add New Game
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table 
            aria-label="Games Library Table"
            className="min-w-full shadow-md rounded-lg border border-gray-800"
          >
            <TableHeader>
              <TableColumn key="name" className="bg-gray-900/60">NAME</TableColumn>
              <TableColumn key="gameCode" className="bg-gray-900/60">GAME CODE</TableColumn>
              <TableColumn key="steamAppId" className="bg-gray-900/60">STEAM APP ID</TableColumn>
              <TableColumn key="servers" className="bg-gray-900/60">SERVERS</TableColumn>
              <TableColumn key="createdAt" className="bg-gray-900/60">ADDED ON</TableColumn>
              <TableColumn key="actions" className="bg-gray-900/60 text-center">ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredGames.length === 0 && (
                <TableRow key="no-results">
                  <TableCell className="text-center py-10">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-gray-800/50 p-3 rounded-full mb-3">
                        <Gamepad2 size={24} className="text-gray-500" />
                      </div>
                      <p className="text-gray-500 mb-2">No games found</p>
                      {searchTerm && (
                        <p className="text-sm text-gray-600">Try a different search term</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              )}
              {filteredGames.map((item: Game) => (
                <TableRow key={item.id} className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center">
                      <div className="bg-primary-500/20 p-2 rounded-lg mr-3">
                        <Gamepad2 size={18} className="text-primary-500" />
                      </div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-gray-800 px-2 py-1 rounded">{item.gameCode}</code>
                  </TableCell>
                  <TableCell>
                    {item.steamAppId ? 
                      <code className="text-sm bg-gray-800 px-2 py-1 rounded">{item.steamAppId}</code> : 
                      <span className="text-gray-500">—</span>
                    }
                  </TableCell>
                  <TableCell>
                    <Chip 
                      size="sm" 
                      variant="flat" 
                      color={item._count?.servers ? "success" : "default"}
                      className="px-2"
                    >
                      {item._count?.servers || 0}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <span className="text-default-400 text-xs">
                      {formatDate(item.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Tooltip content="View Details">
                        <Button 
                          isIconOnly
                          size="sm" 
                          variant="flat" 
                          onPress={() => handleViewGame(item.id)}
                          className="bg-blue-600/20 text-blue-500"
                        >
                          <Eye size={16} />
                        </Button>
                      </Tooltip>
                      
                      {admin && (
                        <Tooltip content="Edit Game">
                          <Button 
                            isIconOnly
                            size="sm" 
                            variant="flat" 
                            onPress={() => handleEditGame(item.id)}
                            className="bg-amber-600/20 text-amber-500"
                          >
                            <Edit size={16} />
                          </Button>
                        </Tooltip>
                      )}
                      
                      {admin && (
                        <Tooltip content="Delete Game">
                          <Button 
                            isIconOnly
                            size="sm" 
                            variant="flat" 
                            onPress={() => handleDeleteGame(item.id)}
                            isLoading={deletingGameId === item.id}
                            className="bg-red-600/20 text-red-500"
                          >
                            {deletingGameId !== item.id && <Trash size={16} />}
                          </Button>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <div className="mt-4 text-center text-xs text-gray-500">
        {filteredGames.length > 0 && (
          <p>Showing {filteredGames.length} of {games.length} games</p>
        )}
      </div>
    </div>
  );
}
