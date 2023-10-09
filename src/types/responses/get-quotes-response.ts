import { Quote } from "../quote";
import { GetResponse } from "./get-response";

/**
 * A response containing a list of quotes
 */
export type GetQuotesResponse = GetResponse<Quote>;