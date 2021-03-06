import { IChatScheduleMessageGateway } from '@/applications/gateways/slack/chat/scheduleMessage'
import { ISettingGateway } from '@/applications/gateways/spreadsheet/setting'
import { ACTION_NOTICE_NEXT_MEMBER } from '@/constants/action'
import { Setting } from '@/domains/setting'

export class NoticeScheduleUseCase {
  private readonly chatScheduleMessageRepos: IChatScheduleMessageGateway
  private readonly settingRepos: ISettingGateway

  constructor(
    chatScheduleMessageRepos: IChatScheduleMessageGateway,
    settingRepos: ISettingGateway,
  ) {
    this.chatScheduleMessageRepos = chatScheduleMessageRepos
    this.settingRepos = settingRepos
  }

  public execute(row: number): void {
    // 設定情報を取得
    const setting = this.settingRepos.getByRow(row)

    // 非通知設定の確認
    const weekInt = new Date().getDay()
    if (setting.unannouncedDays.includes(weekInt)) {
      return
    }

    // 設定に応じて送信予約をセットして、シートを更新する
    this.scheduleMessage(row, setting, weekInt)
  }

  /**
   * 通知の予約送信をセット
   * @param setting
   * @param row
   * @param weekInt
   */
  private scheduleMessage(
    row: number,
    setting: Setting,
    weekInt: number,
  ): void {
    // 除外設定の確認
    if (setting.excludeDays.includes(weekInt)) {
      // 設定を次の人に更新
      this.setNextMember(setting)
      // 設定後の値を取得
      const updatedSetting = this.settingRepos.getByRow(row)
      // 次の人に通知
      this.scheduleMessage(row, updatedSetting, weekInt)
      return
    }

    // 通知のスケジュールをセット
    this.chatScheduleMessageRepos.execute({
      channel: setting.channelId,
      post_at: this.createPostTs(setting.noticeHours, setting.noticeMinutes),
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

  /**
   * 予約送信したい時間のUNIXタイムスタンプを作成
   * @param h
   * @param m
   * @returns
   */
  private createPostTs(h: number, m: number) {
    const today = new Date()
    today.setHours(h)
    today.setMinutes(m)
    today.setMilliseconds(0)

    return Math.floor(today.getTime() / 1000)
  }
}
