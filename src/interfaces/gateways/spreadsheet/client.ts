export interface ISpreadsheetClient {
  getLastRow(): number
  getValue(range: string): string | number
  getValues(range: string): (string | number)[][]
  setValue(range: string, value: unknown): void
}
