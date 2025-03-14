"use client";

import { useState, useEffect } from "react";
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Button,
  Spinner,
  Chip,
  Pagination,
  Input
} from "@nextui-org/react";
import { RefreshCw, Search, Calendar } from "lucide-react";

interface ServerEventsProps {
  serverId: string;
}

interface ServerEvent {
  id: string;
  type: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function ServerEventsTab({ serverId }: ServerEventsProps) {
  const [events, setEvents] = useState<ServerEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const rowsPerPage = 10;

  useEffect(() => {
    fetchEvents();
  }, [serverId, page, searchQuery]);

  const fetchEvents = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch(
        `/api/servers/${serverId}/events?page=${page}&limit=${rowsPerPage}&search=${searchQuery}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch server events");
      }
      
      const data = await response.json();
      setEvents(data.events);
      setTotalPages(Math.ceil(data.total / rowsPerPage));
    } catch (error) {
      console.error("Error fetching server events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "INSTALLATION":
        return "primary";
      case "START":
        return "success";
      case "STOP":
        return "default";
      case "RESTART":
        return "warning";
      case "UPDATE":
        return "secondary";
      case "ERROR":
        return "danger";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "success";
      case "FAILED":
        return "danger";
      case "PENDING":
        return "warning";
      case "IN_PROGRESS":
        return "primary";
      default:
        return "default";
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchEvents();
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Server Events</h3>
        <Button
          color="primary"
          variant="flat"
          startContent={<RefreshCw size={16} />}
          onPress={fetchEvents}
          isLoading={isLoading}
        >
          Refresh
        </Button>
      </div>
      
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={<Search size={16} className="text-gray-400" />}
          className="w-full md:w-1/3"
        />
        <Button type="submit" color="primary">
          Search
        </Button>
      </form>
      
      <Table
        aria-label="Server events table"
        bottomContent={
          totalPages > 0 ? (
            <div className="flex w-full justify-center">
              <Pagination
                total={totalPages}
                page={page}
                onChange={setPage}
                showControls
              />
            </div>
          ) : null
        }
        classNames={{
          wrapper: "min-h-[400px]",
        }}
      >
        <TableHeader>
          <TableColumn>EVENT TYPE</TableColumn>
          <TableColumn>MESSAGE</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>TIME</TableColumn>
        </TableHeader>
        <TableBody 
          loadingContent={<Spinner />}
          isLoading={isLoading}
          emptyContent={
            searchQuery 
              ? "No events found matching your search query." 
              : "No events found for this server."
          }
          items={events}
        >
          {(event) => (
            <TableRow key={event.id}>
              <TableCell>
                <Chip
                  color={getEventTypeColor(event.type) as any}
                  variant="flat"
                  size="sm"
                >
                  {event.type.toLowerCase().replace("_", " ")}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="max-w-md truncate">{event.message}</div>
              </TableCell>
              <TableCell>
                <Chip
                  color={getStatusColor(event.status) as any}
                  variant="flat"
                  size="sm"
                >
                  {event.status.toLowerCase().replace("_", " ")}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar size={14} />
                  {formatDate(event.createdAt)}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
