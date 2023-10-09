# Lord of the Rings Client SDK
This repository contains a Lord of the Rings Client SDK that allows you to interact with the Lord of the Rings API. Additionally, it includes a script to process the client and retrieve quotes and movies.

The Lord of the Rings API documentation is located [here](https://the-one-api.dev/documentation).

Please go to the site to read about how the API functions.  This client only works for retrieving movies and quotes, and for filtering on them at this time.
## Prerequisites

Before using the Lord of the Rings SDK and running the script, make sure you have the following software installed on your machine:

- Node.js (version 12 or higher)
- npm or pnpm (Node Package Manager)

## Installation

1. Clone the repository or download the ZIP file.
2. Open a terminal and navigate to the root directory of the SDK.
3. Run the following command to install the dependencies:

   ```bash
   npm install
   ```
   or
   ```bash
   pnpm install
   ```
   
## Usage
To use the LordOfTheRingsClient in your own project, follow these steps:
1. Import the ```LordOfTheRingsClient``` class into your project:
    ``` Typescript
    import { LordOfTheRingsClient } from 'lord-of-the-rings-client';
    ```
2. Create an instance of the ```LordOfTheRingsClient``` class:
    ``` Typescript
    const client = new LordOfTheRingsClient();
    ```
3. Use the available methods to interact with the Lord of the Rings API. 
    ### Get Movies
    ``` Typescript
    const movies = await client.getMovies();
    console.log("Movies:", movies);
    ```
    ### Get Movie By ID
    ``` Typescript
    const movieId = "MOVIE_ID";  // Replace with the actual movie ID
    const movie = await client.getMovieById(movieId);
    console.log("Movie by ID:", movie);
    ```
    ### Retrieve Quotes for a Movie
    ``` Typescript
    const movieId = "MOVIE_ID";  // Replace with the actual movie ID
    const quotes = await client.getQuotesByMovie(movieId);
    console.log("Quotes for Movie:", quotes);
    ```
    ### Get Quotes
    ``` Typescript
    const quotes = await client.getQuotes();
    console.log("Quotes:", quotes);
    ```
    ### Get Quote By ID
    ``` Typescript
    const quoteId = "QUOTE_ID";  // Replace with the actual quote ID
    const quote = await client.getQuoteById(quoteId);
    console.log("Quote by ID:", quote);
    ```

## Data Types
Data types used by the API.
### Movie
``` Typescript
{
  _id: string,
  name: string,
  runtimeInMinutes: number,
  budgetInMillions: number,
  boxOfficeRevenueInMillions: number,
  academyAwardNominations: number,
  academyAwardWins: number,
  rottenTomatoesScore: number
}
```
### Quotes
``` Typescript
{
  _id: string,
  dialog: string,
  movie: string,
  character: string,
  id: string
}
```
## Filtering
The following client methods allow filtering:
* GetMovies
* GetQuotes

Filters are sent in the parameter to these functions.  You can filter on any field in the Movie and Quote type list above.

By specifying different field names, comparison operators, and values in the ```filters``` object, you can apply various filtering conditions to retrieve specific data the API.

For more information on filtering, please read the [API documention](https://the-one-api.dev/documentation#5).

### Filter Comparison List
* **Equal**
    * Can be used with a single value or array of values.  If an array, it acts as an include and gets all that equal in the array.
* **NotEqual**
    * Can be used with a single value or array of values.  If an array, it acts as an exclude and will exclude all in the array.
* **Exists**
    * Does not need a value.  Just checks if data exists.
* **DoesNotExist**
    * Does not need a value.  Just checks if data does not exists.
* **LessThan**
* **LessThanOrEqual**
* **GreaterThan**
* **GreaterThanOrEqual**
### Filter Example
``` Typescript
filters: {
    name: {
        comparison: FilterComparison.Equal, 
        value: ['The', 'Of']
    },
    runtimeInMinutes: {
        comparison: FilterComparison.NotEqual, 
        value: 128
    },
    budgetInMillions: {
        comparison: FilterComparison.GreaterThan, 
        value: 100000
    },
    boxOfficeRevenueInMillions: {
        comparison: FilterComparison.LessThan, 
        value: 3000000
    },
    academyAwardNominations: {
        comparison: FilterComparison.LessThanOrEqual, 
        value: 2
    },
    academyAwardWins: { 
        comparison: FilterComparison.GreaterThanOrEqual, 
        value: 4 
    },
    rottenTomatoesScore: { 
        comparison: FilterComparison.DoesNotExist
    }
}
```
## Responses
API Responses are returned for the following types:
### GetMovieResponse
``` Typescript
  docs: Movie[],
  total: number,
  limit: number,
  offset: number,
  page: number,
  pages: number
}
```
### GetQuoteResponse
``` Typescript
  docs: Quote[],
  total: number,
  limit: number,
  offset: number,
  page: number,
  pages: number
}
```
## Running the SDK

The repository includes a script named ```process-lotr-sdk.ts``` that demonstrates how to use the ```LordOfTheRingsClient``` to retrieve quotes and movies. To run the script, follow these steps:
1. Make sure you have completed the installation steps mentioned earlier.
2. Open a terminal and navigate to the cloned repository:
    ```bash
    cd lord-of-the-rings-client    
    ```
3. An environment variable file is used to set needed values since these can change per environment and user. Please make sure in the main directory there is an `.env` file and that the following variables are set:
    ``` bash
    API_URL=< Lord of the Rings API url, i.e. https://the-one-api.dev/v2 >
    API_TOKEN=< Bearer token to authenticate the API >
    ```
4. Run the script using the following command:
    ```bash
    pnpm process-sdk
    ```
    The script will retrieve quotes and movies from the Lord of the Rings API and display the results in the console.

## Testing
To run the tests for the ```LordOfTheRingsClient```:
```bash
pnpm test
```
