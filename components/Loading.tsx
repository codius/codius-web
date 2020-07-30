import { FC, useEffect, useState } from 'react'
const { useMonetizationCounter } = require('react-web-monetization')

interface LoadingProps {
  codiusHostURI: string,
  serviceName: string
}

const Loading: FC<LoadingProps> = (props: LoadingProps) => {
  const { assetScale, totalAmount } = useMonetizationCounter()
  const [amount, setAmount] = useState(0)
  const [serviceUrl, setServiceUrl] = useState('')

  useEffect(() => {
    setInterval(async () => {
      const res = await fetch(`${props.codiusHostURI}/services/${props.serviceName}`)
      const service = await res.json()
      if (service.status.availableReplicas === 1) {
        window.location.reload(true)
      }
    }, 1000)
  }, [])

  return <pre>Loading...</pre>
}

export default Loading
