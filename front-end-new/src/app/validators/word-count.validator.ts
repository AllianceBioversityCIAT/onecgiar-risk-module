import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class WordCountValidators {
  /**
   * The Regex used to seperate words from white space characters.
   */
  private static seperator = /\s+/gmu;

  /**
   * @description
   * Validator that requires the control word count to be greater than or equal to the provided number.
   *
   * @usageNotes
   *
   * ### Validate against a minimum of 3
   * ```typescript
   * const control = new FormControl('once upon', WordCountValidator.min(3));
   *
   * console.log(control.errors); // {minword: {min: 3, actual: 2}}
   * ```
   *
   * @returns A validator function that returns an error map with the
   * `minword` property if the validation check fails, otherwise `null`.
   *
   * @see `updateValueAndValidity()`
   *
   */
  static min(min: number, seperator: string | RegExp = WordCountValidators.seperator): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // Check that the control has a value and if that value is a string.
      if (control.value && typeof control.value === 'string') {
        // Remove any leading and trailing whitespace
        const value = control.value.trim();
        const words = value.split(seperator);
        const actual = words.length;
        if (actual < min) {
          return { minword: { min, actual } };
        }
      }
      return null;
    };
  }

  /**
   * @description
   * Validator that requires the control word count to be less than or equal to the provided number.
   *
   * @usageNotes
   *
   * ### Validate against a maximum of 3
   * ```typescript
   * const control = new FormControl('once upon a time', WordCountValidator.max(3));
   *
   * console.log(control.errors); // {minword: {min: 3, actual: 4}}
   * ```
   *
   * @returns A validator function that returns an error map with the
   * `maxword` property if the validation check fails, otherwise `null`.
   *
   * @see `updateValueAndValidity()`
   *
   */
  static max(max: number, seperator: string | RegExp = WordCountValidators.seperator): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // Check that the control has a value and if that value is a string.
      if (control.value && typeof control.value === 'string') {
        // Remove any leading and trailing whitespace.
        const value = control.value.trim();
        const words = value.split(seperator);
        const actual = words.length;
        if (actual > max) {
          return { maxword: { max, actual } };
        }
      }
      return null;
    };
  }
}