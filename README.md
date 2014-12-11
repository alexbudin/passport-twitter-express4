passport-twitter-express4
=========================
An implementation of passport-twitter with Express 4 as the official one is still using Express 3

### Version
0.0.1

### Important

Express 4 no longer depends on Connect, and removes all the built-in middleware from its core, except express.static. This means Express is now an independent routing and middleware web framework, and Express versioning and releases are not affected by middleware updates.

You can read more about it here: http://expressjs.com/guide/migrating-4.html

### Install and run

```sh
$ npm install
```

```sh
node app.js
```

### Remarks
I have included some static files called *index.html*, *account.html* and *login.html*. After you log in you will notice that i am displaying a bit more information just so you have something to play with.
Make sure you **create an app on Twitter first** so you can get the **APP Secret** and **APP key**.
You can do that here: https://apps.twitter.com/
Also remember to include a Callback URL when setting-up the app on Twitter. For the purpose of the example the callback should be
```
http://127.0.0.1:3000/auth/twitter/callback
```

Enjoy and don't forget to follow for more updates.

Twitter: http://www.twitter.com/alexbudin_


License
----

MIT