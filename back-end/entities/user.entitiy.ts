import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinTable } from 'typeorm';
import { Initiative } from './initiative.entity';
import { Risk } from './risk.entity';
@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column()
  first_name: string;
  @ApiProperty()
  @Column()
  last_name: string;
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

  @ApiProperty({ type: () => [Risk] })
  @OneToMany(() => Risk, (risk) => risk.initiative)
  @JoinTable()
  risks: Array<Risk>;

  @ApiProperty()
  @Column({
      type: "varchar",
      generatedType: 'STORED',
      asExpression: `Concat(first_name,' ' ,last_name)`
    })
    full_name: string;
  
}
