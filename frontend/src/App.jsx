import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  return (
    <Routes>
      {/* "/" pe Login page dikhao */}
      <Route path="/" element={<LoginPage />} />

      {/* "/dashboard" pe Dashboard dikhao */}
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  )
}
