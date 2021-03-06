# MERN
MERN stack

# Live Web App
https://mern-00.azurewebsites.net

# Setup .env / .env.dev
```
MONGODB_URI=mongodb://localhost:27017/test
SESSION_SECRET=someSecret
OVERNIGHT_LOGGER_MODE=OFF
APP_ROOT=http://localhost:3000
SENDGRID_API_KEY=<Your-Key>
```

# Installation
```
npm i
```

# Watch both server and client
```
npm run watch
```
Should auto open a new tab on your default browser for you

# Build for development
```
npm run build-dev
npm run serve
```
Open browser at "http://localhost:3000"

# Build for production
```
npm run build
npm run serve
```
Open browser at "http://localhost:3000"

# Note
After `build-*`, we cannot open static `client/index.html` as a standalone file since it will not recognise the paths to `js/css` files, have to use `webpack-dev-server` in `watch` mode so that there is a single truth of `root`

# With `/api/graphql` endpoint, on the Graph-i-QL in browser:

## Example 1: Simple Use Case
The `getSingleCourse` query operation is expecting to get one parameter: `$courseID` of type `Int`. By usign the exclamation mark we’re specifying that this parameters needs to be provided.

Within the `getSingleCourse` we’re executing the course query and for this specific ID. We’re specifying that we’d like to retrieve `title, author, description, topic and url` of that that specific course.

Because the `getSingleCourse` query operation uses a dynamic parameter we need to supply the value of this parameter in the `Query Variables` input field

## Example 2: Using Aliases and Fragments
As you can see the query operations requires two parameters: `courseID1` and `courseID2`. The first ID is used for the first query and the second ID is used for the second query.

Another feature which is used is a `fragment`. By using a fragment we’re able to avoid repeating the same set of fields in multiple queries. Instead we’re defining a reusable fragment with name `courseFields` and specific which fields are relevent for both queries in one place.

## Example 3: Using Mutation
A mutation operation is defined by using the `mutation` keyword followed by the name of the mutation operation. In the following example the `updateCourseTopic` mutation is included in the operation and again we’re making use of the `courseFields` fragment.

The mutation operation is using two dynamic variables so we need to assign the values in the query variables input field
