# mern
MERN stack

# Setup .env
```
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/test
SESSION_SECRET=someSecret
```

# Note
After `build-*`, we cannot open static `client/index.html` as a standalone file since it will not recognise the paths to `js/css` files, have to use `webpack-dev-server` in `watch` mode so that there is a single truth of `root`

# With `/graphql` endpoint, on the Graph-i-QL in browser:

## Example 1:
The `getSingleCourse` query operation is expecting to get one parameter: `$courseID` of type `Int`. By usign the exclamation mark we’re specifying that this parameters needs to be provided.

Within the `getSingleCourse` we’re executing the course query and for this specific ID. We’re specifying that we’d like to retrieve `title, author, description, topic and url` of that that specific course.

Because the `getSingleCourse` query operation uses a dynamic parameter we need to supply the value of this parameter in the `Query Variables` input field

```
query getSingleCourse($courseID: Int!) {
  course(id: $courseID) {
    title
    author
    description
    topic
    url
  }
}

============ Query Variables ============
{
    "courseID": 1
}
```

## Example 2: Using Aliases and Fragments
As you can see the query operations requires two parameters: `courseID1` and `courseID2`. The first ID is used for the first query and the second ID is used for the second query.

Another feature which is used is a `fragment`. By using a fragment we’re able to avoid repeating the same set of fields in multiple queries. Instead we’re defining a reusable fragment with name `courseFields` and specific which fields are relevent for both queries in one place.

```
query getCourseWithFragments($courseID1: Int!, $courseID2: Int!) {
      course1: course(id: $courseID1) {
             ...courseFields
      },
      course2: course(id: $courseID2) {
            ...courseFields
      } 
}
fragment courseFields on Course {
  title
  author
  description
  topic
  url
}

============ Query Variables ============
{ 
    "courseID1": 1,
    "courseID2": 2
}
```
