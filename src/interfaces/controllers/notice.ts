import { NoticeScheduleUseCase } from '@/applications/usecases/notice/schedule'
import { ISlackClient } from '@/interfaces/gateways/slack/client'
import { ISpreadsheetClient } from '@/interfaces/gateways/spreadsheet/client'
import { ChatScheduleMessageGateway } from '../gateways/slack/chat/scheduleMessage'
import { SettingGateway } from '../gateways/spreadsheet/setting'

export class NoticeController {
  private readonly slackClient: ISlackClient
  private readonly ssReadClient: ISpreadsheetClient
  private readonly ssWriteClient: ISpreadsheetClient

  constructor(
    slackClient: ISlackClient,
    ssReadClient: ISpreadsheetClient,
    ssWriteClient: ISpreadsheetClient,
  ) {
    this.slackClient = slackClient
    this.ssReadClient = ssReadClient
    this.ssWriteClient = ssWriteClient
  }

  public schedule(row: number): void {
    const usecase = new NoticeScheduleUseCase(
      new ChatScheduleMessageGateway(this.slackClient),
      new SettingGateway(this.ssReadClient, this.ssWriteClient),
    )
    usecase.execute(row)
  }
}
