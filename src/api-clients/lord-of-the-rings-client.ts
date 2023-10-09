import { GetMoviesRequest } from "../types/requests/get-movies-request";
import { GetMoviesResponse } from "../types/responses/get-movies-response";
import { GetQuotesRequest } from "../types/requests/get-quotes-request";
import { GetQuotesResponse } from "../types/responses/get-quotes-response";
import { FilterComparison } from "../types/requests/filter-comparison";
import { GetRequestBase } from "../types/requests/get-request";

export class LordOfTheRingsClient {
    private baseUrl: string | undefined;
    private authToken: string | undefined;

/**
 * Constructs a new instance of the API class.
 * 
 * @param baseUrl - The base URL of the API.
 * @param authToken - The authentication token.
 */
constructor(baseUrl: string, authToken: string) {
    // Set the base URL to the provided value, or use the default base URL if not provided
    this.baseUrl = baseUrl;

    if (!this.baseUrl) {
        throw new Error(`Base API URL is missing.`);
    }
    
    // Set the authentication token to the provided value, or use the default authentication token if not provided
    this.authToken = authToken;

    if (!this.authToken) {
        throw new Error(`Authentication token is missing.`);
    }
}

    /**
     * Handles the response from an API request and returns the parsed JSON response.
     *
     * @param {Response} response - The response object from the API request.
     * @returns {Promise<T>} - A promise that resolves to the parsed JSON response.
     */
    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            throw new Error(`Request failed: ${response.statusText}`);
        }

        return await response.json();
    }

    /**
     * Retrieves the authentication header.
     *
     * @return {Object} - The authentication header as an object.
     * @throws {Error} - If the authentication token is missing.
     */
    private getAuthHeader(): { [key: string]: string } {
        if (!this.authToken) {
            throw new Error(`Request failed: Authentication required.`);
        }
        return { 'Authorization': `Bearer ${this.authToken}` };
    }

    /**
     * Generates a URL with query parameters based on the provided URL and request object.
     * 
     * @param url - The base URL.
     * @param request - The request object containing filters.
     * @returns The generated URL with query parameters.
     */
    private getUrlWithParams(url: string, request?: GetRequestBase): string {
        const queryParts: string[] = [];

        if (request?.filters) {
            const filters = request.filters;

            // Iterate over each filter and construct the query parameters.
            for (const [key, filter] of Object.entries(filters)) {
                if (filter !== null && filter !== undefined) {
                    //  Check if the filter is for Exists or DoesNotExist.  If so, then no value is needed.
                    if (filter.comparison === FilterComparison.Exists || filter.comparison === FilterComparison.DoesNotExist) {
                        queryParts.push(`${filter.comparison}${key}`);
                    } else {
                        //  If not Exists or DoesNotExist, then the value is needed.
                        //  If the value is an array, then join the values with a comma.
                        const paramValue = (Array.isArray(filter.value) && filter.value.length > 0) ? filter.value.join(',') : filter.value?.toString();
                        queryParts.push(`${key}${filter.comparison}${paramValue}`);
                    }
                }
            }
        }
        // TODO: Add pagination and sorting here

        if (queryParts.length === 0) {
            return url;
        }

        // Add the query parameters to the URL.
        return `${url}?${queryParts.join('&')}`;
    }

    /**
     * Retrieves data from the specified API endpoint.
     *
     * @param {string} apiUrl - The URL of the API endpoint.
     * @return {Promise<T>} A promise that resolves to the fetched data.
     */
    private async getApi<T>(apiFunction: string): Promise<T> {
        // Prepare headers with authentication and content type
        let headers = this.getAuthHeader();
        headers['Content-Type'] = 'application/json';

        const apiUrl = `${this.baseUrl}/${apiFunction}`;
        console.log(`API Url: ${apiUrl}`);

        // Fetch data from the API endpoint
        const response = await fetch(apiUrl, { headers });

        // Handle the API response
        return this.handleResponse<T>(response);
    }

    /**
     * Retrieves a list of movies from the API.
     *
     * @param request - Optional request parameters.
     * @returns A promise that resolves to a response containing the list of movies.
     */
    async getMovies(request?: GetMoviesRequest): Promise<GetMoviesResponse> {
        // Construct the URL with the base URL and request parameters
        const url = this.getUrlWithParams('movie', request);

        // Send a GET request to the API and retrieve the response
        const response = await this.getApi<GetMoviesResponse>(url);

        // Return the response
        return response;
    }

    /**
     * Retrieves a movie by its ID.
     * @param id - The ID of the movie to retrieve.
     * @returns A promise that resolves to the movie response.
     */
    async getMovieById(id: string): Promise<GetMoviesResponse> {
        // Make the API call to retrieve the movie by ID
        const response = await this.getApi<GetMoviesResponse>(`movie/${id}`);
        
        // Return the movie response
        return response;
    }

    /**
     * Retrieves quotes for a specific movie
     * @param movieId - The ID of the movie
     * @returns A promise that resolves to the response containing the quotes
     */
    async getQuotesByMovie(movieId: string): Promise<GetQuotesResponse> {                
        // Make the API call and wait for the response
        const response = await this.getApi<GetQuotesResponse>(`movie/${movieId}/quote`);

        // Return the response containing the quotes
        return response;
    }

    /**
     * Retrieves a list of quotes from the API.
     * 
     * @param request - The optional request parameters.
     * @returns A promise that resolves with the API response.
     */
    async getQuotes(request?: GetQuotesRequest): Promise<GetQuotesRequest> {
        // Generate the URL with the query parameters
        const url = this.getUrlWithParams('quote', request);

        // Send a GET request to the API and return the response
        const response = await this.getApi<GetQuotesRequest>(url);
        return response;
    }

    /**
     * Retrieves a movie quote by its ID.
     * 
     * @param {string} id - The ID of the movie quote to retrieve.
     * @returns {Promise<GetQuotesRequest>} - A promise that resolves with the retrieved movie quote.
     */
    async getQuoteById(id: string): Promise<GetQuotesRequest> {
        // Send a GET request to the API endpoint with the provided ID
        const response = await this.getApi<GetQuotesRequest>(`quote/${id}`);

        // Return the response
        return response;
    }

}
