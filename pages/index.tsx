import { GetServerSideProps, NextPage } from 'next'
import getConfig from 'next/config'

import { Head } from '../components/Head'
import { ReceiptSubmitter } from '../components/ReceiptSubmitter'
import { WebMonetizationStatus } from '../components/WebMonetizationStatus'

const { publicRuntimeConfig } = getConfig()

interface IndexProps {
  balanceId: string
  paymentPointer: string
  receiptVerifierUri: string
  requestPrice: number
}

const IndexPage: NextPage<IndexProps> = (props: IndexProps) => {
  return (
    <div>
      <Head paymentPointer={props.paymentPointer} />
      <ReceiptSubmitter
        balanceId={props.balanceId}
        receiptVerifierUri={props.receiptVerifierUri}
        requestPrice={props.requestPrice}
      />
      <WebMonetizationStatus />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  return {
    props: {
      balanceId: ctx.req.headers.host.split('.', 1),
      ...publicRuntimeConfig
    }
  }
}

export default IndexPage
