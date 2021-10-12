import {
  WebAPICallOptions,
  WebAPICallResult,
} from '@/interfaces/gateways/slack/client'
import { Block, KnownBlock } from '@/types/slack'

// @see https://api.slack.com/methods/chat.update#args
export type ChatUpdateArguments = WebAPICallOptions & {
  channel: string
  ts: string
  as_user?: boolean
  attachments?: string
  blocks?: (KnownBlock | Block)[]
  file_ids?: string[]
  link_names?: boolean
  parse?: string
  reply_broadcast?: boolean
  text?: string
}

export type ChatUpdateResult = WebAPICallResult

export interface IChatUpdateGateway {
  execute(args: ChatUpdateArguments): ChatUpdateResult
}
