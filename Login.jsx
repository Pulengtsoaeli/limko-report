import React, {useState} from 'react';

export default function Login({onLogin}){
  const [email,setEmail] = useState('');
  const [name,setName] = useState('');
  const [role,setRole] = useState('student');

  // Register a new user
  async function register(){
    const res = await fetch('http://localhost:5000/api/register', {
      method:'POST',
      headers:{'content-type':'application/json'},
      body: JSON.stringify({name,email,role})
    });
    const j = await res.json();
    if(j.id) onLogin(j);
  }

  // Login existing user
  async function login(){
    const res = await fetch('http://localhost:5000/api/login', {
      method:'POST',
      headers:{'content-type':'application/json'},
      body: JSON.stringify({email})
    });
    const j = await res.json();
    if(j.id) onLogin(j);
  }

  return (
    <div className="card login">
      <h2>Sign in / Register</h2>
      <input
        placeholder="Full name (for register)"
        value={name}
        onChange={e=>setName(e.target.value)}
      />
      <input
        placeholder="Email"
        value={email}
        onChange={e=>setEmail(e.target.value)}
      />
      <select value={role} onChange={e=>setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="lecturer">Lecturer</option>
        <option value="prl">PRL</option>
        <option value="pl">PL</option>
      </select>
      <div className="row">
        <button onClick={login}>Login</button>
        <button onClick={register}>Register</button>
      </div>
      <p className="muted">Tip: use seeded users like alice@limkokwing.ac.ls</p>
    </div>
  );
}
