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
