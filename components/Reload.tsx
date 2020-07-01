import { FC, useEffect } from 'react'

const Reload: FC = () => {
  useEffect(() => {
    window.location.reload(true)
  }, [])

  return null
}

export default Reload
