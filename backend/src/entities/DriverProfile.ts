export class DriverProfile {
  constructor(
    public id: string,
    public userId: string,
    public serviceType: 'HOURLY' | 'PART_TIME' | 'FULL_TIME' | 'WEEKLY' | 'MONTHLY',
    public rate: number,
    public experience: number,
    public location: string,
    public bio: string | null,
    public isAvailable: boolean
  ) {}
}