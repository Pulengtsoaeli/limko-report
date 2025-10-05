import React, {useEffect, useState} from 'react';
import Lectures from './Lectures';
import Reports from './Reports';
import Monitoring from './Monitoring';
import Students from './Students';

export default function Dashboard({user,onLogout}){
  const [tab,setTab]=useState('reports');
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="userbox"><strong>{user.name}</strong><div className="role">{user.role}</div></div>
        <nav>
          <button onClick={()=>setTab('reports')}>Reports</button>
          <button onClick={()=>setTab('lectures')}>Lectures</button>
          <button onClick={()=>setTab('students')}>Students</button>
          <button onClick={()=>setTab('monitor')}>Monitoring</button>
          <button onClick={onLogout} className="danger">Logout</button>
        </nav>
      </aside>
      <section className="content">
        {tab==='reports' && <Reports user={user}/>}
        {tab==='lectures' && <Lectures user={user}/>}
        {tab==='students' && <Students user={user}/>}
        {tab==='monitor' && <Monitoring />}
      </section>
    </div>
  )
}
