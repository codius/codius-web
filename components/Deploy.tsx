import React, { FC, useState, useEffect } from 'react'
import { parse } from '@prantlf/jsonlint'
import { dump, safeLoad } from 'js-yaml'
import AceEditor, { IAnnotation } from 'react-ace'
import { useMonetizationState } from 'react-web-monetization'

import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/mode-yaml'
import 'ace-builds/src-noconflict/theme-github'

interface DeployProps {
  codiusHostURI: string
}

export const Deploy: FC<DeployProps> = (props: DeployProps) => {
  const defaultService = {
    spec: {
      containers: [
        {
          name: 'app',
          image:
            'nginx@sha256:3e2ffcf0edca2a4e9b24ca442d227baea7b7f0e33ad654ef1eb806fbd9bedcf0',
          command: ['nginx', '-g', 'daemon off;'],
          env: [
            {
              name: 'PUBLIC_VARIABLE',
              value: 'hello world'
            },
            {
              name: 'PRIVATE_VARIABLE',
              valueFrom: {
                secretKeyRef: {
                  key: 'password'
                }
              }
            }
          ],
          readinessProbe: {
            httpGet: {
              path: '/',
              port: 80
            },
            failureThreshold: 10
          }
        }
      ],
      port: 80
    },
    secretData: {
      nonce: '123456789abcdef',
      password: 'super secret'
    }
  }

  const hostUrl = new URL(props.codiusHostURI)
  const host = hostUrl.host
  const protocol = hostUrl.protocol

  const { requestId } = useMonetizationState()

  const [name, setName] = useState('')
  const [url, setUrl] = useState(
    `${protocol}//${name !== '' ? name + '.' : ''}${host}`
  )
  const [token, setToken] = useState('')
  const [ready, setReady] = useState(false)
  const [service, setService] = useState(dump(defaultService))
  const [result, setResult] = useState('')
  const [mode, setMode] = useState('yaml')
  const [prevMode, setPrevMode] = useState('yaml')
  const [annotations, setAnnotations] = useState([])
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('deployToken')
    if (token !== null) {
      setToken(token)
    }
  }, [])

  useEffect(() => {
    if (requestId !== null && localStorage.getItem('deployToken') === null) {
      setToken(requestId)
      localStorage.setItem('deployToken', requestId)
    }
  }, [requestId])

  useEffect(() => {
    setUrl(`${protocol}//${name !== '' ? name + '.' : ''}${host}`)
  }, [name])

  useEffect(() => {
    if (mode !== prevMode) {
      switch (mode) {
        case 'json':
          setService(JSON.stringify(safeLoad(service), null, 2))
          break
        case 'yaml':
          setService(dump(JSON.parse(service)))
          break
      }
      setPrevMode(mode)
    }
  }, [mode])

  useEffect(() => {
    setReady(name !== '' && annotations.length !== 0 && token !== '')
  }, [name, annotations, token])

  const deployService = async (): Promise<void> => {
    const res = await fetch(`${hostUrl.href}services/${name}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: mode === 'json' ? service : JSON.stringify(safeLoad(service))
    })
    if (res.ok) {
      setResult(`Success\n\n${JSON.stringify(await getService(name), null, 2)}`)
    } else {
      switch (res.status) {
        case 400:
          setResult('Invalid service')
          break
        case 402:
          setResult('Payment required')
          break
        case 403:
          setResult('Service name is unavailable')
          break
        default:
          setResult('Unable to deploy service')
      }
    }
  }

  const getService = async (name: string): Promise<string> => {
    const res = await fetch(`${hostUrl.href}services/${name}`, {
      method: 'GET'
    })
    if (res.ok) {
      return await res.json()
    } else {
      return ''
    }
  }

  const updateService = (value): void => {
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
            row: err.location.start.line - 1,
            text: err.reason,
            type: 'error'
          }
          setAnnotations([annotation])
        }
        break
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
        break
    }
  }

  return (
    <div>
      <p>
        Create a{' '}
        <a
          target='_blank'
          rel='noopener noreferrer'
          href='https://godoc.org/github.com/codius/codius-operator/servers#Service'
        >
          Codius service
        </a>
      </p>
      <pre>
        Name:{' '}
        <input
          type='text'
          autoFocus
          autoComplete='off'
          onChange={e => setName(e.target.value)}
        />
      </pre>
      <select
        value={mode}
        disabled={annotations.length !== 0}
        onChange={e => setMode(e.target.value)}
      >
        <option value='json'>JSON</option>
        <option value='yaml'>YAML</option>
      </select>
      <AceEditor
        mode={mode}
        theme='github'
        value={service}
        tabSize={2}
        fontSize={14}
        maxLines={42}
        minLines={10}
        onChange={updateService}
        annotations={annotations}
        setOptions={{ useWorker: false }}
        editorProps={{ $blockScrolling: true }}
      />
      <pre
        onClick={e => setShowAdvanced(!showAdvanced)}
        style={{ cursor: 'pointer' }}
      >
        [{showAdvanced ? '-' : '+'}] Advanced
      </pre>
      {showAdvanced ? (
        <pre>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <a
            target='_blank'
            rel='noopener noreferrer'
            href='https://webmonetization.org'
          >
            Web Monetization
          </a>{' '}
          payment token:{' '}
          <input
            type='text'
            value={token}
            autoComplete='off'
            size={30}
            onChange={e => setToken(e.target.value)}
          />
          <br />
        </pre>
      ) : (
        <p></p>
      )}
      <br />
      <input
        type='button'
        disabled={!ready}
        value='Deploy'
        autoComplete='off'
        onClick={async () => {
          await deployService()
        }}
      />{' '}
      to{' '}
      <a target='_blank' rel='noopener noreferrer' href={url}>
        {url}
      </a>
      <pre>
        {token === '' ? (
          <a
            target='_blank'
            rel='noopener noreferrer'
            href='https://webmonetization.org'
          >
            Payment required
          </a>
        ) : (
          <p></p>
        )}
      </pre>
      <pre>{result}</pre>
    </div>
  )
}
