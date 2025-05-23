import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "node",
  args: ["bin/server.js"],
});

const client = new Client({
  name: "example-client",
  version: "1.0.0",
});

const start = async () => {
  await client.connect(transport);

  // Get a prompt
  const prompt = await client.getPrompt({
    name: "echo",
    arguments: {
      message: "Hello from client!",
    },
  });

  console.log(prompt);

  // List resources
  const resources = await client.listResources();

  console.log(resources);

  // Read a resource
  const resource = await client.readResource({
    uri: "greeting://wiredmartians",
  });

  console.log(resource);

  // Call a tool
  const result = await client.callTool({
    name: "add",
    arguments: {
      a: 2,
      b: 3,
    },
  });
  console.log(result);

  // fetch weather
  const weather = await client.callTool({
    name: "fetch-weather",
    arguments: {
      city: "New York",
    },
  });

  console.log(weather);
};

start()
  .catch((error) => {
    console.error("Error starting client:", error);
    process.exit(1);
  })
  .then(() => {
    console.log("Client started successfully");
  });
