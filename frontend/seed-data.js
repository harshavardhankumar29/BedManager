
import axios from 'axios';

const API_Base = 'http://localhost:5001/api';

// Helpers for random data
const wards = ["ICU", "General", "Emergency", "Pediatrics", "Maternity"];
const bedTypes = ["Ventilator", "Standard", "ICU", "Semi-Private"];
const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore"];
const conditions = ["Hypertension", "Diabetes", "Asthma", "Fracture", "Flu", "Pneumonia", "Cardiac Arrest", "Appendicitis", "Migraine", "Kidney Stones"];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

async function seed() {
    try {
        console.log("🚀 Starting Mass Seeder (Target: 30+ Beds, 20+ Patients)...");

        // 1. Auth
        let token = null;
        const user = { name: "Seeder", email: "seeder@hospital.com", password: "password123", role: "admin" };

        try {
            const regRes = await axios.post(`${API_Base}/auth/register`, user);
            token = regRes.data.token;
        } catch (e) {
            if (e.response && (e.response.status === 400 || e.response.status === 409)) {
                const loginRes = await axios.post(`${API_Base}/auth/login`, { email: user.email, password: user.password });
                token = loginRes.data.token;
            } else throw e;
        }

        if (!token) throw new Error("Authentication failed");
        const headers = { Authorization: `Bearer ${token}` };

        // 2. Generate Beds
        console.log("Generating beds...");
        const bedsToCreate = [];
        // Ward A: ICU (1-10)
        for (let i = 1; i <= 8; i++) bedsToCreate.push({ bedNumber: `A-10${i}`, ward: "ICU", type: "ICU", status: "Available" });
        // Ward B: General (1-15)
        for (let i = 1; i <= 15; i++) bedsToCreate.push({ bedNumber: `B-2${i.toString().padStart(2, '0')}`, ward: "General", type: "General", status: "Available" });
        // Ward C: Emergency (1-5)
        for (let i = 1; i <= 5; i++) bedsToCreate.push({ bedNumber: `C-30${i}`, ward: "Emergency", type: "Emergency", status: "Available" });
        // Ward D: Pediatrics (1-5)
        for (let i = 1; i <= 6; i++) bedsToCreate.push({ bedNumber: `D-40${i}`, ward: "Pediatrics", type: "General", status: "Available" });

        for (const bed of bedsToCreate) {
            try {
                await axios.post(`${API_Base}/beds`, bed, { headers });
                process.stdout.write(".");
            } catch (e) {
                console.log(`\nFailed to add ${bed.bedNumber}: ${e.message}`, e.response?.data);
            }
        }
        console.log("\nBeds created.");

        // 3. Admit Random Patients
        const { data: allBeds } = await axios.get(`${API_Base}/beds`, { headers });
        const availableBeds = allBeds.filter(b => b.status === "Available" /* || b.status === "Occupied" if we want to overwrite, but simpler to just fill available */);

        // Let's fill about 70% of them to make the dashboard look busy
        const patientsCount = Math.floor(availableBeds.length * 0.75);
        console.log(`Admitting ${patientsCount} patients...`);

        for (let i = 0; i < patientsCount; i++) {
            const bed = availableBeds[i];
            const p = {
                name: `${pick(firstNames)} ${pick(lastNames)}`,
                age: randInt(4, 85),
                gender: Math.random() > 0.5 ? "Male" : "Female",
                contact: `555-0${randInt(100, 999)}`,
                medicalHistory: pick(conditions),
                address: `${randInt(10, 999)} ${pick(["Main", "Oak", "Pine", "Maple", "Cedar"])} St`,
                bedId: bed._id
            };

            try {
                await axios.post(`${API_Base}/patients/admit`, p, { headers });
                process.stdout.write("+");
            } catch (e) {
                process.stdout.write("x");
            }
        }

        console.log("\n✅ Mass Seeding Complete!");

        // Verification counts
        const { data: finalBeds } = await axios.get(`${API_Base}/beds`, { headers });
        const { data: finalPatients } = await axios.get(`${API_Base}/patients`, { headers });
        console.log(`\n📊 Final Counts:`);
        console.log(`   - Beds: ${finalBeds.length}`);
        console.log(`   - Patients: ${finalPatients.length}`);

    } catch (err) {
        console.error("Seeding failed:", err.message);
    }
}

seed();
