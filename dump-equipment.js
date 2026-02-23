const mysql = require('mysql2/promise');
const fs = require('fs');

async function run() {
    const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'rental_system'
    });

    const [rows] = await conn.query('SELECT * FROM equipment');
    fs.writeFileSync('c:/xampp/htdocs/rental-system-features-update/backend/equipment-dump.json', JSON.stringify(rows, null, 2));

    let newCount = 0;
    let reusableCount = 0;
    let damagedCount = 0;
    let totalCount = 0;

    for (const item of rows) {
        const totalQ = Number(item.totalQuantity) || 0;
        const damagedQ = Number(item.damagedQuantity) || 0;
        totalCount += totalQ;
        damagedCount += damagedQ;

        if (item.status === 'New') {
            newCount += Math.max(0, totalQ - damagedQ);
        } else {
            reusableCount += Math.max(0, totalQ - damagedQ);
        }
    }

    console.log(`Total Physical Items: ${totalCount}`);
    console.log(`New: ${newCount}, Reusable: ${reusableCount}, Damaged: ${damagedCount}`);
    await conn.end();
}

run().catch(console.error);
