'use client'
import { useState } from 'react'

export default function SearchForm({ onSearch, loading }) {
  const [username, setUsername] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!username.trim()) {
      return
    }

    await onSearch(username.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="input-group">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username..."
          className="username-input"
          disabled={loading}
        />
        <button type="submit" disabled={loading || !username.trim()} className="search-button">
          {loading ? 'Fetching All Repos...' : 'Search'}
        </button>
      </div>
    </form>
  )
}