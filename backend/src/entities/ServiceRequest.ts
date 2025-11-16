export class ServiceRequest {
  constructor(
    public id: string,
    public customerId: string,
    public driverId: string,
    public serviceType: string,
    public location: string,
    public message: string | null,
    public status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  ) {}

  canBeAccepted(): boolean {
    return this.status === 'PENDING';
  }

  canBeRejected(): boolean {
    return this.status === 'PENDING';
  }
}