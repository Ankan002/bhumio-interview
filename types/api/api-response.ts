export type JsonApiResponse<T = void> =
    | {
          success: true;
          code: number;
          data?: T;
      }
    | {
          success: false;
          code: number;
          error: string;
      };
