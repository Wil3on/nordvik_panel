import * as fs from 'fs';
import * as path from 'path';

/**
 * Installs a server on a remote node by communicating with the node's API
 * @param server The server object from the database
 */
export async function createServerDirectory(server: any) {
  try {
    console.log(`Initiating installation of server ${server.name} (ID: ${server.id}) on remote node ${server.node.name}`);
    
    if (!server.node || !server.node.ipAddress || !server.node.port) {
      throw new Error('Server node information is missing or incomplete');
    }
    
    // Node API endpoint for server installation
    const nodeApiUrl = `http://${server.node.ipAddress}:${server.node.port}/api/servers/install`;
    
    // Directory structure that should be created on the remote node
    // Structure: servers/data/clients/{clientId}/servers/{serverId}
    const installPath = `servers/data/clients/${server.user.id}/servers/${server.id}`;
    
    // Server configuration data to send to the node
    const serverConfig = {
      id: server.id,
      name: server.name,
      gameId: server.game.id,
      gameName: server.game.name,
      gameCode: server.game.gameCode,
      clientId: server.user.id,
      nodeId: server.node.id,
      nodeName: server.node.name,
      nodeIp: server.node.ipAddress,
      os: server.os,
      ports: server.ports || {},
      status: server.status,
      createdAt: server.createdAt,
      updatedAt: new Date().toISOString()
    };
    
    // Installation request data
    const installationData = {
      serverId: server.id,
      serverName: server.name,
      gameId: server.game.id,
      gameName: server.game.name,
      gameCode: server.game.gameCode,
      steamAppId: server.game.steamAppId,
      clientId: server.user.id,
      installPath: installPath,
      serverConfig: serverConfig,
      ports: server.ports || {}
    };
    
    console.log(`Sending installation request to node at ${nodeApiUrl}`);
    
    // Make a real API call to the node for server installation
    // We're using multiple authentication methods to ensure it works with our modified auth.js
    const response = await fetch(nodeApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'nordvik-api-key',
        'Authorization': `Bearer dev-token`
      },
      body: JSON.stringify(installationData)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`Node API error: ${errorData.error || response.statusText}`);
    }
    
    const result = await response.json();
    console.log('Installation response from node:', result);
    
    console.log(`Successfully sent installation request to node ${server.node.name} (${server.node.ipAddress})`);
    console.log(`Server installation initiated at ${installPath} on the node`);
    console.log(`Game files for ${server.game.name} will be downloaded and installed on the node`);
    
    // Return the remote installation path
    return installPath;
  } catch (error) {
    console.error(`Error installing server on remote node:`, error);
    throw error;
  }
}

/**
 * Updates server status by communicating with the remote node
 * @param serverId The ID of the server to update
 * @param userId The ID of the user who owns the server
 * @param status The new status of the server
 */
export async function updateServerStatus(serverId: string, userId: string, status: string) {
  try {
    console.log(`Updating status to ${status} for server ID: ${serverId}`);
    
    // Get server information from the database using the prisma client directly
    // Since we're in a server component, we need to import the db
    const prisma = (await import('../lib/prisma')).default;
    
    // Get server and node information directly from the database
    const server = await prisma.server.findUnique({
      where: { id: serverId },
      include: {
        node: true,
        game: true,
        user: true
      }
    });
    
    if (!server || !server.node) {
      console.warn(`Could not fetch server or node information for server ID: ${serverId}`);
      return false;
    }
    
    const node = server.node;
    const nodeApiUrl = `http://${node.ipAddress}:${node.port}/api/servers/${serverId}/status`;
    
    // Prepare status update data
    const updateData = {
      serverId: serverId,
      userId: userId,
      status: status,
      updatedAt: new Date().toISOString()
    };
    
    console.log(`Sending status update request to node at ${nodeApiUrl}`);
    
    // Make the API call to update the server status on the node
    // We're using multiple authentication methods to ensure it works with our modified auth.js
    const statusResponse = await fetch(nodeApiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'nordvik-api-key',
        'Authorization': `Bearer dev-token`
      },
      body: JSON.stringify(updateData)
    });
    
    if (!statusResponse.ok) {
      const errorData = await statusResponse.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`Node API error: ${errorData.error || statusResponse.statusText}`);
    }
    
    const result = await statusResponse.json();
    console.log('Status update response from node:', result);
    
    console.log(`Successfully updated server ${serverId} status to ${status} on node ${node.name}`);
    
    return true;
  } catch (error) {
    console.error(`Error updating server status for server ID: ${serverId}:`, error);
    return false;
  }
}
