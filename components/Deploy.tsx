import { FC, useState, useEffect } from 'react'
import WebMonetizationLoader from './WebMonetizationLoader'
import JSONInput from 'react-json-editor-ajrm'
import locale    from 'react-json-editor-ajrm/locale/en'
const { useMonetizationState } = require('react-web-monetization')

interface DeployProps {
  codiusHostURI: string
}

const Deploy: FC<DeployProps> = (props: DeployProps) => {
  const defaultService = {
    spec: {
      containers: [
        {
          name: "app",
          image: "nginx@sha256:3e2ffcf0edca2a4e9b24ca442d227baea7b7f0e33ad654ef1eb806fbd9bedcf0",
          command: [
            "nginx",
            "-g",
            "daemon off;"
          ],
          env: [
            {
              name: "PUBLIC_VARIABLE",
              value: "hello world"
            },
            {
              name: "PRIVATE_VARIABLE",
              valueFrom: {
                secretKeyRef: {
                  key: "password"
                }
              }
            }
          ],
          readinessProbe: {
            httpGet: {
              path: "/",
              port: 80
            },
            failureThreshold: 10,
          }
        }
      ],
      port: 80
    },
    secretData: {
      nonce: "123456789abcdef",
      password: "super secret"
    }
  }

  const hostUrl = new URL(props.codiusHostURI)
  const host = hostUrl.host
  const protocol = hostUrl.protocol

  const { requestId } = useMonetizationState()

  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [token, setToken] = useState('')
  const [width, setWidth] = useState(1)
  const [ready, setReady] = useState(false)
  const [service, setService] = useState(defaultService)
  const [deployedService, setDeployedService] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('deployToken')
    if (token) {
      setToken(token)
    }
  }, [])

  useEffect(() => {
    if (requestId && !localStorage.getItem('deployToken')) {
      setToken(requestId)
      localStorage.setItem('deployToken', requestId)
    }
  }, [requestId])

  useEffect(() => {
    setReady(!!name && !!service && !!token)
  }, [name, service, token])

  const deployService = async () => {
    const res = await fetch(
      `${hostUrl.href}services/${name}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(service)
      }
    )
    if (res.ok) {
      setError('')
      setDeployedService(await getService(name))
    } else {
      setDeployedService('')
      switch (res.status) {
        case 400:
          setError('Invalid service')
          break;
        case 402:
          setError('Payment required')
          break;
        case 403:
          setError('Service name is unavailable')
          break;
        default:
          setError('Unable to deploy service')
      }
    }
  }

  const getService = async (name) => {
    const res = await fetch(
      `${hostUrl.href}services/${name}`,
      {
        method: 'GET'
      }
    )
    if (res.ok) {
      return res.json()
    } else {
      return ''
    }
  }

  const updateName = (value) => {
    setName(value)
    setWidth(value.length || 1)
  }

  return (
    <div>
      <p></p>
      <p>
        Deploy a <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://godoc.org/github.com/codius/codius-operator/servers#Service">
        Codius service
        </a> at <a
          target="_blank"
          rel="noopener noreferrer"
          href={`${protocol}//${name}.${host}`}>
        {protocol}//
        </a>
        <input
          type="text" size={width} autoFocus onChange={(e) => updateName(e.target.value)}
        /><a
          target="_blank"
          rel="noopener noreferrer"
          href={`${protocol}//${name}.${host}`}>
        .{host}
        </a>:
      </p>
      <JSONInput
        id          = 'a_unique_id'
        placeholder = { defaultService }
        locale      = { locale }
        height      = '500px'
        onChange    = { (o) => setService(o.jsObject) }
      />
      <p>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href='https://webmonetization.org'>
        Web Monetization
        </a> payment token: <input
          type="text" value={token} size={30} onChange={(e) => setToken(e.target.value)}
        />
      </p>
      <input type="button" disabled={!ready} value="Deploy" onClick={(e) => deployService()}/>
      <pre>{error}</pre>
      {deployedService
        ? <div>
            <pre>Success</pre>
            <pre>{JSON.stringify(deployedService, null, 2)}</pre>
          </div>
        : <div>
            <p>Or from the command line with:</p>
            <pre>curl -X PUT {hostUrl.href}services/{name || '{name}'} -H "Content-Type: application/json" -H "Authorization: Bearer {token || '{token}'}" -d @codius-service.json</pre>
          </div>
      }
    </div>
  )
}

export default Deploy
