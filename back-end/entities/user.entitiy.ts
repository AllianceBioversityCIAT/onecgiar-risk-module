import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinTable } from 'typeorm';
import { Program } from './program.entity';
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


  @ApiProperty({ type: () => [Program] })
  @OneToMany(() => Program, (program) => program.created_by)
  @JoinTable()
  program: Array<Program>;

  @ApiProperty({ type: () => [Risk] })
  @OneToMany(() => Risk, (risk) => risk.program)
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
