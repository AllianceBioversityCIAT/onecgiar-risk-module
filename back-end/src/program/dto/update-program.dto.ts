import { PartialType } from '@nestjs/mapped-types';
import { CreateProgramDto } from './create-program.dto';

/**
 * DTO for **updating** a Program / Project.
 * Inherits all fields from CreateProgramDto but makes them optional.
 */
export class UpdateProgramDto extends PartialType(CreateProgramDto) {}
