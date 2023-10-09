# Design
## Client SDK
`LordOfTheRingsClient` is the main TypeScript class that represents a client for an API related to the Lord of the Rings movies. It imports various types from other files and sets up a base URL and an authentication token for the API in the constructor.  The API URL and token can be set in the `.env` file and then passed to the class constructor.

The class has several methods for interacting with the API, including retrieving a list of movies, retrieving a specific movie by its ID, retrieving quotes for a specific movie, and retrieving a list of quotes. The class also has some helper methods for handling API responses, generating URLs with query parameters, and retrieving the authentication header. The helper methods make it easy to expand to new API endpoints, reducing the code to create new functions for them.  

The `getUrlWithParams` is a helper function called first on endpoints that handle filtering. This function will go through a list of filters in the request and construct the query parameters according to the API specifications.

The `getApi` is another main helper function that is called on all endpoints after the API URL is ready to send. This function calls fetch to do the GET on the API, return the response, and handle any errors that happen.

The code is well-documented with JSDoc comments explaining the purpose and functionality of each method.

## Types
The types in the `types` folder list the main types to be used for requests and responses for the API.  These use generics to fill in with the provided Movie and Quote type to increase modularity.

Filters in the request types are generated based on the passed-in type.  In this way, it can take any type like Movie or Quote, and generate a list of available filters.
