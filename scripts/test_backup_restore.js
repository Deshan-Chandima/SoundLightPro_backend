const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5000';
const BACKUP_FILE = path.join(__dirname, '../sample_backup.json');

async function testBackupRestore() {
    try {
        console.log('--- Starting Backup & Restore Test ---');

        // 0. Check Health
        console.log('0. Checking Server Health...');
        try {
            const healthRes = await fetch(`${API_URL}/health`);
            if (healthRes.ok) {
                console.log('✅ Server is UP:', await healthRes.json());
            } else {
                console.error('❌ Server returned:', healthRes.status, healthRes.statusText);
            }
        } catch (e) {
            console.error('❌ Server Unreachable:', e.message);
            return;
        }

        // 1. Login to get token
        console.log('1. Logging in as admin...');
        const loginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'akil', password: 'eternals' })
        });

        if (!loginRes.ok) {
            throw new Error(`Login failed: ${loginRes.status} ${loginRes.statusText}`);
        }

        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('✅ Login successful. Token received.');

        // 2. Read sample backup file
        console.log('2. Reading sample backup file...');
        const backupData = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf8'));
        console.log('✅ Backup file read successfully.');

        // 3. Restore Backup
        console.log('3. Restoring backup...');
        const restoreRes = await fetch(`${API_URL}/backup/import`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(backupData)
        });

        if (!restoreRes.ok) {
            const errText = await restoreRes.text();
            throw new Error(`Restore failed: ${restoreRes.status} ${restoreRes.statusText} - ${errText}`);
        }

        const restoreResult = await restoreRes.json();
        console.log('✅ Restore successful:', restoreResult.message);

        // 4. Export Backup to verify
        console.log('4. Exporting backup to verify...');
        const exportRes = await fetch(`${API_URL}/backup/export`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!exportRes.ok) {
            throw new Error(`Export failed: ${exportRes.status} ${exportRes.statusText}`);
        }

        const exportedData = await exportRes.json();
        console.log('✅ Export successful.');

        // 5. Verification
        console.log('5. Verifying data...');
        // Check counts
        console.log(`- Equipment: Expected ${backupData.equipment.length}, Got ${exportedData.equipment.length}`);
        console.log(`- Customers: Expected ${backupData.customers.length}, Got ${exportedData.customers.length}`);
        console.log(`- Orders: Expected ${backupData.orders.length}, Got ${exportedData.orders.length}`);
        console.log(`- Users: Expected ${backupData.users.length}, Got ${exportedData.users.length}`);

        if (
            exportedData.equipment.length === backupData.equipment.length &&
            exportedData.customers.length === backupData.customers.length &&
            exportedData.orders.length === backupData.orders.length
        ) {
            console.log('✅ Counts match!');
            console.log('--- Test Passed ---');
        } else {
            console.error('❌ Data mismatch!');
            console.log('--- Test Failed ---');
        }

    } catch (error) {
        console.error('❌ Test Error:', error.message);
    }
}

testBackupRestore();
