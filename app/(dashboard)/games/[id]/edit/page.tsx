"use client";

import React, { useState, useEffect } from "react";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { ArrowLeft, Save, RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useIsAdmin } from "@/lib/client-auth";

// Define form state interface
interface GameFormState {
  name: string;
  steamAppId: string;
  gameCode: string;
  description: string;
  supportedOS: {
    windows: boolean;
    linux: boolean;
  };
  startupCommands: string;
  defaultConfig: string;
}

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
}

export default function EditGamePage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params at the component top level using React.use()
  const unwrappedParams = React.use(params);
  const gameId = unwrappedParams.id;
  
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAdmin = useIsAdmin();
  
  // Redirect if user is not an admin
  useEffect(() => {
    if (status === "authenticated" && !isAdmin) {
      router.push("/dashboard");
    }
  }, [status, isAdmin, router]);
  
  // Initialize form state
  const [formState, setFormState] = useState<GameFormState>({
    name: "",
    steamAppId: "",
    gameCode: "",
    description: "",
    supportedOS: {
      windows: true,
      linux: false,
    },
    startupCommands: "",
    defaultConfig: "{}",
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof GameFormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  // Load game data from API
  useEffect(() => {
    const loadGameData = async () => {
      try {
        // Fetch the game from the API
        const response = await fetch(`/api/games/${gameId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setNotFound(true);
          } else {
            throw new Error('Failed to load game data');
          }
          return;
        }
        
        const data = await response.json();
        const game = data.game;
        
        if (game) {
          setFormState({
            name: game.name,
            steamAppId: game.steamAppId || "",
            gameCode: game.gameCode,
            description: game.description,
            supportedOS: {
              windows: game.supportedOS.windows || false,
              linux: game.supportedOS.linux || false,
            },
            startupCommands: game.startupCommands || "",
            defaultConfig: game.defaultConfig ? JSON.stringify(game.defaultConfig, null, 2) : "{}",
          });
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error loading game:', error);
        alert('Failed to load game data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadGameData();
  }, [gameId]);
  
  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when field is edited
    if (errors[name as keyof GameFormState]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    if (name === "windows" || name === "linux") {
      setFormState((prev) => ({
        ...prev,
        supportedOS: {
          ...prev.supportedOS,
          [name]: checked,
        },
      }));
    }
  };
  
  // Validate the form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof GameFormState, string>> = {};
    
    if (!formState.name.trim()) {
      newErrors.name = "Game name is required";
    }
    
    if (!formState.gameCode.trim()) {
      newErrors.gameCode = "Game code is required";
    } else if (!/^[a-z0-9_]+$/.test(formState.gameCode)) {
      newErrors.gameCode = "Game code must contain only lowercase letters, numbers, and underscores";
    }
    
    if (formState.steamAppId && !/^\d+$/.test(formState.steamAppId)) {
      newErrors.steamAppId = "Steam App ID must be a number";
    }
    
    if (!formState.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formState.supportedOS.windows && !formState.supportedOS.linux) {
      newErrors.supportedOS = "At least one operating system must be selected";
    }
    
    try {
      if (formState.defaultConfig.trim()) {
        JSON.parse(formState.defaultConfig);
      }
    } catch (error) {
      newErrors.defaultConfig = "Default configuration must be valid JSON";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare data for API submission
      const gameData = {
        name: formState.name,
        gameCode: formState.gameCode,
        description: formState.description,
        supportedOS: formState.supportedOS,
        steamAppId: formState.steamAppId.trim() || null,
        startupCommands: formState.startupCommands.trim() || null,
        defaultConfig: formState.defaultConfig.trim() 
          ? JSON.parse(formState.defaultConfig)
          : null
      };
      
      // Submit to API
      const response = await fetch(`/api/games/${gameId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update game');
      }
      
      // Success - Navigate back to games list
      router.push("/games");
    } catch (error) {
      console.error("Error updating game:", error);
      alert(`An error occurred while updating the game: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    router.push(`/games/${gameId}`);
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
  
  if (notFound) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4">Game not found</div>
        <button
          onClick={() => router.push("/games")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Back to Games
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button
          onClick={handleCancel}
          className="mr-4 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Edit Game</h1>
          <p className="text-gray-400 mt-1">Update game information</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <DashboardCard title="Game Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Game Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                Game Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formState.name}
                onChange={handleInputChange}
                className={`w-full bg-gray-800 border ${
                  errors.name ? "border-red-500" : "border-gray-700"
                } rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
                placeholder="e.g., Counter-Strike 2"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            
            {/* Game Code */}
            <div>
              <label htmlFor="gameCode" className="block text-sm font-medium text-gray-400 mb-1">
                Game Code *
              </label>
              <input
                type="text"
                id="gameCode"
                name="gameCode"
                value={formState.gameCode}
                onChange={handleInputChange}
                className={`w-full bg-gray-800 border ${
                  errors.gameCode ? "border-red-500" : "border-gray-700"
                } rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
                placeholder="e.g., cs2"
              />
              {errors.gameCode && (
                <p className="mt-1 text-sm text-red-500">{errors.gameCode}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Unique code identifier, lowercase with underscores only.
              </p>
            </div>
            
            {/* Steam App ID */}
            <div>
              <label htmlFor="steamAppId" className="block text-sm font-medium text-gray-400 mb-1">
                Steam App ID
              </label>
              <input
                type="text"
                id="steamAppId"
                name="steamAppId"
                value={formState.steamAppId}
                onChange={handleInputChange}
                className={`w-full bg-gray-800 border ${
                  errors.steamAppId ? "border-red-500" : "border-gray-700"
                } rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
                placeholder="e.g., 730"
              />
              {errors.steamAppId && (
                <p className="mt-1 text-sm text-red-500">{errors.steamAppId}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Leave empty if the game is not on Steam.
              </p>
            </div>
            
            {/* Supported OS */}
            <div>
              <p className="block text-sm font-medium text-gray-400 mb-2">
                Supported Operating Systems *
              </p>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="windows"
                    checked={formState.supportedOS.windows}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <span>Windows</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="linux"
                    checked={formState.supportedOS.linux}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <span>Linux</span>
                </label>
              </div>
              {errors.supportedOS && (
                <p className="mt-1 text-sm text-red-500">{errors.supportedOS}</p>
              )}
            </div>
            
            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formState.description}
                onChange={handleInputChange}
                className={`w-full bg-gray-800 border ${
                  errors.description ? "border-red-500" : "border-gray-700"
                } rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
                placeholder="Describe the game..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
              )}
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Server Configuration">
          <div className="space-y-6">
            {/* Startup Commands */}
            <div>
              <label htmlFor="startupCommands" className="block text-sm font-medium text-gray-400 mb-1">
                Default Startup Commands
              </label>
              <textarea
                id="startupCommands"
                name="startupCommands"
                rows={3}
                value={formState.startupCommands}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono text-sm"
                placeholder="Enter the default startup commands..."
              />
              <p className="mt-1 text-xs text-gray-500">
                These commands will be used to start the server. You can use placeholders like {'{'}{'{'}'SERVER_PORT'{'}'}{'}'}.
              </p>
            </div>
            
            {/* Default Configuration */}
            <div>
              <label htmlFor="defaultConfig" className="block text-sm font-medium text-gray-400 mb-1">
                Default Configuration (JSON)
              </label>
              <textarea
                id="defaultConfig"
                name="defaultConfig"
                rows={8}
                value={formState.defaultConfig}
                onChange={handleInputChange}
                className={`w-full bg-gray-800 border ${
                  errors.defaultConfig ? "border-red-500" : "border-gray-700"
                } rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono text-sm`}
                placeholder='{"serverName": "My Server", "maxPlayers": 16}'
              />
              {errors.defaultConfig && (
                <p className="mt-1 text-sm text-red-500">{errors.defaultConfig}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Default configuration in JSON format. This will be used as a template for new servers.
              </p>
            </div>
          </div>
        </DashboardCard>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <RotateCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Saving...
              </>
            ) : (
              <>
                <Save className="-ml-1 mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
