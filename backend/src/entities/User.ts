export class User {
  constructor(
    public id: string,
    public clerkId: string,
    public email: string,
    public name: string,
    public phone: string | null,
    public password:string,
    public type: 'CUSTOMER' | 'DRIVER'
  ) {}

  isDriver(): boolean {
    return this.type === 'DRIVER';
  }

  isCustomer(): boolean {
    return this.type === 'CUSTOMER';
  }
}