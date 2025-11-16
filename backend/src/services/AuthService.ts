import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/UserRepository';
import { DriverRepository } from '../repositories/DriverRepository';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export class AuthService {
  static async login(email: string, password: string): Promise<any> {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid password');

    const token = jwt.sign({ id: user.id, type: user.type }, JWT_SECRET, { expiresIn: '1d' });

    const profile: any = { user, token };

    if (user.isDriver()) {
      profile.driverProfile = await DriverRepository.findByUserId(user.id);
    }

    return profile;
  }

  static async signup(data: {
    email: string;
    name: string;
    phone?: string;
    password: string;
    type: 'CUSTOMER' | 'DRIVER';
  }): Promise<any> {
    const existing = await UserRepository.findByEmail(data.email);
    if (existing) throw new Error('User already exists');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await UserRepository.create({ ...data, password: hashedPassword });

    const token = jwt.sign({ id: user.id, type: user.type }, JWT_SECRET, { expiresIn: '1d' });

    return { user, token };
  }
}
