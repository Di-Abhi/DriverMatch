import { DriverRepository } from '../repositories/DriverRepository';
import { DriverProfile } from '../entities/DriverProfile';

export class DriverService {
  static async createProfile(userId: string, data: {
    serviceType: 'HOURLY' | 'PART_TIME' | 'FULL_TIME' | 'WEEKLY' | 'MONTHLY';
    rate: number;
    experience: number;
    location: string;
    bio?: string;
  }): Promise<DriverProfile> {
    const existing = await DriverRepository.findByUserId(userId);
    if (existing) throw new Error('Driver profile already exists');
    if (data.rate <= 0) throw new Error('Rate must be greater than 0');

    return DriverRepository.create({ userId, ...data });
  }

  static async updateProfile(userId: string, data: any): Promise<DriverProfile> {
    const existing = await DriverRepository.findByUserId(userId);
    if (!existing) throw new Error('Driver profile not found');
    if (data.rate && data.rate <= 0) throw new Error('Rate must be greater than 0');

    return DriverRepository.update(userId, data);
  }

  static async searchDrivers(filters: any): Promise<any[]> {
    return DriverRepository.search(filters);
  }


  static async toggleAvailability(userId: string, isAvailable: boolean): Promise<DriverProfile> {
    return DriverRepository.update(userId, { isAvailable });
  }
}