1. List all of the Organizations, so that we can manage them.

# Page Components

1. Page Actions: Create New Organization, link to /authenticate/organizations/create
2. Filter Controls: Able to search
3. View Toggle: Allow us to toggle between list and card view
4. Listing: Shows the Organizations, based on the Group
5. Pagination Controls

# Development Strategies

1. Most implementations (Components, Hooks, Actions, Schemas) needs to be in /features/organizations
2. For Search, View Toggles, Pagination, use Search Params (validated via zod)
