// Cleanup script for the frontend development environment

const fs = require('fs').promises;
const path = require('path');
const os = require('os');

async function cleanupFrontend() {
    try {
        console.log('Starting frontend cleanup...');

        // Define paths
        const distPath = path.join(__dirname, 'dist');
        const nodeModulesPath = path.join(__dirname, 'node_modules');
        const buildCachePath = path.join(os.tmpdir(), 'esbuild-cache'); // ESBuild cache if exists

        // Cleanup tasks array
        const cleanupTasks = [
            {
                name: 'Distribution files',
                path: distPath,
                action: async () => {
                    try {
                        await fs.rm(distPath, { recursive: true, force: true });
                        console.log('✓ Cleaned distribution files');
                    } catch (err) {
                        if (err.code !== 'ENOENT') throw err;
                    }
                }
            },
            {
                name: 'Build cache',
                path: buildCachePath,
                action: async () => {
                    try {
                        await fs.rm(buildCachePath, { recursive: true, force: true });
                        console.log('✓ Cleaned build cache');
                    } catch (err) {
                        if (err.code !== 'ENOENT') throw err;
                    }
                }
            }
        ];

        // Execute all cleanup tasks
        for (const task of cleanupTasks) {
            try {
                await task.action();
            } catch (error) {
                console.error(`× Error cleaning ${task.name}:`, error.message);
            }
        }

        console.log('\nFrontend cleanup completed! 🧹\n');
        console.log('To completely reset the frontend environment:');
        console.log('1. Delete node_modules: rm -rf node_modules');
        console.log('2. Clear npm cache: npm cache clean --force');
        console.log('3. Reinstall dependencies: npm install\n');

    } catch (error) {
        console.error('Cleanup failed:', error);
        process.exit(1);
    }
}

// Run the cleanup if this script is executed directly
if (require.main === module) {
    cleanupFrontend().catch(console.error);
}

module.exports = cleanupFrontend;