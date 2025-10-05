import React, { useEffect, useState } from 'react';

export default function Lectures() {
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [newCourse, setNewCourse] = useState({ name: '', code: '' });
  const [newLecturer, setNewLecturer] = useState({ name: '', email: '', course_id: '' });

  // Sample Sesotho lecturers for demo
  const sampleLecturers = [
    { id: 201, name: "Prof. Thabo Mokoena", email: "thabo@limkokwing.ac.ls", course: "Software Engineering" },
    { id: 202, name: "Dr. Palesa Mohale", email: "palesa@limkokwing.ac.ls", course: "Database Systems" },
    { id: 203, name: "Ms. Lerato Nthabeleng", email: "lerato@limkokwing.ac.ls", course: "Computer Networks" },
    { id: 204, name: "Mr. Kabelo Ntsane", email: "kabelo@limkokwing.ac.ls", course: "Web Development" },
  ];

  // Load courses
  useEffect(() => {
    fetch('http://localhost:5000/api/courses')
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error("Failed to fetch courses:", err));

    setLecturers(sampleLecturers);
  }, []);

  // Add new course
  async function addCourse(e) {
    e.preventDefault();
    if (!newCourse.name || !newCourse.code) return;

    const res = await fetch('http://localhost:5000/api/courses', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(newCourse)
    });

    const created = await res.json();
    if (created.id) {
      setCourses([...courses, created]);
      setNewCourse({ name: '', code: '' });
    }
  }

  // Add new lecturer
  async function addLecturer(e) {
    e.preventDefault();
    if (!newLecturer.name || !newLecturer.email || !newLecturer.course_id) return;

    try {
      const course = courses.find(c => c.id === parseInt(newLecturer.course_id));
      const payload = { name: newLecturer.name, email: newLecturer.email, role: "lecturer" };

      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const created = await res.json();
      if (created.id) {
        setLecturers([...lecturers, { ...created, course: course ? course.name : "Unassigned" }]);
        setNewLecturer({ name: '', email: '', course_id: '' });
      }
    } catch (err) {
      console.error("Failed to register lecturer:", err);
    }
  }

  // Styles
  const sectionStyle = { marginBottom: "30px" };
  const titleStyle = { fontSize: "28px", fontWeight: "700", marginBottom: "15px", color: "#4f9dff" };
  const cardStyle = { background: "#2b2b3c", padding: "20px", borderRadius: "10px", marginBottom: "20px", boxShadow: "0 4px 10px rgba(0,0,0,0.4)" };
  const formLabel = { display: "block", fontSize: "15px", fontWeight: "600", margin: "10px 0 5px" };
  const inputStyle = { width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #555", marginBottom: "15px", fontSize: "15px", background: "#1e1e2f", color: "#f1f1f1" };
  const buttonStyle = { padding: "10px 16px", background: "#4f9dff", color: "white", border: "none", borderRadius: "6px", fontWeight: "600", fontSize: "15px", cursor: "pointer" };
  const itemStyle = { padding: "10px 0", borderBottom: "1px solid #3a3a4d", fontSize: "16px" };

  return (
    <div>
      <h2 style={titleStyle}>📚 Classes & Lecturers</h2>

      {/* Course List */}
      <div style={sectionStyle}>
        <div style={cardStyle}>
          <h3 style={{ fontSize: "20px", marginBottom: "12px" }}>Available Courses</h3>
          {courses.length === 0 && <p style={{ color: "#aaa" }}>No courses yet.</p>}
          {courses.map(c => (
            <div key={c.id} style={itemStyle}>
              <strong>{c.name}</strong> <span style={{ color: "#aaa" }}>({c.code})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Course Form */}
      <div style={sectionStyle}>
        <div style={cardStyle}>
          <h3 style={{ fontSize: "20px", marginBottom: "12px" }}>Add a New Course</h3>
          <form onSubmit={addCourse}>
            <label style={formLabel}>Course Name</label>
            <input style={inputStyle} type="text" value={newCourse.name} onChange={e => setNewCourse({ ...newCourse, name: e.target.value })} placeholder="e.g. Artificial Intelligence" />

            <label style={formLabel}>Course Code</label>
            <input style={inputStyle} type="text" value={newCourse.code} onChange={e => setNewCourse({ ...newCourse, code: e.target.value })} placeholder="e.g. AI401" />

            <button type="submit" style={buttonStyle}>➕ Add Course</button>
          </form>
        </div>
      </div>

      {/* Lecturer List */}
      <div style={sectionStyle}>
        <div style={cardStyle}>
          <h3 style={{ fontSize: "20px", marginBottom: "12px" }}>Lecturers & What They Teach</h3>
          {lecturers.length === 0 && <p style={{ color: "#aaa" }}>No lecturers yet.</p>}
          {lecturers.map(l => (
            <div key={l.id} style={itemStyle}>
              <strong>{l.name}</strong> <span style={{ color: "#aaa" }}>({l.email})</span>
              <div style={{ color: "#bbb", fontSize: "14px" }}>Teaches: {l.course}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Lecturer Form */}
      <div style={sectionStyle}>
        <div style={cardStyle}>
          <h3 style={{ fontSize: "20px", marginBottom: "12px" }}>Add a New Lecturer</h3>
          <form onSubmit={addLecturer}>
            <label style={formLabel}>Lecturer Name</label>
            <input style={inputStyle} type="text" value={newLecturer.name} onChange={e => setNewLecturer({ ...newLecturer, name: e.target.value })} placeholder="e.g. Dr. Neo Molefe" />

            <label style={formLabel}>Lecturer Email</label>
            <input style={inputStyle} type="email" value={newLecturer.email} onChange={e => setNewLecturer({ ...newLecturer, email: e.target.value })} placeholder="e.g. neo@limkokwing.ac.ls" />

            <label style={formLabel}>Assign to Course</label>
            <select style={inputStyle} value={newLecturer.course_id} onChange={e => setNewLecturer({ ...newLecturer, course_id: e.target.value })}>
              <option value="">-- Select Course --</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <button type="submit" style={buttonStyle}>➕ Add Lecturer</button>
          </form>
        </div>
      </div>
    </div>
  );
}
