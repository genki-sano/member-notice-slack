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
    const values = this.readClient.getValues(`A${row}:H${row}`)

    const channelId = String(values[0][0])
    const noticeHours = values[0][1]
      ? Number(values[0][1])
      : DEFAULT_NOTICE_HOURS
    const noticeMinutes = values[0][2]
      ? Number(values[0][2])
      : DEFAULT_NOTICE_MINUTES
    const unannouncedDays = values[0][3] ? String(values[0][3]).split(',') : []
    const memberId = String(values[0][4])
    const excludeDays = values[0][5] ? String(values[0][5]).split(',') : []
    const masterRow = Number(values[0][6])
    const noticeRow = Number(values[0][7])
    const lastMemberRow = Number(values[0][8])

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
