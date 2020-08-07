import { FC, useEffect } from 'react'
import { MutableSnapshot, selector, useRecoilState } from 'recoil'
import { useMonetizationState } from 'react-web-monetization'

import { balanceIdState } from './ReceiptSubmitter'

export const tokenState = selector({
  key: 'token',
  get: ({ get }) => get(balanceIdState),
  set: ({ set }, newValue: string) => {
    localStorage.setItem('deployToken', newValue)
    set(balanceIdState, newValue)
  }
})

export const initializeTokenState = ({ set }: MutableSnapshot): void => {
  if (typeof window !== 'undefined') {
    const storedToken = localStorage.getItem('deployToken')
    set(balanceIdState, storedToken !== null ? storedToken : '')
  }
}

export const TokenField: FC = () => {
  const [token, setToken] = useRecoilState(tokenState)

  const { requestId } = useMonetizationState()

  useEffect(() => {
    if (requestId !== null && token === '') {
      setToken(requestId)
    }
  }, [requestId])

  const onChange = (e): void => setToken(e.target.value)

  return (
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
        onChange={onChange}
      />
      <br />
    </pre>
  )
}
