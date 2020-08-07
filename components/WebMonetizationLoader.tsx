import { FC, useEffect, useState } from 'react'
import { useMonetizationCounter } from 'react-web-monetization'

interface WMLoaderProps {
  balanceId?: string
  receiptVerifierUri: string
  requestPrice: number
}

export const WebMonetizationLoader: FC<WMLoaderProps> = props => {
  const {
    state: monetizationState,
    requestId,
    receipt
  } = useMonetizationCounter()
  const [paid, setPaid] = useState(false)

  useEffect(() => {
    if (requestId !== null && receipt !== null) {
      const id =
        props.balanceId || localStorage.getItem('deployToken') || requestId
      const submitReceipt = async (): Promise<void> => {
        const res = await fetch(
          `${props.receiptVerifierUri}/balances/${id as string}:creditReceipt`,
          {
            method: 'POST',
            body: receipt
          }
        )
        if (res.ok && parseInt(await res.text()) >= props.requestPrice) {
          setPaid(true)
        }
      }
      void submitReceipt()
    }
  }, [receipt])

  if (props.children === null) {
    return null
  }

  if (paid) {
    return <>{props.children}</>
  } else if (
    monetizationState === 'pending' ||
    monetizationState === 'started'
  ) {
    return (
      <pre>
        Awaiting <a href='https://webmonetization.org'>Web Monetization</a>...
      </pre>
    )
  } else {
    return (
      <pre>
        Pay with <a href='https://webmonetization.org'>Web Monetization</a> to
        access this Codius host.
      </pre>
    )
  }
}
