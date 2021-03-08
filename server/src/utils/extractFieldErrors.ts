import { ValidationError } from 'class-validator';
import { FieldError } from '../types';

export const extractFieldErrors = (errors: ValidationError[]): FieldError[] => {
  return errors.map(({ property, constraints }) => ({
    path: property.includes('.') ? property.split('.').slice(-1)[0] : property,
    message: Object.values(constraints!)[0],
  }));
};
