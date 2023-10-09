import { Movie } from "../movie";
import { GetResponse } from "./get-response";

/**
 * A response containing a list of movies.
 */
export type GetMoviesResponse = GetResponse<Movie>;
