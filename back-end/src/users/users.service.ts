import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities/user.entitiy';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    public UserRepository: Repository<User>,
  ) {}
  async find(username: string): Promise<any | undefined> {
    return this.users[0];
  }
}
