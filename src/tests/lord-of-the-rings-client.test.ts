import { LordOfTheRingsClient } from '../api-clients/lord-of-the-rings-client';
import { FilterComparison } from "../types/requests/filter-comparison";
import { GetMoviesRequest } from "../types/requests/get-movies-request";
import { GetQuotesRequest } from "../types/requests/get-quotes-request";
import { GetMoviesResponse } from '../types/responses/get-movies-response';
import { GetQuotesResponse } from '../types/responses/get-quotes-response';

describe('LordOfTheRingsClient', () => {
  let apiClient: LordOfTheRingsClient;

  const unmockedFetch = global.fetch;
  const apiUrl = 'http://test.lotr.com/v1';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-auth-token'
    };

  // Mock the movie response.
  const moviesResponse: Partial<GetMoviesResponse> = {
    docs: [
      { 
        _id: '5cd95395de30eff6ebccde5c', 
        name: 'The Fellowship of the Ring',
        runtimeInMinutes: 178,
        budgetInMillions: 2000000,
        boxOfficeRevenueInMillions: 3000000,
        academyAwardNominations: 2,
        academyAwardWins: 1,
        rottenTomatoesScore: 100
      },
      {
        _id: "5cd95395de30eff6ebccde5b",
        name: "The Two Towers",
        runtimeInMinutes: 179,
        budgetInMillions: 94,
        boxOfficeRevenueInMillions: 926,
        academyAwardNominations: 6,
        academyAwardWins: 2,
        rottenTomatoesScore: 96
    },
      { 
        _id: '5cd95395de30eff6ebccde5d', 
        name: 'The Return of the King',
        runtimeInMinutes: 178,
        budgetInMillions: 2000000,
        boxOfficeRevenueInMillions: 3000000,
        academyAwardNominations: 2,
        academyAwardWins: 1,
        rottenTomatoesScore: 100 },
    ],
    total: 3
 };

  // Mock the quote response.
  const quotesResponse: Partial<GetQuotesResponse>= {
    docs: [
      {   
        _id: '5cd96e05de30eff6ebcce7e9',
        movie: '5cd95395de30eff6ebccde5c',
        character: '5cd99d4bde30eff6ebccfe9e', 
        dialog: 'Old Tom Bombadil is a merry fellow, Bright blue his jacket is, and his boots are yellow.',
      },
      {   
        _id: '5cd96e05de30eff6ebcce7ea',
        movie: '5cd95395de30eff6ebccde5c',
        character: '5cd99d4bde30eff6ebccfe9e', 
        dialog: 'I do not love the bright sword for its sharpness, nor the arrow for its swiftness, nor the warrior for his glory. I love only that which they defend.' 
      }
    ],
    total: 2
};

  beforeEach(() => {
    apiClient = new LordOfTheRingsClient(apiUrl, 'your-auth-token');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    global.fetch = unmockedFetch;
  });

  describe('missing setup', () => {
    beforeEach(() => {
        apiClient['authToken'] = undefined;
    });
    it('should throw an error if the API url is missing', () => {
      expect(() => { 
        const sdk = new LordOfTheRingsClient('', 'your-auth-token'); 
      })
        .toThrow('Base API URL is missing.');
    });
    it('should throw an error if the API url is missing', () => {
      expect(() => { 
        const sdk = new LordOfTheRingsClient('url', ''); 
      })
        .toThrow('Authentication token is missing.');
    });
    it('should throw an error if the authentication token is missing when making a request', async () => {        
        await expect(apiClient.getMovies())
          .rejects
          .toThrow('Request failed: Authentication required.');
    });
  });

  describe('getMovies', () => {
    it('should retrieve a list of movies', async () => {
        const mockFetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => moviesResponse
        });

        // Replace global fetch with mock
        global.fetch = mockFetch;

        const result = await apiClient.getMovies();

        expect(result).toEqual(moviesResponse);
        expect(mockFetch).toHaveBeenCalledWith(`${apiUrl}/movie`, { headers });
    });

    it('should retrieve a list of movies with filter', async () => {
        const mockFetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => moviesResponse
        });

        // Replace global fetch with mock
        global.fetch = mockFetch;

        // Get movies with filter
        const request: GetMoviesRequest = {
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
                }
            }
        };

        const result = await apiClient.getMovies(request);

        expect(result).toEqual(moviesResponse);
        expect(mockFetch).toHaveBeenCalledWith(`${apiUrl}/movie?name=The,Of&runtimeInMinutes!=128&budgetInMillions>100000&boxOfficeRevenueInMillions<3000000&academyAwardNominations<=2&academyAwardWins>=4`, { headers });
    });

    it('throws error on non-200 response', async () => {    
        const mockFetch = jest.fn().mockResolvedValue({
          ok: false,
          statusText: 'Not Found'
        });
  
        global.fetch = mockFetch;
  
        await expect(apiClient.getMovies())
          .rejects
          .toThrow('Request failed: Not Found');
    });
  });

  describe('getMovieById', () => {
    it('should retrieve a movie by its ID', async () => {
        const id = moviesResponse.docs![0]._id;
        const expectedMovie = { _id: id, name: 'The Fellowship of the Ring: Merry Fellow Edition' };
    
        const mockFetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => expectedMovie
        });
        global.fetch = mockFetch;

        const result = await apiClient.getMovieById(id);

        expect(result).toEqual(expectedMovie);
        expect(mockFetch).toHaveBeenCalledWith(`${apiUrl}/movie/${id}`, { headers });
    });

    it('throws error on non-200 response', async () => {
        const movieId = moviesResponse.docs![0]._id;
        const mockFetch = jest.fn().mockResolvedValue({
          ok: false,
          statusText: 'Not Found'
        });
  
        global.fetch = mockFetch;
  
        await expect(apiClient.getMovieById(movieId))
          .rejects
          .toThrow('Request failed: Not Found');
    });
  });

  describe('getQuotesByMovie', () => {
    it('should retrieve quotes by movie ID', async () => {
        const movieId = moviesResponse.docs![0]._id;
            
        const mockFetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => quotesResponse
        });
        global.fetch = mockFetch;

        const result = await apiClient.getQuotesByMovie(movieId);

        expect(result).toEqual(quotesResponse);
        expect(mockFetch).toHaveBeenCalledWith(`${apiUrl}/movie/${movieId}/quote`, { headers });
    });

    it('throws error on non-200 response', async () => {
        const movieId = moviesResponse.docs![0]._id;
        const mockFetch = jest.fn().mockResolvedValue({
          ok: false,
          statusText: 'Not Found'
        });
  
        global.fetch = mockFetch;
  
        await expect(apiClient.getQuotesByMovie(movieId))
          .rejects
          .toThrow('Request failed: Not Found');
    });
  });

  describe('getQuotes', () => {
    it('should retrieve a list of quotes', async () => {
        const mockFetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => quotesResponse
        });

        // Replace global fetch with mock
        global.fetch = mockFetch;

        const result = await apiClient.getQuotes();

        expect(result).toEqual(quotesResponse);
        expect(mockFetch).toHaveBeenCalledWith(`${apiUrl}/quote`, { headers });
    });

    it('should retrieve a list of quotes with filter', async () => {
        const mockFetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => quotesResponse
        });

        // Replace global fetch with mock
        global.fetch = mockFetch;

        // Get movies with filter
        const request: GetQuotesRequest = {
            filters: {
                dialog: { 
                    comparison: FilterComparison.Exists
                },
                movie: undefined
            }
        };
        
        const result = await apiClient.getQuotes(request);

        expect(result).toEqual(quotesResponse);
        expect(mockFetch).toHaveBeenCalledWith(`${apiUrl}/quote?dialog`, { headers });
      });
    });

    describe('getQuoteById', () => {
        it('should retrieve a quote by its ID', async () => {
            const id = quotesResponse.docs![0]._id;
            const expectedQuote = { 
                _id: id, 
                movie: '5cd95395de30eff6ebccde5c', 
                character: '5cd99d4bde30eff6ebccfe9e', 
                dialog: 'Old Tom Bombadil is a merry fellow, Bright blue his jacket is, and his boots are yellow.' 
            };
        
            const mockFetch = jest.fn().mockResolvedValue({
                ok: true,
                json: async () => expectedQuote
            });
            global.fetch = mockFetch;
    
            const result = await apiClient.getQuoteById(id);
    
            expect(result).toEqual(expectedQuote);
            expect(mockFetch).toHaveBeenCalledWith(`${apiUrl}/quote/${id}`, { headers });
        });
    });
});
