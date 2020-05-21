import { GetServerSideProps, NextPage, NextPageContext } from 'next'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

interface AuthProps {
  statusCode: number
}

const Authenticate: NextPage<AuthProps> = (props: AuthProps) => {
  return <div>{props.statusCode}</div>
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const receiptVerifierUriPrivate = publicRuntimeConfig.receiptVerifierUriPrivate
  const serviceHost = ctx.req.headers['x-forwarded-host'] as string
  const serviceId = serviceHost.split('.')[0]
  const res = await fetch(`${publicRuntimeConfig.receiptVerifierUriPrivate}/balances/${serviceId}:spend`,
    {
      method: 'POST',
      body: publicRuntimeConfig.requestPrice
    }
  )
  if (!res.ok) {
    ctx.res.writeHead(303, {
      Location: `${publicRuntimeConfig.codius_web_url}/${serviceId}/402`
    })
    ctx.res.end()
  }
  return {
    props: {
      statusCode: ctx.res.statusCode
    }
  }
}

export default Authenticate
