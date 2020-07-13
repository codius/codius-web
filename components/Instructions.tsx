import { FC, useState, useEffect } from 'react'
const { useMonetizationState } = require('react-web-monetization')

const Instructions: FC = () => {
  const { requestId } = useMonetizationState()
  const [url, setUrl] = useState('')
  const [serviceUrl, setServiceUrl] = useState('')
  const [serviceResourceUrl, setServiceResourceUrl] = useState('')
  const token = localStorage.getItem('deployToken') || requestId
  localStorage.setItem('deployToken', token)

  useEffect(() => {
    setUrl(window.location.href)
    setServiceUrl(`${window.location.protocol}//{name}.${window.location.host}`)
    setServiceResourceUrl(`${window.location.protocol}//${window.location.host}/services/{name}`)
  }, [])

  return (
    <div>
      <p></p>
      <pre>
        Deploy a <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://godoc.org/github.com/codius/codius-operator/servers#Service">
        Codius service
        </a> (see <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/codius/examples">
        examples
        </a>
        ) to this host:
      </pre>
      <pre>&nbsp;&nbsp;curl -X PUT {url}services/{'{name}'} -H "Content-Type: application/json" -H "Authorization: Bearer {token}" -d @codius-service.json</pre>
      <pre>Deployed service will be available at {serviceUrl}</pre>
      <pre>Service details can be found at {serviceResourceUrl}</pre>
    </div>
  )
}

export default Instructions
