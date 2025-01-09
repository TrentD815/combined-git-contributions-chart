import { combineDuplicates, summarizeContributions } from "../../../utils/api/general";

export default async (req, res) => {
  try {
    let gitlab = JSON.parse(req.body)
    gitlab = gitlab.body
    const accessToken = gitlab.gitlabAccessToken
    const projectId = gitlab.gitlabProjectId
    const displayName = gitlab.gitlabDisplayName
    const baseUrl = `https://gitlab.com/api/v4/projects/${(projectId)}/repository/commits`
    let nextUrl = baseUrl;
    let commitsByUser = [];
    let totalCommitCount = 0
    let currentRepoCommitCount = 0

    while (nextUrl) {
      console.log(`Fetching gitlab commits for Project ID: ${projectId}`)
      console.log(`Commits fetched for the current project: ${currentRepoCommitCount}. Commits fetched for all projects: ${totalCommitCount}`)
      const response = await fetch(nextUrl, {
        method: "GET",
        headers: {
          "PRIVATE-TOKEN": accessToken,
          "Content-Type": "application/json",
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json();

      // Filter commits by user
      for (const commit of data || []) {
        if (commit.committer_name === displayName) {
          commit.committed_date = commit.committed_date.split("T")[0]
          const contribution = {
            date: commit.committed_date,
            count: 1,
            color: "#9be9a8",
            intensity: '1'
          }
          commitsByUser.push(contribution)
        }
      }

      // Check for pagination
      const nextPage = response.headers.get("x-next-page")
      nextUrl = nextPage ? `${baseUrl}?page=${nextPage}` : null;
      currentRepoCommitCount += data.length
      totalCommitCount += data.length
    }

    const years = summarizeContributions(commitsByUser)
    commitsByUser = combineDuplicates(commitsByUser)
    return res.status(200).json({ message: "Gitlab commits retrieved successfully", years: years, contributions: commitsByUser })
  }
  catch (error) {
    console.error("Error fetching commits:", error.message)
    return res.status(500).json({ message: "Unable to get Gitlab commits", error: error.message })
  }
}
