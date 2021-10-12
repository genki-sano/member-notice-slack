import { IChatPostMessageGateway } from '@/applications/gateways/slack/chat/postMessage'
import { IChatUpdateGateway } from '@/applications/gateways/slack/chat/update'
import { ISettingGateway } from '@/applications/gateways/spreadsheet/setting'
import { ACTION_NOTICE_NEXT_MEMBER } from '@/constants/action'
import { Setting } from '@/domains/setting'
import { MessageAttachment } from '@/types/slack'

export class NoticeNextMemberUseCase {
  private readonly chatPostMessageRepos: IChatPostMessageGateway
  private readonly chatUpdateGateway: IChatUpdateGateway
  private readonly settingRepos: ISettingGateway

  constructor(
    chatScheduleMessageRepos: IChatPostMessageGateway,
    chatUpdateGateway: IChatUpdateGateway,
    settingRepos: ISettingGateway,
  ) {
    this.chatPostMessageRepos = chatScheduleMessageRepos
    this.chatUpdateGateway = chatUpdateGateway
    this.settingRepos = settingRepos
  }

  public execute(
    channelId: string,
    userId: string,
    messageAtt: MessageAttachment,
  ): void {
    // 設定情報を取得
    const setting = this.settingRepos.getByChannelId(channelId)
    if (!setting) {
      return
    }

    // 非通知設定の確認
    const weekInt = new Date().getDay()
    if (setting.unannouncedDays.includes(weekInt)) {
      return
    }

    // 設定に応じて送信予約をセットして、シートを更新する
    this.postMessage(channelId, userId, messageAtt, setting, weekInt)
  }

  /**
   * 通知を送信
   * @param channelId
   * @param userId
   * @param messageAtt
   * @param setting
   * @param weekInt
   */
  private postMessage(
    channelId: string,
    userId: string,
    messageAtt: MessageAttachment,
    setting: Setting,
    weekInt: number,
  ): void {
    if (!messageAtt.ts || !messageAtt.blocks) {
      return
    }

    // 除外設定の確認
    if (setting.excludeDays.includes(weekInt)) {
      // 設定を次の人に更新
      this.setNextMember(setting)
      // 設定後の値を取得
      const updatedSetting = this.settingRepos.getByChannelId(channelId)
      if (!updatedSetting) {
        return
      }
      // 次の人に通知
      this.postMessage(channelId, userId, messageAtt, updatedSetting, weekInt)
      return
    }

    // 通知のスケジュールをセット
    this.chatPostMessageRepos.execute({
      channel: setting.channelId,
      text: '本日の朝会のファシリテーションをお願いします！',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `<@${setting.memberId}>\n本日の朝会のファシリテーションをお願いします！ :sunny:`,
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              style: 'danger',
              action_id: ACTION_NOTICE_NEXT_MEMBER,
              text: {
                type: 'plain_text',
                text: '休みです',
              },
              value: '休みです',
              confirm: {
                title: {
                  type: 'plain_text',
                  text: 'どうやら休みのようだ',
                },
                text: {
                  type: 'mrkdwn',
                  text: 'スキップして次の方へ通知しますがよろしいでしょうか？ :thinking_face:',
                },
                confirm: {
                  type: 'plain_text',
                  text: 'はい',
                },
                deny: {
                  type: 'plain_text',
                  text: 'キャンセル',
                },
              },
            },
          ],
        },
      ],
    })

    // クリックしたメッセージの修正
    this.chatUpdateGateway.execute({
      channel: setting.channelId,
      ts: messageAtt.ts,
      text: messageAtt.text,
      blocks: [
        messageAtt.blocks[0],
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `<@${userId}>さんが休みですをクリックしました`,
          },
        },
      ],
    })

    // 次の人になるよう設定を変更
    this.setNextMember(setting)
  }

  /**
   * シートに次の人をセット
   * @param setting
   */
  private setNextMember(setting: Setting): void {
    const nextNoticeRow = setting.isLastRow ? 2 : setting.noticeRow + 1
    this.settingRepos.update(setting.masterRow, nextNoticeRow)
  }
}
