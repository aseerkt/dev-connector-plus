import { FieldError } from '../generated/graphql';

export const extractFormErrors = (errors: FieldError[]) =>
  errors.reduce((prev, { path, message }) => {
    prev[path] = message;
    return prev;
  }, {});
