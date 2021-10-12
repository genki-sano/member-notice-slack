import { Setting } from '@/domains/setting'

export interface ISettingGateway {
  getByRow(row: number): Setting
  getByChannelId(channelId: string): Setting | undefined
  update(row: number, value: number): void
}
