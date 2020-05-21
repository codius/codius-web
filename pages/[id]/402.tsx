import Loader from '../../components/Loader'
import WebMonetizationLoader from '../../components/WebMonetizationLoader'
import { GetServerSideProps, NextPage, NextPageContext } from 'next'
import getConfig from 'next/config'
import Head from 'next/head'
import { useRouter } from 'next/router'

const { publicRuntimeConfig } = getConfig()

interface AuthProps {
  codius_web_url: string,
  receiptVerifierUriPublic: string,
  paymentPointer: string
}

const Authenticate: NextPage<AuthProps> = (props: AuthProps) => {
  const router = useRouter()
  const { id } = router.query
  const serviceUrl = new URL(publicRuntimeConfig.codius_web_url)
  serviceUrl.host = `${id}.${serviceUrl.host}`

  return (
    <div>
      <Head>
        <title>Codius Host</title>
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name='monetization' content={props.paymentPointer} />
      </Head>
      <WebMonetizationLoader receiptVerifierUriPublic={props.receiptVerifierUriPublic} balanceId={id as string}>
        <Loader serviceUrl={serviceUrl.href} />
      </WebMonetizationLoader>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  return {
    props: {
      ...publicRuntimeConfig
    }
  }
}

export default Authenticate
