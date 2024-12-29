import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import "normalize.css/normalize.css";
import "../styles/index.css";
import "../styles/App.css";

import Head from "next/head";

const App = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>Combined Version Control Contributions Chart Generator</title>
      <meta
        name="description"
        content="See all of your version control contributions in one image!"
      />
    </Head>
    <Component {...pageProps} />
    <Toaster position="bottom-right" />
    <Analytics />
  </>
);

export default App;
