# Hours of work

**Day**	| **Time(h)**	|	**Description**
----------|-------------|-----------
7.9.2022 | 2 | Configuring backend and frontend and added linting and basic routing
9.9.2022 | 1 | Added GraphQL to the mix and made sure everything works properly
12.9.2022 | 3 | Started user authentication, added typing and added mongodb support
13.9.2022 | 1 | Finished user authentication and adding users
13.9.2022 | 2.5 | Made sure frontend builds and works with backend. Made some bug-fixes. Started docker support.
14.9.2022 | 1 | Finished docker support, refractored backend and changed project structure
16.9.2022 | 2 | Added tailwind to the frontend, added user authentication to the backend and started modelling more complex data structure
16.9.2022 | 1.5 | Changed user authentication to avoid unneccessary database queries, added getters and setters for games, stores and items with user authentication
17.9.2022 | 1.5 | Added user authentication to the frontend, added mutations for stores, games and items. Started UI.
17.9.2022 | 1.5 | Added navigationbar to the frontend, added UI for listing all games. Made some refactoring and bug fixing.
19.9.2022 | 2 | Configured Jest to work with typescript and added tests to the backend for adding users and login.
20.9.2022 | 2 | Started modelling the item and store data, updated the types for items and stores. 
20.9.2022 | 3 | Started item testing. Most of the time was used to find a way to test GraphQL with token in headers/context. After 2 hours of trial and error I did not find any way. 
21.9.2022 | 2 | Added more validation for stores. Added tests for stores and items.
27.9.2022 | 2 | Finished adders for store and items. Added getters and removers for stores, items and games
28.9.2022 | 2 | Added more tests and changed the Schemas' properties: now most do not have refrences anymore. I will explain why later
28.9.2022 | 1 | Added update resolvers for stores, games and items. Added tests for updating stores
29.9.2022 | 1 | Added more tests for updating stores and items
29.9.2022 | 1.5 | Refactored tests, finished up store and game deletion.
30.9.2022 | 1.5 | Added tests for games and improved some tests
2.10.2022 | 2.5 | Added getter tests for individual games, items and stores. Started testing game and store interactions
3.10.2022 | 4 | Added rest of the test for interactions between games and items and items and stores. Changed Schemas to allow duplicate names if user is different and added validation in the backend for unique names.
4.10.2022 | 1 | Refactored mutations and queries so that they use a dao, not direct access to mongodb
4.10.2022 | 1.5 | Started developing the itemgenerator. Added a way to generate item rarities based on given probabilities and the tests for it
5.10.2022 | 3 | Added Enchantment Schema, updated Item and Game schemas and updated the types, parsers and GraphQL difinitions
7.10.2022 | 1.5 | Added mutations and queries for enchantments. Continued item generator
11.10.2022 | 1.5 | Refactored frontend forms and added a few more
7.11.2022 | 1.5 | Added the rest of the forms to the frontend
7.11.2022 | 2 | Added pages to view Stores, Items and Games
9.11.2022 | 2.5 | Made the first version of the itempool generator
11.11.2022 | 2 | Added support for enchanted armor and uniques in the itempool generator. Renamed itemTypeProbability to itemRarityProbability.
11.11.2022 | 2 | Added tests for itempool generator. Added capacity to store schema and updated everything relating to it.
12.11.2022 | 2 | Made a mutation for itempool generator. Started testing the mutation
14.11.2022 | 1.5 | Added more tests for itempool generator api and added test for enchantment api
14.11.2022 | 1 | Added support for itempool view in the frontend and fixed item generator bug.
15.11.2022 | 2 | Updated esling and fixed eslint errors. Added styling to frontend and refactored item from ItemsView and ItemPoolView
16.11.2022 | 4 | Updated the frontend: Added styling, updated the navigationbar, made it possible to update games, stores, items and enchantments from the frontend.
17.11.2022 | 2.5 | Updated directory structure. Started better docker support and integration with fly.io
20.11.2022 | 2 | Fixed bugs with nginx and docker
Total time | 75 | updated 16.11.2022