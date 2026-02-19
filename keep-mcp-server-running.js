const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');
const fs = require('fs');

// Load .env manually
const envContent = fs.readFileSync('.env', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

async function keepServerRunning() {
  console.log('Starting Figma Console MCP server...\n');
  
  const transport = new StdioClientTransport({
    command: 'npx',
    args: ['-y', 'figma-console-mcp@latest'],
    env: {
      ...process.env,
      FIGMA_ACCESS_TOKEN: envVars.FIGMA_ACCESS_TOKEN,
    }
  });
  
  const client = new Client(
    { name: 'figma-mcp-server', version: '1.0.0' },
    { capabilities: {} }
  );
  
  try {
    await client.connect(transport);
    console.log('✅ MCP server running on port 9223');
    console.log('✅ Desktop Bridge plugin can now connect');
    console.log('\nServer will stay running until you press Ctrl+C\n');
    console.log('Now restart the Desktop Bridge plugin in Figma...\n');
    
    // Keep the process alive
    await new Promise(() => {});
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

keepServerRunning();
