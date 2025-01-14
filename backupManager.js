const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

const DB_PATH = './database/fitness_data.db';
const BACKUP_DIR = './database/backups/';
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

function createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(BACKUP_DIR, `fitness_data_backup${timestamp}`);
    fs.copyFile(DB_PATH, backupPath, (err) => {
        if (err) {
            console.error('Failed to create backup:', err);
        } else {
            console.log('Database backup created at:', backupPath);
            pushBackupToGitHub(backupPath);
        }
    });
}

function restoreBackup() {
    const backups = fs.readdirSync(BACKUP_DIR)
        .filter(file => file.startsWith('fitness_data_backup'))
        .sort()
        .reverse(); // Sort by newest first

    if (backups.length > 0) {
        const latestBackup = path.join(BACKUP_DIR, backups[0]);
        fs.copyFile(latestBackup, DB_PATH, (err) => {
            if (err) {
                console.error('Failed to restore backup:', err);
            } else {
                console.log('Database restored from:', latestBackup);
            }
        });
    } else {
        console.error('No backups available for restoration.');
    }
}

function cleanOldBackups() {
    const backups = fs.readdirSync(BACKUP_DIR)
        .filter(file => file.startsWith('fitness_data_backup'))
        .sort()
        .reverse(); // Sort by newest first

    if (backups.length > MAX_BACKUPS) {
        const backupsToDelete = backups.slice(MAX_BACKUPS);
        backupsToDelete.forEach((backup) => {
            const backupPath = path.join(BACKUP_DIR, backup);
            fs.unlink(backupPath, (err) => {
                if (err) {
                    console.error('Failed to delete old backup:', backupPath, err);
                } else {
                    console.log('Deleted old backup:', backupPath);
                }
            });
        });
    }
}

function pushBackupToGitHub(backupPath) {
    exec('git add .', (err, stdout, stderr) => {
        if (err) {
            console.error('Failed to stage files:', stderr);
            return;
        }
        exec(`git commit -m "Backup: ${path.basename(backupPath)}"`, (err, stdout, stderr) => {
            if (err) {
                console.error('Failed to commit backup:', stderr);
                return;
            }
            exec('git push', (err, stdout, stderr) => {
                if (err) {
                    console.error('Failed to push backup to GitHub:', stderr);
                } else {
                    console.log('Backup pushed to GitHub successfully.');
                }
            });
        });
    });
}

// Schedule backups and cleanup
const cron = require('node-cron');

// Create backup every 24 hours
cron.schedule('*/1 * * * *', () => {
    // Every minute '*/1 * * * *'
    console.log('Running automated backup...');
    createBackup();
    cleanOldBackups();
});

module.exports = {
    createBackup,
    restoreBackup,
    cleanOldBackups,
};

// Manually create backups
// const { createBackup, restoreBackup } = require('./backupManager');

// createBackup(); // To create a backup immediately
// restoreBackup(); // To restore the latest backup