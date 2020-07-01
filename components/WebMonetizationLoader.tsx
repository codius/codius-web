import { FC, useEffect, useState } from 'react'
const { useMonetizationCounter } = require('react-web-monetization')

interface WMLoaderProps {
  balanceId?: string,
  receiptVerifierUri: string
  requestPrice: number
}

const WebMonetizationLoader: FC<WMLoaderProps> = (props) => {
  const { state: monetizationState, requestId, receipt } = useMonetizationCounter()
  const [paid, setPaid] = useState(false)

  useEffect(() => {
    if (requestId && receipt) {
      const id = props.balanceId || localStorage.getItem('deployToken') || requestId
      const submitReceipt = async () => {
        const res = await fetch(
          `${props.receiptVerifierUri}/balances/${id}:creditReceipt`,
          {
            method: 'POST',
            body: receipt
          }
        )
        if (res.ok && parseInt(await res.text()) >= props.requestPrice) {
          setPaid(true)
        }
      }
      submitReceipt()
    }
  }, [receipt])

  if (!props.children) {
    return null
  }

  if (paid) {
    return <>{props.children}</>
  } else if (monetizationState === 'pending' || monetizationState === 'started') {
    return <p>Awaiting <a href='https://webmonetization.org'>Web Monetization</a>...</p>
  } else {
    return <p>Pay with <a href='https://webmonetization.org'>Web Monetization</a> to access this Codius host.</p>
  }
}

export default WebMonetizationLoader
