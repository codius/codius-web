import { FC, useState, useEffect } from 'react'
import WebMonetizationLoader from './WebMonetizationLoader'
import { parse } from '@prantlf/jsonlint'
import { dump, safeLoad } from 'js-yaml'
import AceEditor, {IAnnotation} from 'react-ace'

import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/mode-yaml'
import 'ace-builds/src-noconflict/theme-github'

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
  const [service, setService] = useState(dump(defaultService))
  const [deployedService, setDeployedService] = useState('')
  const [mode, setMode] = useState('yaml')
  const [prevMode, setPrevMode] = useState('yaml')
  const [annotations, setAnnotations] = useState([])

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
    if (mode !== prevMode) {
      switch (mode) {
        case 'json':
          setService(JSON.stringify(safeLoad(service), null, 2))
          break;
        case 'yaml':
          setService(dump(JSON.parse(service)))
          break;
      }
      setPrevMode(mode)
    }
  }, [mode])

  useEffect(() => {
    setReady(!!name && !annotations.length && !!token)
  }, [name, annotations, token])

  const deployService = async () => {
    const res = await fetch(
      `${hostUrl.href}services/${name}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: mode === 'json' ? service : JSON.stringify(safeLoad(service))
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

  const updateService = (value) => {
    setService(value)
    switch (mode) {
      case 'json':
        try {
          parse(value, {
            allowSingleQuotedStrings: true
          })
          setAnnotations([])
        } catch (err) {
          const annotation: IAnnotation = {
            column: err.location.start.column,
            row: err.location.start.line-1,
            text: err.reason,
            type: 'error'
          }
          setAnnotations([annotation])
        }
        break;
      case 'yaml':
        try {
          safeLoad(value)
          setAnnotations([])
        } catch (err) {
          const annotation: IAnnotation = {
            column: err.mark.column,
            row: err.mark.line,
            text: err.reason,
            type: 'error'
          }
          setAnnotations([annotation])
        }
        break;
    }
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
      <select value={mode} disabled={!!annotations.length} onChange={(e) => setMode(e.target.value)}>
        <option value="json">JSON</option>
        <option value="yaml">YAML</option>
      </select>
      <AceEditor
        mode={ mode }
        theme="github"
        value={ service }
        tabSize={2}
        fontSize={14}
        maxLines={42}
        minLines={10}
        onChange={updateService}
        annotations={annotations}
        setOptions={{ useWorker: false }}
        editorProps={{ $blockScrolling: true }}
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
        : <p></p>
      }
    </div>
  )
}

export default Deploy
