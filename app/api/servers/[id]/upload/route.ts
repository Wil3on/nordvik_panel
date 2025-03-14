import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// Configuration for the Node API
const NODE_API_BASE_URL = process.env.NODE_API_BASE_URL || "http://localhost:3001/api";
const NODE_API_KEY = process.env.NODE_API_KEY || "node_2cd11867-a2a3-44a6-ac92-91e4079b55ea";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const serverId = params.id;
    
    // Check if server exists in database
    const server = await prisma.server.findUnique({
      where: { id: serverId },
      include: {
        node: true,
      }
    });
    
    if (!server) {
      return NextResponse.json(
        { error: "Server not found" },
        { status: 404 }
      );
    }

    // Get the 'path' query parameter to determine destination
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') || '/';
    
    console.log(`Uploading file to server ${serverId} at path ${path}`);
    
    // Parse the form data from the request
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }
    
    console.log(`Received ${files.length} files for upload`);
    
    // Process each file
    const uploadResults = await Promise.all(
      files.map(async (file) => {
        try {
          // Create a new FormData object for each file
          const fileFormData = new FormData();
          
          // The daemon expects the file with field name 'file' (singular)
          fileFormData.append('file', file);
          
          // Construct the upload URL with path as query parameter
          const uploadUrl = `${NODE_API_BASE_URL}/files/${serverId}/upload?path=${encodeURIComponent(path)}`;
          console.log(`Uploading to: ${uploadUrl}`);
          
          // Send the file to the Node API
          const uploadResponse = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
              'X-API-Key': NODE_API_KEY,
            },
            body: fileFormData,
          });
          
          let errorText = "";
          
          if (!uploadResponse.ok) {
            try {
              errorText = await uploadResponse.text();
              console.error(`Error uploading file ${file.name}:`, errorText);
            } catch (e) {
              console.error(`Error reading error response for ${file.name}:`, e);
              errorText = "Could not read error response";
            }
            
            return {
              name: file.name,
              success: false,
              error: `Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}. ${errorText}`
            };
          }
          
          console.log(`Successfully uploaded file: ${file.name}`);
          return {
            name: file.name,
            success: true
          };
        } catch (error) {
          console.error(`Error processing file ${file.name}:`, error);
          return {
            name: file.name,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
          };
        }
      })
    );
    
    // Count successful uploads
    const successCount = uploadResults.filter(result => result.success).length;
    
    if (successCount === 0) {
      // All uploads failed
      return NextResponse.json(
        { error: "All file uploads failed", details: uploadResults },
        { status: 500 }
      );
    } else if (successCount < files.length) {
      // Some uploads failed
      return NextResponse.json(
        { 
          message: `${successCount} of ${files.length} files uploaded successfully`,
          results: uploadResults
        },
        { status: 207 } // Multi-Status
      );
    } else {
      // All uploads succeeded
      return NextResponse.json({ 
        message: `${files.length} files uploaded successfully`,
        results: uploadResults
      });
    }
  } catch (error) {
    console.error("Error in upload route:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
