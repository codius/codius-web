import { FC, useState, useEffect } from 'react'
const { useMonetizationState } = require('react-web-monetization')

const Instructions: FC = () => {
  const { requestId } = useMonetizationState()
  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(window.location.href)
  }, [])

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
