"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Chip,
  Tooltip
} from "@nextui-org/react";
import { Key, Plus, Copy, Trash, Calendar, Info } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

// Dashboard Header Component
interface DashboardHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

function DashboardHeader({
  title,
  description,
  actions,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

// Define interface for API key data
interface ApiKey {
  id: string;
  name: string;
  key?: string;
  createdAt: string;
  lastUsed: string | null;
  expiresAt: string | null;
  permissions: {
    read: boolean;
    write: boolean;
  };
}

// Custom hook for modal state
const useDisclosure = () => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  return { isOpen, onOpen, onClose };
};

// Custom Switch component
const Switch = ({ 
  isSelected, 
  onValueChange, 
  color 
}: { 
  isSelected: boolean; 
  onValueChange: (value: boolean) => void; 
  color: string;
}) => {
  return (
    <div 
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        isSelected 
          ? color === "primary" 
            ? "bg-blue-600" 
            : "bg-amber-500" 
          : "bg-gray-300 dark:bg-gray-600"
      }`}
      onClick={() => onValueChange(!isSelected)}
    >
      <span 
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isSelected ? "translate-x-6" : "translate-x-1"
        }`} 
      />
    </div>
  );
};

// Toast notification system
const toast = {
  success: (message: string) => {
    console.log("Success:", message);
    // In a real app, this would show a toast notification
  },
  error: (message: string) => {
    console.error("Error:", message);
    // In a real app, this would show a toast notification
  }
};

