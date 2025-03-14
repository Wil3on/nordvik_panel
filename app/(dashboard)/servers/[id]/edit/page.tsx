"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter, 
  Input, 
  Button, 
  Select, 
  SelectItem,
  Chip,
  Divider,
  Spinner
} from "@nextui-org/react";
import { ArrowLeft, Save, Plus, Trash } from "lucide-react";

import PageHeader from "@/components/ui/page-header";

interface ServerDetails {
  id: string;
  name: string;
  nodeId: string;
  gameId: string;
  os: string;
  ports: Record<string, string>;
  game: {
    name: string;
  };
  node: {
    name: string;
    os: string;
  };
}

interface Port {
  name: string;
  port: string;
}

export default function EditServerPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params at the component top level using React.use()
  const unwrappedParams = use(params);
  const serverId = unwrappedParams.id;

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [server, setServer] = useState<ServerDetails | null>(null);
  const [serverName, setServerName] = useState("");
  const [ports, setPorts] = useState<Port[]>([]);
  
  useEffect(() => {
    const fetchServerDetails = async () => {
      try {
        const response = await fetch(`/api/servers/${serverId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch server details");
        }
        
        const data = await response.json();
        // Check if data.server exists to handle both response formats for robustness
        const serverData = data.server || data;
        setServer(serverData);
        setServerName(serverData.name);
        
        // Transform ports object to array
        const portsArray = Object.entries(serverData.ports || {}).map(([name, port]) => ({
          name,
          port: port as string,
        }));
        
        setPorts(portsArray);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching server details:", error);
        setIsLoading(false);
      }
    };

    fetchServerDetails();
  }, [serverId]);

  const handlePortChange = (index: number, value: string) => {
    const updatedPorts = [...ports];
    updatedPorts[index].port = value;
    setPorts(updatedPorts);
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    
    try {
      // Prepare server data
      const serverData = {
        name: serverName,
        ports: ports.reduce((acc, port) => {
          acc[port.name] = port.port;
          return acc;
        }, {} as Record<string, string>)
      };
      
      // Update server
      const response = await fetch(`/api/servers/${serverId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serverData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update server");
      }
      
      router.push(`/servers/${serverId}`);
    } catch (error) {
      console.error("Error updating server:", error);
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!server) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Server Not Found</h2>
          <p className="mb-6">The server you are looking for does not exist or you don't have permission to view it.</p>
          <Button color="primary" onPress={() => router.push("/servers")}>
            Back to Servers
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title={`Edit Server - ${serverName}`}
        description="Update server information and settings"
        actions={
          <Button
            variant="flat"
            startContent={<ArrowLeft size={16} />}
            onPress={() => router.push(`/servers/${serverId}`)}
          >
            Back
          </Button>
        }
      />

      <Card className="mt-6">
        <CardHeader className="px-6 py-4 border-b border-divider">
          <h3 className="text-lg font-medium">Server Configuration</h3>
        </CardHeader>
        
        <CardBody className="px-6 py-4 gap-6">
          <div className="space-y-2">
            <h4 className="text-base font-medium">Basic Information</h4>
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                label="Server Name"
                placeholder="Enter server name"
                value={serverName}
                onValueChange={setServerName}
                className="w-full"
                isRequired
              />
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <Input
                label="Game"
                value={server.game.name}
                isDisabled
                className="w-full"
              />
              <Input
                label="Node"
                value={server.node.name}
                isDisabled
                className="w-full"
              />
              <Input
                label="Operating System"
                value={server.os}
                isDisabled
                className="w-full"
              />
            </div>
          </div>
          
          <Divider />
          
          <div className="space-y-2">
            <h4 className="text-base font-medium">Port Configuration</h4>
            <div className="space-y-4">
              {ports.map((port, index) => (
                <Input
                  key={index}
                  label={port.name}
                  placeholder={`Enter ${port.name.toLowerCase()}`}
                  value={port.port}
                  onValueChange={(value) => handlePortChange(index, value)}
                  type="number"
                  className="w-full md:w-1/2"
                  isRequired
                />
              ))}
            </div>
          </div>
        </CardBody>
        
        <CardFooter className="px-6 py-4 border-t border-divider flex justify-end gap-2">
          <Button
            variant="flat"
            onPress={() => router.push(`/servers/${serverId}`)}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            startContent={<Save size={16} />}
            onPress={handleSubmit}
            isLoading={isSaving}
          >
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
