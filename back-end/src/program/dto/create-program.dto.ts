export class CreateProgramDto {
  /** Unique short code, e.g. “ABC-123”. */
  official_code!: string;

  /** Human-readable title. */
  name!: string;

  /**
   * 1 = project, 0 = programme. Optional; defaults to 0.
   * (Tinyint in the DB layer.)
   */
  isProject?: number = 0;
}
