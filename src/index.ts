import { doPost, schedule } from '@/infrastructures/route'

declare const global: {
  [x: string]: unknown
}

global.doGet = (
  e: GoogleAppsScript.Events.DoGet,
): GoogleAppsScript.HTML.HtmlOutput => {
  console.log('GAS got a get request!')

  const params = JSON.stringify(e)
  return HtmlService.createHtmlOutput(params)
}

global.doPost = (
  e: GoogleAppsScript.Events.DoPost,
): GoogleAppsScript.Content.TextOutput => {
  return doPost(e)
}

global.schedule = (): GoogleAppsScript.Content.TextOutput => {
  return schedule()
}

// NOTE: 誤って作成されたスケジュールを消すのに使用
// global.resetSchedule = (): GoogleAppsScript.Content.TextOutput => {
//   const token =
//     PropertiesService.getScriptProperties().getProperty('SLACK_BOT_TOKEN')
//   const response = UrlFetchApp.fetch(
//     'https://www.slack.com/api/chat.scheduledMessages.list',
//     {
//       method: 'post',
//       contentType: 'application/x-www-form-urlencoded',
//       headers: { Authorization: `Bearer ${token}` },
//       payload: {},
//     },
//   )
//   const resp = JSON.parse(response.getContentText())

//   resp.scheduled_messages.forEach(
//     (item: { id: string; channel_id: string }) => {
//       UrlFetchApp.fetch(
//         'https://www.slack.com/api/chat.deleteScheduledMessage',
//         {
//           method: 'post',
//           contentType: 'application/x-www-form-urlencoded',
//           headers: { Authorization: `Bearer ${token}` },
//           payload: {
//             channel: item.channel_id,
//             scheduled_message_id: item.id,
//           },
//         },
//       )
//     },
//   )

//   const check = UrlFetchApp.fetch(
//     'https://www.slack.com/api/chat.scheduledMessages.list',
//     {
//       method: 'post',
//       contentType: 'application/x-www-form-urlencoded',
//       headers: { Authorization: `Bearer ${token}` },
//       payload: {},
//     },
//   )
//   Logger.log(JSON.parse(check.getContentText()))

//   return ContentService.createTextOutput('')
// }
