import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { InitiativeRoles } from './initiative-roles.entity';
import { Initiative } from './initiative.entity';
import { Mitigation } from './mitigation.entity';
import { RiskCategory } from './risk-category.entity';
import { User } from './user.entitiy';

@Entity()
export class Risk {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column()
  initiative_id: number;

  @ManyToOne(() => Initiative, (initiative) => initiative.risks)
  @JoinColumn({ name: 'initiative_id' })
  initiative: Initiative;
  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  risk_owner_id: number;
  @ManyToOne(() => InitiativeRoles, (initiativeRoles) => initiativeRoles.risks,{onUpdate:'CASCADE',onDelete:'CASCADE'})
  @JoinColumn({ name: 'risk_owner_id' })
  risk_owner: number;
  @ApiProperty()
  @Column()
  description: string;
  @ApiProperty()
  @Column()
  target_likelihood: number;
  @ApiProperty()
  @Column()
  target_impact: number;
  @ApiProperty()
  @Column()
  current_likelihood: number;

  @ApiProperty()
  @Column()
  current_impact: number;

  @ManyToOne(() => RiskCategory, (category) => category.risks)
  @JoinColumn({ name: 'category_id' })
  category: RiskCategory;


  @ApiProperty()
  @Column()
  category_id: number;
  
  @ApiProperty({ type: () => [Mitigation], })
  @OneToMany(() => Mitigation, (mitigation) => mitigation.risk,{onUpdate:'CASCADE',onDelete:'CASCADE'})
  @JoinTable()
  mitigations: Array<Mitigation>;

  @ManyToOne(() => User, (user) => user.risks)
  @JoinColumn({ name: 'created_by_user_id' })
  created_by: User;
  @Optional()
  @Column({default:null})
  created_by_user_id:number

  @Optional()
  @Column({default:false})
  redundant:boolean
  
  
}
