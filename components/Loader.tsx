import { FC, useEffect, useState } from 'react'
const { useMonetizationCounter } = require('react-web-monetization')

interface LoaderProps {
  serviceName: string
}

const Loader: FC<LoaderProps> = (props: LoaderProps) => {
  const { assetScale, totalAmount } = useMonetizationCounter()
  const [amount, setAmount] = useState(0)
  const [serviceUrl, setServiceUrl] = useState('')

  useEffect(() => {
    setServiceUrl(`${window.location.protocol}//${props.serviceName}.${window.location.host}`)
  }, [])

  useEffect(() => {
    setAmount(totalAmount/(10*assetScale))
  }, [totalAmount])

  return (
    <div>
      <p></p>
      <pre>Topping up previously insufficient service balance: +{amount}</pre>
      <pre>
        You can follow the link to <a href={serviceUrl}>{serviceUrl}</a> at any time.
      </pre>
    </div>
  )
}

export default Loader
