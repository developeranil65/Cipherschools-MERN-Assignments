# Student Record Management API

![Question](images/ques.png)

Build a backend application using Node.js and Express.js to manage student records without using any database. Student data must be stored in a local JSON or TXT file using the fs module.

## Objectives

- Implement RESTful APIs using Express.js
- Perform CRUD operations without a database
- Use fs module for file handling

## Student Fields

- id
- name
- email
- course

## API Endpoints

- POST /students
- GET /students
- GET /students/:id
- PUT /students/:id
- DELETE /students/:id

## Rules

- No database allowed
- Use Express.js only
- Use proper HTTP status codes

## Postman Testing

### POST /students
![Create Student Outcome](<images/add_student.png>)

### GET /students
![Get All Students Outcome](<images/get_students.png>)

### GET /students/:id
![Get Single Student Outcome](<images/get_stud_id.png>)

### PUT /students/:id
![Update Student Outcome](<images/put_stud.png>)

### DELETE /students/:id
![Delete Student Outcome](<images/delete_stud.png>)
