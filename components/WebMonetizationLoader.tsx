import * as React from 'react'
const { useMonetizationState } = require('react-web-monetization')

const WebMonetizationLoader: React.FC = ({ children }) => {
  const { state: monetizationState } = useMonetizationState()

  if (monetizationState === 'pending') {
    return <p>Awaiting Web Monetization...</p>
  } else if (monetizationState === 'started') {
    return <>{children}</>
  } else {
    return <p>You can deploy to this Codius host by paying with <a href='https://webmonetization.org'>Web Monetization</a>.</p>
  }
}

export default WebMonetizationLoader
