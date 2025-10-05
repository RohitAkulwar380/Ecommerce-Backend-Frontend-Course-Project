const path = require('path');
const { spawn } = require('child_process');

async function runCommand(command, args, cwd) {
    return new Promise((resolve, reject) => {
        const proc = spawn(command, args, {
            cwd,
            shell: true,
            stdio: 'inherit'
        });

        proc.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Command failed with exit code ${code}`));
            }
        });
    });
}

async function cleanupAll() {
    console.log('Starting full project cleanup...\n');

    try {
        // Clean frontend
        console.log('🧹 Cleaning frontend...');
        const frontendPath = path.join(__dirname, 'frontend');
        await runCommand('npm', ['run', 'cleanup'], frontendPath);

        // Clean backend
        console.log('\n🧹 Cleaning backend...');
        const backendPath = path.join(__dirname, 'src');
        await runCommand('node', ['cleanup.js'], backendPath);

        console.log('\n✨ Full project cleanup completed!\n');
        console.log('Additional manual steps if needed:');
        console.log('1. Delete all node_modules:');
        console.log('   - rm -rf frontend/node_modules');
        console.log('   - rm -rf node_modules');
        console.log('2. Clear npm caches: npm cache clean --force');
        console.log('3. Reinstall dependencies:');
        console.log('   - cd frontend && npm install');
        console.log('   - cd .. && npm install\n');

    } catch (error) {
        console.error('Cleanup failed:', error);
        process.exit(1);
    }
}

// Run the cleanup if this script is executed directly
if (require.main === module) {
    cleanupAll().catch(console.error);
}

module.exports = cleanupAll;