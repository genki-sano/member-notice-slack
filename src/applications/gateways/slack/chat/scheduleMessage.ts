import {
  WebAPICallOptions,
  WebAPICallResult,
} from '@/interfaces/gateways/slack/client'
import { Block, KnownBlock } from '@/types/slack'

// @see https://api.slack.com/methods/chat.scheduleMessage#args
export type ChatScheduleMessageArguments = WebAPICallOptions & {
  channel: string
  post_at: number
  text: string
  as_user?: boolean
  attachments?: string
  blocks?: (KnownBlock | Block)[]
  link_names?: boolean
  parse?: string
  reply_broadcast?: boolean
  thread_ts?: string
  unfurl_links?: boolean
  unfurl_media?: boolean
}

export type ChatScheduleMessageResult = WebAPICallResult

export interface IChatScheduleMessageGateway {
  execute(args: ChatScheduleMessageArguments): ChatScheduleMessageResult
}
