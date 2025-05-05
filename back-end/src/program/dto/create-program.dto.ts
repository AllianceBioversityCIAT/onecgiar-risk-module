import { IsNotEmpty, IsOptional, IsIn } from 'class-validator';

/**
 * DTO for **creating** a Program / Project.
 */
export class CreateProgramDto {
  /** Unique short code, e.g. “ABC-123”. */
  @IsNotEmpty()
  official_code!: string;

  /** Human-readable title. */
  @IsNotEmpty()
  name!: string;

  /**
   * 1 = project, 0 = programme. Optional; defaults to 0.
   * (Tinyint in the DB layer.)
   */
  @IsOptional()
  @IsIn([0, 1])
  isProject?: number = 0;
}
