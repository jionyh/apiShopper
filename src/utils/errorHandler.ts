import { Response } from 'express';
import { ZodIssue } from 'zod';

export enum ErrorMessages {
  INVALID_TYPE = 'Tipo de medição não permitida',
  MEASURES_NOT_FOUND = 'Nenhuma leitura encontrada',
  MEASURE_NOT_FOUND= 'Leitura do mês não encontrada',
  DOUBLE_REPORT = 'Leitura do mês já realizada',
  CONFIRMATION_DUPLICATE = 'Leitura do mês já realizada',}

export type ErrorCode = keyof typeof ErrorMessages;

export class CustomError extends Error {
  public code: ErrorCode;
  constructor(code: ErrorCode) {
    super(code);
    this.code = code;
  }
}

export const errorResponseHandler = (
  res: Response,
  errorMessage?: ZodIssue[] | ErrorCode,
) => {
  if (Array.isArray(errorMessage)) {
    const errorDescriptions = errorMessage.map((issue: ZodIssue) => issue.message);
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: errorDescriptions
    });
  }
  const errorDescription = ErrorMessages[errorMessage as ErrorCode];

  if (!errorDescription) {
    return res.status(500).json({
      error_code: 'UNKNOWN_ERROR',
      error_description: 'Um erro desconhecido ocorreu.'
    });
  }

  switch (errorMessage) {
    case 'CONFIRMATION_DUPLICATE':
    case 'DOUBLE_REPORT':
      return res.status(409).json({
        error_code: errorMessage,
        error_description: errorDescription
      });
    case 'INVALID_TYPE':
      return res.status(400).json({
        error_code: errorMessage,
        error_description: errorDescription
      });
    case 'MEASURES_NOT_FOUND':
    case 'MEASURE_NOT_FOUND':
      return res.status(404).json({
        error_code: errorMessage,
        error_description: errorDescription
      });
    default:
      return res.status(500).json({
        error_code: 'UNKNOWN_ERROR',
        error_description: 'Um erro desconhecido ocorreu'
      });
  }
};
