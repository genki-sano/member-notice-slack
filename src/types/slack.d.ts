// ----------------------------------------
// Interactivity & Shortcuts Payloads
// ----------------------------------------

type Payloads = {
  type: string
  token: string
  user: User
  team: Team
}

export type InteractionPayloads =
  | ShortcutsPayloads
  | MessageActionPayloads
  | BlockActionsPayloads
  | ViewSubmissionPayloads
  | ViewClosedPayloads

// NOTE: 公式でも詳しい説明がなかったので、網羅的ではない
// @see https://api.slack.com/reference/interaction-payloads/shortcuts#fields
export type ShortcutsPayloads = Payloads & {
  type: 'shortcut'
  callback_id: string
  trigger_id: string
  action_ts: string
}

// NOTE: 公式でも詳しい説明がなかったので、網羅的ではない
// @see https://api.slack.com/reference/interaction-payloads/shortcuts#message_actions
export type MessageActionPayloads = Payloads & {
  type: 'message_action'
  callback_id: string
  trigger_id: string
  response_url: string
  message: MessageAttachment
  channel: Channel
}

// NOTE: 公式でも詳しい説明がなかったので、網羅的ではない
// @see https://api.slack.com/reference/interaction-payloads/block-actions#fields
export type BlockActionsPayloads = Payloads & {
  type: 'block_actions'
  trigger_id: string
  response_url: string
  message: MessageAttachment
  actions: (KnownAction & {
    block_id: string
    action_ts: string
  })[]
  token: string
  state: {
    values: View[]
  }
  channel: Channel
  container: MessageContainer
}

// NOTE: 公式でも詳しい説明がなかったので、網羅的ではない
// @see https://api.slack.com/reference/interaction-payloads/views#view_submission_fields
export type ViewSubmissionPayloads = Payloads & {
  type: 'view_submission'
  view: View
  hash: string
  response_urls: {
    block_id: string
    action_id: string
    channel_id: string
    response_url: string
  }[]
}

// NOTE: 公式でも詳しい説明がなかったので、網羅的ではない
// @see https://api.slack.com/reference/interaction-payloads/views#view_closed__fields
export type ViewClosedPayloads = Payloads & {
  type: 'view_closed'
  view: View
  is_cleared: boolean
}

type Team = {
  id: string
  domain: string
}

type Channel = {
  id: string
  name: string
}

type User = {
  id: string
  username: string
  name?: string
  team_id: string
}

type Container = MessageContainer | ViewContainer

type MessageContainer = {
  type: 'message'
  message_ts: string
  channel_id: string
  is_ephemeral: boolean
}

type ViewContainer = {
  type: 'view'
  view_id: string
}

// ----------------------------------------
// Block Kit Builder
// ----------------------------------------

/*
 * Block Elements
 */

// @see https://api.slack.com/reference/block-kit/composition-objects#text
type TextElement = PlainTextElement | MrkdwnElement

type PlainTextElement = {
  type: 'plain_text'
  text: string
  emoji?: boolean
}

type MrkdwnElement = {
  type: 'mrkdwn'
  text: string
  verbatim?: boolean
}

// @see https://api.slack.com/reference/block-kit/composition-objects#option
type Option = MrkdwnOption | PlainTextOption

type PlainTextOption = {
  text: PlainTextElement
  value: string
  description?: PlainTextElement
  url?: string
}

type MrkdwnOption = {
  text: MrkdwnElement
  value: string
  description?: PlainTextElement
  url?: string
}

// @see https://api.slack.com/reference/block-kit/composition-objects#option_group
type OptionGroup = {
  label: PlainTextElement
  options: Option[]
}

/*
 * Action Types
 */

type KnownAction = Button | Select

type Action = {
  type: string
  action_id: string
}

// @see https://api.slack.com/reference/block-kit/block-elements#button
type Button = Action & {
  type: 'button'
  text: PlainTextElement
  url?: string
  value?: string
  style?: 'primary' | 'danger'
  confirm?: Confirm
}

// @see https://api.slack.com/reference/block-kit/block-elements#select
type Select = StaticSelect

type StaticSelect = Action & {
  type: 'static_select'
  placeholder: PlainTextElement
  options: PlainTextOption[]
  option_groups?: {
    label: PlainTextElement
    options: PlainTextOption[]
  }[]
  initial_option?: PlainTextOption
  confirm?: Confirm
}

// @see https://api.slack.com/reference/block-kit/composition-objects#confirm
type Confirm = {
  title?: PlainTextElement
  text: TextElement
  confirm?: PlainTextElement
  deny?: PlainTextElement
  style?: 'primary' | 'danger'
}

/*
 * Block Types
 */

export type KnownBlock =
  | ActionsBlock
  | DividerBlock
  | SectionBlock
  | HeaderBlock

type Block = {
  type: string
  block_id?: string
}

type ActionsBlock = Block & {
  type: 'actions'
  elements: KnownAction[]
}

type DividerBlock = Block & {
  type: 'divider'
}

type SectionBlock = Block & {
  type: 'section'
  text?: TextElement
  fields?: TextElement[]
  accessory?: KnownAction
}

type HeaderBlock = Block & {
  type: 'header'
  text: PlainTextElement
}

type MessageAttachment = {
  blocks?: (KnownBlock | Block)[]
  fallback?: string
  color?: 'good' | 'warning' | 'danger' | string
  pretext?: string
  author_name?: string
  author_link?: string
  author_icon?: string
  title?: string
  title_link?: string
  text?: string
  fields?: {
    title: string
    value: string
    short?: boolean
  }[]
  image_url?: string
  thumb_url?: string
  footer?: string
  footer_icon?: string
  ts?: string
  actions?: AttachmentAction[]
  callback_id?: string
  mrkdwn_in?: ('pretext' | 'text' | 'fields')[]
}

type AttachmentAction = {
  id?: string
  confirm?: Confirmation
  data_source?: 'static' | 'channels' | 'conversations' | 'users' | 'external'
  min_query_length?: number
  name?: string
  options?: OptionField[]
  option_groups?: {
    text: string
    options: OptionField[]
  }[]
  selected_options?: OptionField[]
  style?: 'default' | 'primary' | 'danger'
  text: string
  type: 'button' | 'select'
  value?: string
  url?: string
}

type OptionField = {
  description?: string
  text: string
  value: string
}

type Confirmation = {
  dismiss_text?: string
  ok_text?: string
  text: string
  title?: string
}

type View = HomeView | ModalView | WorkflowStepView

type HomeView = {
  type: 'home'
  blocks: (KnownBlock | Block)[]
  private_metadata?: string
  callback_id?: string
  external_id?: string
}

type ModalView = {
  type: 'modal'
  title: PlainTextElement
  blocks: (KnownBlock | Block)[]
  close?: PlainTextElement
  submit?: PlainTextElement
  private_metadata?: string
  callback_id?: string
  clear_on_close?: boolean // defaults to false
  notify_on_close?: boolean // defaults to false
  external_id?: string
}

type WorkflowStepView = {
  type: 'workflow_step'
  blocks: (KnownBlock | Block)[]
  private_metadata?: string
  callback_id?: string
  submit_disabled?: boolean // defaults to false
}
