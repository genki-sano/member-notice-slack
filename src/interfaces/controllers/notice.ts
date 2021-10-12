import { NoticeNextMemberUseCase } from '@/applications/usecases/notice/nextMember'
import { NoticeScheduleUseCase } from '@/applications/usecases/notice/schedule'
import { ISlackClient } from '@/interfaces/gateways/slack/client'
import { ChatPostMessageGateway } from '@/interfaces/gateways/slack/chat/postMessage'
import { ChatScheduleMessageGateway } from '@/interfaces/gateways/slack/chat/scheduleMessage'
import { ChatUpdateGateway } from '@/interfaces/gateways/slack/chat/update'
import { ISpreadsheetClient } from '@/interfaces/gateways/spreadsheet/client'
import { SettingGateway } from '@/interfaces/gateways/spreadsheet/setting'
import { BlockActionsPayloads } from '@/types/slack'

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

  public nextMember(payload: BlockActionsPayloads): void {
    const usecase = new NoticeNextMemberUseCase(
      new ChatPostMessageGateway(this.slackClient),
      new ChatUpdateGateway(this.slackClient),
      new SettingGateway(this.ssReadClient, this.ssWriteClient),
    )
    usecase.execute(payload.channel.id, payload.user.id, payload.message)
  }
}
