import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { InitiativeRoles } from './initiative-roles.entity';
import { Risk } from './risk.entity';

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
    (initiative_roles) => initiative_roles.initiative,
  )
  @JoinTable()
  roles: Array<InitiativeRoles>;
}
