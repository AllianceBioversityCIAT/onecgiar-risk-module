import { ActionArea } from 'entities/action-area';
import { Announcement } from 'entities/announcement.entity';
import { Archive } from 'entities/archive.entity';
import { CategoryGroup } from 'entities/categories-groups';
import { CollectedEmail } from 'entities/collected-emails.entity';
import { FAQ } from 'entities/FAQ.entity';
import { Glossary } from 'entities/glossary.entity';
import { ProgramRoles } from 'entities/program-roles.entity';
import { Program } from 'entities/program.entity';
import { MitigationStatus } from 'entities/mitigation-status.entity';
import { Mitigation } from 'entities/mitigation.entity';
import { Phase } from 'entities/phase.entity';
import { RiskCategory } from 'entities/risk-category.entity';
import { Risk } from 'entities/risk.entity';
import { User } from 'entities/user.entitiy';
import { Variables } from 'entities/variables.entity';
import { Email } from 'src/emails/email.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { Organization } from 'entities/organization.entity';
import { PhaseProgramOrganization } from 'entities/phase-program-organization.entity';

dotenv.config();
export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  charset: 'utf8mb4',
  entities: [
    CategoryGroup,
    RiskCategory,
    Risk,
    Program,
    ProgramRoles,
    Mitigation,
    MitigationStatus,
    User,
    CollectedEmail,
    ActionArea,
    Phase,
    Email,
    Announcement,
    Archive,
    FAQ,
    Glossary,
    Variables,
    Organization,
    PhaseProgramOrganization
  ],
  migrations: ['dist/db/migrations/**/*{.ts,.js}'],
  synchronize: true,
  logging: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;