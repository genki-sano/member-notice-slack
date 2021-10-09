import {
  ChatScheduleMessageArguments,
  ChatScheduleMessageResult,
  IChatScheduleMessageGateway,
} from '@/applications/gateways/slack/chat/scheduleMessage'
import {
  ISlackClient,
  WebAPICallHeaders,
} from '@/interfaces/gateways/slack/client'

export class ChatScheduleMessageGateway implements IChatScheduleMessageGateway {
  private readonly client: ISlackClient
  private readonly method: string

  constructor(client: ISlackClient) {
    this.client = client
    this.method = 'chat.scheduleMessage'
  }

  public execute(
    args: ChatScheduleMessageArguments,
  ): ChatScheduleMessageResult {
    const headers: WebAPICallHeaders = {}
    return this.client.apiCall(this.method, headers, args)
  }
}
