/**
 * Filter comparison for filtering out results.
 */
export enum FilterComparison {
    Equal = '=',
    NotEqual = '!=',
    Exists = '',
    DoesNotExist = '!',
    LessThan = '<',
    LessThanOrEqual = '<=',
    GreaterThan = '>',
    GreaterThanOrEqual = '>='
}