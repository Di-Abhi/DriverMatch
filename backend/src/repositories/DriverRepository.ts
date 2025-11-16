import { Database } from '../config/database.config';
import { DriverProfile } from '../entities/DriverProfile';

export class DriverRepository {
  private static db = Database.getInstance();

  static async create(data: {
    userId: string;
    serviceType: string;
    rate: number;
    experience: number;
    location: string;
    bio?: string;
  }): Promise<DriverProfile> {
    const driver = await this.db.driverProfile.create({ data });
    return new DriverProfile(
      driver.id,
      driver.userId,
      driver.serviceType as any,
      driver.rate,
      driver.experience,
      driver.location,
      driver.bio,
      driver.isAvailable
    );
  }

  static async findByUserId(userId: string): Promise<DriverProfile | null> {
    const driver = await this.db.driverProfile.findUnique({ where: { userId } });
    if (!driver) return null;
    return new DriverProfile(
      driver.id,
      driver.userId,
      driver.serviceType as any,
      driver.rate,
      driver.experience,
      driver.location,
      driver.bio,
      driver.isAvailable
    );
  }

  static async search(filters: {
    serviceType?: string;
    location?: string;
    maxRate?: number;
    minExperience?: number;
  }): Promise<any[]> {
    const where: any = { isAvailable: true };
    
    if (filters.serviceType) where.serviceType = filters.serviceType;
    if (filters.location) where.location = { contains: filters.location };
    if (filters.maxRate) where.rate = { lte: filters.maxRate };
    if (filters.minExperience) where.experience = { gte: filters.minExperience };

    const drivers = await this.db.driverProfile.findMany({ 
      where,
      include: { user: true }
    });

    return drivers.map(d => ({
      id: d.id,
      userId: d.userId,
      name: d.user.name,
      phone: d.user.phone,
      email: d.user.email,
      serviceType: d.serviceType,
      rate: d.rate,
      experience: d.experience,
      location: d.location,
      bio: d.bio
    }));
  }

  static async update(userId: string, data: any): Promise<DriverProfile> {
    const driver = await this.db.driverProfile.update({ where: { userId }, data });
    return new DriverProfile(
      driver.id,
      driver.userId,
      driver.serviceType as any,
      driver.rate,
      driver.experience,
      driver.location,
      driver.bio,
      driver.isAvailable
    );
  }
}