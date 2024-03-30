import {ZodIssue,/* ZodIssueCode,*/ ZodSchema} from 'zod';

import {ERRORS} from './errors';

const {InputValidationError} = ERRORS;

/**
 * All properties are defined handler.
 */
export const allDefined = (obj: Record<string | number | symbol, unknown>) =>
  Object.values(obj).every(v => v !== undefined);

/**
 * Error message formatter for zod issues.
 */
const prettifyErrorMessage = (issues: string) => {
  const issuesArray = JSON.parse(issues);

  return issuesArray.map((issue: ZodIssue) => {
    const code = issue.code;
    let {path, message} = issue;
    const fullPath = flattenPath(path);
    return `"${fullPath}" parameter is ${message.toLowerCase()}. Error code: ${code}.`;
  });
};



/**
 * Flattens an array representing a nested path into a string.
 */
const flattenPath = (path: (string | number)[]): string => {
  const flattenPath = path.map(part =>
    /*typeof part === 'number' ?  `[${part}]` */ part
  );
  return flattenPath.join('.');
};



/**
 * Validates given `object` with given `schema`.
 */
export const validate = <T>(schema: ZodSchema<T>, object: any) => {
  const validationResult = schema.safeParse(object);

  if (!validationResult.success) {
    throw new InputValidationError(
      prettifyErrorMessage(validationResult.error.message)
    );
  }

  return validationResult.data;
};