import {
  WebAPICallOptions,
  WebAPICallResult,
} from '@/interfaces/gateways/slack/client'
import { Block, KnownBlock } from '@/types/slack'

// @see https://api.slack.com/methods/chat.postMessage#args
export type ChatPostMessageArguments = WebAPICallOptions & {
  channel: string
  as_user?: boolean
  attachments?: string
  blocks?: (KnownBlock | Block)[]
  container_id?: string
  file_annotation?: string
  icon_emoji?: string
  icon_url?: string
  link_names?: boolean
  mrkdwn?: boolean
  parse?: string
  reply_broadcast?: boolean
  text?: string
  thread_ts?: string
  unfurl_links?: boolean
  unfurl_media?: boolean
  username?: string
}

export type ChatPostMessageResult = WebAPICallResult

export interface IChatPostMessageGateway {
  execute(args: ChatPostMessageArguments): ChatPostMessageResult
}
