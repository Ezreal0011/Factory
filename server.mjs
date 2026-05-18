import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const port = 5174;
const types = {
  ".html": "text/html;charset=utf-8",
  ".css": "text/css;charset=utf-8",
  ".js": "text/javascript;charset=utf-8",
  ".md": "text/plain;charset=utf-8"
};

createServer(async (request, response) => {
  try {
    let pathname = decodeURIComponent(request.url.split("?")[0]);
    if (pathname === "/") pathname = "/index.html";
    const file = normalize(join(root, pathname));
    if (!file.startsWith(root)) throw new Error("outside root");
    const body = await readFile(file);
    response.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain;charset=utf-8" });
    response.end("not found");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`factory M1 running at http://127.0.0.1:${port}`);
});
