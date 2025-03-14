"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
  Button, 
  Chip, 
  Tooltip, 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem,
  Pagination,
  Input,
  Card
} from "@nextui-org/react";
import { 
  Eye, 
  Edit, 
  Trash2, 
  MoreVertical, 
  Server as ServerIcon, 
  Plus, 
  Search, 
  Monitor,
  Activity,
  CircleOff
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/empty-state";
import LoadingState from "@/components/ui/loading-state";
import ConfirmationModal from "@/components/ui/confirmation-modal";

interface Node {
  id: string;
  name: string;
  uid: string;
  os: string;
  ipAddress: string;
  port: number;
  description: string;
  status: string;
  createdAt: string;
  _count?: {
    servers: number;
  };
}

export default function NodesPage() {
  const router = useRouter();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [filteredNodes, setFilteredNodes] = useState<Node[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const rowsPerPage = 10;

  useEffect(() => {
    fetchNodes();
  }, [currentPage]);

  useEffect(() => {
    filterNodes();
  }, [searchQuery, nodes]);

  const fetchNodes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/nodes?page=${currentPage}&limit=${rowsPerPage}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch nodes");
      }
      
      const data = await response.json();
      setNodes(data.nodes);
      setTotalPages(data.totalPages);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching nodes:", error);
      setIsLoading(false);
    }
  };

  const filterNodes = () => {
    if (!searchQuery.trim()) {
      setFilteredNodes(nodes);
      return;
    }

    const filtered = nodes.filter(node => 
      node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.ipAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.os.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredNodes(filtered);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteNode = () => {
    if (!selectedNode) return;
    
    setIsDeleting(true);
    
    fetch(`/api/nodes/${selectedNode}`, {
      method: "DELETE",
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to delete node");
        }
        return response.json();
      })
      .then(() => {
        fetchNodes();
        setShowDeleteConfirmation(false);
        setSelectedNode(null);
      })
      .catch(error => {
        console.error("Error deleting node:", error);
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  const confirmDelete = (nodeId: string) => {
    setSelectedNode(nodeId);
    setShowDeleteConfirmation(true);
  };

  const renderCell = (node: Node, columnKey: string) => {
    switch (columnKey) {
      case "name":
        return (
          <div className="flex flex-col">
            <p className="text-sm font-medium text-white">{node.name}</p>
            <p className="text-xs text-gray-400">{node.uid}</p>
          </div>
        );
      case "os":
        return (
          <Chip
            className="capitalize px-2 py-1"
            color={node.os === "WINDOWS" ? "primary" : "secondary"}
            size="sm"
            variant="flat"
          >
            {node.os.toLowerCase()}
          </Chip>
        );
      case "ip":
        return (
          <div className="flex flex-col">
            <p className="text-sm text-white">{node.ipAddress}</p>
            <p className="text-xs text-gray-400">Port: {node.port}</p>
          </div>
        );
      case "servers":
        return (
          <p className="text-center font-medium">{node._count?.servers || 0}</p>
        );
      case "actions":
        return (
          <div className="flex justify-end">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly variant="light" className="text-gray-400 hover:text-white">
                  <MoreVertical size={16} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu 
                aria-label="Node Actions"
                className="bg-gray-800 border border-gray-700 shadow-lg"
              >
                <DropdownItem 
                  key="view" 
                  startContent={<Eye size={16} className="text-blue-400" />}
                  onPress={() => router.push(`/nodes/${node.id}`)}
                  className="text-white hover:bg-gray-700"
                >
                  View
                </DropdownItem>
                <DropdownItem 
                  key="edit" 
                  startContent={<Edit size={16} className="text-green-400" />}
                  onPress={() => router.push(`/nodes/${node.id}/edit`)}
                  className="text-white hover:bg-gray-700"
                >
                  Edit
                </DropdownItem>
                <DropdownItem 
                  key="delete" 
                  className="text-red-400 hover:bg-gray-700" 
                  color="danger" 
                  startContent={<Trash2 size={16} className="text-red-400" />}
                  onPress={() => confirmDelete(node.id)}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return null;
    }
  };

  const getNodeDescription = (node: Node) => {
    if (!selectedNode || selectedNode !== node.id) return null;
    
    const serverText = node._count?.servers === 1 
      ? "1 server" 
      : `${node._count?.servers || 0} servers`;
    
    return `Are you sure you want to delete "${node.name}"? This node has ${serverText}.`;
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Nodes"
        description="Manage your server nodes"
        actions={
          <Button 
            color="primary" 
            startContent={<Plus size={16} />}
            onPress={() => router.push("/nodes/new")}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add Node
          </Button>
        }
      />

      <div className="mt-6 flex items-center mb-4">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, IP address, or OS"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="bg-gray-900 border border-gray-800 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
          />
        </div>
      </div>

      {filteredNodes.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
          <ServerIcon size={40} className="mx-auto text-gray-500 mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No Nodes Found</h3>
          <p className="text-gray-400">
            {searchQuery
              ? "No nodes match your search criteria. Try a different search term."
              : "You haven't added any nodes yet. Click the 'Add Node' button to get started."}
          </p>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  NAME
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  STATUS
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  OS
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  IP ADDRESS
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  SERVERS
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {filteredNodes.map(node => (
                <tr key={node.id} className="hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-white">{node.name}</p>
                      <p className="text-xs text-gray-400">{node.uid}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block h-2.5 w-2.5 rounded-full animate-pulse ${
                        node.status?.toUpperCase() === "ONLINE" ? "bg-green-500" : "bg-red-500"
                      }`}></span>
                      <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                        node.status?.toUpperCase() === "ONLINE" 
                          ? "bg-green-900/30 text-green-400 border border-green-700/50" 
                          : "bg-red-900/30 text-red-400 border border-red-700/50"
                      }`}>
                        {node.status?.toUpperCase() === "ONLINE" ? (
                          <><Activity size={12} className="mr-1" /> ONLINE</>
                        ) : (
                          <><CircleOff size={12} className="mr-1" /> OFFLINE</>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      node.os === "WINDOWS" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                    }`}>
                      {node.os}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <p className="text-sm text-white">{node.ipAddress}</p>
                      <p className="text-xs text-gray-400">Port: {node.port}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    {node._count?.servers || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly variant="light" className="text-gray-400 hover:text-white">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu 
                        aria-label="Node Actions"
                        className="bg-gray-800 border border-gray-700 shadow-lg"
                      >
                        <DropdownItem 
                          key="view" 
                          startContent={<Eye size={16} className="text-blue-400" />}
                          onPress={() => router.push(`/nodes/${node.id}`)}
                          className="text-white hover:bg-gray-700"
                        >
                          View
                        </DropdownItem>
                        <DropdownItem 
                          key="edit" 
                          startContent={<Edit size={16} className="text-green-400" />}
                          onPress={() => router.push(`/nodes/${node.id}/edit`)}
                          className="text-white hover:bg-gray-700"
                        >
                          Edit
                        </DropdownItem>
                        <DropdownItem 
                          key="delete" 
                          className="text-red-400 hover:bg-gray-700" 
                          color="danger" 
                          startContent={<Trash2 size={16} className="text-red-400" />}
                          onPress={() => confirmDelete(node.id)}
                        >
                          Delete
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="py-4 px-4 flex justify-center bg-gray-900 border-t border-gray-800">
              <div className="flex gap-2 items-center">
                <button 
                  className="w-8 h-8 rounded-md flex items-center justify-center bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      className={`w-8 h-8 rounded-md flex items-center justify-center ${
                        pageNumber === currentPage 
                          ? "bg-blue-600 text-white" 
                          : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                      }`}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                <button 
                  className="w-8 h-8 rounded-md flex items-center justify-center bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDeleteNode}
        title="Delete Node"
        description={
          nodes.find(node => node.id === selectedNode)
            ? getNodeDescription(nodes.find(node => node.id === selectedNode)!)
            : "Are you sure you want to delete this node?"
        }
        confirmText="Delete"
        confirmColor="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
