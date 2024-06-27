// Import statements
import createBareServer from '@tomphttp/bare-server-node';
import { fileURLToPath } from 'url';
import { createServer as createHttpsServer } from 'https';
import { createServer as createHttpServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import serveStatic from 'serve-static';

// Print message (optional)
console.log(`
Gravity Tabs Server
This program comes with ABSOLUTELY NO WARRANTY.
This is free software, and you are welcome to redistribute it
under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
`);

// Constants and variables
const staticPath = fileURLToPath(new URL('../static/', import.meta.url));
const serve = serveStatic(staticPath, { fallthrough: false });
const bare = createBareServer('/bare/');
let server;

// Create HTTPS or HTTP server based on SSL certificate existence
if (existsSync('../ssl/key.pem') && existsSync('../ssl/cert.pem')) {
  server = createHttpsServer({
    key: readFileSync('../ssl/key.pem'),
    cert: readFileSync('../ssl/cert.pem')
  });
} else {
  server = createHttpServer();
}

// Request handling
server.on('request', (req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    serve(req, res, (err) => {
      res.writeHead(err?.statusCode || 500, null, {
        'Content-Type': 'text/plain',
      });
      res.end('Error');
    });
  }
});

// WebSocket upgrade handling
server.on('upgrade', (req, socket, head) => {
  if (bare.shouldRoute(req, socket, head)) {
    bare.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

// Server listening event
server.on('listening', () => {
  const addr = server.address();
  console.log(`Server running on port ${addr.port}`);
  console.log('');
  console.log('You can now view it in your browser.');

  // Local and network IP addresses
  console.log(`Local: http://${addr.family === 'IPv6' ? `[${addr.address}]` : addr.address}:${addr.port}`);
  try {
    console.log(`On Your Network: http://${address.ip()}:${addr.port}`); // Note: `address.ip()` needs to be defined
  } catch (err) {
    console.error(`Cannot find LAN interface: ${err}`);
  }

  // Replit deployment URL (if applicable)
  if (process.env.REPL_SLUG && process.env.REPL_OWNER) {
    console.log(`Replit: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`);
  }
});

// Start the server on specified port
server.listen({ port: process.env.PORT || 8080 });
