import { FC, useEffect } from 'react'

interface LoadingProps {
  codiusHostURI: string
  serviceName: string
}

export const Loading: FC<LoadingProps> = (props: LoadingProps) => {
  useEffect(() => {
    async function reloadIfAvailable(): Promise<void> {
      const res = await fetch(
        `${props.codiusHostURI}/services/${props.serviceName}`
      )
      const service = await res.json()
      if (service.status.availableReplicas === 1) {
        window.location.reload(true)
      }
    }
    const interval = setInterval((): void => {
      void reloadIfAvailable()
    }, 1000)
    return (): void => {
      clearInterval(interval)
    }
  }, [])

  return <pre>Loading...</pre>
}
