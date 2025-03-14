"use client";

import { useState, useEffect, useRef } from "react";
import { Button, Input, Spinner } from "@nextui-org/react";
import { Send, Terminal } from "lucide-react";

interface ServerConsoleProps {
  serverId: string;
  serverStatus: string;
}

export default function ServerConsoleTab({ serverId, serverStatus }: ServerConsoleProps) {
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [command, setCommand] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const consoleRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Cleanup function to close EventSource connection
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when console output changes
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleOutput]);

  const connectToConsole = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setIsConnecting(true);
    setConsoleOutput(prev => [...prev, "Connecting to server console..."]);

    // Create a new EventSource connection
    const eventSource = new EventSource(`/api/servers/${serverId}/console`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
      setIsConnecting(false);
      setConsoleOutput(prev => [...prev, "Connected to server console."]);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === "output") {
          setConsoleOutput(prev => [...prev, data.message]);
        } else if (data.type === "error") {
          setConsoleOutput(prev => [...prev, `Error: ${data.message}`]);
        }
      } catch (error) {
        setConsoleOutput(prev => [...prev, `Error parsing console output: ${event.data}`]);
      }
    };

    eventSource.onerror = () => {
      setConsoleOutput(prev => [...prev, "Connection to console lost. Reconnecting..."]);
      setIsConnected(false);
      eventSource.close();
      
      // Try to reconnect after 3 seconds
      setTimeout(() => {
        if (serverStatus === "ONLINE") {
          connectToConsole();
        } else {
          setConsoleOutput(prev => [...prev, "Cannot connect to console: Server is offline."]);
        }
      }, 3000);
    };
  };

  const disconnectFromConsole = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    setIsConnected(false);
    setConsoleOutput(prev => [...prev, "Disconnected from server console."]);
  };

  const sendCommand = async () => {
    if (!command.trim()) return;
    
    try {
      const response = await fetch(`/api/servers/${serverId}/command`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to send command");
      }
      
      // Show command in console
      setConsoleOutput(prev => [...prev, `> ${command}`]);
      setCommand("");
    } catch (error) {
      console.error("Error sending command:", error);
      setConsoleOutput(prev => [...prev, `Error sending command: ${command}`]);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Server Console</h3>
        <div className="flex gap-2">
          {!isConnected ? (
            <Button
              color="primary"
              onPress={connectToConsole}
              isDisabled={serverStatus !== "ONLINE" || isConnecting}
              isLoading={isConnecting}
            >
              Connect
            </Button>
          ) : (
            <Button
              color="danger"
              variant="flat"
              onPress={disconnectFromConsole}
            >
              Disconnect
            </Button>
          )}
        </div>
      </div>
      
      <div
        ref={consoleRef}
        className="bg-black text-white h-96 overflow-auto p-4 rounded-lg font-mono text-sm"
      >
        {consoleOutput.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Terminal size={32} />
            <p className="mt-2">
              {serverStatus === "ONLINE" 
                ? "Connect to view server console output" 
                : "Server must be online to connect to console"}
            </p>
          </div>
        ) : (
          consoleOutput.map((line, index) => (
            <div key={index} className="mb-1">
              {line}
            </div>
          ))
        )}
        {isConnecting && (
          <div className="flex items-center gap-2 text-yellow-400">
            <Spinner size="sm" color="warning" />
            <span>Connecting to server console...</span>
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <Input
          fullWidth
          placeholder="Type command..."
          value={command}
          onValueChange={setCommand}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendCommand();
            }
          }}
          isDisabled={!isConnected}
        />
        <Button
          isIconOnly
          color="primary"
          onPress={sendCommand}
          isDisabled={!isConnected || !command.trim()}
        >
          <Send size={16} />
        </Button>
      </div>
      
      <div className="text-xs text-gray-500">
        <p>Note: Console commands are sent directly to the game server.</p>
        <p>The server must be online to use the console.</p>
      </div>
    </div>
  );
}
