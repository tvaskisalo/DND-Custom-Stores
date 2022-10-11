export type SubmitEvent = (e:React.SyntheticEvent) => Promise<void>
export type Field = {
  name: string
  type: string
  value: string | undefined,
  onChange: (e: unknown) => void
}