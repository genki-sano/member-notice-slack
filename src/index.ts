import { doPost } from './infrastructures/route'

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
