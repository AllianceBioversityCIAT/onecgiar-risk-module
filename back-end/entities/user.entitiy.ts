import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinTable } from 'typeorm';
import { sciencePrograms } from './initiative.entity';
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
  @Column({default:'user'})
  role: 'user' | 'admin';


  @ApiProperty({ type: () => [sciencePrograms] })
  @OneToMany(() => sciencePrograms, (sciencePrograms) => sciencePrograms.created_by)
  @JoinTable()
  science_programs: Array<sciencePrograms>;

  @ApiProperty({ type: () => [Risk] })
  @OneToMany(() => Risk, (risk) => risk.science_programs)
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
