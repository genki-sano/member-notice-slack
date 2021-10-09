import { ISpreadsheetClient } from '@/interfaces/gateways/spreadsheet/client'

export class SpreadsheetClient implements ISpreadsheetClient {
  private readonly ss: GoogleAppsScript.Spreadsheet.Spreadsheet
  private readonly sheet: GoogleAppsScript.Spreadsheet.Sheet

  constructor(sheetId: string, sheetName: string) {
    this.ss = SpreadsheetApp.openById(sheetId)

    const sheet = this.ss.getSheetByName(sheetName)
    if (!sheet) {
      throw new Error(`not found sheet (sheet_name: ${sheetName})`)
    }
    this.sheet = sheet
  }

  public getValue(range: string): string {
    const value = this.sheet.getRange(range).getValue()
    return value
  }
}
