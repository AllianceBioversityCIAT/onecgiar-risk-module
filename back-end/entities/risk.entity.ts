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
  Index,
  CreateDateColumn,
} from 'typeorm';
import { ProgramRoles } from './program-roles.entity';
import { Program } from './program.entity';
import { Mitigation } from './mitigation.entity';
import { RiskCategory } from './risk-category.entity';
import { User } from './user.entitiy';
import { CollectedEmail } from './collected-emails.entity';

@Entity()
export class Risk {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column()
  program_id: number;

  @ManyToOne(() => Program, (program) => program.risks)
  @JoinColumn({ name: 'program_id' })
  program: Program;

  @Index({ fulltext: true })
  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Optional()
  @Column({ default: null })
  risk_owner_id: number;
  @ManyToOne(
    () => ProgramRoles,
    (programRoles) => programRoles.risks,
    { onUpdate: 'SET NULL', onDelete: 'SET NULL' },
  )
  @JoinColumn({ name: 'risk_owner_id' })
  risk_owner: ProgramRoles;
  @ApiProperty()
  @Column({ type: 'text' })
  description: string;
  @ApiProperty()
  @Column()
  target_likelihood: number;
  @ApiProperty()
  @Column()
  target_impact: number;

  @ApiProperty()
  @Column({
    type: 'int',
    generatedType: 'STORED',
    asExpression: `target_likelihood * target_impact`,
  })
  target_level: number;

  @ApiProperty()
  @Column()
  current_likelihood: number;

  @ApiProperty()
  @Column({ type: 'bool', default: false })
  request_assistance: boolean;

  @ApiProperty()
  @Column()
  current_impact: number;
  @ApiProperty()
  @Column({
    type: 'int',
    generatedType: 'STORED',
    asExpression: `current_likelihood * current_impact`,
  })
  current_level: number;

  @ApiProperty()
  @Column({
    type: 'bool',
    generatedType: 'STORED',
    asExpression: `current_likelihood * current_impact >= 16`,
  })
  flag: boolean;

  @ManyToOne(() => RiskCategory, (category) => category.risks)
  @JoinColumn({ name: 'category_id' })
  category: RiskCategory;

  @ApiProperty()
  @Column()
  category_id: number;

  @ApiProperty()
  @Optional()
  @Column({ default: false })
  redundant: boolean;

  @ApiProperty()
  @Optional()
  @Column({ default: 999 })
  top: number;

  @ApiProperty()
  @Optional()
  @Column({ type: 'date', default: null })
  due_date: string;

  @CreateDateColumn()
  created_date: Date;

  @ApiProperty({ type: () => [Mitigation] })
  @OneToMany(() => Mitigation, (mitigation) => mitigation.risk, {

    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinTable()
  mitigations: Array<Mitigation>;

  @ApiProperty()
  @ManyToOne(() => User, (user) => user.risks)
  @JoinColumn({ name: 'created_by_user_id' })
  created_by: User;
  @ApiProperty()
  @Optional()
  @Column({ default: null })
  created_by_user_id: number;

  @ApiProperty()
  @ManyToOne(() => User, (user) => user.risks)
  @JoinColumn({ name: 'update_by_user_id' })
  update_by: User;
  @ApiProperty()
  @Optional()
  @Column({ default: null })
  update_by_user_id: number;

  @ApiProperty()
  @Optional()
  @Column({ default: null })
  original_risk_id: number;

  @ApiProperty()
  @OneToMany(() => CollectedEmail, (collectedEmail) => collectedEmail.risk)
  email: any;

}
