#This is a multiroom chatroom example/demo using node.
**All code is commented and explained as best possible.**

---

####Layout

> First we start by defining our folder layout

We do this by creating a root folder to hold all our other files and folders.
Create two folders(*subdirectories of root*). One named (names can be changed according to your preference) *lib* and a second named *public*.

*lib* will hold some of the server side logic

Within *public* created two more folders(*subdirectories of public*) - *scripts*, where client side logic will be stored, and *stylesheets* where **CSS** files will be stored.

> Second we will create a package.json file for our application dependencies and description

`npm init` will initiate the *package.json* for you in your terminal and you can fill it in there

####OR

`touch package.json` in our root directory and open it with your text editor(**atom, sublime, etc**)

Fill-in your *package.json* file with the following:

`{
    "name": "chatrooms",
    "version": "0.0.1",
    "description": "Minimalist multiroom char server",
    "dependencies": {
      "socket.io": "~0.9.6",
      "mime": "~1.2.7"
    }
  }`

#####Note: If you know before-hand exactly all of the dependencies and devDependencies you will be using, this is a faster way to set up your application, because it allows you to install all of your dependencies with one command in the terminal.

Type `npm install` or `sudo npm install` depending on your system settings.

> Once you have finished these first simple steps, you can start typing the code for your application.

In this example we start by defining the **server logic first** and create *server.js* in our root directory.

> Once we have created *server.js*, we then create *index.html* and *styles.css*, our static files.

> Having done that we focus our attention to our chatroom logic on the server-side and write *chat_server.js* using **socket.io**.

---

Read more about socket.io and websockets at:
- http://socket.io/
- http://en.wikipedia.org/wiki/Socket.IO

---

####Note:
**To connect the server side to the client side we will use socket.io.**

---

Our chat application will need to handle the following types of tasks:
- Guest name assignment
- Room-change requests
- Name-change requests
- Sending chat messages
- Room creation
- User disconnection

To handle these, we will create helper functions in our *chat_server.js* file.

---

> In web applications there are, from a security perspective, two types of data.

There's *trusted* text data and there's *untrusted* text data. The first is supplied by the web application and the second by the users of
the application. Text data from users is considered untrusted because
malicious users may intentionally submit text data that includes JavaScript logic in *script* tags.
This method of highjacking a web application is called **cross-site scripting (XXS) attack**.
The chat application will sanitize this sort of untrusted text by transforming special characters into HTML entities and
displaying them rather than interpreting them.
