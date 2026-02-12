import React from 'react'
import IncidentList from './pages/IncidentList'
import UnitMap from './pages/UnitMap'

export default function App() {
  return (
    <div className="app">
      <header className="app-header">Dispatcher — MVP</header>
      <main className="app-main">
        <section className="left"><IncidentList /></section>
        <section className="right"><UnitMap /></section>
      </main>
    </div>
  )
}
