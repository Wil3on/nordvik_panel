"use client";

import React, { useState, useEffect } from "react";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { ArrowLeft, Plus, X, Trash, RotateCw, Save } from "lucide-react";
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

export default function NewGamePage() {
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
    defaultConfig: "{\n  \"serverName\": \"Nordvik Server\",\n  \"maxPlayers\": 16,\n  \"gameMode\": \"competitive\",\n  \"mapRotation\": [\"de_dust2\", \"de_mirage\", \"de_inferno\"]\n}",
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof GameFormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors: Partial<Record<keyof GameFormState, string>> = {};
    
    if (!formState.name.trim()) {
      validationErrors.name = "Game name is required";
    }
    
    if (!formState.gameCode.trim()) {
      validationErrors.gameCode = "Game code is required";
    }
    
    if (!formState.description.trim()) {
      validationErrors.description = "Description is required";
    }
    
    // Validate JSON for defaultConfig if provided
    if (formState.defaultConfig.trim()) {
      try {
        JSON.parse(formState.defaultConfig);
      } catch (e) {
        validationErrors.defaultConfig = "Invalid JSON format";
      }
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare data for API submission
      const parsedDefaultConfig = formState.defaultConfig.trim() 
        ? JSON.parse(formState.defaultConfig)
        : {};
      
      const gameData = {
        name: formState.name,
        gameCode: formState.gameCode,
        description: formState.description,
        supportedOS: formState.supportedOS,
        steamAppId: formState.steamAppId.trim() || null,
        startupCommands: formState.startupCommands.trim() || null,
        defaultConfig: parsedDefaultConfig
      };
      
      console.log("Submitting game data:", JSON.stringify(gameData));
      
      // Submit to API
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API response error:", errorData);
        throw new Error(errorData.error || 'Failed to create game');
      }
      
      // Success - Navigate back to games list
      router.push("/games");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`An error occurred while saving the game: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    router.push("/games");
  };
  
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
          <h1 className="text-2xl font-bold">New Game</h1>
          <p className="text-gray-400 mt-1">Add a new game to your panel</p>
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
                Lowercase letters, numbers, and underscores only. This will be used for server directories.
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
                Leave blank for non-Steam games
              </p>
            </div>
            
            {/* Operating System */}
            <div>
              <span className="block text-sm font-medium text-gray-400 mb-2">
                Supported Operating Systems *
              </span>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="windows"
                    checked={formState.supportedOS.windows}
                    onChange={handleCheckboxChange}
                    className="rounded bg-gray-800 border-gray-700 text-blue-600 focus:ring-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-300">Windows</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="linux"
                    checked={formState.supportedOS.linux}
                    onChange={handleCheckboxChange}
                    className="rounded bg-gray-800 border-gray-700 text-blue-600 focus:ring-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-300">Linux</span>
                </label>
              </div>
              {errors.supportedOS && (
                <p className="mt-1 text-sm text-red-500">{errors.supportedOS}</p>
              )}
            </div>
          </div>
          
          {/* Description */}
          <div className="mt-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formState.description}
              onChange={handleInputChange}
              rows={3}
              className={`w-full bg-gray-800 border ${
                errors.description ? "border-red-500" : "border-gray-700"
              } rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
              placeholder="Enter a description for the game"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>
        </DashboardCard>
        
        <DashboardCard title="Server Configuration">
          {/* Startup Commands */}
          <div>
            <label htmlFor="startupCommands" className="block text-sm font-medium text-gray-400 mb-1">
              Startup Commands
            </label>
            <textarea
              id="startupCommands"
              name="startupCommands"
              value={formState.startupCommands}
              onChange={handleInputChange}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Enter startup commands for the game server"
            />
            <p className="mt-1 text-xs text-gray-500">
              Variables: {`{{SERVER_IP}}, {{SERVER_PORT}}, {{MAP}}, {{MAXPLAYERS}}, {{TICKRATE}}`}
            </p>
          </div>
          
          {/* Default Configuration */}
          <div className="mt-6">
            <label htmlFor="defaultConfig" className="block text-sm font-medium text-gray-400 mb-1">
              Default Configuration (JSON)
            </label>
            <textarea
              id="defaultConfig"
              name="defaultConfig"
              value={formState.defaultConfig}
              onChange={handleInputChange}
              rows={10}
              className={`w-full bg-gray-800 border ${
                errors.defaultConfig ? "border-red-500" : "border-gray-700"
              } rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono text-sm`}
              placeholder="Enter default configuration in JSON format"
            />
            {errors.defaultConfig && (
              <p className="mt-1 text-sm text-red-500">{errors.defaultConfig}</p>
            )}
          </div>
        </DashboardCard>
        
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-md text-sm transition-colors"
          >
            {isSubmitting ? (
              <>
                <RotateCw className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Game</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
