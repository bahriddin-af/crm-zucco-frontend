export const HTTP_HEADERS = {
  AUTHORIZATION: 'Authorization',
  BRANCH_ID: 'X-Branch-Id',
  OPERATION_ID: 'X-Operation-Id',
} as const

export const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
} as const

/** Yozish amallari: ularning har biri idempotentlik kaliti (`operationId`) bilan yuboriladi. */
export const WRITE_METHODS = ['post', 'put', 'patch', 'delete'] as const

export const BEARER_PREFIX = 'Bearer '
