import React, { useEffect, useState } from 'react';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: '', email: '' });

  // Sample Sesotho student list (fallback/demo data)
  const sampleStudents = [
    { id: 101, name: "Thabo Mokoena", email: "thabo@student.limkokwing.ac.ls" },
    { id: 102, name: "Lerato Nthabeleng", email: "lerato@student.limkokwing.ac.ls" },
    { id: 103, name: "Palesa Mohale", email: "palesa@student.limkokwing.ac.ls" },
    { id: 104, name: "Mpho Radebe", email: "mpho@student.limkokwing.ac.ls" },
    { id: 105, name: "Kabelo Ntsane", email: "kabelo@student.limkokwing.ac.ls" },
  ];

  // Load students from backend or fallback to sample
  useEffect(() => {
    fetch('http://localhost:5000/api/users?role=student')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setStudents(data);
        else setStudents(sampleStudents); // fallback if backend empty
      })
      .catch(err => {
        console.error("Failed to fetch students:", err);
        setStudents(sampleStudents);
      });
  }, []);

  // Register a new student
  async function addStudent(e) {
    e.preventDefault();
    if (!newStudent.name || !newStudent.email) return;

    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...newStudent, role: 'student' })
      });

      const created = await res.json();
      if (created.id) {
        setStudents([...students, created]);
        setNewStudent({ name: '', email: '' });
      }
    } catch (err) {
      console.error("Failed to register student:", err);
    }
  }

  // Delete student
  async function deleteStudent(id) {
    if (!window.confirm("Are you sure you want to remove this student?")) return;

    try {
      await fetch(`http://localhost:5000/api/users/${id}`, { method: 'DELETE' });
      setStudents(students.filter(s => s.id !== id));
    } catch (err) {
      console.error("Failed to delete student:", err);
    }
  }

  return (
    <div>
      <h2 className="title">👩‍🎓 Students Dashboard</h2>

      {/* Student List */}
      <div className="card">
        <h3>Registered Students</h3>
        {students.length === 0 && <p className="muted">No students found.</p>}
        {students.length > 0 && (
          <table className="report-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th style={{ width: "100px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td className="muted">{s.email}</td>
                  <td>
                    <button 
                      style={{ background: "#ff4d4d", padding: "6px 10px", fontSize: "13px", borderRadius: "6px", border: "none", cursor: "pointer", color: "white" }}
                      onClick={() => deleteStudent(s.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add New Student Form */}
      <div className="card form">
        <h3>Add a New Student</h3>
        <form onSubmit={addStudent}>
          <label>
            Full Name
            <input
              type="text"
              value={newStudent.name}
              onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
              placeholder="e.g. Neo Molefe"
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={newStudent.email}
              onChange={e => setNewStudent({ ...newStudent, email: e.target.value })}
              placeholder="e.g. neo@student.limkokwing.ac.ls"
            />
          </label>
          <button type="submit">➕ Add Student</button>
        </form>
      </div>
    </div>
  );
}
