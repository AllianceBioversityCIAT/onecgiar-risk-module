import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinTable,
  OneToMany,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { InitiativeRoles } from './initiative-roles.entity';
import { Risk } from './risk.entity';
import { User } from './user.entitiy';
@Entity()
export class Initiative {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column({ nullable: true, default: null })
  official_code: string;
  @ApiProperty()
  @Column()
  clarisa_id: string;

  @Index({ fulltext: true })
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty({ type: () => [Risk] })
  @OneToMany(() => Risk, (risk) => risk.initiative)
  @JoinTable()
  risks: Array<Risk>;

  @ApiProperty({ type: () => [InitiativeRoles] })
  @OneToMany(
    () => InitiativeRoles,
    (initiative_roles) => initiative_roles.initiative,{onUpdate:'RESTRICT',onDelete:'RESTRICT'}
  )
  @JoinTable()
  roles: Array<InitiativeRoles>;

  @ApiProperty()
  @Optional()
  @Column({default:null})
  parent_id: number;

  @ApiProperty()
  @Optional()
  @Column({default:null})
  last_version_id: number;

  @ApiProperty()
  @CreateDateColumn()
  submit_date: Date;

  @ApiProperty()
  @UpdateDateColumn()
  last_updated_date: Date;

  @ManyToOne(() => User, (user) => user.initiatives)
  @JoinColumn({ name: 'created_by_user_id' })
  created_by: User;
  @Optional()
  @Column({default:null})
  created_by_user_id:number

  @Optional()
  @Column({default:null})
  publish_reason:string

  @ApiProperty()
  @Column({type: 'bool', default: false})
  status: boolean;
}
