import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sciencePrograms } from 'entities/initiative.entity';
import { Risk } from 'entities/risk.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {}
