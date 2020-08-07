import { FC } from 'react'
import { useRecoilValue } from 'recoil'
import { useMonetizationCounter } from 'react-web-monetization'

import { balanceState } from './ReceiptSubmitter'

interface WMLoaderProps {
  requestPrice: number
}

export const WebMonetizationLoader: FC<WMLoaderProps> = (
  props: React.PropsWithChildren<WMLoaderProps>
) => {
  const { state: monetizationState } = useMonetizationCounter()
  const balance = useRecoilValue(balanceState)

  if (balance >= props.requestPrice) {
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
