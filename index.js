const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_FILE = path.join(__dirname, 'db.sqlite');
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize DB if not exists
const initSql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
const exists = fs.existsSync(DB_FILE);
const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) return console.error(err);
  if (!exists) {
    db.exec(initSql, (e) => {
      if (e) console.error('DB init error:', e);
      else console.log('Database initialized.');
    });
  }
});

// Simple helpers
function runSql(sql, params=[]) {
  return new Promise((resolve,reject)=>{
    db.run(sql, params, function(err){
      if(err) reject(err); else resolve({id:this.lastID, changes:this.changes});
    });
  });
}
function allSql(sql, params=[]){
  return new Promise((resolve,reject)=>{
    db.all(sql, params, (err, rows)=>{
      if(err) reject(err); else resolve(rows);
    });
  });
}
function getSql(sql, params=[]){
  return new Promise((resolve,reject)=>{
    db.get(sql, params, (err, row)=>{
      if(err) reject(err); else resolve(row);
    });
  });
}

// API routes

// Health
app.get('/api/ping', (req,res)=>res.json({ok:true}));

// Users (register/login simple)
app.post('/api/register', async (req,res)=>{
  const {name, email, role} = req.body;
  if(!name || !email || !role) return res.status(400).json({error:'name, email, role required'});
  try{
    const result = await runSql('INSERT INTO users (name,email,role) VALUES (?,?,?)',[name,email,role]);
    const user = await getSql('SELECT id,name,email,role FROM users WHERE id=?',[result.id]);
    res.json(user);
  }catch(e){ res.status(500).json({error:e.message}); }
});

app.post('/api/login', async (req,res)=>{
  const {email} = req.body;
  if(!email) return res.status(400).json({error:'email required'});
  try{
    const user = await getSql('SELECT id,name,email,role FROM users WHERE email=?',[email]);
    if(!user) return res.status(404).json({error:'user not found'});
    res.json(user);
  }catch(e){ res.status(500).json({error:e.message}); }
});

// Courses
app.get('/api/courses', async (req,res)=>{
  const rows = await allSql('SELECT * FROM courses');
  res.json(rows);
});
app.post('/api/courses', async (req,res)=>{
  const {name, code} = req.body;
  if(!name || !code) return res.status(400).json({error:'name and code required'});
  const r = await runSql('INSERT INTO courses (name,code) VALUES (?,?)',[name,code]);
  const course = await getSql('SELECT * FROM courses WHERE id=?',[r.id]);
  res.json(course);
});

// Reports
app.get('/api/reports', async (req,res)=>{
  const rows = await allSql('SELECT r.*, c.name AS course_name, u.name AS lecturer_name FROM reports r LEFT JOIN courses c ON r.course_id=c.id LEFT JOIN users u ON r.lecturer_id=u.id ORDER BY r.id DESC');
  res.json(rows);
});
app.post('/api/reports', async (req,res)=>{
  const {
    faculty_name, class_name, week_of_reporting, date_of_lecture,
    course_id, lecturer_id, actual_present, total_registered,
    venue, scheduled_time, topic, learning_outcomes, recommendations
  } = req.body;
  const r = await runSql(`INSERT INTO reports
    (faculty_name,class_name,week_of_reporting,date_of_lecture,course_id,lecturer_id,actual_present,total_registered,venue,scheduled_time,topic,learning_outcomes,recommendations)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [faculty_name,class_name,week_of_reporting,date_of_lecture,course_id,lecturer_id,actual_present,total_registered,venue,scheduled_time,topic,learning_outcomes,recommendations]);
  const report = await getSql('SELECT * FROM reports WHERE id=?',[r.id]);
  res.json(report);
});

// Simple monitoring: counts
app.get('/api/monitoring/summary', async (req,res)=>{
  const totalReports = (await getSql('SELECT COUNT(*) as c FROM reports')).c;
  const totalUsers = (await getSql('SELECT COUNT(*) as c FROM users')).c;
  res.json({totalReports, totalUsers});
});

// Serve frontend static (if built)
app.use(express.static(path.join(__dirname,'../frontend/dist')));
app.get('*', (req,res)=>{
  const index = path.join(__dirname,'../frontend/dist/index.html');
  if(fs.existsSync(index)) res.sendFile(index);
  else res.json({message:'API is running. Build frontend and place into frontend/dist or run frontend separately.'});
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>console.log('Server started on port', PORT));
