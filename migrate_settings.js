const { getPool } = require('./config/db');

async function migrate() {
    try {
        const pool = getPool();
        await pool.query('ALTER TABLE settings ADD COLUMN bankDetails TEXT');
        console.log('Added bankDetails column');
    } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME') {
            console.log('bankDetails column already exists');
        } else {
            console.error('Error adding bankDetails:', e.message);
        }
    }

    try {
        const pool = getPool();
        await pool.query('ALTER TABLE settings ADD COLUMN termsAndConditions TEXT');
        console.log('Added termsAndConditions column');
    } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME') {
            console.log('termsAndConditions column already exists');
        } else {
            console.error('Error adding termsAndConditions:', e.message);
        }
    }

    process.exit(0);
}

migrate();
