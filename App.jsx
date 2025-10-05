import React, {useEffect, useState} from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

export default function App(){
  const [user, setUser] = useState(null);
  useEffect(()=>{ document.title='LIMKO Reports'; },[]);
  return (
    <div className="app">
      <header className="topbar">
        <h1>LIMKO Reports</h1>
        <div className="brand">Faculty of FICT</div>
      </header>
      <main>
        {!user ? <Login onLogin={setUser}/> : <Dashboard user={user} onLogout={()=>setUser(null)}/>}
      </main>
      <footer className="footer">Built for DIWA2110 — Simple demo</footer>
    </div>
  )
}
