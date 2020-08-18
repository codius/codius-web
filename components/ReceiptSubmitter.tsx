import { FC, useEffect } from 'react'
import { useMonetizationCounter } from 'react-web-monetization'

interface ReceiptSubmitterProps {
  balanceId: string
  receiptVerifierUri: string
  requestPrice: number
}

export const ReceiptSubmitter: FC<ReceiptSubmitterProps> = (
  props: ReceiptSubmitterProps
) => {
  const { receipt } = useMonetizationCounter()

  useEffect(() => {
    if (receipt !== null && props.balanceId !== '') {
      const submitReceipt = async (): Promise<void> => {
        const res = await fetch(
          `${props.receiptVerifierUri}/balances/${props.balanceId}:creditReceipt`,
          {
            method: 'POST',
            body: receipt
          }
        )
        if (res.ok && parseInt(await res.text()) >= props.requestPrice) {
          window.location.reload(true)
        }
      }
      void submitReceipt()
    }
  }, [receipt])

  return null
}
