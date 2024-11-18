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
import { scienceProgramsRoles } from './initiative-roles.entity';
import { Risk } from './risk.entity';
import { User } from './user.entitiy';
import { ActionArea } from './action-area';
import { Phase } from './phase.entity';
import { CollectedEmail } from './collected-emails.entity';
@Entity()
export class sciencePrograms {
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
  @OneToMany(() => Risk, (risk) => risk.science_programs)
  @JoinTable()
  risks: Array<Risk>;

  @ApiProperty({ type: () => [scienceProgramsRoles] })
  @OneToMany(
    () => scienceProgramsRoles,
    (scienceProgramsRoles) => scienceProgramsRoles.science_programs,{onUpdate:'RESTRICT',onDelete:'RESTRICT'}
  )
  @JoinTable()
  roles: Array<scienceProgramsRoles>;

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

  @ManyToOne(() => User, (user) => user.science_programs)
  @JoinColumn({ name: 'created_by_user_id' })
  created_by: User;
  @Optional()
  @Column({default:null})
  created_by_user_id:number


  @ApiProperty()
  @Column({type: 'bool', default: false})
  status: boolean;

  @ApiProperty()
  @Column({type: 'bool', default: false})
  archived: boolean;

  @ApiProperty()
  @Column({type: 'bool', default: false})
  sync_clarisa: boolean;

  @Optional()
  @Column({default:null})
  action_area_id:number

  @ManyToOne(() => ActionArea, (action_area) => action_area.science_programs)
  @JoinColumn({ name: 'action_area_id' })
  action_area: ActionArea;

  @Optional()
  @Column({default:null})
  phase_id:number

  @ManyToOne(() => Phase, (phase) => phase.science_programs)
  @JoinColumn({ name: 'phase_id' })
  phase: Phase;


  @ApiProperty()
  @OneToMany(() => CollectedEmail, (collectedEmail) => collectedEmail.science_programs)
  email: any;
}
