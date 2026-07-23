import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

async function check() {
    try {
        // 1. Authenticate (Register or Login)
        let token;
        const user = {
            name: "Check Bot",
            email: "check@example.com",
            password: "password123",
            role: "admin"
        };

        console.log("Attempting to authenticate...");
        try {
            const { data } = await axios.post(`${API_URL}/auth/register`, user);
            token = data.token;
            console.log("Registered new check user.");
        } catch (err) {
            if (err.response && err.response.status === 409) {
                console.log("User exists, logging in...");
                const { data } = await axios.post(`${API_URL}/auth/login`, {
                    email: user.email,
                    password: user.password
                });
                token = data.token;
                console.log("Logged in successfully.");
            } else {
                throw err;
            }
        }

        if (!token) {
            throw new Error("Failed to obtain token.");
        }

        // 2. Fetch Data
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const { data: beds } = await axios.get(`${API_URL}/beds`, config);
        const { data: patients } = await axios.get(`${API_URL}/patients`, config);

        console.log('------------------------------------------------');
        console.log(`Beds Count: ${beds.length}`);
        console.log(`Patients Count: ${patients.length}`);
        console.log('------------------------------------------------');

    } catch (error) {
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error("Error Message:", error.message);
            console.error("Error Code:", error.code);
        }
    }
}

check();
