import { FC, useEffect } from 'react'

export const Reload: FC = () => {
  useEffect(() => {
    window.location.reload(true)
  }, [])

  return null
}
