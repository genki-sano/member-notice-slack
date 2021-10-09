export interface ISpreadsheetClient {
  getValue(range: string, sheetName: string): string
}
