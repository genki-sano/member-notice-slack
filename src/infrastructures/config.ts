export class Config {
  readonly legacyVerificationToken: string
  readonly slackUserToken: string
  readonly slackBotToken: string
  readonly spreadsheetId: string
  readonly spreadsheetSheetName: string

  constructor() {
    this.legacyVerificationToken = this.getProperty('SLACK_VERIFICATION_TOKEN')
    this.slackUserToken = this.getProperty('SLACK_USER_TOKEN')
    this.slackBotToken = this.getProperty('SLACK_BOT_TOKEN')
    this.spreadsheetId = this.getProperty('SPREADSHEET_ID')
    this.spreadsheetSheetName = this.getProperty('SPREADSHEET_SHEET_NAME')
  }

  private getProperty(key: string): string {
    const prop = PropertiesService.getScriptProperties().getProperty(key)
    if (!prop) {
      throw new Error(`not found property (key: ${key})`)
    }
    return prop
  }
}
