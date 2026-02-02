import express from "express";
import { promises as fs } from "fs";

const app = express();
app.use(express.json());

const DATA_FILE = "file.json";

/* ---------- Helper functions ---------- */

const readData = async () => {
    try {
        const data = await fs.readFile(DATA_FILE, "utf-8");
        return JSON.parse(data || "[]");
    } catch (err) {
        console.error("Failed to read data:", err.message);
        return [];
    }
};

const writeData = async (data) => {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Failed to write data:", err.message);
    }
};

/* ---------- Routes ---------- */

// CREATE student
app.post("/students", async (req, res) => {
    const { id, name, email, course } = req.body;

    if (!id || !name || !email || !course) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const students = await readData();

    const exists = students.some(s => s.id === id);
    if (exists) {
        return res.status(409).json({ message: "Student already exists" });
    }

    students.push({ id, name, email, course });
    await writeData(students);

    res.status(201).json({ message: "Student added successfully" });
});

// GET all students
app.get("/students", async (_req, res) => {
    const students = await readData();
    res.status(200).json(students);
});

// GET student by id
app.get("/students/:id", async (req, res) => {
    const { id } = req.params;
    const students = await readData();

    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
});

// UPDATE student (partial update)
app.put("/students/:id", async (req, res) => {
    const { id } = req.params;
    const students = await readData();

    const index = students.findIndex(s => s.id === id);
    if (index === -1) {
        return res.status(404).json({ message: "Student not found" });
    }

    students[index] = {
        ...students[index],
        ...req.body
    };

    await writeData(students);
    res.status(200).json({ message: "Student updated successfully" });
});

// DELETE student
app.delete("/students/:id", async (req, res) => {
    const { id } = req.params;
    const students = await readData();

    const filtered = students.filter(s => s.id !== id);

    if (filtered.length === students.length) {
        return res.status(404).json({ message: "Student not found" });
    }

    await writeData(filtered);
    res.status(200).json({ message: "Student deleted successfully" });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
