import { summarizeContributions, combineDuplicates } from "../../../utils/api/general";

export default async (req, res) => {
  try {
    let bitbucket = JSON.parse(req.body)
    bitbucket = bitbucket.body
    const username = bitbucket.bitbucketUsername
    const appPassword = bitbucket.bitbucketAppPassword
    const workspace = bitbucket.bitbucketWorkspace
    const repos = bitbucket.bitbucketRepoChips || []
    const displayName = bitbucket.bitbucketDisplayName
    let commitsByUser = []
    const repoCount = repos.length
    let totalCommitCount = 0

    for (const [i, repo] of repos.entries()) {
      let currentRepoCommitCount = 0
      let nextUrl = `https://api.bitbucket.org/2.0/repositories/${workspace}/${repo}/commits`
      while (nextUrl) {
        console.log(`Fetching bitbucket commits for repo: ${repo}. Repo ${i + 1} of ${repoCount}`)
        console.log(`Commits fetched for the current repo: ${currentRepoCommitCount}. Commits fetched for all repos: ${totalCommitCount}`)
        const response = await fetch(nextUrl, {
          method: "GET",
          headers: {
            "Authorization": `Basic ${Buffer.from(`${username}:${appPassword}`).toString("base64")}`,
            "Content-Type": "application/json"
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()

        // Filter commits by user
        for (const commit of data.values || []) {
          const author = commit.author || {}
          const user = author.user

          if (user?.display_name === displayName) {
            commit.date = commit.date.split("T")[0]
            const contribution = {
              date: commit.date,
              count: 1,
              color: "#9be9a8",
              intensity: '1'
            }
            commitsByUser.push(contribution)
          }
        }
        // Update nextUrl for pagination
        nextUrl = data.next || null
        currentRepoCommitCount += data.values.length
        totalCommitCount += data.values.length
      }
    }
    const years = summarizeContributions(commitsByUser)
    commitsByUser = combineDuplicates(commitsByUser)
    return res.status(200).json({ message: "Bitbucket commits retrieved successfully", years: years, contributions: commitsByUser })
  } catch (error) {
    console.error("Error fetching commits:", error.message)
    return res.status(500).json({ message: "Unable to get Bitbucket commits", error: error.message })
  }
}
