import { Database } from '../config/database.config';
import { ServiceRequest } from '../entities/ServiceRequest';

export class RequestRepository {
  private static db = Database.getInstance();

  static async create(data: {
    customerId: string;
    driverId: string;
    serviceType: string;
    location: string;
    message?: string;
  }): Promise<ServiceRequest> {
    const request = await this.db.serviceRequest.create({ data });
    return new ServiceRequest(
      request.id,
      request.customerId,
      request.driverId,
      request.serviceType,
      request.location,
      request.message,
      request.status as any
    );
  }

  static async findById(id: string): Promise<ServiceRequest | null> {
    const request = await this.db.serviceRequest.findUnique({ where: { id } });
    if (!request) return null;
    return new ServiceRequest(
      request.id,
      request.customerId,
      request.driverId,
      request.serviceType,
      request.location,
      request.message,
      request.status as any
    );
  }

  static async findByCustomer(customerId: string): Promise<any[]> {
    const requests = await this.db.serviceRequest.findMany({
      where: { customerId },
      include: { driver: { include: { driverProfile: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return requests;
  }

  static async findByDriver(driverId: string): Promise<any[]> {
    const requests = await this.db.serviceRequest.findMany({
      where: { driverId },
      include: { customer: true },
      orderBy: { createdAt: 'desc' }
    });
    return requests;
  }

  static async updateStatus(id: string, status: string): Promise<ServiceRequest> {
    const request = await this.db.serviceRequest.update({ where: { id }, data: { status } });
    return new ServiceRequest(
      request.id,
      request.customerId,
      request.driverId,
      request.serviceType,
      request.location,
      request.message,
      request.status as any
    );
  }
}