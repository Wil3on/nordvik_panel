"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter,
  Button, 
  Divider,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Code
} from "@nextui-org/react";
import { ArrowLeft, Info, Server as ServerIcon, Copy, Check } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { requireAdmin } from "@/lib/auth";

// Custom hook for modal state
const useDisclosure = () => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  return { isOpen, onOpen, onClose };
};

export default function NewNodePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [nodeData, setNodeData] = useState<any>(null);
  const [deployCommand, setDeployCommand] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    ipAddress: "",
    port: "3001", // Default from node app
    os: "LINUX", // Will be mapped to correct format
    username: "",
    password: "",
    description: "Nordvik Game Server Node" // Default from node app
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(deployCommand);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmit = async () => {
    // Reset errors
    setErrors({});
    
    // Validate form
    let valid = true;
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }
    
    if (!formData.ipAddress.trim()) {
      newErrors.ipAddress = "IP Address is required";
      valid = false;
    } else if (!/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(formData.ipAddress)) {
      newErrors.ipAddress = "Invalid IP Address format";
      valid = false;
    }
    
    if (!formData.port.trim()) {
      newErrors.port = "Port is required";
      valid = false;
    } else if (!/^\d+$/.test(formData.port) || parseInt(formData.port) < 1 || parseInt(formData.port) > 65535) {
      newErrors.port = "Port must be a number between 1-65535";
      valid = false;
    }
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      valid = false;
    }
    
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    }
    
    if (!valid) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create node object that matches node.config.json structure
      const nodeData = {
        uid: `node_${uuidv4().replace(/-/g, '')}`, // Generate a unique ID for the node
        name: formData.name,
        description: formData.description,
        os: formData.os, // Already in the correct format (LINUX or WIN32)
        ipAddress: formData.ipAddress,
        port: parseInt(formData.port),
        username: formData.username, // For SSH access
        password: formData.password  // For SSH access
      };
      
      // Send data to API
      const response = await fetch('/api/nodes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nodeData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create node');
      }
      
      // Get the created node data
      const result = await response.json();
      setNodeData(result.node);
      
      // Generate the deployment command
      const nodeId = result.node.uid.replace('node_', '');
      const command = `wings configure --panel-url ${window.location.origin} --token ${result.node.authToken} --node ${nodeId}`;
      setDeployCommand(command);
      
      // Show the modal with the command
      onOpen();
    } catch (error: any) {
      console.error("Error creating node:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Add New Node"
        description="Connect a new server node to your network"
        actions={
          <Button 
            variant="light" 
            startContent={<ArrowLeft size={16} />}
            onPress={() => router.push("/nodes")}
          >
            Back to Nodes
          </Button>
        }
      />

      <Card className="mt-6 max-w-3xl mx-auto">
        <CardHeader className="flex flex-col items-start px-6 py-5">
          <div className="flex items-center gap-2">
            <ServerIcon className="h-6 w-6" />
            <h3 className="text-xl font-semibold">Node Details</h3>
          </div>
          <p className="text-default-500 mt-1">
            Enter the details of your server node
          </p>
        </CardHeader>
        <Divider />
        <CardBody className="px-6 py-5 gap-5">
          <div className="space-y-2">
            <label className="text-sm text-gray-300 font-medium">Name</label>
            <input
              className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter a name for this node"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          
          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <label className="text-sm text-gray-300 font-medium">IP Address</label>
              <input
                className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. 192.168.1.100"
                value={formData.ipAddress}
                onChange={(e) => handleInputChange("ipAddress", e.target.value)}
                required
              />
              {errors.ipAddress && <p className="text-red-500 text-xs mt-1">{errors.ipAddress}</p>}
            </div>
            <div className="space-y-2 w-32">
              <label className="text-sm text-gray-300 font-medium">Port</label>
              <input
                className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. 22"
                value={formData.port}
                onChange={(e) => handleInputChange("port", e.target.value)}
                required
              />
              {errors.port && <p className="text-red-500 text-xs mt-1">{errors.port}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-300 font-medium">Operating System</label>
            <select
              className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.os}
              onChange={(e) => handleInputChange("os", e.target.value)}
              required
            >
              <option value="LINUX">Linux</option>
              <option value="WINDOWS">Windows</option>
            </select>
          </div>
          
          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <label className="text-sm text-gray-300 font-medium">Username</label>
              <input
                className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="SSH username"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                required
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </div>
            <div className="space-y-2 flex-1 relative">
              <label className="text-sm text-gray-300 font-medium">Password</label>
              <div className="relative">
                <input
                  className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  type="password"
                  placeholder="SSH password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />
                <Tooltip content="This password will be encrypted before storing">
                  <button type="button" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Info size={16} className="text-gray-400 cursor-help" />
                  </button>
                </Tooltip>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-300 font-medium">Description</label>
            <input
              className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Optional description of this node"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>
        </CardBody>
        <Divider />
        <CardFooter className="px-6 py-4 justify-end">
          <Button 
            color="default" 
            variant="flat"
            onPress={() => router.push("/nodes")}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button 
            color="primary" 
            onPress={handleSubmit}
            isLoading={isLoading}
            className="px-8"
          >
            Add Node
          </Button>
        </CardFooter>
      </Card>
      
      {/* Node Configuration Modal */}
      <Modal 
        isOpen={isOpen} 
        onClose={() => {
          onClose();
          router.push("/nodes");
        }}
        className="max-w-2xl"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <ServerIcon className="h-5 w-5 text-green-500" />
              <span>Node Created Successfully</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <p className="text-default-500">
              Your node <span className="font-semibold text-white">{nodeData?.name}</span> has been created successfully. To connect this node to the panel, run the following command on your server:
            </p>
            
            <div className="mt-4 bg-gray-900 p-4 rounded-md relative">
              <Code className="w-full whitespace-pre-wrap text-sm break-all">
                {deployCommand}
              </Code>
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                className="absolute top-2 right-2"
                onPress={handleCopyCommand}
              >
                {isCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </Button>
            </div>
            
            <div className="mt-4 bg-yellow-900/30 border border-yellow-700/50 p-3 rounded-md">
              <p className="text-yellow-200 text-sm flex items-start gap-2">
                <Info size={16} className="mt-0.5 flex-shrink-0" />
                <span>After running this command, start the node service to connect to the panel. The node will remain offline until it connects.</span>
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button 
              color="primary" 
              onPress={() => {
                onClose();
                router.push("/nodes");
              }}
            >
              Go to Nodes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