export default function ApiKeysPage() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newApiKey, setNewApiKey] = useState<ApiKey | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [readPermission, setReadPermission] = useState(true);
  const [writePermission, setWritePermission] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");

  // Fetch API keys
  const fetchApiKeys = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/api-keys");
      const data = await response.json();
      
      if (response.ok) {
        setApiKeys(data.apiKeys);
      } else {
        toast.error(data.error || "Failed to fetch API keys");
      }
    } catch (error) {
      console.error("Error fetching API keys:", error);
      toast.error("An error occurred while fetching API keys");
    } finally {
      setIsLoading(false);
    }
  };

  // Create new API key
  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      toast.error("API key name is required");
      return;
    }

    try {
      const response = await fetch("/api/api-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newKeyName,
          permissions: {
            read: readPermission,
            write: writePermission,
          },
          expiresAt: expiryDate ? new Date(expiryDate).toISOString() : null,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setNewApiKey(data.apiKey);
        fetchApiKeys(); // Refresh the list
        toast.success("API key created successfully");
      } else {
        toast.error(data.error || "Failed to create API key");
      }
    } catch (error) {
      console.error("Error creating API key:", error);
      toast.error("An error occurred while creating the API key");
    }
  };

  // Revoke API key
  const revokeApiKey = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this API key? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/api-keys?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      
      if (response.ok) {
        fetchApiKeys(); // Refresh the list
        toast.success("API key revoked successfully");
      } else {
        toast.error(data.error || "Failed to revoke API key");
      }
    } catch (error) {
      console.error("Error revoking API key:", error);
      toast.error("An error occurred while revoking the API key");
    }
  };

  // Copy API key to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("API key copied to clipboard");
  };

  // Reset form
  const resetForm = () => {
    setNewKeyName("");
    setReadPermission(true);
    setWritePermission(false);
    setExpiryDate("");
    setNewApiKey(null);
  };

  // Handle modal close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Load API keys on component mount
  useEffect(() => {
    fetchApiKeys();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <DashboardHeader
        title="API Keys"
        description="Manage API keys for third-party integrations"
      />

      <Card className="mt-6">
        <CardHeader className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Your API Keys</h2>
            <p className="text-sm text-gray-500">
              API keys allow third-party applications to access the Nordvik API
            </p>
          </div>
          <Button 
            color="primary" 
            startContent={<Plus size={16} />}
            onPress={onOpen}
          >
            Create API Key
          </Button>
        </CardHeader>
        <CardBody>
          <Table 
            aria-label="API Keys table"
            className="min-h-[400px]"
          >
            <TableHeader>
              <TableColumn key="name">Name</TableColumn>
              <TableColumn key="created">Created</TableColumn>
              <TableColumn key="lastUsed">Last Used</TableColumn>
              <TableColumn key="expires">Expires</TableColumn>
              <TableColumn key="actions">Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow key="loading">
                  <TableCell>
                    <div className="flex justify-center items-center w-full h-40">
                      <div className="animate-pulse h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : apiKeys.length === 0 ? (
                <TableRow key="empty">
                  <TableCell>
                    <div className="flex justify-center items-center w-full h-40">
                      <p className="text-gray-500 dark:text-gray-400">
                        No API keys found. Create one to get started.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                apiKeys.map((apiKey: ApiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Key size={16} />
                        <span>{apiKey.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(apiKey.createdAt), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      {apiKey.lastUsed 
                        ? formatDistanceToNow(new Date(apiKey.lastUsed), { addSuffix: true }) 
                        : "Never used"}
                    </TableCell>
                    <TableCell>
                      {apiKey.expiresAt 
                        ? (
                          <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>{format(new Date(apiKey.expiresAt), "MMM d, yyyy")}</span>
                          </div>
                        ) 
                        : "Never expires"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Tooltip content="Revoke API Key">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="danger"
                            onClick={() => revokeApiKey(apiKey.id)}
                          >
                            <Trash size={16} />
                          </Button>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Create API Key Modal */}
      <Modal 
        isOpen={isOpen} 
        onClose={handleClose}
      >
        <ModalContent>
          <>
            <ModalHeader>
              {newApiKey ? "API Key Created" : "Create New API Key"}
            </ModalHeader>
            <ModalBody>
              {newApiKey ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">Your API Key</h3>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => copyToClipboard(newApiKey.key || "")}
                        aria-label="Copy API key"
                      >
                        <Copy size={16} />
                      </Button>
                    </div>
                    <div className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded font-mono text-sm break-all">
                      {newApiKey.key}
                    </div>
                    <div className="mt-2 flex items-center text-amber-500 text-sm">
                      <Info size={14} className="mr-1" />
                      <span>This key will only be shown once. Save it securely.</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">API Key Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Name:</span>
                        <span className="text-sm">{newApiKey.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Permissions:</span>
                        <div className="flex gap-1">
                          {newApiKey.permissions.read && (
                            <Chip size="sm" color="primary" variant="flat">Read</Chip>
                          )}
                          {newApiKey.permissions.write && (
                            <Chip size="sm" color="warning" variant="flat">Write</Chip>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Expires:</span>
                        <span className="text-sm">
                          {newApiKey.expiresAt ? format(new Date(newApiKey.expiresAt), "PPp") : "Never"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Input
                    label="API Key Name"
                    placeholder="Enter a name for your API key"
                    value={newKeyName}
                    onValueChange={setNewKeyName}
                    isRequired
                  />
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Permissions</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-sm">Read Access</span>
                          <p className="text-xs text-gray-500">Allows reading data from the API</p>
                        </div>
                        <Switch 
                          isSelected={readPermission}
                          onValueChange={setReadPermission}
                          color="primary"
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-sm">Write Access</span>
                          <p className="text-xs text-gray-500">Allows modifying data through the API</p>
                        </div>
                        <Switch 
                          isSelected={writePermission}
                          onValueChange={setWritePermission}
                          color="warning"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Input
                    type="date"
                    label="Expiration Date (Optional)"
                    placeholder="Select an expiration date"
                    value={expiryDate}
                    onValueChange={setExpiryDate}
                    startContent={<Calendar size={16} />}
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty for a non-expiring key</p>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              {newApiKey ? (
                <Button color="primary" onPress={handleClose}>
                  Done
                </Button>
              ) : (
                <>
                  <Button variant="light" onPress={handleClose}>
                    Cancel
                  </Button>
                  <Button color="primary" onPress={createApiKey}>
                    Create API Key
                  </Button>
                </>
              )}
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </div>
  );
}
