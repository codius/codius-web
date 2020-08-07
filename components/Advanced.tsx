import { FC, useState } from 'react'

interface AdvancedProps {
  dummy?: boolean
}

export const Advanced: FC<AdvancedProps> = (
  props: React.PropsWithChildren<AdvancedProps>
) => {
  const [showAdvanced, setShowAdvanced] = useState(false)

  return (
    <div>
      <pre
        onClick={(): void => setShowAdvanced(!showAdvanced)}
        style={{ cursor: 'pointer' }}
      >
        [{showAdvanced ? '-' : '+'}] Advanced
      </pre>
      {showAdvanced ? <div>{props.children}</div> : <p></p>}
    </div>
  )
}
