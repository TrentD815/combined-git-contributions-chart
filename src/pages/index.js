import React, { useRef, useState, useEffect } from "react"
import { TbShare, TbDownload, TbCopy, TbBrandGithub, TbBrandBitbucket, TbBrandGitlab } from "react-icons/tb"
import {
  download, fetchData, downloadJSON, cleanUsername, share,
  copyToClipboard, fetchBitbucketData, fetchGitlabtData, fetchGitlabData
} from "../utils/export";
import ThemeSelector from "../components/themes"
import makeAnimated from 'react-select/animated'
import Select from 'react-select'
import { MuiChipsInput } from "mui-chips-input"

const App = () => {
  const inputRef = useRef()
  const canvasRef = useRef()
  const contentRef = useRef()
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState("standard")
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  // GitHub
  const [username, setUsername] = useState("")
  const [showGitHubForm, setShowGithubForm] = useState(false)
  // Bitbucket
  const [bitbucketUsername, setBitbucketUsername] = useState("")
  const [bitbucketDisplayName, setBitbucketDisplayName] = useState("")
  const [bitbucketAppPassword, setBitbucketAppPassword] = useState("")
  const [bitbucketWorkspace, setBitbucketWorkspace] = useState("")
  const [bitbucketRepoChips, setBitbucketRepoChips] = React.useState([])
  const [showBitbucketForm, setShowBitbucketForm] = useState(false)
  // Gitlab
  const [gitlabDisplayName, setGitlabDisplayName] = useState("")
  const [gitlabAccessToken, setGitlabAccessToken] = useState("")
  const [gitlabProjectId, setGitlabProjectId] = useState("")
  const [showGitlabForm, setShowGitlabForm] = useState(false)
  //VCS
  const animatedComponents = makeAnimated();
  const [vcsSelection, setVcsSelection] = React.useState([])
  const options = [
    { value: 'GitHub', label: 'GitHub' },
    { value: 'Bitbucket', label: 'Bitbucket' },
    { value: 'Gitlab', label: 'Gitlab' }
  ]

  useEffect(() => {
    if (!data) { return }
    draw()
  }, [data, theme])

  const handleSubmit = (e) => {
    e.preventDefault()
    const bitbucketBody = {
      vcsSelection,
      bitbucketUsername,
      bitbucketDisplayName,
      bitbucketAppPassword,
      bitbucketWorkspace,
      bitbucketRepoChips
    }
    const gitlabBody = {
      vcsSelection,
      gitlabDisplayName,
      gitlabAccessToken,
      gitlabProjectId
    }

    setUsername(cleanUsername(username))
    setLoading(true)
    setError(null)
    setData(null)

    fetchData(cleanUsername(username))
      .then((data) => {
        setLoading(false)
        data.years.length === 0  ? setError("Could not find GitHub your profile") : setData(data)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
        setError("Unable to fetch check Github profile successfully...")
      })

    // fetchBitbucketData(bitbucketBody)
    //   .then((data) => {
    //     setLoading(false)
    //     data.years.length === 0 ? setError("Could not find your Bitbucket commits") : setData(data)
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //     setLoading(false)
    //     setError("Unable to fetch Bitbucket profile successfully...")
    //   })
    // fetchGitlabData(gitlabBody)
    //   .then((data) => {
    //     setLoading(false)
    //     data.years.length === 0 ? setError("Could not find your Gitlab commits") : setData(data)
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //     setLoading(false)
    //     setError("Unable to fetch Gitlab profile successfully...")
    //   })
  }

  const onBitbucketSelect = () => {
    alert("Bitbucket selected")
  }

  const onGithubSelect = () => {
    alert("Github selected")
  }

  const onGitlabSelect = () => {
    alert("Gitlab selected")
  }

  const handleBitbucketChipChange = (chips) => {
    setBitbucketRepoChips(chips)
  }

  const onDownload = (e) => {
    e.preventDefault()
    download(canvasRef.current)
  }

  const onCopy = (e) => {
    e.preventDefault()
    copyToClipboard(canvasRef.current)
  }

  const onDownloadJson = (e) => {
    e.preventDefault()
    if (data != null) {
      downloadJSON(data)
    }
  }

  const onShare = (e) => {
    e.preventDefault()
    share(canvasRef.current)
  }
  const onVCSInputChange = (inputValue, { action, prevInputValue }) => {
    if (action === 'select-option' || action === "remove-value" || action === "clear") {
      setVcsSelection(inputValue)
    }
  }

  const draw = async () => {
    if (!canvasRef.current || !data) {
      setError("Something went wrong... Check back later.")
      return
    }

    const { drawContributions } = await import("github-contributions-canvas")

    drawContributions(canvasRef.current, {
      data,
      username: username,
      themeName: theme,
      footerText: "Made by @Sallar on GitHub"
    })
    contentRef.current.scrollIntoView({
      behavior: "smooth"
    })
  }

  const _renderGithubButton = () => {
    return (
      <div className="App-github-button">
        <a className="github-button" href="https://github.com/TrentD815/combined-git-contributions-chart"
          data-size="large" data-show-count="true" aria-label="Star TrentD815/combined-git-contribution-chart on GitHub">
          Star
        </a>
      </div>
    )
  }

  const _renderLoading = () => {
    return (
      <div className="App-centered">
        <div className="App-loading">
          <img src={"/loading.gif"} alt="Loading..." width={200} />
          <p>Please wait, pulling data from ...</p>
        </div>
      </div>
    )
  }

  const _renderGraphs = () => {
    return (
      <div
        className="App-result"
        style={{ display: data !== null && !loading ? "block" : "none" }}
      >
        <p>Your chart is ready!</p>

        {data !== null && (
          <>
            <div className="App-buttons">
              <button className="App-download-button" onClick={onCopy} type="button">
                <TbCopy size={18} />Copy
              </button>
              <button className="App-download-button" onClick={onDownload} type="button">
                <TbDownload size={18} />Download
              </button>
              {global.navigator && "share" in navigator && (
                <button className="App-download-button" onClick={onShare} type="button">
                  <TbShare size={18} />Share
                </button>
              )}
            </div>
            <canvas ref={canvasRef} />
          </>
        )}
      </div>
    )
  }

  const _renderForm = () => {
    return (
        <form onSubmit={handleSubmit}>
          <Select
            instanceId="eaa53c4b-392e-402e-a779-57636ddc5db3" isMulti options={options}
            className="basic-multi-select vcsSelect" classNamePrefix="select" components={animatedComponents}
            onChange={onVCSInputChange} placeholder="Select your version control systems..." value={vcsSelection}
          />
          <span id="githubFormItems">
            <h3>GitHub <TbBrandGithub size={18} /> </h3>
            <input ref={inputRef} placeholder="GitHub Username" onChange={(e) => setUsername(e.target.value)}
                   value={username} id="username" autoCorrect="off" autoCapitalize="none" autoFocus autoComplete="false" />
          </span>

          <span id="bitbucketFormItems">
            <h3>Bitbucket <TbBrandBitbucket size={18} /> </h3>
            <input title="Bitbucket Username" ref={inputRef} placeholder="Bitbucket Username" onChange={(e) => setBitbucketUsername(e.target.value)}
                   value={bitbucketUsername} id="bitbucketUsername" autoComplete="false" autoCorrect="off" autoCapitalize="none" />
            <input title="Bitbucket Display Name" ref={inputRef} placeholder="Bitbucket Display Name" onChange={(e) => setBitbucketDisplayName(e.target.value)}
                   value={bitbucketDisplayName} id="bitbucketDisplayName" autoComplete="false" autoCorrect="off" autoCapitalize="none" />
            <input title="Bitbucket App Password" ref={inputRef} placeholder="Bitbucket App Password" onChange={(e) => setBitbucketAppPassword(e.target.value)}
                   value={bitbucketAppPassword} type="password" id="bitbucketAppPassword" autoCorrect="off" autoCapitalize="none" />
            <input title="Bitbucket Workspace" ref={inputRef} placeholder="Bitbucket Workspace" onChange={(e) => setBitbucketWorkspace(e.target.value)}
                   value={bitbucketWorkspace} id="bitbucketWorkspace" autoCorrect="off" autoCapitalize="none" />
            <MuiChipsInput title="Bitbucket Repo Names" color="primary" placeholder="Type and enter your Bitbucket repository names" fullWidth
                           variant="filled" id="bitbucketRepoChips" value={bitbucketRepoChips} onChange={handleBitbucketChipChange} />
          </span>

          <span id="gitlabFormItems">
            <h3>Gitlab <TbBrandGitlab size={18} /></h3>
            <input title="Gitlab Display Name" ref={inputRef} placeholder="Gitlab Display Name" onChange={(e) => setGitlabDisplayName(e.target.value)}
                   value={gitlabDisplayName} id="gitlabDisplayName" autoComplete="false" autoCorrect="off" autoCapitalize="none" />
            <input title="Gitlab Access Token" ref={inputRef} placeholder="Gitlab Access Token" onChange={(e) => setGitlabAccessToken(e.target.value)}
                   value={gitlabAccessToken} id="gitlabAccessToken" autoComplete="false" autoCorrect="off" autoCapitalize="none" />
            <input title="Gitlab Project Id" ref={inputRef} placeholder="Gitlab Project Id" onChange={(e) => setGitlabProjectId(e.target.value)}
                   value={gitlabProjectId} id="gitlabProjectId" autoComplete="false" autoCorrect="off" autoCapitalize="none" />
          </span>

          <button type="submit" disabled={
            username.length <= 0 || bitbucketUsername.length <= 0 || bitbucketDisplayName.length <= 0
            || bitbucketWorkspace.length <= 0 || bitbucketAppPassword.length <= 0 || bitbucketRepoChips.length <= 0
            || vcsSelection.length <= 0 || loading}>
          <span role="img" aria-label="Stars">
            ✨
          </span>{" "}
            {loading ? "Generating..." : "Generate!"}
          </button>
        </form>
    )
  }

  const _renderVCSLogos = () => {
    return (
      <div className="App-buttons">
        GitHub | Bitbucket | Gitlab
      </div>
    )
  }

  const _renderError = () => {
    return (
      <div className="App-error App-centered">
        <p>{error}</p>
      </div>
    )
  }

  const _renderDownloadAsJSON = () => {
    if (data === null) return
    return (
      <a href="#" onClick={onDownloadJson}>
        <span role="img" aria-label="Bar Chart">
          📊
        </span>{" "}
        Download data as JSON for your own visualizations
      </a>
    )
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="App-logo">
          <img src="/vcs.webp" width={150} alt="all vcs logos" />
          <h1>Combined VCS Contributions Chart Generator</h1>
          <h4>All your contributions in one image!</h4>
        </div>
        {_renderVCSLogos()}
        {_renderForm()}
        <ThemeSelector
          currentTheme={theme}
          onChangeTheme={(themeName) => setTheme(themeName)}
        />
        {_renderGithubButton()}
        <footer>
          <p>Not affiliated with GitHub, Gitlab, Atlassian, Amazon, or Microsoft</p>
          {_renderDownloadAsJSON()}
        </footer>
      </header>
      <section className="App-content" ref={contentRef}>
        {loading && _renderLoading()}
        {error !== null && _renderError()}
        {_renderGraphs()}
      </section>
    </div>
  )
}

export default App
