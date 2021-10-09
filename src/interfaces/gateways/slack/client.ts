export type WebAPICallOptions = {
  [argument: string]: unknown
}

export type WebAPICallHeaders = {
  'X-Slack-User'?: string
}

export type WebAPICallResult = {
  ok: boolean
  error?: string
  response_metadata?: {
    warnings?: string[]
    next_cursor?: string
    scopes?: string[]
    acceptedScopes?: string[]
    retryAfter?: number
    messages?: string[]
  }
}

export interface ISlackClient {
  apiCall(
    method: string,
    headers: WebAPICallHeaders,
    options: WebAPICallOptions,
    isUserToken?: boolean,
  ): WebAPICallResult
}
