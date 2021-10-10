import { Setting } from '@/domains/setting'

export interface ISettingGateway {
  getByRow(row: number): Setting
  update(row: number, value: number): void
}
