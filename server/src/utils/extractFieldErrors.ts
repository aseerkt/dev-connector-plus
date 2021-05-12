import { ValidationError } from 'class-validator';
import { FieldError } from '../types';

// function capitalizeFirstLetter(string: string) {
//   return string.charAt(0).toUpperCase() + string.slice(1);
// }

export const extractFieldErrors = (errors: ValidationError[]): FieldError[] => {
  // console.log(errors);
  let fieldErrors: FieldError[] = [];
  errors.forEach(({ property, constraints, children }) => {
    if (!constraints && children && children?.length > 0) {
      children?.forEach(({ property: childProp, constraints }) => {
        fieldErrors.push({
          path: `${property}.${childProp}`,
          message: Object.values(constraints!)[0],
        });
      });
    } else {
      fieldErrors.push({
        path: property,
        message: Object.values(constraints!)[0],
      });
    }
  });
  return fieldErrors;
};
