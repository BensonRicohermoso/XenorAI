import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/finchatbot.ico" />
        <link rel="apple-touch-icon" href="/finchatbot-180.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/finchatbot-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/finchatbot-16.png" />
        <meta name="description" content="XenorAI - Your Intelligent AI Assistant" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
