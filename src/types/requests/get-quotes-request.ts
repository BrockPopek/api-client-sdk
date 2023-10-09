import { Quote } from "../quote";
import { GetRequest } from "./get-request";

/**
 * The request parameters for retrieving a list of movie quotes.
 */
export type GetQuotesRequest = GetRequest<Quote>;
