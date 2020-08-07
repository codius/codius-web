import { GetServerSideProps, NextPage } from 'next'
import React from 'react'
import getConfig from 'next/config'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { WebMonetizationLoader } from '../../components/WebMonetizationLoader'
import { Reload } from '../../components/Reload'

const { publicRuntimeConfig } = getConfig()

interface TopUpProps {
  codiusHostURI: string
  receiptVerifierUri: string
  paymentPointer: string
  requestPrice: number
}

const TopUpPage: NextPage<TopUpProps> = (props: TopUpProps) => {
  const router = useRouter()
  const { id } = router.query

  return (
    <div>
      <Head>
        <title>Codius Host</title>
        <link rel='icon' href={props.codiusHostURI + '/favicon.ico'} />
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <meta name='monetization' content={props.paymentPointer} />
      </Head>
      <WebMonetizationLoader
        receiptVerifierUri={props.receiptVerifierUri}
        balanceId={id as string}
        requestPrice={props.requestPrice}
      >
        <Reload />
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

export default TopUpPage
