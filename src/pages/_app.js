import { Toaster } from "react-hot-toast"
import "normalize.css/normalize.css"
import "../styles/index.css"
import "../styles/App.css"
import Head from "next/head"

const App = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>Combined VCS Contributions Chart Generator</title>
      <meta
        name="description"
        content="See all of your VCS contributions in one image!"
      />
    </Head>
    <Component {...pageProps} />
    <Toaster position="bottom-right" />
  </>
)

export default App
