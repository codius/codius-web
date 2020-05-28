import { FC, useEffect, useState } from 'react'
const { useMonetizationCounter } = require('react-web-monetization')

interface WMLoaderProps {
  balanceId?: string,
  receiptVerifierUri: string
}

const WebMonetizationLoader: FC<WMLoaderProps> = (props) => {
  const { state: monetizationState, requestId, receipt } = useMonetizationCounter()
  const [paid, setPaid] = useState(false)

  useEffect(() => {
    if (requestId && receipt) {
      const id = props.balanceId || requestId
      const submitReceipt = async () => {
        const res = await fetch(
          `${props.receiptVerifierUri}/balances/${id}:creditReceipt`,
          {
            method: 'POST',
            body: receipt
          }
        )
        if (res.ok) {
          // should require a minimum returned balance?
          setPaid(true)
        }
      }
      submitReceipt()
    }
  }, [receipt])

  if (paid) {
    return <>{props.children}</>
  } else if (monetizationState === 'pending' || monetizationState === 'started') {
    return <p>Awaiting Web Monetization...</p>
  } else {
    return <p>Pay with <a href='https://webmonetization.org'>Web Monetization</a> to access this Codius host.</p>
  }
}

export default WebMonetizationLoader
