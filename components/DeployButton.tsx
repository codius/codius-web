import { FC, useState, useEffect } from 'react'
import { atom, useRecoilValue, useSetRecoilState } from 'recoil'

import { tokenState } from './TokenField'
import { serviceState, serviceValidState } from './Editor'
import { nameState } from './NameField'

export const statusCodeState = atom({
  key: 'statusCode',
  default: 0
})

interface DeployButtonProps {
  codiusHostURI: string
}

export const DeployButton: FC<DeployButtonProps> = (
  props: DeployButtonProps
) => {
  const hostUrl = new URL(props.codiusHostURI)
  const host = hostUrl.host
  const protocol = hostUrl.protocol

  const name = useRecoilValue(nameState)
  const [ready, setReady] = useState(false)
  const service = useRecoilValue(serviceState)
  const serviceValid = useRecoilValue(serviceValidState)
  const setStatusCode = useSetRecoilState(statusCodeState)
  const token = useRecoilValue(tokenState)
  const [url, setUrl] = useState(
    `${protocol}//${name !== '' ? name + '.' : ''}${host}`
  )

  useEffect(() => {
    setUrl(`${protocol}//${name !== '' ? name + '.' : ''}${host}`)
  }, [name])

  useEffect(() => {
    setReady(name !== '' && serviceValid && token !== '')
  }, [name, serviceValid, token])

  const deployService = async (): Promise<void> => {
    const res = await fetch(`${hostUrl.href}services/${name}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(service)
    })
    setStatusCode(res.status)
  }

  return (
    <input
      type='button'
      disabled={!ready}
      value={`Deploy to ${url}`}
      autoComplete='off'
      onClick={async (): Promise<void> => {
        await deployService()
      }}
    />
  )
}
