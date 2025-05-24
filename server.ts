import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "Demo MCP",
  version: "1.0.0",
  description: "A demo server for Model Context Protocol",
});

// Add an addition tool
// @ts-ignore
server.tool("add", { a: z.number(), b: z.number() }, async ({ a, b }) => ({
  content: [{ type: "text", text: String(a + b) }],
}));

// @ts-ignore
server.prompt("echo", { message: z.string() }, ({ message }) => ({
  messages: [
    {
      role: "user",
      content: {
        type: "text",
        text: `Please process this message: ${message}`,
      },
    },
  ],
}));

// Add a dynamic greeting resource
server.resource(
  "greeting",
  new ResourceTemplate("greeting://{name}", { list: undefined }),
  async (uri, { name }) => ({
    contents: [
      {
        uri: uri.href,
        text: `Hello, ${name}!`,
      },
    ],
  }),
);

// @ts-ignore
server.tool("fetch-data", { route: z.string() }, async ({ route }) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/${route}`);
  const data = await response.text();
  return {
    content: [{ type: "text", text: data }],
  };
});

// Start receiving messages on stdin and sending messages on stdout
const start = async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
};

start()
  .catch((error) => {
    console.error("Error starting server:", error);
    process.exit(1);
  })
  .then(() => {
    console.log("Server started successfully");
  });
