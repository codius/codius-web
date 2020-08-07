import { FC } from 'react'
import { useRecoilValue } from 'recoil'

import { tokenState } from './TokenField'

export const PaymentRequired: FC = () => {
  const token = useRecoilValue(tokenState)

  return token !== '' ? null : (
    <pre>
      <a
        target='_blank'
        rel='noopener noreferrer'
        href='https://webmonetization.org'
      >
        Payment required
      </a>
    </pre>
  )
}
