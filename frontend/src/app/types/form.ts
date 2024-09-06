export type FormStateErrors<T> = { [K in keyof T]?: string[] };
export type FormState<T, R extends string | object | undefined> =
  | {
      errors?: FormStateErrors<T> | null;
      data?: R | null;
    }
  | undefined;
