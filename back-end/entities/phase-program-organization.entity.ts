import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Organization } from './organization.entity';
import { Phase } from './phase.entity';
import { Program } from './program.entity';

@Entity()
export class PhaseProgramOrganization {
  @JoinColumn({ name: 'phase_id' })
  @ManyToOne(() => Phase)
  phase: Phase;

  @Column({ primary: true })
  phase_id: number;

  @JoinColumn({ name: 'program_id' })
  @ManyToOne(() => Program)
  program: Program;

  @Column({ primary: true })
  program_id: number;

  @JoinColumn({ name: 'organization_code' })
  @ManyToOne(() => Organization)
  organization: Organization;

  @Column({ primary: true })
  organization_code: string;
}
