import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinTable } from 'typeorm';
import { Risk } from './risk.entity';

@Entity()
export class RiskCategory {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty({ type: () => [Risk] })
  @OneToMany(() => Risk, (risk) => risk.initiative)
  @JoinTable()
  risks: Array<Risk>;

}
