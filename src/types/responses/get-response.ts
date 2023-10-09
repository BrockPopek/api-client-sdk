/**
 * Response from a GET request
 */
export type GetResponse<T> = {
    docs: T[];
    total: number;
    limit: number;
    offset: number;
    page: number;
    pages: number;
}