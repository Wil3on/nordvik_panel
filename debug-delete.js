// Debug script for testing file deletion with the Node daemon directly
const fetch = require('node-fetch');

// Configuration
const NODE_IP = "127.0.0.1"; // Change this to your node IP
const NODE_PORT = 3001; // Change this to your node port 
const SERVER_ID = "your-server-id"; // Change this to your server ID
const FILE_PATH = "/path/to/file"; // Change this to the file/folder path you want to delete

// Headers for Node API
const headers = {
  'Content-Type': 'application/json',
  'X-API-Key': 'nordvik-api-key',
  'Authorization': 'Bearer dev-token'
};

// API URL for file deletion
const nodeApiUrl = `http://${NODE_IP}:${NODE_PORT}/api/files/${SERVER_ID}/delete`;

// Request body
const body = {
  path: FILE_PATH,
  recursive: true
};

console.log(`Sending delete request to: ${nodeApiUrl}`);
console.log(`Request body: ${JSON.stringify(body)}`);

// Make the request
fetch(nodeApiUrl, {
  method: 'POST',
  headers,
  body: JSON.stringify(body)
})
.then(async response => {
  console.log(`Response status: ${response.status}`);
  console.log(`Response headers:`, response.headers.raw());
  
  const text = await response.text();
  console.log(`Response text: ${text}`);
  
  try {
    const json = JSON.parse(text);
    console.log(`Response JSON: ${JSON.stringify(json, null, 2)}`);
  } catch (e) {
    console.log(`Not valid JSON: ${e.message}`);
  }
  
  if (!response.ok) {
    console.error(`Error deleting file: ${response.status} ${response.statusText}`);
  } else {
    console.log(`Successfully deleted file: ${FILE_PATH}`);
  }
})
.catch(error => {
  console.error(`Network error: ${error.message}`);
});
