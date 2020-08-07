import { FC, useEffect } from 'react'
import { atom, useSetRecoilState, useRecoilValue } from 'recoil'
import { useMonetizationCounter } from 'react-web-monetization'

export const balanceState = atom({
  key: 'balance',
  default: 0
})

export const balanceIdState = atom({
  key: 'balanceId',
  default: ''
})

interface ReceiptSubmitterProps {
  receiptVerifierUri: string
}

export const ReceiptSubmitter: FC<ReceiptSubmitterProps> = (
  props: ReceiptSubmitterProps
) => {
  const { receipt } = useMonetizationCounter()
  const setBalance = useSetRecoilState(balanceState)
  const balanceId = useRecoilValue(balanceIdState)

  useEffect(() => {
    if (receipt !== null && balanceId !== '') {
      const submitReceipt = async (): Promise<void> => {
        const res = await fetch(
          `${props.receiptVerifierUri}/balances/${balanceId}:creditReceipt`,
          {
            method: 'POST',
            body: receipt
          }
        )
        if (res.ok) {
          setBalance(parseInt(await res.text()))
        }
      }
      void submitReceipt()
    }
  }, [receipt])

  return null
}
