import React, { useEffect, useState } from "react";

export default function Monitoring() {
  const [stats, setStats] = useState({ totalReports: 0, totalUsers: 0 });
  const [recentReports, setRecentReports] = useState([]);

  // Load summary numbers
  useEffect(() => {
    fetch("http://localhost:5000/api/monitoring/summary")
      .then((res) => res.json())
      .then(setStats)
      .catch((err) =>
        console.error("Failed to fetch monitoring summary:", err)
      );
  }, []);

  // Load recent reports
  useEffect(() => {
    fetch("http://localhost:5000/api/reports")
      .then((res) => res.json())
      .then((data) => setRecentReports(data.slice(0, 5))) // latest 5
      .catch((err) => console.error("Failed to fetch reports:", err));
  }, []);

  // Compute average attendance (if data exists)
  const avgAttendance =
    recentReports.length > 0
      ? Math.round(
          recentReports.reduce(
            (sum, r) =>
              sum +
              (r.total_registered
                ? (r.actual_present / r.total_registered) * 100
                : 0),
            0
          ) / recentReports.length
        )
      : 0;

  return (
    <div>
      <h2 className="title">📊 Monitoring Dashboard</h2>

      {/* Stats Summary */}
      <div className="card stats">
        <div className="stat">
          <div className="num">{stats.totalReports}</div>
          <div className="label">Reports Submitted</div>
        </div>
        <div className="stat">
          <div className="num">{stats.totalUsers}</div>
          <div className="label">Registered Users</div>
        </div>
        <div className="stat">
          <div className="num">{avgAttendance}%</div>
          <div className="label">Avg Attendance</div>
        </div>
      </div>

      {/* Attendance Progress */}
      <div className="card">
        <h3>📈 Attendance Overview</h3>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${avgAttendance}%` }}
          ></div>
        </div>
        <p className="muted">
          Average attendance from the last {recentReports.length} reports.
        </p>
      </div>

      {/* Recent Reports */}
      <div className="card">
        <h3>📝 Latest Reports</h3>
        {recentReports.length === 0 && (
          <p className="muted">No reports submitted yet.</p>
        )}
        {recentReports.length > 0 && (
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
              {recentReports.map((r) => (
                <tr key={r.id}>
                  <td>{r.topic || "Untitled"}</td>
                  <td>{r.course_name}</td>
                  <td>{r.date_of_lecture}</td>
                  <td>{r.lecturer_name || "Unknown"}</td>
                  <td>
                    {r.actual_present}/{r.total_registered}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
