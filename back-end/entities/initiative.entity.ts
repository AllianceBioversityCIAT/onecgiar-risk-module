import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinColumn, JoinTable, OneToMany } from 'typeorm';
import { InitiativeRoles } from './initiative-roles.entity';
import { Risk } from './risk.entity';

@Entity()
export class Initiative {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable:true,default:null})
  official_code: string;

  @Column()
  clarisa_id: string;

  @Column()
  name: string;

  @OneToMany(()=> Risk,(risk)=>risk.initiative)
  @JoinTable()
  risks:Array<Risk>

  @OneToMany(()=> InitiativeRoles,(initiative_roles)=>initiative_roles.initiative)
  @JoinTable()
  roles:Array<InitiativeRoles>
}