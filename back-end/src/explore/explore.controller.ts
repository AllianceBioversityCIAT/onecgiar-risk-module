import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProgramService } from 'src/program/program.service';
import { ILike, IsNull } from 'typeorm';

@ApiTags('Explore')
@Controller('explore')
export class ExploreController {
  constructor(private readonly programService: ProgramService) {}

  @Get('programs')
  async getPrograms(@Query('search') search?: string) {
    const baseWhere = {
      parent_id: IsNull(),
      archived: false,
    };

    const where = search
      ? [
          { ...baseWhere, name: ILike(`%${search}%`) },
          { ...baseWhere, official_code: ILike(`%${search}%`) },
        ]
      : baseWhere;

    const rootPrograms = await this.programService.programRepository.find({
      where,
      relations: ['organizations', 'risks', 'risks.mitigations'],
      order: { official_code: 'ASC' },
    });

    const results = [];

    for (const root of rootPrograms) {
      const latestSubmitted =
        await this.programService.programRepository.findOne({
          where: { parent_id: root.id, status: true },
          relations: ['phase'],
          order: { id: 'DESC' },
        });

      if (!latestSubmitted) continue;

      const risks = root.risks ?? [];
      const riskCount = risks.length;
      const avgCurrentLevel =
        riskCount > 0
          ? Math.round(
              (risks.reduce(
                (sum, r) =>
                  sum +
                  (r.current_level ??
                    (r.current_likelihood ?? 0) * (r.current_impact ?? 0)),
                0,
              ) /
                riskCount) *
                100,
            ) / 100
          : 0;
      const avgTargetLevel =
        riskCount > 0
          ? Math.round(
              (risks.reduce(
                (sum, r) =>
                  sum +
                  (r.target_level ??
                    (r.target_likelihood ?? 0) * (r.target_impact ?? 0)),
                0,
              ) /
                riskCount) *
                100,
            ) / 100
          : 0;

      const totalActions = risks.reduce(
        (sum, r) => sum + (r.mitigations?.length ?? 0),
        0,
      );

      results.push({
        id: root.id,
        official_code: root.official_code,
        name: root.name,
        organizations: root.organizations,
        risk_count: riskCount,
        total_actions: totalActions,
        avg_current_level: avgCurrentLevel,
        avg_target_level: avgTargetLevel,
      });
    }

    return results;
  }

  @Get('programs/:official_code')
  async getProgramByOfficialCode(
    @Param('official_code') officialCode: string,
  ) {
    const root = await this.programService.programRepository.findOne({
      where: {
        official_code: officialCode,
        parent_id: IsNull(),
      },
    });

    if (!root) {
      throw new NotFoundException(
        `Program with official code "${officialCode}" not found`,
      );
    }

    const latestVersion = await this.programService.programRepository.findOne({
      where: {
        parent_id: root.id,
        status: true,
      },
      relations: [
        'risks',
        'risks.category',
        'risks.category.category_group',
        'risks.mitigations',
        'risks.mitigations.status',
        'risks.risk_owner',
        'risks.risk_owner.user',
        'phase',
        'roles',
        'roles.user',
      ],
      order: { id: 'DESC', risks: { top: 'ASC', id: 'DESC' } },
    });

    if (!latestVersion) {
      throw new NotFoundException(
        `No submitted version found for program "${officialCode}"`,
      );
    }

    return latestVersion;
  }
}
