export default async (req, res) => {
  try {
    return res.status(200).json({ message: "Gitlab commits retrieved successfully"})
    let gitlab = JSON.parse(req.body)
    gitlab = gitlab.body
    console.log(gitlab)
    const accessToken = gitlab.gitlabAccessToken
    const projectId = gitlab.gitlabProjectId
    const displayName = gitlab.displayName
    const baseUrl = `https://gitlab.com/api/v4/projects/${encodeURIComponent(projectId)}/repository/commits`
    let nextUrl = baseUrl;
    const commitsByUser = [];

    while (nextUrl) {
      const response = await fetch(nextUrl, {
        method: "GET",
        headers: {
          "PRIVATE-TOKEN": accessToken,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json();

      // Add commits to the result
      commitsByUser.push(...(data || []));

      // Check for pagination
      const nextPage = response.headers.get("x-next-page")
      nextUrl = nextPage ? `${baseUrl}?page=${nextPage}` : null;
    }
    // Filter commits by author email
    const filteredCommits = commitsByUser.filter(
      (commit) => commit.committer_name === displayName
    );

    console.log(`Commits by ${username}:`)
    for (const commit of filteredCommits) {
      console.log(`- ${commit.committed_date}`)
    }
    return res.status(200).json({ message: "Gitlab commits retrieved successfully", commits: filteredCommits })
  }
  catch (error) {
    console.error("Error fetching commits:", error.message);
    return res.status(500).json({ message: "Unable to get Gitlab commits", error: error.message })
  }
}
