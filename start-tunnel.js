import localtunnel from 'localtunnel';
import fs from 'fs';

(async () => {
  try {
    console.log('Starting localtunnel...');
    const tunnel = await localtunnel({ port: 3001 });

    const url = tunnel.url;
    console.log('');
    console.log('🌐 Public URL:', url);
    console.log('');
    console.log('Tunnel is now active. Press Ctrl+C to stop.');
    console.log('');

    // Write URL to file for easy access
    fs.writeFileSync('/tmp/tunnel-url.txt', url);
    console.log('URL saved to /tmp/tunnel-url.txt');

    tunnel.on('close', () => {
      console.log('Tunnel closed');
      process.exit(0);
    });

    // Keep the process running
    process.on('SIGINT', () => {
      tunnel.close();
    });
  } catch (err) {
    console.error('Error starting tunnel:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
})();
