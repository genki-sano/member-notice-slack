import { ISettingGateway } from '@/applications/gateways/spreadsheet/setting'
import {
  DEFAULT_NOTICE_HOURS,
  DEFAULT_NOTICE_MINUTES,
} from '@/constants/setting'
import { Setting } from '@/domains/setting'
import { ISpreadsheetClient } from '@/interfaces/gateways/spreadsheet/client'

export class SettingGateway implements ISettingGateway {
  private readonly readClient: ISpreadsheetClient
  private readonly writeClient: ISpreadsheetClient

  constructor(readClient: ISpreadsheetClient, writeClient: ISpreadsheetClient) {
    this.readClient = readClient
    this.writeClient = writeClient
  }

  public getByRow(row: number): Setting {
    const values = this.readClient.getValues(`A${row}:I${row}`)
    const targetValues = values[0]

    const channelId = String(targetValues[0])
    const noticeHours = targetValues[1]
      ? Number(targetValues[1])
      : DEFAULT_NOTICE_HOURS
    const noticeMinutes = targetValues[2]
      ? Number(targetValues[2])
      : DEFAULT_NOTICE_MINUTES
    const unannouncedDays = targetValues[3]
      ? String(targetValues[3]).split(',')
      : []
    const memberId = String(targetValues[4])
    const excludeDays = targetValues[5]
      ? String(targetValues[5]).split(',')
      : []
    const masterRow = Number(targetValues[6])
    const noticeRow = Number(targetValues[7])
    const lastMemberRow = Number(targetValues[8])

    return new Setting(
      channelId,
      noticeHours,
      noticeMinutes,
      unannouncedDays,
      memberId,
      excludeDays,
      masterRow,
      noticeRow,
      lastMemberRow,
    )
  }

  public update(row: number, value: number): void {
    this.writeClient.setValue(`H${row}`, value)
  }
}
