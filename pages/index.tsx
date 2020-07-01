import Instructions from '../components/Instructions'
import WebMonetizationLoader from '../components/WebMonetizationLoader'
import { NextPage, NextPageContext } from 'next'
import getConfig from 'next/config'
import Head from 'next/head'

const { publicRuntimeConfig } = getConfig()

interface IndexProps {
  receiptVerifierUri: string,
  paymentPointer: string,
  requestPrice: number
}

const IndexPage: NextPage<IndexProps> = (props: IndexProps) => (
  <div>
    <Head>
      <title>Codius Host</title>
      <link rel="icon" href="/favicon.ico" />
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name='monetization' content={props.paymentPointer} />
    </Head>
    <WebMonetizationLoader receiptVerifierUri={props.receiptVerifierUri} requestPrice={props.requestPrice}>
      <Instructions/>
    </WebMonetizationLoader>
  </div>
)

IndexPage.getInitialProps = async (ctx: NextPageContext) => {
  return publicRuntimeConfig
}

export default IndexPage
