import { FC, useState, useEffect } from 'react'
const { useMonetizationState } = require('react-web-monetization')

const Instructions: FC = () => {
  const { requestId } = useMonetizationState()
  const [url, setUrl] = useState('')
  const [serviceUrl, setServiceUrl] = useState('')

  useEffect(() => {
    setUrl(window.location.href)
    setServiceUrl(`${window.location.protocol}//<service-name>.${window.location.host}`)
  }, [])

  return (
    <div>
      <p></p>
      <pre>
        Deploy a <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://godoc.org/github.com/codius/codius-crd-operator/api/v1alpha1#Service">
        Codius service
        </a> (see <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/codius/codius-crd-operator/blob/master/config/samples/core_v1alpha1_service.yaml">
        sample
        </a>
        ) to this host using <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://kubernetes.io/docs/tasks/tools/install-kubectl/">
        kubectl
        </a>:
      </pre>
      <pre>&nbsp;&nbsp;KUBECONFIG=none kubectl create -f codius-service.yaml -s {url} --token="{requestId}"</pre>
      <pre>Deployed service will be available at {serviceUrl}</pre>
    </div>
  )
}

export default Instructions
