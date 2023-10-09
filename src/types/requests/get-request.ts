import { Filter } from "./filter"

/**
 * The base request object for GET requests.
 */
export type GetRequest<T> = Omit<GetRequestBase, 'filters'> & {
    /**
     * The filters to apply to the request.  
     * These are auto generated based on the API data type.
     */
    filters?: { [K in keyof T]?: Filter }
}

export type GetRequestBase = {
    filters?: { [key: string]: Filter }
    
    // TODO: Add pagination and sort options
}