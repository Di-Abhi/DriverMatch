import { RequestRepository } from '../repositories/RequestRepository';
import { DriverRepository } from '../repositories/DriverRepository';
import { ServiceRequest } from '../entities/ServiceRequest';

export class RequestService {
  static async createRequest(data: {
    customerId: string;
    driverId: string;
    serviceType: string;
    location: string;
    message?: string;
  }): Promise<ServiceRequest> {
    const driver = await DriverRepository.findByUserId(data.driverId);
    if (!driver || !driver.isAvailable) {
      throw new Error('Driver is not available');
    }
    return RequestRepository.create(data);
  }

  static async acceptRequest(requestId: string, driverId: string): Promise<ServiceRequest> {
    const request = await RequestRepository.findById(requestId);
    if (!request) throw new Error('Request not found');
    if (request.driverId !== driverId) throw new Error('Unauthorized');
    if (!request.canBeAccepted()) throw new Error('Request cannot be accepted');

    return RequestRepository.updateStatus(requestId, 'ACCEPTED');
  }

  static async rejectRequest(requestId: string, driverId: string): Promise<ServiceRequest> {
    const request = await RequestRepository.findById(requestId);
    if (!request) throw new Error('Request not found');
    if (request.driverId !== driverId) throw new Error('Unauthorized');
    if (!request.canBeRejected()) throw new Error('Request cannot be rejected');

    return RequestRepository.updateStatus(requestId, 'REJECTED');
  }

  static async getCustomerRequests(customerId: string): Promise<any[]> {
    return RequestRepository.findByCustomer(customerId);
  }

  static async getDriverRequests(driverId: string): Promise<any[]> {
    return RequestRepository.findByDriver(driverId);
  }
}