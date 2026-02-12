// Using global fetch (Node 18+)

const API_URL = 'http://localhost:5000/api';

async function verify() {
    console.log('🔍 Verifying Damaged Stock API...');
    try {
        // 1. Get equipment
        // Need login? Yes probably.
        // Let's use the default admin credentials if needed, or bypass auth if possible (unlikely).
        // Let's assume we can hit public endpoints? No, equipment is likely protected.
        // For now, I just want to see if the server responds at all.

        const res = await fetch(`${API_URL}/equipment`);
        if (res.status === 200) {
            console.log('✅ Server is reachable.');
        } else {
            console.log(`⚠️ Server responded with status: ${res.status}`);
        }

    } catch (error) {
        console.error('❌ Could not connect to server:', error.message);
    }
}

verify();
