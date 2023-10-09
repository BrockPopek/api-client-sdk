/**
 * This will run the API SDK against the Lord of the Rings API.
 * To run this file, run the following command in the terminal:
 * 
 * pnpm process-sdk
 */

import { config } from "dotenv";
import { LordOfTheRingsClient } from "./api-clients/lord-of-the-rings-client";
import { FilterComparison } from "./types/requests/filter-comparison";
import { GetMoviesRequest } from "./types/requests/get-movies-request";
import { GetQuotesRequest } from "./types/requests/get-quotes-request";

// Load environment variables.  If they don't exist, throw an error.
// These can be set in the .env file.  
// Using an .env file allows for environment variables to be set without having to hardcode them in the code.
config();
if (!process.env.API_URL) {
    throw new Error("API_URL is missing from the environment.");
}
if (!process.env.API_TOKEN) {
    throw new Error("API_TOKEN is missing from the environment.");
}
const client = new LordOfTheRingsClient(process.env.API_URL, process.env.API_TOKEN);

(async () => {
    try {
        // Get all movies
        const result = await client.getMovies();
        console.log(`Movies: `, result);
        
        //------------------------------------------------------
        // Get movies with filter for academy award wins greater than or equal to 4.
        const request: GetMoviesRequest = {
            filters: {
                academyAwardWins: { 
                    comparison: FilterComparison.GreaterThanOrEqual, 
                    value: 4 
                }
            }
        };
        const result2 = await client.getMovies(request);
        console.log(`Movies with filter: `, result2);
        
        //------------------------------------------------------
        // Get quotes with filter for no dialog
        const request3: GetQuotesRequest = {
            filters: {
                dialog: { 
                    comparison: FilterComparison.DoesNotExist 
                }
            }
        };
        const result3 = await client.getQuotes(request3);
        console.log(`Quotes with filter: `, result3);

        //------------------------------------------------------
        // Get quotes for The Fellowship of the Ring.
        const requestName: GetMoviesRequest = {
            filters: {
                name: { 
                    comparison: FilterComparison.Equal, 
                    value: 'The Fellowship of the Ring'
                }   
            }
        };
        const resultName = await client.getMovies(requestName);

        if (resultName.total > 0) {
            const movieId = resultName.docs[0]._id;
            const resultQuotes = await client.getQuotesByMovie(movieId);
            console.log(`Quotes for ${resultName.docs[0].name}: `, resultQuotes);

            // Now drill down to some quoutes testing out the dialog filter for the following quotes:
            // So it's true
            // Hurry!
            // Put it out you fools!
            const requestDialog: GetQuotesRequest = {
                filters: {
                    movie: {
                        comparison: FilterComparison.Equal, 
                        value: movieId
                    },
                    dialog: { 
                        comparison: FilterComparison.Equal, 
                        value: [
                            'Hurry!', 
                            'Put it out you fools! Put it out!', 
                            `So it's true`
                        ]
                    }   
                }
            };
            
            const resultQuotesByDialog = await client.getQuotes(requestDialog);
            console.log(`Quotes for ${resultName.docs[0].name}: `, resultQuotesByDialog);        
        }
    } catch (error) {
        console.error(error);
    }
})();

