# :octocat: Combined Version Control Contribution Chart Generator [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/TrentD815/combined-git-contributions-chart/blob/master/LICENSE)

- Generate an image for all contributions across various version control systems such as Github, Bitbucket, Gitlab, and AWS Code Commit
- The API for this project lives in the `src/pages/api` directory since GitHub doesn't provide a way to access user statistics through it's official API.
- The drawing mechanism lives in the [sallar/github-contributions-canvas repository](https://github.com/sallar/github-contributions-canvas).

## Requirements
### For GitHub
- A valid GitHub account.
- Open activity in setting (`Settings` > `Public profile` > `Contributions & Activity`).
  - [ ] Make profile private and hide activity
  
### For Bitbucket
- A valid Bitbucket account
- Your username and a pre-generated app password with the correct permissions
- The name of your project and the name of your repo slug(s)

### Future Integrations: 
- Gitlab, AWS Code Commit, Azure DevOps,

## Install and run locally
- Install the packages using [NPM](https://nodejs.org/en/):
```$ npm install```
- Then run locally using:
```$ npm run dev```

## Deployment
This project is deployed on [Cloudflare](https://cloudflare.com/).

[//]: Example
[//]: # (<div align="center">)
[//]: # (  <img src="screenshot.png" width="676">)
[//]: # (</div>)

## Contributing
Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Change Log
Every release, along with the migration instructions, is documented on the GitHub [Releases](https://github.com/TrentD815/combined-git-contributions-chart/releases) page.

## License
[MIT license](https://opensource.org/licenses/MIT)

