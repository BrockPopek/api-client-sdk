import { FilterComparison } from './filter-comparison';

/**
 * Filter values for each property in the request.
 */
export type Filter = {
    comparison: FilterComparison;
    value?: string | string[] | number | undefined;
}