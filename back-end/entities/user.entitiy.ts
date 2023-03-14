import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column()
  firstName: string;
  @ApiProperty()
  @Column()
  lastName: string;
  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  role: 'user' | 'admin';
}
