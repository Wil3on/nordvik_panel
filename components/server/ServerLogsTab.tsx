"use client";

import { useState, useEffect, useRef } from "react";
import { Button, Spinner, Pagination, Select, SelectItem } from "@nextui-org/react";
import { RefreshCw, Download, FileText } from "lucide-react";

interface ServerLogsProps {
  serverId: string;
}

interface LogFile {
  name: string;
  size: string;
  modified: string;
}

export default function ServerLogsTab({ serverId }: ServerLogsProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [logFiles, setLogFiles] = useState<LogFile[]>([]);
  const [selectedLogFile, setSelectedLogFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const logsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchLogFiles();
  }, [serverId]);

  useEffect(() => {
    if (selectedLogFile) {
      fetchLogs();
    }
  }, [selectedLogFile, page]);

  const fetchLogFiles = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/servers/${serverId}/logs/files`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch log files");
      }
      
      const data = await response.json();
      setLogFiles(data.logFiles);
      
      // Select the most recent log file by default
      if (data.logFiles.length > 0) {
        setSelectedLogFile(data.logFiles[0].name);
      }
    } catch (error) {
      console.error("Error fetching log files:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLogs = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch(
        `/api/servers/${serverId}/logs?file=${selectedLogFile}&page=${page}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch logs");
      }
      
      const data = await response.json();
      setLogs(data.logs);
      setTotalPages(data.totalPages);
      
      // Scroll to top of logs container when logs change
      if (logsRef.current) {
        logsRef.current.scrollTop = 0;
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchLogs();
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(
        `/api/servers/${serverId}/logs/download?file=${selectedLogFile}`,
        {
          method: "GET",
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to download log file");
      }
      
      // Get filename from content-disposition header or use selectedLogFile
      const contentDisposition = response.headers.get("content-disposition");
      let filename = selectedLogFile;
      
      if (contentDisposition) {
        const filenameMatch = /filename="(.+)"/.exec(contentDisposition);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      
      // Create a download link for the blob and click it
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading log file:", error);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Server Logs</h3>
        <div className="flex gap-2">
          <Button
            color="primary"
            variant="flat"
            startContent={<RefreshCw size={16} />}
            onPress={handleRefresh}
            isDisabled={!selectedLogFile || isLoading}
            isLoading={isLoading}
          >
            Refresh
          </Button>
          <Button
            color="primary"
            variant="flat"
            startContent={<Download size={16} />}
            onPress={handleDownload}
            isDisabled={!selectedLogFile || isLoading}
          >
            Download
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <Select
          label="Log File"
          placeholder="Select a log file"
          selectedKeys={selectedLogFile ? [selectedLogFile] : []}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0]?.toString() || "";
            setSelectedLogFile(selected);
            setPage(1);
          }}
          className="w-full md:w-1/3"
          isDisabled={logFiles.length === 0 || isLoading}
        >
          {logFiles.map((file) => (
            <SelectItem key={file.name} textValue={file.name}>
              <div className="flex justify-between items-center">
                <span>{file.name}</span>
                <span className="text-small text-gray-500">{file.size}</span>
              </div>
            </SelectItem>
          ))}
        </Select>
      </div>
      
      <div
        ref={logsRef}
        className="bg-black text-white h-96 overflow-auto p-4 rounded-lg font-mono text-sm"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner color="primary" />
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <FileText size={32} />
            <p className="mt-2">
              {selectedLogFile
                ? "No log entries found in this file"
                : "Select a log file to view its contents"}
            </p>
          </div>
        ) : (
          logs.map((line, index) => (
            <div key={index} className="mb-1 whitespace-pre-wrap break-all">
              {line}
            </div>
          ))
        )}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            total={totalPages}
            initialPage={1}
            page={page}
            onChange={setPage}
            showControls
          />
        </div>
      )}
      
      <div className="text-xs text-gray-500">
        <p>Note: Logs are arranged with the most recent entries at the top.</p>
      </div>
    </div>
  );
}
