Please answer the following questions about your work:

0 - What language did you program in?
Typescript

1 - Have you manually tested the SDK?
Yes. Use ```pnpm process-client```

2 - Did you add a test suite? If so, how will we use it? If not, why?

3 - Did you use any 3rd party library? Why did you use it? What are the tradeoffs?
Jest for testing

4 - Do you feel this SDK makes it easier to interact with the API?
The filtering is more clear on how to use.

5 - If you had more time, what else would you add?
Paging and sorting.  I have where I would add it in TODO comments.

6 - What would you change in your current SDK solution?
Ability to filter not relying on knowing the ID of something.  Like if you want quotes for movie, then give the name of the movie and it will lookup the ID to pass through.

7 - On a scale of 1 to 10 (10 being the highest), how would you rate this solution?
8

8 - Anything else we should keep in mind when we evaluate the project?
I never really tested it being an NPM package that I can actually publish and share across other projects.
