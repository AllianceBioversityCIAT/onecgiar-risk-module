import { ActionArea } from 'entities/action-area';
import { CategoryGroup } from 'entities/categories-groups';
import { CollectedEmail } from 'entities/collected-emails.entity';
import { scienceProgramsRoles } from 'entities/initiative-roles.entity';
import { sciencePrograms } from 'entities/initiative.entity';
import { MitigationStatus } from 'entities/mitigation-status.entity';
import { Mitigation } from 'entities/mitigation.entity';
import { Phase } from 'entities/phase.entity';
import { RiskCategory } from 'entities/risk-category.entity';
import { Risk } from 'entities/risk.entity';
import { User } from 'entities/user.entitiy';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: 'tareqb00s',
  database: 'risk3',
  charset: 'utf8mb4',
  entities: [CategoryGroup, RiskCategory, Risk, sciencePrograms, scienceProgramsRoles, Mitigation, MitigationStatus, User, CollectedEmail, ActionArea, Phase],
  migrations: ['dist/db/migrations/**/*{.ts,.js}'],
  synchronize: false,
  logging: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;