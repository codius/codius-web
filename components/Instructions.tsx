import { FC, useState, useEffect } from 'react'
const { useMonetizationCounter } = require('react-web-monetization')

interface InstructionsProps {
  receiptVerifierUrl: string
}

const Instructions: FC<InstructionsProps> = (props: InstructionsProps) => {
  console.log(props)
  const { requestId, receipt } = useMonetizationCounter()
  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(window.location.href)
  }, [])

  useEffect(() => {
    if (requestId && receipt) {
      fetch(
        `${props.receiptVerifierUrl}/balances/${requestId}:creditReceipt`,
        {
          method: 'POST',
          body: receipt
        }
      )
    }
  }, [receipt])

  return (
    <div>
      <p></p>
      <pre>
        Deploy a Codius service to this host using <a href="https://kubernetes.io/docs/tasks/tools/install-kubectl/">kubectl</a>
      </pre>
      <pre>kubectl apply -f codius-service.yaml -s {url} --token="{requestId}"</pre>
    </div>
  )
}

export default Instructions
