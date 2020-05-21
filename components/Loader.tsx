import { FC, useEffect, useState } from 'react'
const { useMonetizationCounter } = require('react-web-monetization')

interface LoaderProps {
  serviceUrl: string
}

const Loader: FC<LoaderProps> = (props: LoaderProps) => {
  const { assetScale, totalAmount } = useMonetizationCounter()
  const [amount, setAmount] = useState(0)

  useEffect(() => {
    setAmount(totalAmount/(10*assetScale))
  }, [totalAmount])

  return (
    <div>
      <p></p>
      <pre>Topping up previously insufficient service balance: +{amount}</pre>
      <pre>
        You can follow the link to <a href={props.serviceUrl}>{props.serviceUrl}</a> at any time.
      </pre>
    </div>
  )
}

export default Loader
