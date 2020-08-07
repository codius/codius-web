import { FC, useEffect } from 'react'

interface LoadingProps {
  codiusHostURI: string
  serviceName: string
}

export const Loading: FC<LoadingProps> = (props: LoadingProps) => {
  useEffect(() => {
    async function reloadIfAvailable (): Promise<void> {
      const res = await fetch(
        `${props.codiusHostURI}/services/${props.serviceName}`
      )
      const service = await res.json()
      if (service.status.availableReplicas === 1) {
        window.location.reload(true)
      }
    }
    setInterval((): void => {
      void reloadIfAvailable()
    }, 1000)
  }, [])

  return <pre>Loading...</pre>
}
