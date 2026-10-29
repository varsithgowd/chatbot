const { spawn } = require('child_process');
const path = require('path');

console.log('====================================================');
console.log(' Starting SupportSense AI (Backend + Frontend)...');
console.log('====================================================');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';
const nodeCmd = process.execPath;

// Start Backend Server
const serverProc = spawn(nodeCmd, ['server.js'], {
  cwd: path.resolve(__dirname, '../server'),
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' }
});

// Start Frontend Vite Server
const clientProc = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.resolve(__dirname, '../client'),
  stdio: 'inherit',
  env: { ...process.env }
});

const cleanup = () => {
  console.log('\nStopping SupportSense AI processes...');
  try { serverProc.kill(); } catch (e) {}
  try { clientProc.kill(); } catch (e) {}
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);

