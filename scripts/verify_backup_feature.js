const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const TEST_PORT = 5001;
const API_URL = `http://localhost:${TEST_PORT}`;
const BACKUP_FILE = path.join(__dirname, '../../release_backup.json');

async function runTest() {
    console.log('--- Starting Self-Contained Backup Verification ---');

    console.log(`1. Spawning Temporary Server on port ${TEST_PORT}...`);
    const server = spawn('node', ['index.js'], {
        cwd: path.join(__dirname, '..'),
        env: {
            ...process.env,
            PORT: TEST_PORT,
            DB_NAME: 'rental_system_test' // FORCE TEST DATABASE
        },
        stdio: 'pipe' // Capture output
    });

    let serverReady = false;

    // Monitor server output
    server.stdout.on('data', (data) => {
        const output = data.toString();
        // console.log('[Server]:', output);
        if (output.includes(`Server running on port ${TEST_PORT}`)) {
            serverReady = true;
        }
    });

    server.stderr.on('data', (data) => {
        console.error('[Server Error]:', data.toString());
        fs.appendFileSync(path.join(__dirname, '../server_error.log'), data);
    });

    // Wait for server to start
    console.log('   Waiting for server to be ready...');
    for (let i = 0; i < 30; i++) {
        if (serverReady) break;
        await new Promise(r => setTimeout(r, 1000));
    }

    if (!serverReady) {
        console.error('❌ Server failed to start within 30 seconds.');
        server.kill();
        process.exit(1);
    }
    console.log('✅ Server is ready.');

    try {
        // Run Verification Logic
        await verifyBackup(API_URL);

    } catch (error) {
        console.error('❌ Verification Failed:', error.message);
        fs.writeFileSync(path.join(__dirname, '../verification_error.log'), error.message);
    } finally {
        console.log('🧹 Cleaning up: Killing temporary server...');
        server.kill();
        console.log('✅ Done.');
    }
}

async function verifyBackup(apiUrl) {
    // 1. Login
    console.log('2. Logging in as admin...');
    const loginRes = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'akil', password: 'eternals' })
    });

    if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
    const { token } = await loginRes.json();
    console.log('✅ Login successful.');

    // 2. Import Backup
    console.log('3. Restoring backup...');
    const backupData = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf8'));

    // Sanitize timestamps for import if needed, but endpoint expects raw JSON matching structure
    const importRes = await fetch(`${apiUrl}/backup/import`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(backupData)
    });

    if (!importRes.ok) {
        const err = await importRes.text();
        console.error('Import Error Detail:', err);
        fs.writeFileSync(path.join(__dirname, '../import_error.log'), err);
        throw new Error(`Import failed: ${importRes.status} - ${err}`);
    }
    console.log('✅ Import successful.');

    // 3. Export Backup
    console.log('4. Exporting backup...');
    const exportRes = await fetch(`${apiUrl}/backup/export`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!exportRes.ok) throw new Error(`Export failed: ${exportRes.status}`);
    const exportedData = await exportRes.json();
    console.log('✅ Export successful.');

    // 4. Validate
    console.log('5. Validating data...');
    const eqCount = exportedData.equipment.length;
    const custCount = exportedData.customers.length;
    const ordCount = exportedData.orders.length;

    console.log(`   Equipment: ${eqCount} (Expected: ${backupData.equipment.length})`);
    console.log(`   Customers: ${custCount} (Expected: ${backupData.customers.length})`);
    console.log(`   Orders: ${ordCount} (Expected: ${backupData.orders.length})`);

    if (eqCount === backupData.equipment.length &&
        custCount === backupData.customers.length &&
        ordCount === backupData.orders.length) {
        console.log('✅ Data counts match!');
        console.log('🎉 VERIFICATION PASSED');
    } else {
        throw new Error('Data counts mismatch');
    }
}

runTest();
