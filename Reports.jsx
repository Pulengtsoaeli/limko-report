import React, { useEffect, useState } from 'react';

export default function Reports({ user }) {
  const [courses, setCourses] = useState([]);
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({
    faculty_name: 'Faculty of ICT',
    class_name: '',
    week_of_reporting: '',
    date_of_lecture: '',
    course_id: '',
    actual_present: 0,
    total_registered: 0,
    venue: '',
    scheduled_time: '',
    topic: '',
    learning_outcomes: '',
    recommendations: ''
  });

  // Load courses + reports
  useEffect(() => {
    fetch('http://localhost:5000/api/courses')
      .then(r => r.json())
      .then(setCourses);

    fetchReports();
  }, []);

  // Fetch all reports
  function fetchReports() {
    fetch('http://localhost:5000/api/reports')
      .then(r => r.json())
      .then(data => {
        // show latest first
        setReports(data.sort((a, b) => new Date(b.date_of_lecture) - new Date(a.date_of_lecture)));
      });
  }

  // Submit a new report
  async function submit(e) {
    e.preventDefault();
    const payload = { ...form, lecturer_id: user.id };

    await fetch('http://localhost:5000/api/reports', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });

    setForm({
      ...form,
      class_name: '',
      week_of_reporting: '',
      date_of_lecture: '',
      course_id: '',
      actual_present: 0,
      total_registered: 0,
      venue: '',
      scheduled_time: '',
      topic: '',
      learning_outcomes: '',
      recommendations: ''
    });

    fetchReports();
  }

  return (
    <div>
      <h2 className="title">📑 Lecturer Reporting</h2>

      {/* Add New Report Form */}
      <div className="card form">
        <h3>Add a New Report</h3>
        <form onSubmit={submit}>
          <label>Faculty
            <input value={form.faculty_name} onChange={e => setForm({ ...form, faculty_name: e.target.value })} />
          </label>
          <label>Class
            <input value={form.class_name} onChange={e => setForm({ ...form, class_name: e.target.value })} />
          </label>
          <label>Week
            <input value={form.week_of_reporting} onChange={e => setForm({ ...form, week_of_reporting: e.target.value })} />
          </label>
          <label>Date of Lecture
            <input type="date" value={form.date_of_lecture} onChange={e => setForm({ ...form, date_of_lecture: e.target.value })} />
          </label>
          <label>Course
            <select value={form.course_id} onChange={e => setForm({ ...form, course_id: e.target.value })}>
              <option value="">--select--</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
            </select>
          </label>
          <label>Actual Present
            <input type="number" value={form.actual_present} onChange={e => setForm({ ...form, actual_present: parseInt(e.target.value || 0) })} />
          </label>
          <label>Total Registered
            <input type="number" value={form.total_registered} onChange={e => setForm({ ...form, total_registered: parseInt(e.target.value || 0) })} />
          </label>
          <label>Venue
            <input value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} />
          </label>
          <label>Scheduled Time
            <input value={form.scheduled_time} onChange={e => setForm({ ...form, scheduled_time: e.target.value })} />
          </label>
          <label>Topic
            <input value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} />
          </label>
          <label>Learning Outcomes
            <textarea value={form.learning_outcomes} onChange={e => setForm({ ...form, learning_outcomes: e.target.value })}></textarea>
          </label>
          <label>Recommendations
            <textarea value={form.recommendations} onChange={e => setForm({ ...form, recommendations: e.target.value })}></textarea>
          </label>
          <div className="row"><button type="submit">Submit Report</button></div>
        </form>
      </div>

      {/* Available Reports */}
      <div className="card">
        <h3>Available Reports</h3>
        {reports.length === 0 && <p className="muted">No reports yet.</p>}
        {reports.length > 0 && (
          <table className="report-table">
            <thead>
              <tr>
                <th>Topic</th>
                <th>Course</th>
                <th>Date</th>
                <th>Lecturer</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id}>
                  <td>{r.topic}</td>
                  <td>{r.course_name}</td>
                  <td>{r.date_of_lecture}</td>
                  <td>{r.lecturer_name || 'Unknown'}</td>
                  <td>{r.actual_present}/{r.total_registered}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
