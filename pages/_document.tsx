import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/xenorai-logo.jpg" />
        <link rel="apple-touch-icon" href="/xenorai-logo.jpg" />
        <link rel="icon" type="image/jpeg" sizes="32x32" href="/xenorai-logo.jpg" />
        <link rel="icon" type="image/jpeg" sizes="16x16" href="/xenorai-logo.jpg" />
        <meta name="description" content="XenorAI - Your Intelligent AI Assistant" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
