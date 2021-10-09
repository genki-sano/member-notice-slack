import {
  ChatUpdateArguments,
  ChatUpdateResult,
  IChatUpdateGateway,
} from '@/applications/gateways/slack/chat/update'
import {
  ISlackClient,
  WebAPICallHeaders,
} from '@/interfaces/gateways/slack/client'

export class ChatUpdateGateway implements IChatUpdateGateway {
  private readonly client: ISlackClient
  private readonly method: string

  constructor(client: ISlackClient) {
    this.client = client
    this.method = 'chat.update'
  }

  public execute(args: ChatUpdateArguments): ChatUpdateResult {
    const headers: WebAPICallHeaders = {}
    return this.client.apiCall(this.method, headers, args)
  }
}
