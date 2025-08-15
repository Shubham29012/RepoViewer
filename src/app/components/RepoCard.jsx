export default function RepoCard({ repo }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="repo-card">
      <div className="repo-header">
        <h3>
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
            {repo.name}
          </a>
        </h3>
        <div className="repo-stats">
          <span className="stat">⭐ {repo.stargazers_count}</span>
          <span className="stat">🍴 {repo.forks_count}</span>
        </div>
      </div>
      
      {repo.description && (
        <p className="repo-description">{repo.description}</p>
      )}
      
      <div className="repo-meta">
        {repo.language && (
          <span className="language">{repo.language}</span>
        )}
        <span className="updated">
          Updated {formatDate(repo.updated_at)}
        </span>
      </div>

      {repo.topics && repo.topics.length > 0 && (
        <div className="topics">
          {repo.topics.slice(0, 5).map((topic, index) => (
            <span key={index} className="topic">{topic}</span>
          ))}
        </div>
      )}
    </div>
  )
}