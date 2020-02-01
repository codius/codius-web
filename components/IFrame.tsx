import { FC, useState, useEffect } from 'react'
const { useMonetizationState } = require('react-web-monetization')

interface IFrameProps {
  dashboardUrl: string
}

const IFrame: FC<IFrameProps> = (props: IFrameProps) => {
  console.log(props)
  const [blobUrl, setBlobUrl] = useState('');
  const { requestId } = useMonetizationState()

  const getUrl = (href: string) => {
    const url = new URL(window.location.href)
    //TODO: check that subdomain is web-{hash}
    if (url.host.startsWith('web-')) {
      url.host = url.host.slice(4)
      return url.href
    } else {
      const dashboardUrl = new URL(props.dashboardUrl)
      if (dashboardUrl.pathname.length === 1) {
        dashboardUrl.pathname = url.pathname
      } else {
        dashboardUrl.pathname += url.pathname
      }
      return dashboardUrl.href
    }
  }

  const getBlob = (url) => {
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${requestId}`
      }
    })
    .then(response => {
      if (response.ok) {
        return response.blob()
      //TODO: also retry on payment required
      } else if (response.status === 503) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(getBlob(url))
          }, 500)
        })
      } else {
        throw new Error()
      }
    })
  }

  useEffect(() => {
    const url = getUrl(window.location.href)
    getBlob(url)
    .then(blob => {
      // also fetch script sources and convert to blob urls?
      // and/or inject monetization meta tag?
      console.log(blob)
      console.log(URL.createObjectURL(blob))
      setBlobUrl(URL.createObjectURL(blob))
    })
  }, [])
  
  if (blobUrl) {
    return <iframe width="100%" height="100%" src={blobUrl}></iframe>
  } else {
    return <p>Verifying <a href='https://webmonetization.org'>Web Monetization</a> payment and loading...</p>
  }
}

export default IFrame
