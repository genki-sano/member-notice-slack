import { Config } from '@/infrastructures/config'
import { SlackClient } from '@/infrastructures/slack/client'
import { SpreadsheetClient } from '@/infrastructures/spreadsheet/client'
import { InteractionPayloads } from '@/types/slack'

/**
 * Slack からの POST リクエストをハンドリングする関数
 *
 * @param GoogleAppsScript.Events.DoPost e
 * @returns GoogleAppsScript.Content.TextOutput
 */
export const doPost = (
  e: GoogleAppsScript.Events.DoPost,
): GoogleAppsScript.Content.TextOutput => {
  if (typeof e.postData === 'undefined') {
    throw new Error('invalid request')
  }

  // GASに設定した各種設定を取っておく
  const config = new Config()
  // Slack API への接続設定
  const slackClient = new SlackClient(
    config.slackBotToken,
    config.slackUserToken,
  )
  // Spreadsheet API への接続設定
  const spreadsheetClient = new SpreadsheetClient(
    config.spreadsheetId,
    config.spreadsheetSheetName,
  )

  if (e.postData.type === 'application/json') {
    // Events API (イベント API / URL 検証リクエスト)
    return executeEventApi(e, config)
  }

  if (e.postData.type === 'application/x-www-form-urlencoded') {
    if (typeof e.parameters.payload !== 'undefined') {
      // Interactivity & Shortcuts (ボタン操作やモーダル送信、ショートカットなど)
      return executeInteractivityAndShortcuts(
        e,
        config,
        slackClient,
        spreadsheetClient,
      )
    }

    if (typeof e.parameters.command !== 'undefined') {
      // Slash Commands (スラッシュコマンドの実行)
      return executeSlashCommands(e, config)
    }
  }

  // 200 OK を返すことでペイロードを受信したことを Slack に対して伝える
  return ContentService.createTextOutput('')
}

/**
 * Events API (イベント API / URL 検証リクエスト)
 *
 * @param GoogleAppsScript.Events.DoPost e
 * @param Config config
 * @returns GoogleAppsScript.Content.TextOutput
 *
 * @see https://api.slack.com/apis/connections/events-api
 */
const executeEventApi = (
  e: GoogleAppsScript.Events.DoPost,
  config: Config,
): GoogleAppsScript.Content.TextOutput => {
  const payload = JSON.parse(e.postData.contents)
  // Verification Token の検証
  if (payload.token !== config.legacyVerificationToken) {
    throw new Error(
      `Invalid verification token detected (actual: ${payload.token}, expected: ${config.legacyVerificationToken})`,
    )
  }

  // Events API を有効にしたときの URL 検証リクエストへの応答
  if (typeof payload.challenge !== 'undefined') {
    return ContentService.createTextOutput(payload.challenge)
  }

  return ContentService.createTextOutput('')
}

/**
 * Interactivity & Shortcuts (ボタン操作やモーダル送信、ショートカットなど)
 *
 * @param GoogleAppsScript.Events.DoPost e
 * @param Config config
 * @param SlackClient slackClient
 * @param SpreadsheetClient spreadsheetClient
 * @returns GoogleAppsScript.Content.TextOutput
 *
 * @see https://api.slack.com/reference/interaction-payloads
 */
const executeInteractivityAndShortcuts = (
  e: GoogleAppsScript.Events.DoPost,
  config: Config,
  slackClient: SlackClient,
  spreadsheetClient: SpreadsheetClient,
): GoogleAppsScript.Content.TextOutput => {
  const payload = JSON.parse(e.parameters.payload[0]) as InteractionPayloads
  // Verification Token の検証
  if (payload.token !== config.legacyVerificationToken) {
    throw new Error(
      `Invalid verification token detected (actual: ${payload.token}, expected: ${config.legacyVerificationToken})`,
    )
  }

  // グローバルショートカット
  if (payload.type === 'shortcut') {
    return ContentService.createTextOutput('')
  }

  // メッセージショートカット
  if (payload.type === 'message_action') {
    return ContentService.createTextOutput('')
  }

  // Block Kit (message 内の blocks) 内の
  // ボタンクリック・セレクトメニューのアイテム選択イベント
  if (payload.type === 'block_actions') {
    // TODO: action毎に分岐を作成
    if (payload.actions[0].action_id === 'action_id') {
      console.log(slackClient)
      console.log(spreadsheetClient)
      return ContentService.createTextOutput('')
    }

    return ContentService.createTextOutput('')
  }

  // モーダルの submit ボタンのクリックイベント
  if (payload.type === 'view_submission') {
    return ContentService.createTextOutput('')
  }

  // モーダルの cancel ボタンのクリックイベント
  if (payload.type === 'view_closed') {
    return ContentService.createTextOutput('')
  }

  return ContentService.createTextOutput('')
}

/**
 * Slash Commands (スラッシュコマンドの実行)
 *
 * @param GoogleAppsScript.Events.DoPost e
 * @param Config config
 * @returns GoogleAppsScript.Content.TextOutput
 *
 * @see https://api.slack.com/interactivity/slash-commands
 */
const executeSlashCommands = (
  e: GoogleAppsScript.Events.DoPost,
  config: Config,
): GoogleAppsScript.Content.TextOutput => {
  const payload = e.parameter
  if (payload.token !== config.legacyVerificationToken) {
    // Verification Token の検証
    throw new Error(
      `Invalid verification token detected (actual: ${payload.token}, expected: ${config.legacyVerificationToken})`,
    )
  }

  // TODO: スラッシュコマンドを追加する場合はここに実装
  if (payload.command === '/hoge') {
    return ContentService.createTextOutput('')
  }

  return ContentService.createTextOutput('')
}

// NOTE: リクエストの中身を検証するのに使用
// const testShowRequest = (token: string, channelId: string, payload: any) => {
//   const response = UrlFetchApp.fetch(
//     'https://www.slack.com/api/chat.postMessage',
//     {
//       method: 'post',
//       contentType: 'application/x-www-form-urlencoded',
//       headers: { Authorization: `Bearer ${token}` },
//       payload: {
//         channel: channelId,
//         text: JSON.stringify(payload),
//       },
//     },
//   )
//   return response
// }
