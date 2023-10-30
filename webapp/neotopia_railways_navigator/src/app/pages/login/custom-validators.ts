import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function createPasswordRepeatValidator(firstControl: AbstractControl): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        const firstEntry = firstControl.value;

        if (!value) {
            return null;
        }

        if (firstEntry != value) {
            return null;
        }

        return { passwordRepeated: true };
    }
}