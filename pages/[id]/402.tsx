import { RecoilRoot } from 'recoil'
import { GetServerSideProps, NextPage } from 'next'
import getConfig from 'next/config'
import { useRouter } from 'next/router'

import {
  ReceiptSubmitter,
  balanceIdState
} from '../../components/ReceiptSubmitter'
import { Head } from '../../components/Head'
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

  const initializeState = ({ set }): void => {
    set(balanceIdState, router.query.id as string)
  }

  return (
    <RecoilRoot initializeState={initializeState}>
      <Head paymentPointer={props.paymentPointer} />
      <ReceiptSubmitter receiptVerifierUri={props.receiptVerifierUri} />
      <WebMonetizationLoader requestPrice={props.requestPrice}>
        <Reload />
      </WebMonetizationLoader>
    </RecoilRoot>
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
