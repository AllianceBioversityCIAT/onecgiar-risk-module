import { Module } from '@nestjs/common';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from 'entities/organization.entity';
import { Program } from 'entities/program.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization, Program
    ])
  ],
  controllers: [OrganizationsController],
  providers: [OrganizationsService]
})
export class OrganizationsModule {}
