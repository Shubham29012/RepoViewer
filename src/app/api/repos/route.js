import { NextResponse } from 'next/server'

async function fetchAllRepos(username) {
  let allRepos = []
  let page = 1
  const perPage = 100 // GitHub's maximum per page

  while (true) {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=${perPage}&page=${page}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GitHub-Repo-Viewer'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`)
    }

    const repos = await response.json()
    
    if (repos.length === 0) break
    
    allRepos = [...allRepos, ...repos]
    
    if (repos.length < perPage) break
    
    page++
    
    if (page > 20) break // Safety limit
  }
  
  return allRepos
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 })
    }

    const cleanUsername = username.trim()

    // Fetch all repositories using pagination
    const allRepos = await fetchAllRepos(cleanUsername)

    const transformedRepos = allRepos.map(repo => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      html_url: repo.html_url,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      language: repo.language,
      updated_at: repo.updated_at,
      topics: repo.topics || []
    }))

    return NextResponse.json(transformedRepos)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch repositories: ' + error.message },
      { status: 500 }
    )
  }
}