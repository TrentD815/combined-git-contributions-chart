import { TbShare, TbDownload, TbCopy, TbBrandGithub, TbBrandBitbucket, TbBrandGitlab } from "react-icons/tb"
import React, { useRef, useState, useEffect } from "react"
import { download, fetchData, downloadJSON, cleanUsername, share, copyToClipboard } from "../utils/export"
import ThemeSelector from "../components/themes"
import makeAnimated from 'react-select/animated';
import Select, { InputActionMeta } from 'react-select'

const App = () => {
  const inputRef = useRef()
  const canvasRef = useRef()
  const contentRef = useRef()
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [bitbucketUsername, setBitbucketUsername] = useState("")
  const [bitbucketAppPassword, setBitbucketAppPassword] = useState("")
  const [bitbucketWorkspace, setBitbucketWorkspace] = useState("")
  const [theme, setTheme] = useState("standard")
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const animatedComponents = makeAnimated();
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

    setUsername(cleanUsername(username))
    setLoading(true)
    setError(null)
    setData(null)

    fetchData(cleanUsername(username))
      .then((data) => {
        setLoading(false)

        if (data.years.length === 0) {
          setError("Could not find GitHub your profile")
        } else {
          setData(data)
        }
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
        setError("Unable to fetch check Github profile successfully...")
      })
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
    console.log("Action", action)
    console.log("Prev input value",prevInputValue)
    if (action === 'select-option') {
      console.log("Showing form fields for", inputValue)
      return inputValue;
    }
    if (action === "remove-value") {
      console.log("Removing form fields for", inputValue)
      return inputValue;
    }
    if (action === "clear") {
      console.log("Hiding all form fields", inputValue)
      return inputValue;
    }
    return prevInputValue;
  };

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
      footerText: "Made by @TrentD815"
    })
    contentRef.current.scrollIntoView({
      behavior: "smooth"
    })
  }

  const _renderGithubButton = () => {
    return (
      <div className="App-github-button">
        <a
          className="github-button"
          href="https://github.com/TrentD815/combined-git-contributions-chart"
          data-size="large"
          data-show-count="true"
          aria-label="Star TrentD815/combined-git-contribution-chart on GitHub"
        >
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
          <h3>GitHub</h3>
            <input ref={inputRef} placeholder="GitHub Username" onChange={(e) => setUsername(e.target.value)}
                   value={username} id="username" autoCorrect="off" autoCapitalize="none" autoFocus
            />
          <h3>Bitbucket</h3>
          <input ref={inputRef} placeholder="Bitbucket Username" onChange={(e) => setBitbucketUsername(e.target.value)}
                 value={bitbucketUsername} id="bitbucketUsername" autoComplete="false" autoCorrect="off" autoCapitalize="none"
          />
          <input ref={inputRef} placeholder="Bitbucket App Password" onChange={(e) => setBitbucketAppPassword(e.target.value)}
                 value={bitbucketAppPassword} id="bitbucketAppPassword" autoCorrect="off" autoCapitalize="none"
          />
          <input ref={inputRef} placeholder="Bitbucket Workspace" onChange={(e) => setBitbucketWorkspace(e.target.value)}
                 value={bitbucketWorkspace} id="bitbucketWorkspace" autoCorrect="off" autoCapitalize="none"
          />
          <button type="submit" disabled={username.length <= 0 || loading}>
          <span role="img" aria-label="Stars">
            ✨
          </span>{" "}
            {loading ? "Generating..." : "Generate!"}
          </button>
        </form>
    )
  }

  const _renderVCSSelect = () => {
    return (
      <div className="App-buttons">
        <TbBrandGithub size={18} />GitHub |
        <TbBrandBitbucket size={18} />Bitbucket |
        <TbBrandGitlab size={18} />Gitlab
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
        {_renderVCSSelect()}
        <Select
          instanceId="eaa53c4b-392e-402e-a779-57636ddc5db3"
          isMulti
          name="colors"
          options={options}
          className="basic-multi-select"
          classNamePrefix="select"
          components={animatedComponents}
          // onInputChange={}
          onChange={onVCSInputChange}
          placeholder="Select version control system..."
        />
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
