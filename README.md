# Combined VCS Contribution Chart Generator [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/TrentD815/combined-git-contributions-chart/blob/master/LICENSE)
Generate an image for all contributions across various version control systems such as 
GitHub, Bitbucket, Gitlab, Azure DevOps, and AWS Code Commit

## Motivation and Reasoning
I haven't found a web app service which can show you a combined contributions graph
across multiple VCS services such as Bitbucket + GitHub + Gitlab all in one. I've seen 
Python/CLI services such as [this](https://github.com/YakinRubaiat/GitGraph) but these require the repos to be local which 
in my opinion defeats the purpose a bit. I've also seen projects which create a "shadow" repo on your GitHub such as 
[this](https://github.com/miromannino/Contributions-Importer-For-Github) and then retroactively tack on the contributions. 
I do like this method of persistent integration but again, it requires the repos to be local. For my use case,
I had 12+ different repos in Bitbucket on a work laptop separate from my personal computer. I didn't
want to clone each repo to my personal or set up a shadow repo 

Github provides contributions for you already but other services such as Bitbucket don't
have a native equivalent and require you to install a 3rd party extension
from the respective marketplace. And even then it's only your contributions
from that VCS.

The best deployed service I could find was [this](https://github.com/sallar/github-contributions-chart). 
The UI is very clean and the generation works well for GitHub. My project forks this
and expands it to multiple VCS.
   
Main benefits:
- Your repos don't have to be local as the respective VCS REST APIs are called to pull contributions
- Multiple VCS contributions are now shown in one chart

Main downsides:
- More info is required to pull all your contributions (as opposed to just needing your GitHub username previously) 
- It's not persistent since it's just a one time generator like the original project this was forked from

## Requirements
### For GitHub
- A valid GitHub account.
- Open activity in setting (`Settings` > `Public profile` > `Contributions & Activity`).
  - `Make profile private and hide activity` should be unchecked
  
### For Bitbucket
- A valid Bitbucket account
- Your username (for authentication)
- Your display name (for filtering commits)
- A pre-generated app password with the correct permissions. See [this](https://support.atlassian.com/bitbucket-cloud/docs/create-an-app-password/) link for how to create an app password
  - Note: The app password must have `REPO_READ` permission for the specified repositories
- The name of your workspace and repository names

### Future Integrations: 
- Gitlab, AWS Code Commit, & Azure DevOps

## Install and run locally
- Install the packages using NPM:
```$ npm install```
- Then run locally using:
```$ npm run dev```

[//]: Example
[//]: # (<div align="center">)
[//]: # (  <img src="screenshot.png" width="676">)
[//]: # (</div>)


## Change Log
Every release is documented on the GitHub [Releases](https://github.com/TrentD815/combined-git-contributions-chart/releases) page.

## License
[MIT license](https://opensource.org/licenses/MIT)

