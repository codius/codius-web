import { FC } from 'react'
import NextHead from 'next/head'

interface HeadProps {
  paymentPointer: string
}

export const Head: FC<HeadProps> = (props: HeadProps) => {
  return (
    <NextHead>
      <title>Codius Host</title>
      <meta charSet='utf-8' />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      <meta name='monetization' content={props.paymentPointer} />
    </NextHead>
  )
}
