import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { AdminRolesGuard } from 'src/auth/admin-roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { Organization } from 'entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@UseGuards(JwtAuthGuard, AdminRolesGuard)
@Controller('organizations')
export class OrganizationsController {
    constructor(private organizationsService: OrganizationsService) { }


    @ApiBearerAuth()
    @ApiCreatedResponse({
        description: '',
        type: Organization,
    })
    @ApiBody({ type: Organization })
    @Post()
    create(@Body() createOrganizationDto: CreateOrganizationDto) {
        return this.organizationsService.create(createOrganizationDto);
    }


    @ApiCreatedResponse({
        description: '',
        type: [Organization],
    })
    @ApiBearerAuth()
    @Get()
    findAll(@Query() query) {
        return this.organizationsService.findAll(query);
    }


    @ApiCreatedResponse({
        description: '',
        type: Organization,
    })
    @ApiBearerAuth()
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.organizationsService.findOne(+id);
    }



    @ApiCreatedResponse({
        description: '',
        type: Organization,
    })
    @ApiBody({ type: Organization })
    @ApiBearerAuth()
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateOrganizationDto: UpdateOrganizationDto,
    ) {
        return this.organizationsService.update(+id, updateOrganizationDto);
    }


    @ApiBearerAuth()
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.organizationsService.remove(+id);
    }
}
