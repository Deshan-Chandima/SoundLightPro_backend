const mysql = require('mysql2/promise');

async function run() {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'rental_system'
    });

    // First check what raw values exist
    const [before] = await conn.query('SELECT status, COUNT(*) as Count, SUM(totalQuantity) as TotalQ, SUM(availableQuantity) as AvailQ, SUM(damagedQuantity) as DamagedQ FROM equipment GROUP BY status');
    console.log("BEFORE UPDATE:", JSON.stringify(before, null, 2));

    // Update invalid ones
    await conn.query(`UPDATE equipment SET status = 'Reusable' WHERE status NOT IN ('New', 'Reusable', 'Damaged') OR status IS NULL OR status = ''`);

    // Check again
    const [after] = await conn.query('SELECT status, COUNT(*) as Count, SUM(totalQuantity) as TotalQ, SUM(availableQuantity) as AvailQ, SUM(damagedQuantity) as DamagedQ FROM equipment GROUP BY status');
    console.log("AFTER UPDATE:", JSON.stringify(after, null, 2));

    await conn.end();
}

run().catch(console.error);
