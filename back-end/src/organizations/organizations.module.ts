import { Module } from '@nestjs/common';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from 'entities/organization.entity';
import { PhaseProgramOrganization } from 'entities/phase-program-organization.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization, PhaseProgramOrganization
    ])
  ],
  controllers: [OrganizationsController],
  providers: [OrganizationsService]
})
export class OrganizationsModule {}
