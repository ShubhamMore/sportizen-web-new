import { FormGroup, FormArray } from '@angular/forms';

export class Validator {
  passwordValidator(group: FormGroup): { [s: string]: boolean } {
    if (group.value.password !== group.value.confirmPassword) {
      return { invalidPassword: true };
    }
    return null;
  }
}
