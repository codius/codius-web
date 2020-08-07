import { RecoilRoot } from 'recoil'
import { GetServerSideProps, NextPage } from 'next'
import getConfig from 'next/config'
import { useRouter } from 'next/router'

import {
  ReceiptSubmitter,
  balanceIdState
} from '../../components/ReceiptSubmitter'
import { Head } from '../../components/Head'
import { Loading } from '../../components/Loading'

const { publicRuntimeConfig } = getConfig()

interface LoadingProps {
  codiusHostURI: string
  receiptVerifierUri: string
  paymentPointer: string
  requestPrice: number
}

const LoadingPage: NextPage<LoadingProps> = (props: LoadingProps) => {
  const router = useRouter()
  const { id } = router.query

  const initializeState = ({ set }): void => {
    set(balanceIdState, id as string)
  }

  return (
    <RecoilRoot initializeState={initializeState}>
      <Head paymentPointer={props.paymentPointer} />
      <ReceiptSubmitter receiptVerifierUri={props.receiptVerifierUri} />
      <Loading codiusHostURI={props.codiusHostURI} serviceName={id as string} />
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

export default LoadingPage
