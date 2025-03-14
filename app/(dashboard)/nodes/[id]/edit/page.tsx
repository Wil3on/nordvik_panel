"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { 
  Card, 
  CardBody, 
  CardHeader,
  CardFooter,
  Input,
  Button,
  Select,
  SelectItem,
  Divider,
  Tooltip
} from "@nextui-org/react";
import { ArrowLeft, Info, Server as ServerIcon } from "lucide-react";
import LoadingState from "@/components/ui/loading-state"; 
import PageHeader from "@/components/ui/page-header"; 
import { requireAdmin } from "@/lib/auth";

// Add global styles for form inputs
import "./edit-node.css";

interface NodeDetails {
  id: string;
  name: string;
  ipAddress: string;
  port: number;
  os: string;
  username: string;
  description: string;
}

export default function EditNodePage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params at the component top level using React.use()
  const unwrappedParams = use(params);
  const nodeId = unwrappedParams.id;

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<NodeDetails>({
    id: "",
    name: "",
    ipAddress: "",
    port: 22,
    os: "LINUX",
    username: "",
    description: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    fetchNodeDetails();
  }, [nodeId]);

  const fetchNodeDetails = async () => {
    try {
      const response = await fetch(`/api/nodes/${nodeId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch node details");
      }
      
      const data = await response.json();
      setFormData({
        id: data.node.id,
        name: data.node.name,
        ipAddress: data.node.ipAddress,
        port: data.node.port,
        os: data.node.os,
        username: data.node.username,
        description: data.node.description || ""
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching node details:", error);
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.ipAddress.trim()) {
      newErrors.ipAddress = "IP Address is required";
    } else {
      // Simple IP validation
      const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (!ipRegex.test(formData.ipAddress)) {
        newErrors.ipAddress = "Invalid IP address format";
      }
    }

    if (!formData.port) {
      newErrors.port = "Port is required";
    } else {
      const port = formData.port;
      if (isNaN(Number(port)) || port < 1 || port > 65535) {
        newErrors.port = "Port must be between 1 and 65535";
      }
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/nodes/${nodeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          ipAddress: formData.ipAddress,
          port: formData.port,
          os: formData.os,
          username: formData.username,
          description: formData.description
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update node");
      }

      router.push(`/nodes/${nodeId}`);
    } catch (error) {
      console.error("Error updating node:", error);
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Node</h1>
          <p className="text-gray-400 mt-1">Update node settings and configuration</p>
        </div>
        <div className="flex gap-2 self-end md:self-auto">
          <Button 
            variant="light" 
            startContent={<ArrowLeft size={16} />}
            onPress={() => router.push(`/nodes/${nodeId}`)}
            className="bg-gray-900 text-gray-300 hover:text-white"
          >
            Back to Node
          </Button>
        </div>
      </div>

      <Card className="bg-gray-900 border border-gray-800 shadow-xl max-w-4xl mx-auto">
        <CardHeader className="px-6 py-4 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <ServerIcon className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-medium text-white">Node Details</h3>
          </div>
        </CardHeader>
        
        <div className="p-6 bg-gray-900">
          {/* Node Name */}
          <div className="mb-8">
            <div className="text-xs font-medium text-gray-400 uppercase mb-2">Name</div>
            <Input
              value={formData.name}
              onValueChange={(value) => handleInputChange("name", value)}
              placeholder="Enter node name"
              className="w-full bg-gray-800 border-gray-700 text-white"
              isInvalid={!!errors.name}
              errorMessage={errors.name}
            />
          </div>
          
          {/* IP Address and Port */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="text-xs font-medium text-gray-400 uppercase mb-2">IP Address</div>
              <Input
                value={formData.ipAddress}
                onValueChange={(value) => handleInputChange("ipAddress", value)}
                placeholder="e.g. 192.168.1.100"
                className="w-full bg-gray-800 border-gray-700 text-white"
                isInvalid={!!errors.ipAddress}
                errorMessage={errors.ipAddress}
              />
            </div>
            <div>
              <div className="text-xs font-medium text-gray-400 uppercase mb-2">Port</div>
              <Input
                value={formData.port.toString()}
                onValueChange={(value) => handleInputChange("port", parseInt(value) || 22)}
                placeholder="e.g. 22"
                className="w-full bg-gray-800 border-gray-700 text-white"
                isInvalid={!!errors.port}
                errorMessage={errors.port}
              />
            </div>
          </div>
          
          {/* Operating System */}
          <div className="mb-8">
            <div className="text-xs font-medium text-gray-400 uppercase mb-2">Operating System</div>
            <Select
              selectedKeys={[formData.os]}
              onSelectionChange={(keys) => {
                const selectedKey = keys.size > 0 ? Array.from(keys)[0] as string : "LINUX";
                handleInputChange("os", selectedKey);
              }}
              className="w-full bg-gray-800 border-gray-700 text-white"
            >
              <SelectItem key="LINUX" value="LINUX">Linux</SelectItem>
              <SelectItem key="WINDOWS" value="WINDOWS">Windows</SelectItem>
            </Select>
          </div>
          
          {/* Username */}
          <div className="mb-8">
            <div className="text-xs font-medium text-gray-400 uppercase mb-2">Username</div>
            <Input
              value={formData.username}
              onValueChange={(value) => handleInputChange("username", value)}
              placeholder="SSH username"
              className="w-full bg-gray-800 border-gray-700 text-white"
              isInvalid={!!errors.username}
              errorMessage={errors.username}
            />
          </div>
          
          {/* Password */}
          <div className="mb-8">
            <div className="flex items-center">
              <span className="text-xs font-medium text-gray-400 uppercase mb-2">Password</span>
              <Tooltip content="Only enter a new password if you want to change it">
                <Info size={16} className="text-gray-400 cursor-help ml-2" />
              </Tooltip>
            </div>
            <Input
              type="password"
              onValueChange={(value) => handleInputChange("password", value)}
              placeholder="••••••••••"
              className="w-full bg-gray-800 border-gray-700 text-white"
            />
          </div>
          
          {/* Description */}
          <div className="mb-4">
            <div className="text-xs font-medium text-gray-400 uppercase mb-2">Description</div>
            <Input
              value={formData.description}
              onValueChange={(value) => handleInputChange("description", value)}
              placeholder="Optional description"
              className="w-full bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>
        
        <CardFooter className="px-6 py-4 justify-end bg-gray-800 border-t border-gray-700">
          <Button 
            variant="flat"
            onPress={() => router.push(`/nodes/${nodeId}`)}
            className="mr-3 bg-gray-700 text-gray-300 hover:bg-gray-600"
          >
            Cancel
          </Button>
          <Button 
            color="primary" 
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
