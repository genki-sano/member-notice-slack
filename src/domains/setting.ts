export class Setting {
  private readonly _channelId: string
  private readonly _noticeHours: number
  private readonly _noticeMinutes: number
  private readonly _unannouncedDays: number[]
  private _memberId: string
  private _excludeDays: number[]
  private readonly _masterRow: number
  private readonly _noticeRow: number
  private readonly _isLastRow: boolean

  get channelId(): string {
    return this._channelId
  }

  get noticeHours(): number {
    return this._noticeHours
  }

  get noticeMinutes(): number {
    return this._noticeMinutes
  }

  get unannouncedDays(): number[] {
    return this._unannouncedDays
  }

  get memberId(): string {
    return this._memberId
  }

  get excludeDays(): number[] {
    return this._excludeDays
  }

  get masterRow(): number {
    return this._masterRow
  }

  get noticeRow(): number {
    return this._noticeRow
  }

  get isLastRow(): boolean {
    return this._isLastRow
  }

  constructor(
    channelId: string,
    noticeHours: number,
    noticeMinutes: number,
    unannouncedDays: string[],
    memberId: string,
    excludeDays: string[],
    masterRow: number,
    noticeRow: number,
    lastMemberRow: number,
  ) {
    this._channelId = channelId
    this._noticeHours = noticeHours
    this._noticeMinutes = noticeMinutes
    this._unannouncedDays = this.formatDays(unannouncedDays)
    this._memberId = memberId
    this._excludeDays = this.formatDays(excludeDays)
    this._masterRow = masterRow
    this._noticeRow = noticeRow
    this._isLastRow = noticeRow === lastMemberRow
  }

  public setMemberId(memberId: string): this {
    this._memberId = memberId
    return this
  }

  public setExcludeDays(excludeDays: string[]): this {
    this._excludeDays = this.formatDays(excludeDays)
    return this
  }

  private formatDays(strDays: string[]): number[] {
    const days: { [key: string]: number } = {
      月: 1,
      火: 2,
      水: 3,
      木: 4,
      金: 5,
    }
    const tempNumber = 99

    return strDays
      .map((str): number => {
        return days[str] || tempNumber
      })
      .filter((x, i, self) => {
        return x === tempNumber || self.indexOf(x) === i
      })
  }
}
