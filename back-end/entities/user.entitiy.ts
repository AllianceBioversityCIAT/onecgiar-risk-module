import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinTable } from 'typeorm';
import { Initiative } from './initiative.entity';
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


  @ApiProperty({ type: () => [Initiative] })
  @OneToMany(() => Initiative, (initiative) => initiative.created_by)
  @JoinTable()
  initiatives: Array<Initiative>;
}
