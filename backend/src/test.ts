import { UserService } from './services/userService';

const service = new UserService();

async function test() {
  try {
    const user = await service.createUser({
      clerkId: 'test123',
      name: 'Abhishek',
      email: 'test@example.com',
      phone: '1234567890'
    });
    console.log(user);
  } catch (err) {
    console.error('Test error:', err);
  }
}

test();
