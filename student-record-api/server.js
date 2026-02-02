import express from "express";
import fs from "fs";

const app = express();
app.use(express.json());

function readStudents() {
    try {
        return JSON.parse(fs.readFileSync("file.json", "utf-8"));
    } catch {
        return [];
    }
}

function writeStudents(students) {
    fs.writeFileSync("file.json", JSON.stringify(students));
}

app.post("/students", (req, res) => {
    const students = readStudents();
    const { id, name, email, course } = req.body;
    const exists = students.some(s => s.id === id);
    if (exists) {
        return res.send("Student already exists");
    }
    const updatedStudents = [...students, { id, name, email, course }];
    writeStudents(updatedStudents);
    res.send("Student added successfully");
});

app.get("/students", (_, res) => {
    res.send(readStudents());
});

app.get("/students/:id", (req, res) => {
    const student = readStudents().find(
        s => s.id === req.params.id
    );
    if (!student) {
        return res.send("Student not found");
    }
    res.send(student);
});

app.put("/students/:id", (req, res) => {
    const students = readStudents();
    const { id } = req.params;
    const exists = students.some(s => s.id === id);
    if (!exists) {
        return res.send("Student not found");
    }
    const updatedStudents = students.map(student =>
        student.id === id
            ? { ...student, ...req.body }
            : student
    );
    writeStudents(updatedStudents);
    res.send("Student updated");
});

app.delete("/students/:id", (req, res) => {
    const students = readStudents();
    const { id } = req.params;
    const filteredStudents = students.filter(
        student => student.id !== id
    );
    if (filteredStudents.length === students.length) {
        return res.send("Student not found");
    }
    writeStudents(filteredStudents);
    res.send("Student deleted");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
