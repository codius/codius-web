import { FC } from 'react'
import { useMonetizationCounter } from 'react-web-monetization'

export const WebMonetizationStatus: FC = () => {
  const { state: monetizationState } = useMonetizationCounter()

  if (monetizationState === 'pending' || monetizationState === 'started') {
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
