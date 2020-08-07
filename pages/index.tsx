import { RecoilRoot } from 'recoil'
import { GetServerSideProps, NextPage } from 'next'
import getConfig from 'next/config'

import { Advanced } from '../components/Advanced'
import { DeployButton } from '../components/DeployButton'
import { DeployResult } from '../components/DeployResult'
import { Editor } from '../components/Editor'
import { Head } from '../components/Head'
import { NameField } from '../components/NameField'
import { PaymentRequired } from '../components/PaymentRequired'
import { ReceiptSubmitter } from '../components/ReceiptSubmitter'
import { TokenField, initializeTokenState } from '../components/TokenField'

const { publicRuntimeConfig } = getConfig()

interface IndexProps {
  codiusHostURI: string
  receiptVerifierUri: string
  paymentPointer: string
}

const IndexPage: NextPage<IndexProps> = (props: IndexProps) => (
  <RecoilRoot initializeState={initializeTokenState}>
    <Head paymentPointer={props.paymentPointer} />
    <ReceiptSubmitter receiptVerifierUri={props.receiptVerifierUri} />
    <p>
      Create a serverless{' '}
      <a
        target='_blank'
        rel='noopener noreferrer'
        href='https://godoc.org/github.com/codius/codius-operator/servers#Service'
      >
        Codius service
      </a>
    </p>
    <NameField />
    <Editor />
    <Advanced>
      <TokenField />
    </Advanced>
    <br />
    <DeployButton codiusHostURI={props.codiusHostURI} />
    <PaymentRequired />
    <DeployResult codiusHostURI={props.codiusHostURI} />
  </RecoilRoot>
)

export const getServerSideProps: GetServerSideProps = async ctx => {
  return {
    props: {
      ...publicRuntimeConfig
    }
  }
}

export default IndexPage
