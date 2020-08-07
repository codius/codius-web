import { FC } from 'react'
import { atom, useRecoilState } from 'recoil'

export const nameState = atom({
  key: 'name',
  default: ''
})

export const NameField: FC = () => {
  const [name, setName] = useRecoilState(nameState)

  const onChange = (e): void => setName(e.target.value)

  return (
    <pre>
      Name:{' '}
      <input
        type='text'
        value={name}
        autoFocus
        autoComplete='off'
        onChange={onChange}
      />
    </pre>
  )
}
