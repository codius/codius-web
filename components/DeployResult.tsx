import { FC, useState, useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import reactStringReplace from 'react-string-replace'

import { statusCodeState } from './DeployButton'
import { nameState } from './NameField'

interface DeployResultProps {
  codiusHostURI: string
}

export const DeployResult: FC<DeployResultProps> = (
  props: DeployResultProps
) => {
  const hostUrl = new URL(props.codiusHostURI)

  const name = useRecoilValue(nameState)
  const [result, setResult] = useState(null)
  const statusCode = useRecoilValue(statusCodeState)

  useEffect(() => {
    const setResultToService = async (): Promise<void> => {
      const res = await fetch(`${hostUrl.href}services/${name}`, {
        method: 'GET'
      })
      if (res.ok) {
        const service = await res.json()
        setResult(
          <>
            Success
            <br />
            {reactStringReplace(
              JSON.stringify(service, null, 2),
              service.metadata.annotations['codius.org/hostname'],
              match => (
                <a
                  target='_blank'
                  rel='noopener noreferrer'
                  href={`${hostUrl.protocol}//${match}`}
                >
                  {match}
                </a>
              )
            )}
          </>
        )
      } else {
        setResult(<>Success</>)
      }
    }

    if (statusCode !== 0) {
      switch (statusCode) {
        case 201:
        case 204:
          void setResultToService()
          break
        case 400:
          setResult(<>Invalid service</>)
          break
        case 402:
          setResult(<>Payment required</>)
          break
        case 403:
          setResult(<>Service name is unavailable</>)
          break
        default:
          setResult(<>Unable to deploy service</>)
      }
    }
  }, [statusCode])

  return <pre>{result}</pre>
}
