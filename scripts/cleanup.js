const { exec } = require('child_process');

const PORT = process.env.PORT || 5002;

function findAndKillProcess() {
  const isWindows = process.platform === 'win32';
  
  // Command to find process using the port (different for Windows and Unix)
  const findCommand = isWindows
    ? `netstat -ano | findstr :${PORT}`
    : `lsof -i :${PORT}`;

  exec(findCommand, (error, stdout, stderr) => {
    if (error) {
      console.log(`No process found using port ${PORT}`);
      return;
    }

    // Parse the output to get PID
    let pid;
    if (isWindows) {
      const lines = stdout.split('\n');
      for (const line of lines) {
        const match = line.match(/LISTENING\s+(\d+)/);
        if (match) {
          pid = match[1];
          break;
        }
      }
    } else {
      const lines = stdout.split('\n');
      for (const line of lines) {
        if (line.includes('LISTEN')) {
          pid = line.split(/\s+/)[1];
          break;
        }
      }
    }

    if (pid) {
      // Kill the process
      const killCommand = isWindows ? `taskkill /F /PID ${pid}` : `kill -9 ${pid}`;
      exec(killCommand, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error killing process: ${error}`);
          return;
        }
        console.log(`Successfully killed process using port ${PORT}`);
      });
    } else {
      console.log(`No process found using port ${PORT}`);
    }
  });
}

// Run the cleanup
findAndKillProcess();