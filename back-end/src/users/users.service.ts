import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities/user.entitiy';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    public userRepository: Repository<User>,
  ) {}
  async findByEmail(email: string): Promise<any | undefined> {
    return this.userRepository.findOne({where:{email}})
  }
}
