"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { 
  Button, 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem,
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Card,
  CardBody,
  Progress,
  Tooltip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Tabs,
  Tab,
  Chip
} from "@nextui-org/react";
import { 
  ChevronLeft, 
  Home, 
  RefreshCw, 
  Upload, 
  FolderPlus, 
  FilePlus, 
  Edit, 
  Trash2, 
  Download, 
  Eye, 
  Folder, 
  File, 
  ChevronsUp, 
  ArrowLeft, 
  Search,
  MoreVertical,
  ClipboardCopy
} from "lucide-react";

export interface FileItem {
  name: string;
  path: string;
  type: "file" | "directory";
  size?: number;
  modifiedAt?: string;
}

interface ServerFileManagerTabProps {
  serverId: string;
  serverStatus: string;
  gameCode?: string;
}

export default function ServerFileManagerTab({ 
  serverId, 
  serverStatus,
  gameCode 
}: ServerFileManagerTabProps) {
  // File manager state
  const [isLoading, setIsLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState("/");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [pathHistory, setPathHistory] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  // Form states
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);
  const [newItemType, setNewItemType] = useState<"file" | "directory">("file");
  const [newItemName, setNewItemName] = useState("");
  const [newFileContent, setNewFileContent] = useState("");
  const [fileContent, setFileContent] = useState("");
  
  // Path parts for breadcrumb navigation
  const pathParts = currentPath.split("/").filter(Boolean);
  
  // Check if server is available for file operations
  const isServerAvailable = true; // Allow file operations regardless of server status
  
  // Tab state for file manager view modes
  const [activeTab, setActiveTab] = useState("files");

  // Filter state for search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>([]);
  
  // Helper function to navigate to a directory
  const navigateToDirectory = (dirPath: string) => {
    // Normalize path to prevent path traversal issues
    let normalizedPath = dirPath.replace(/\\/g, '/');
    
    // Prevent navigating above the root by removing any "../" references
    while (normalizedPath.includes('../') || normalizedPath.includes('..\\')) {
      normalizedPath = normalizedPath.replace(/\.\.\//g, '');
      normalizedPath = normalizedPath.replace(/\.\.\\/g, '');
    }
    
    // Remove multiple slashes
    normalizedPath = normalizedPath.replace(/\/+/g, '/');
    
    // Ensure path starts with a slash
    if (!normalizedPath.startsWith('/')) {
      normalizedPath = '/' + normalizedPath;
    }
    
    // Log the navigation
    console.log(`Navigating to: ${normalizedPath}`);
    
    // Update the current path state
    setCurrentPath(normalizedPath);
  };

  // Navigate to parent directory
  const navigateToParent = () => {
    if (currentPath === '/') return;
    
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    const parentPath = parts.length === 0 ? '/' : `/${parts.join('/')}`;
    
    navigateToDirectory(parentPath);
  };

  // Handle click on a directory item
  const handleDirectoryClick = (item: FileItem) => {
    if (item.type === 'directory') {
      navigateToDirectory(item.path || `${currentPath === '/' ? '' : currentPath}/${item.name}`);
    }
  };

  // Initial fetch when component mounts or server/path changes
  useEffect(() => {
    // Clear any previous reference to serverManager that might exist in closure
    let isComponentMounted = true;
    
    const initializeFiles = async () => {
      if (serverId && isServerAvailable && isComponentMounted) {
        await fetchFiles();
      } else if (serverId && !isServerAvailable && isComponentMounted) {
        setError(`Server is currently ${serverStatus}. File operations are only available when the server is online.`);
        setFiles([]);
      }
    };
    
    initializeFiles();
    
    // Set up polling for file refreshes if the component is mounted
    const refreshInterval = setInterval(() => {
      if (serverId && isServerAvailable && !isLoading && isComponentMounted) {
        fetchFiles();
      }
    }, 30000); // Refresh every 30 seconds
    
    return () => {
      isComponentMounted = false;
      clearInterval(refreshInterval);
    };
  }, [serverId, currentPath, serverStatus]);

  const fetchFiles = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching files for server ${serverId} at path ${currentPath}`);
      
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      
      // Clean implementation of the fetch call
      const url = `/api/servers/${serverId}/files?path=${encodeURIComponent(currentPath)}&_t=${timestamp}`;
      console.log(`Making request to: ${url}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `Server returned ${response.status}: ${response.statusText}` }));
        throw new Error(errorData.error || "Failed to fetch files");
      }
      
      const data = await response.json();
      
      // Validate that the response contains either files or items arrays
      const filesList = data.files || data.items || [];
      
      if (!Array.isArray(filesList)) {
        console.error("Invalid file data received:", data);
        throw new Error("Invalid file data format received from server");
      }
      
      // Handle different file structures in case the daemon returns a different format
      const normalizedFiles = filesList.map(file => ({
        name: file.name,
        path: file.path || `${currentPath === '/' ? '' : currentPath}/${file.name}`.replace(/\/\//g, '/'),
        type: file.type || (file.isDirectory ? 'directory' : 'file'),
        size: file.size || 0,
        modifiedAt: file.modified || file.modifiedAt || new Date().toISOString()
      }));
      
      // Sort directories first, then files, both alphabetically
      const sortedFiles = [...normalizedFiles].sort((a, b) => {
        // Sort directories first
        if (a.type === "directory" && b.type !== "directory") return -1;
        if (a.type !== "directory" && b.type === "directory") return 1;
        
        // Then alphabetically
        return a.name.localeCompare(b.name);
      });
      
      setFiles(sortedFiles);
      setIsLoading(false);
    } catch (error: any) {
      console.error("Error fetching files:", error);
      setError(error.message || "Failed to load files");
      setIsLoading(false);
    }
  };

  const navigateTo = (path: string) => {
    setPathHistory([...pathHistory, currentPath]);
    navigateToDirectory(path);
  };

  const navigateToRoot = () => {
    setPathHistory([...pathHistory, currentPath]);
    navigateToDirectory("/");
  };

  const navigateUp = () => {
    if (currentPath === "/") return;
    
    const parts = currentPath.split("/").filter(Boolean);
    parts.pop(); // Remove the last part
    const newPath = parts.length === 0 ? "/" : `/${parts.join("/")}`;
    
    setPathHistory([...pathHistory, currentPath]);
    navigateToDirectory(newPath);
  };
  
  const navigateBack = () => {
    if (pathHistory.length === 0) return;
    
    const previousPath = pathHistory[pathHistory.length - 1];
    const newHistory = pathHistory.slice(0, -1);
    
    setCurrentPath(previousPath);
    setPathHistory(newHistory);
  };

  const handleFileClick = async (file: FileItem) => {
    if (file.type === "directory") {
      // For directories, navigate to that path
      // Use the full path from the file object if available
      if (file.path && file.path.startsWith('/')) {
        navigateToDirectory(file.path);
      } else {
        navigateToDirectory(`${currentPath === '/' ? '' : currentPath}/${file.name}`);
      }
    } else {
      setSelectedFile(file);
      
      // Construct the full file path
      const filePath = file.path || `${currentPath === '/' ? '' : currentPath}/${file.name}`;
      
      // Fetch file content
      try {
        setIsLoading(true);
        const response = await fetch(`/api/servers/${serverId}/files`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "read",
            path: filePath,
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to read file");
        }
        
        const data = await response.json();
        setFileContent(data.content || "");
        setIsEditModalOpen(true);
      } catch (error) {
        console.error("Error reading file:", error);
        alert(error instanceof Error ? error.message : "Failed to read file");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle double-click on file to view it
  const handleFileDoubleClick = async (file: FileItem) => {
    if (file.type === "directory") {
      // For directories, navigate to that path (same as single click)
      if (file.path && file.path.startsWith('/')) {
        navigateToDirectory(file.path);
      } else {
        navigateToDirectory(`${currentPath === '/' ? '' : currentPath}/${file.name}`);
      }
    } else {
      setSelectedFile(file);
      
      // Construct the full file path
      const filePath = file.path || `${currentPath === '/' ? '' : currentPath}/${file.name}`;
      
      // Fetch file content
      try {
        setIsLoading(true);
        const response = await fetch(`/api/servers/${serverId}/files`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "read",
            path: filePath,
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to read file");
        }
        
        const data = await response.json();
        setFileContent(data.content || "");
        setIsViewModalOpen(true); // Open view modal instead of edit modal
      } catch (error) {
        console.error("Error reading file:", error);
        alert(error instanceof Error ? error.message : "Failed to read file");
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleSaveFile = async () => {
    if (!selectedFile) return;
    
    // Construct the full file path
    const filePath = selectedFile.path || `${currentPath === '/' ? '' : currentPath}/${selectedFile.name}`;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/servers/${serverId}/files`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "write",
          path: filePath,
          content: fileContent,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save file");
      }
      
      setIsEditModalOpen(false);
      fetchFiles(); // Refresh the file list
    } catch (error) {
      console.error("Error saving file:", error);
      alert(error instanceof Error ? error.message : "Failed to save file");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateItem = async () => {
    if (!newItemName) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/servers/${serverId}/files`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "create",
          path: `${currentPath === '/' ? '' : currentPath}/${newItemName}`,
          type: newItemType,
          content: newItemType === "file" ? newFileContent : undefined,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to create ${newItemType}`);
      }
      
      setIsNewItemModalOpen(false);
      setNewItemName("");
      setNewFileContent("");
      fetchFiles(); // Refresh the file list
    } catch (error) {
      console.error(`Error creating ${newItemType}:`, error);
      alert(error instanceof Error ? error.message : `Failed to create ${newItemType}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUploadFiles = async () => {
    if (!uploadFiles || uploadFiles.length === 0) return;
    
    try {
      setIsLoading(true);
      
      // Track upload success/failure
      let successCount = 0;
      let failureCount = 0;
      const errors: string[] = [];
      
      // Process each file individually
      for (let i = 0; i < uploadFiles.length; i++) {
        const file = uploadFiles[i];
        console.log(`Processing file ${i+1}/${uploadFiles.length}: ${file.name}`);
        
        try {
          // Read the file as an ArrayBuffer
          const fileContent = await new Promise<ArrayBuffer>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as ArrayBuffer);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
          });
          
          // Convert ArrayBuffer to Base64 for safe transmission
          const base64Content = btoa(
            new Uint8Array(fileContent)
              .reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          
          // Send the file directly to the server using the write API
          const filePath = `${currentPath === '/' ? '' : currentPath}/${file.name}`;
          console.log(`Uploading file to path: ${filePath}`);
          
          const response = await fetch(`/api/servers/${serverId}/files`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'write',
              path: filePath,
              content: base64Content,
              encoding: 'base64'
            }),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to upload ${file.name}`);
          }
          
          console.log(`Successfully uploaded ${file.name}`);
          successCount++;
          
        } catch (fileError) {
          console.error(`Error uploading file ${file.name}:`, fileError);
          failureCount++;
          errors.push(`${file.name}: ${fileError instanceof Error ? fileError.message : 'Unknown error'}`);
        }
      }
      
      // Report results
      if (failureCount === 0) {
        alert(`Successfully uploaded ${successCount} files`);
      } else if (successCount === 0) {
        throw new Error(`All file uploads failed: ${errors.join('; ')}`);
      } else {
        alert(`Uploaded ${successCount} files successfully. ${failureCount} files failed.`);
      }
      
      // Close modal and refresh files
      setIsUploadModalOpen(false);
      setUploadFiles(null);
      fetchFiles();
      
    } catch (error) {
      console.error("Error in upload process:", error);
      alert(error instanceof Error ? error.message : "Failed to upload files");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteFile = async (file: FileItem) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${file.name}?`
    );
    
    if (!confirmDelete) return;
    
    // Construct the full file path
    const filePath = file.path || `${currentPath === '/' ? '' : currentPath}/${file.name}`;
    console.log(`Attempting to delete: ${filePath}, type: ${file.type}`);
    
    try {
      setIsLoading(true);
      // Use the dedicated delete endpoint
      const deleteData = {
        path: filePath,
        type: file.type // Send the file type so the API knows if it's a file or directory
      };
      console.log("Sending delete request with data:", deleteData);
      
      const response = await fetch(`/api/servers/${serverId}/delete-files`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deleteData),
      });
      
      console.log(`Delete response status: ${response.status}`);
      
      // Try to get the response text first
      const responseText = await response.text();
      console.log("Delete response text:", responseText);
      
      // Try to parse as JSON if possible
      let errorData: { error?: string; message?: string } = {};
      try {
        if (responseText) {
          errorData = JSON.parse(responseText) as { error?: string; message?: string };
          console.log("Delete response JSON:", errorData);
        }
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
      }
      
      if (!response.ok) {
        console.error("Delete API error:", errorData);
        throw new Error(
          errorData.error || 
          errorData.message || 
          responseText || 
          `Failed to delete ${file.type === 'directory' ? 'folder' : 'file'}`
        );
      }
      
      console.log(`Successfully deleted: ${filePath}`);
      fetchFiles(); // Refresh the file list
    } catch (error) {
      console.error("Error deleting item:", error);
      alert(error instanceof Error ? error.message : "Failed to delete item");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle downloading a file to local PC
  const handleDownloadFile = () => {
    if (!selectedFile || !fileContent) return;
    
    // Create a blob with the file content
    const blob = new Blob([fileContent], { type: 'text/plain' });
    
    // Create a temporary URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name;
    
    // Append to body, click to trigger download, then clean up
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  // Handle direct download of a file without opening it first
  const handleDirectDownload = async (file: FileItem) => {
    if (file.type !== 'file') return;
    
    // Construct the full file path
    const filePath = file.path || `${currentPath === '/' ? '' : currentPath}/${file.name}`;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/servers/${serverId}/files`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "read",
          path: filePath,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to read file");
      }
      
      const data = await response.json();
      const content = data.content || "";
      
      // Create a blob with the file content
      const blob = new Blob([content], { type: 'text/plain' });
      
      // Create a temporary URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create a temporary anchor element
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      
      // Append to body, click to trigger download, then clean up
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert(error instanceof Error ? error.message : "Failed to download file");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter files based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredFiles(files);
      return;
    }

    const filtered = files.filter(file => 
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFiles(filtered);
  }, [searchQuery, files]);
  
  // Format file size to human-readable format
  const formatFileSize = (bytes?: number): string => {
    if (bytes === undefined || bytes === 0) return "—";
    
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };
  
  // Format date to human-readable format
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "—";
    
    try {
      const date = new Date(dateString);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) return "—";
      
      // Return a nicely formatted date
      return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return "—";
    }
  };
  
  // Get file type based on extension
  const getFileType = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase() || "";
    
    // Map common extensions to friendly names
    const typeMap: Record<string, string> = {
      // Text files
      txt: "Text",
      log: "Log",
      md: "Markdown",
      json: "JSON",
      xml: "XML",
      html: "HTML",
      css: "CSS",
      js: "JavaScript",
      ts: "TypeScript",
      jsx: "React",
      tsx: "React",
      
      // Config files
      cfg: "Config",
      conf: "Config",
      ini: "Config",
      yml: "YAML",
      yaml: "YAML",
      env: "Environment",
      
      // Data files
      csv: "CSV",
      sql: "SQL",
      
      // Scripts
      sh: "Shell Script",
      bat: "Batch File",
      ps1: "PowerShell",
      py: "Python",
      rb: "Ruby",
      php: "PHP",
      
      // Images
      jpg: "Image",
      jpeg: "Image",
      png: "Image",
      gif: "Image",
      svg: "Image",
      ico: "Icon",
      
      // Documents
      pdf: "PDF",
      doc: "Word",
      docx: "Word",
      xls: "Excel",
      xlsx: "Excel",
      ppt: "PowerPoint",
      pptx: "PowerPoint",
      
      // Archives
      zip: "Archive",
      tar: "Archive",
      gz: "Archive",
      rar: "Archive",
      
      // Executables
      exe: "Executable",
      dll: "Library",
      so: "Library",
    };
    
    return typeMap[extension] || extension.toUpperCase() || "File";
  };
  
  // File action dropdown menu
  const FileActions = ({ file }: { file: FileItem }) => (
    <Dropdown>
      <DropdownTrigger>
        <Button 
          isIconOnly 
          size="sm" 
          variant="light" 
          className="text-default-500"
          radius="full"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu 
        aria-label="File Actions" 
        className="dark text-foreground"
      >
        {file.type === "directory" ? (
          <DropdownItem
            key="open"
            startContent={<Folder className="h-4 w-4" />}
            onPress={() => navigateToDirectory(file.path || `${currentPath === '/' ? '' : currentPath}/${file.name}`)}
          >
            Open Folder
          </DropdownItem>
        ) : (
          <DropdownItem
            key="edit"
            startContent={<Edit className="h-4 w-4" />}
            onPress={() => handleFileClick(file)}
          >
            Edit File
          </DropdownItem>
        )}
        
        <DropdownItem
          key="delete"
          className="text-danger"
          color="danger"
          startContent={<Trash2 className="h-4 w-4" />}
          onPress={() => handleDeleteFile(file)}
        >
          Delete
        </DropdownItem>
        
        {file.type !== "directory" && (
          <DropdownItem
            key="download"
            startContent={<Download className="h-4 w-4" />}
            onPress={() => handleDirectDownload(file)}
          >
            Download
          </DropdownItem>
        )}

        {file.type !== "directory" && (
          <DropdownItem
            key="copy-path"
            startContent={<ClipboardCopy className="h-4 w-4" />}
            onPress={() => {
              const path = file.path || `${currentPath === '/' ? '' : currentPath}/${file.name}`;
              navigator.clipboard.writeText(path);
              toast.success("Path copied to clipboard");
            }}
          >
            Copy Path
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );

  return (
    <div className="file-manager-container">
      {/* File Manager Header */}
      <div className="file-manager-header">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">File Manager</h2>
          <Chip 
            size="sm" 
            variant="flat" 
            color={isServerAvailable ? "success" : "warning"}
            className="px-2 py-1"
          >
            {isServerAvailable ? "Available" : "Limited Access"}
          </Chip>
        </div>
      </div>
      
      {/* Breadcrumb Navigation */}
      <div className="file-manager-toolbar">
        <div className="breadcrumb-path">
          <Button
            size="sm"
            variant="flat"
            isIconOnly
            className="mr-1 bg-gray-800/80 text-gray-300"
            onClick={() => navigateToDirectory("/")}
            disabled={isLoading}
          >
            <Home className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="flat"
            isIconOnly
            className="mr-1 bg-gray-800/80 text-gray-300"
            onClick={navigateToParent}
            disabled={isLoading || currentPath === "/"}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            className="bg-gray-800/80 text-gray-300 mr-3"
            onClick={() => fetchFiles()}
            disabled={isLoading}
            startContent={<RefreshCw className="h-4 w-4" />}
          >
            Refresh
          </Button>
          
          <span className="breadcrumb-item active" onClick={() => navigateToDirectory("/")}>
            Root
          </span>
          
          {pathParts.map((part, index) => (
            <React.Fragment key={index}>
              <span className="breadcrumb-separator">/</span>
              <span 
                className={`breadcrumb-item ${index === pathParts.length - 1 ? 'active' : ''}`}
                onClick={() => {
                  const path = `/${pathParts.slice(0, index + 1).join('/')}`;
                  navigateToDirectory(path);
                }}
              >
                {part}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="file-manager-toolbar">
        <div className="flex flex-wrap justify-between w-full">
          <div className="flex flex-wrap gap-2 mb-2 sm:mb-0">
            <Button
              size="sm"
              variant="flat"
              color="primary"
              className="bg-blue-900/50 text-white"
              startContent={<Upload className="h-4 w-4" />}
              onClick={() => setIsUploadModalOpen(true)}
              disabled={!isServerAvailable}
            >
              Upload
            </Button>
            
            <Button
              size="sm"
              variant="flat"
              color="primary"
              className="bg-blue-900/50 text-white"
              startContent={<FolderPlus className="h-4 w-4" />}
              onClick={() => {
                setNewItemType("directory");
                setIsNewItemModalOpen(true);
              }}
              disabled={!isServerAvailable}
            >
              New Folder
            </Button>
            
            <Button
              size="sm"
              variant="flat"
              color="primary"
              className="bg-blue-900/50 text-white"
              startContent={<FilePlus className="h-4 w-4" />}
              onClick={() => {
                setNewItemType("file");
                setIsNewItemModalOpen(true);
              }}
              disabled={!isServerAvailable}
            >
              New File
            </Button>
          </div>
          
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="file-search-input pl-10 pr-3 py-2 text-sm"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <Tabs 
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        className="file-manager-tabs"
        aria-label="File Manager Tabs"
        color="primary"
        variant="underlined"
        classNames={{
          tabList: "bg-transparent border-b border-divider",
          cursor: "bg-primary",
          tab: "text-medium",
        }}
      >
        <Tab
          key="files"
          title={
            <div className="flex items-center gap-2">
              <File className="h-4 w-4" />
              <span>Files</span>
            </div>
          }
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Spinner color="primary" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-center gap-2">
              <div className="text-danger font-semibold">{error}</div>
              <Button size="sm" onClick={fetchFiles}>Retry</Button>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="empty-state">
              {searchQuery ? (
                <>
                  <Folder className="empty-state-icon" />
                  <div className="text-gray-500">No files match your search criteria.</div>
                  <Button size="sm" variant="flat" onClick={() => setSearchQuery("")} className="mt-2">Clear Search</Button>
                </>
              ) : (
                <>
                  <Folder className="empty-state-icon" />
                  <div className="text-gray-500">This folder is empty.</div>
                </>
              )}
            </div>
          ) : (
            <Table
              aria-label="File Manager Table"
              className="file-manager-table"
            >
              <TableHeader>
                <TableColumn key="name">Name</TableColumn>
                <TableColumn key="size">Size</TableColumn>
                <TableColumn key="modified">Last Modified</TableColumn>
                <TableColumn key="actions">Actions</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredFiles.map((file) => (
                  <TableRow key={file.path}>
                    <TableCell>
                      <div
                        className="file-item"
                        onClick={() => handleFileClick(file)}
                        onDoubleClick={() => handleFileDoubleClick(file)}
                      >
                        <div className={`file-icon ${file.type === 'directory' ? 'folder' : 'file'}`}>
                          {file.type === 'directory' ? (
                            <Folder className="h-5 w-5" />
                          ) : (
                            <File className="h-5 w-5" />
                          )}
                        </div>
                        <div className="truncate">
                          {file.name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {file.type === 'directory' ? '-' : formatFileSize(file.size || 0)}
                    </TableCell>
                    <TableCell>
                      {file.modifiedAt ? formatDate(file.modifiedAt) : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="file-actions">
                        <Dropdown>
                          <DropdownTrigger>
                            <Button 
                              isIconOnly 
                              size="sm" 
                              variant="light"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu aria-label="File Actions">
                            {file.type === 'directory' && (
                              <DropdownItem 
                                key="open" 
                                startContent={<Folder className="h-4 w-4 text-blue-400" />}
                                onPress={() => handleDirectoryClick(file)}
                              >
                                Open
                              </DropdownItem>
                            )}
                            
                            {file.type === 'file' && (
                              <DropdownItem 
                                key="view" 
                                startContent={<Eye className="h-4 w-4 text-blue-400" />}
                                onPress={() => handleFileClick(file)}
                              >
                                View
                              </DropdownItem>
                            )}
                            
                            {file.type === 'file' && (
                              <DropdownItem 
                                key="edit" 
                                startContent={<Edit className="h-4 w-4 text-green-400" />}
                                onPress={() => {
                                  if (isServerAvailable) {
                                    handleFileClick(file);
                                  }
                                }}
                              >
                                <span className={!isServerAvailable ? "opacity-50" : ""}>Edit</span>
                              </DropdownItem>
                            )}
                            
                            <DropdownItem 
                              key="download" 
                              startContent={<Download className="h-4 w-4 text-purple-400" />}
                              onPress={() => handleDirectDownload(file)}
                            >
                              Download
                            </DropdownItem>
                            
                            {file.type !== "directory" && (
                              <DropdownItem 
                                key="copy-path" 
                                startContent={<ClipboardCopy className="h-4 w-4 text-amber-400" />}
                                onPress={() => {
                                  const path = file.path || `${currentPath === '/' ? '' : currentPath}/${file.name}`;
                                  navigator.clipboard.writeText(path);
                                  toast.success("Path copied to clipboard");
                                }}
                              >
                                Copy Path
                              </DropdownItem>
                            )}
                            
                            <DropdownItem 
                              key="delete" 
                              className="text-danger"
                              startContent={<Trash2 className="h-4 w-4 text-danger" />}
                              onPress={() => {
                                if (isServerAvailable) {
                                  handleDeleteFile(file);
                                }
                              }}
                            >
                              <span className={!isServerAvailable ? "opacity-50" : ""}>Delete</span>
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Tab>
        <Tab
          key="upload-history"
          title={
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span>Recent Uploads</span>
            </div>
          }
        >
          <div className="flex items-center justify-center h-64 text-gray-500">
            Upload history will be displayed here.
          </div>
        </Tab>
      </Tabs>
      
      {/* Upload Modal */}
      <Modal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)}
        className="bg-[#0b101b]"
      >
        <ModalContent className="bg-[#0b101b] border border-[#182234] rounded-lg">
          <ModalHeader className="border-b border-[#182234] text-gray-100">
            <div className="pr-10">Upload Files</div>
          </ModalHeader>
          <ModalBody className="py-6 bg-[#0b101b]">
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Upload to: {currentPath}
              </label>
              <input
                type="file"
                multiple
                onChange={(e) => setUploadFiles(e.target.files)}
                className="w-full bg-[#141e32] border border-[#1f2a3f] rounded p-3 text-gray-100"
              />
              {isLoading && (
                <div className="mt-4 flex items-center">
                  <Spinner size="sm" color="primary" className="mr-2" />
                  <span className="text-gray-300">Uploading files...</span>
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter className="border-t border-[#182234] bg-[#0b101b]">
            <Button 
              color="danger" 
              variant="light" 
              onPress={() => setIsUploadModalOpen(false)}
              className="bg-[#0b101b] border border-[#182234] text-gray-100"
              isDisabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              color="primary" 
              onPress={handleUploadFiles}
              isLoading={isLoading}
              className="bg-[#10b981] border border-[#059669] text-white"
            >
              Upload
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* New Item Modal */}
      <Modal 
        isOpen={isNewItemModalOpen} 
        onClose={() => setIsNewItemModalOpen(false)}
        className="bg-[#0b101b]"
      >
        <ModalContent className="bg-[#0b101b] border border-[#182234] rounded-lg">
          <ModalHeader className="border-b border-[#182234] text-gray-100">
            <div className="pr-10">
              {newItemType === "file" ? "Create New File" : "Create New Folder"}
            </div>
          </ModalHeader>
          <ModalBody className="py-6 bg-[#0b101b]">
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                {newItemType === "file" ? "File Name" : "Folder Name"}
              </label>
              <input
                placeholder={newItemType === "file" ? "filename.txt" : "folder name"}
                value={newItemName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItemName(e.target.value)}
                className="w-full bg-[#141e32] border border-[#1f2a3f] rounded text-gray-100"
                aria-label={newItemType === "file" ? "File Name" : "Folder Name"}
              />
            </div>
            
            {newItemType === "file" && (
              <div className="mt-4">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  File Content
                </label>
                <textarea
                  placeholder="Enter file content here..."
                  value={newFileContent}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewFileContent(e.target.value)}
                  className="w-full bg-[#141e32] border border-[#1f2a3f] rounded text-gray-100"
                  rows={10}
                  aria-label="File Content"
                />
              </div>
            )}
          </ModalBody>
          <ModalFooter className="border-t border-[#182234] bg-[#0b101b]">
            <Button 
              color="danger" 
              variant="light" 
              onPress={() => setIsNewItemModalOpen(false)}
              className="bg-[#0b101b] border border-[#182234] text-gray-100"
            >
              Cancel
            </Button>
            <Button 
              color="primary" 
              onPress={() => {
                handleCreateItem();
                setIsNewItemModalOpen(false);
              }}
              className="bg-[#10b981] border border-[#059669] text-white"
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        className="bg-[#0b101b] max-w-3xl"
      >
        <ModalContent className="bg-[#0b101b] border border-[#182234] rounded-lg">
          <ModalHeader className="border-b border-[#182234] text-gray-100">
            <div className="pr-10">Edit File: {selectedFile?.name}</div>
          </ModalHeader>
          <ModalBody className="py-6 bg-[#0b101b]">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                File Content
              </label>
              <textarea
                value={fileContent}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFileContent(e.target.value)}
                rows={20}
                placeholder="File content..."
                className="w-full font-mono text-sm bg-[#141e32] border border-[#1f2a3f] rounded text-gray-100"
                aria-label="File Content"
              />
            </div>
          </ModalBody>
          <ModalFooter className="border-t border-[#182234] bg-[#0b101b]">
            <Button 
              color="primary" 
              onPress={handleSaveFile}
              isLoading={isLoading}
              className="bg-[#10b981] border border-[#059669] text-white"
            >
              Save
            </Button>
            <Button 
              color="primary"
              variant="bordered"
              onPress={handleDownloadFile}
              className="bg-[#0b101b] border border-[#3b82f6] text-[#3b82f6]"
            >
              Download
            </Button>
            <Button 
              color="danger" 
              variant="light" 
              onPress={() => setIsEditModalOpen(false)}
              className="bg-[#0b101b] border border-[#182234] text-gray-100"
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Modal */}
      <Modal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)}
        className="bg-[#0b101b] max-w-3xl"
      >
        <ModalContent className="bg-[#0b101b] border border-[#182234] rounded-lg">
          <ModalHeader className="border-b border-[#182234] text-gray-100">
            <div className="pr-10">View File: {selectedFile?.name}</div>
          </ModalHeader>
          <ModalBody className="py-6 bg-[#0b101b]">
            <div className="file-viewer">
              <pre>{fileContent}</pre>
            </div>
          </ModalBody>
          <ModalFooter className="border-t border-[#182234] bg-[#0b101b]">
            <Button 
              color="primary" 
              onPress={() => {
                setIsViewModalOpen(false);
                setIsEditModalOpen(true);
              }}
              className="bg-[#10b981] border border-[#059669] text-white"
            >
              Edit
            </Button>
            <Button 
              color="primary"
              variant="bordered"
              onPress={handleDownloadFile}
              className="bg-[#0b101b] border border-[#3b82f6] text-[#3b82f6]"
            >
              Download
            </Button>
            <Button 
              color="danger" 
              variant="light" 
              onPress={() => setIsViewModalOpen(false)}
              className="bg-[#0b101b] border border-[#182234] text-gray-100"
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
