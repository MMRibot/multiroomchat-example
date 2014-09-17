#This is a multiroom chatroom example using node.
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

#####Note: If you know before-hand exactly all of the dependencies and dev-dependencies you will be using, this a faster way to set up your application, because it allows you to install all of your dependencies with one command in the terminal.

Type `npm install` or `sudo npm install` depending on your system settings.

Once you have finished these first simple steps, you can start typing the code for your application.

In this example we start by defining the **server logic first** and create *server.js* in our root directory.
