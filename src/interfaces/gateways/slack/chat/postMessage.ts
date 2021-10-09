import {
  ChatPostMessageArguments,
  ChatPostMessageResult,
  IChatPostMessageGateway,
} from '@/applications/gateways/slack/chat/postMessage'
import {
  ISlackClient,
  WebAPICallHeaders,
} from '@/interfaces/gateways/slack/client'

export class ChatPostMessageGateway implements IChatPostMessageGateway {
  private readonly client: ISlackClient
  private readonly method: string

  constructor(client: ISlackClient) {
    this.client = client
    this.method = 'chat.postMessage'
  }

  public execute(args: ChatPostMessageArguments): ChatPostMessageResult {
    const headers: WebAPICallHeaders = {}
    return this.client.apiCall(this.method, headers, args)
  }
}
