import { Database } from '../config/database.config';
import { User } from '../entities/User';

export class UserRepository {
  private static db = Database.getInstance();

  static async create(data: {
    email: string;
    name: string;
    phone?: string;
    password: string;
    type: 'CUSTOMER' | 'DRIVER';
  }): Promise<User> {
    const user = await this.db.user.create({ data });
    return new User(
      user.id,
      user.email, 
      user.email,
      user.name,
      user.phone,
      user.password,
      user.type as any
    );
  }

  static async findById(id: string): Promise<User | null> {
    const user = await this.db.user.findUnique({ where: { id } });
    if (!user) return null;
    return new User(
      user.id,
      user.email,
      user.email,
      user.name,
      user.phone,
      user.password,
      user.type as any
    );
  }

  static async findByEmail(email: string): Promise<User | null> {
    const user = await this.db.user.findUnique({ where: { email } });
    if (!user) return null;
    return new User(
      user.id,
      user.email,
      user.email,
      user.name,
      user.phone,
      user.password,
      user.type as any
    );
  }
}
