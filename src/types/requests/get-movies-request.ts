import { GetRequest } from "./get-request";
import { Movie } from "../movie";

/**
 * Request parameters for retrieving a list of movies.
 */
export type GetMoviesRequest = GetRequest<Movie>;
