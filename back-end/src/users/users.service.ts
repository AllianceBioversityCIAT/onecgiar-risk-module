import { Injectable } from '@nestjs/common';
import { User } from 'entities/user.entitiy';

@Injectable()
export class UsersService {
  private readonly users = [
    {
      id: 1,
      email: 'admin@codeobia.com',
      password: 'admin',
    },
  ];
  async findFakeOne(username: string): Promise<any | undefined> {
    return this.users[0];
  }
}
