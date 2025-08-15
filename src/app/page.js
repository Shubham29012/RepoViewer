'use client'
import { useState } from 'react'
import SearchForm from './components/SearchForm'
import RepoCard from './components/RepoCard'
import ErrorMessage from './components/ErrorMessage'

export default function Home() {
  const [repos, setRepos] = useState([])
  const [error, setError] = useState('')
  const [currentUser, setCurrentUser] = useState('')
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (username) => {
    setError('')
    setRepos([])
    setCurrentUser('')
    setUserInfo(null)
    setLoading(true)

    try {
      const response = await fetch(`/api/repos?username=${encodeURIComponent(username)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch repositories')
      }

      // Handle the new API response format
      if (data.repositories) {
        setRepos(data.repositories)
        setUserInfo(data.user_info)
      } else {
        // Fallback for old format
        setRepos(data)
      }
      
      setCurrentUser(username)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <header className="header">
        <h1>GitHub Repository Viewer</h1>
        <p>Enter a GitHub username to view their public repositories</p>
      </header>

      <SearchForm onSearch={handleSearch} loading={loading} />
      
      <ErrorMessage error={error} />

      {loading && (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Fetching all repositories...</p>
        </div>
      )}

      {userInfo && (
        <div className="user-info">
          <div className="user-card">
            <img src={userInfo.avatar_url} alt={`${currentUser} avatar`} className="avatar" />
            <div className="user-details">
              <h2>{userInfo.name || currentUser}</h2>
              {userInfo.bio && <p className="bio">{userInfo.bio}</p>}
              <div className="user-stats">
                <span className="user-stat">📦 {userInfo.public_repos} Public Repos</span>
                <span className="user-stat">👥 {userInfo.followers} Followers</span>
                <span className="user-stat">👤 {userInfo.following} Following</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {repos.length > 0 && (
        <div className="results">
          <h2>
            All Repositories ({repos.length})
          </h2>
          <div className="repos-grid">
            {repos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
