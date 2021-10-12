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
    return this.makeSetting(values[0])
  }

  public getByChannelId(channelId: string): Setting | undefined {
    const lastRow = this.readClient.getLastRow()
    const values = this.readClient.getValues(`A2:I${lastRow}`)

    const targetValues = values.find(
      (element) => String(element[0]) === channelId,
    )
    return targetValues ? this.makeSetting(targetValues) : undefined
  }

  /**
   * 設定情報のエンティティに変換
   * @param unknown[] values
   * @returns Setting
   */
  private makeSetting(values: unknown[]): Setting {
    const channelId = String(values[0])
    const noticeHours = values[1] ? Number(values[1]) : DEFAULT_NOTICE_HOURS
    const noticeMinutes = values[2] ? Number(values[2]) : DEFAULT_NOTICE_MINUTES
    const unannouncedDays = values[3] ? String(values[3]).split(',') : []
    const memberId = String(values[4])
    const excludeDays = values[5] ? String(values[5]).split(',') : []
    const masterRow = Number(values[6])
    const noticeRow = Number(values[7])
    const lastMemberRow = Number(values[8])

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
