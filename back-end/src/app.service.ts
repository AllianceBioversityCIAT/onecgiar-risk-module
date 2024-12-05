import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Program } from 'entities/program.entity';
import { Risk } from 'entities/risk.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {}
