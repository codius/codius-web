import { FC, useState, useEffect } from 'react'
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil'
import { parse } from '@prantlf/jsonlint'
import { dump as toYaml, safeLoad as fromYaml } from 'js-yaml'
import AceEditor, { IAnnotation } from 'react-ace'

import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/mode-yaml'
import 'ace-builds/src-noconflict/theme-github'

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

const modeState = atom({
  key: 'mode',
  default: 'yaml'
})

const serviceStrState = atom({
  key: 'serviceStr',
  default: toYaml(defaultService)
})

const annotationsState = atom({
  key: 'annotations',
  default: []
})

export const serviceValidState = selector({
  key: 'serviceValid',
  get: ({ get }) => get(annotationsState).length === 0
})

export const serviceState = selector({
  key: 'service',
  get: ({ get }) => {
    if (get(serviceValidState)) {
      switch (get(modeState)) {
        case 'json':
          return JSON.parse(get(serviceStrState))
        case 'yaml':
          return fromYaml(get(serviceStrState))
      }
    }
  }
})

export const Editor: FC = () => {
  const [annotations, setAnnotations] = useRecoilState(annotationsState)
  const [mode, setMode] = useRecoilState(modeState)
  const [newMode, setNewMode] = useState(mode)
  const [serviceStr, setServiceStr] = useRecoilState(serviceStrState)
  const valid = useRecoilValue(serviceValidState)

  useEffect(() => {
    if (mode !== newMode) {
      setMode(newMode)
      switch (newMode) {
        case 'json':
          setServiceStr(JSON.stringify(fromYaml(serviceStr), null, 2))
          break
        case 'yaml':
          setServiceStr(toYaml(JSON.parse(serviceStr)))
          break
      }
    }
  }, [newMode])

  const onChange = (value): void => {
    setServiceStr(value)
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
          fromYaml(value)
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
      <select
        value={mode}
        disabled={!valid}
        onChange={(e): void => setNewMode(e.target.value)}
      >
        <option value='json'>JSON</option>
        <option value='yaml'>YAML</option>
      </select>
      <AceEditor
        mode={mode}
        theme='github'
        value={serviceStr}
        tabSize={2}
        fontSize={14}
        maxLines={42}
        minLines={10}
        onChange={onChange}
        annotations={annotations}
        setOptions={{ useWorker: false }}
        editorProps={{ $blockScrolling: true }}
      />
    </div>
  )
}
