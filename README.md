*********************************************************************
Express MVC Framework
This is an Express.js MVC framework for building web applications.
*********************************************************************

**********************************
        Folder Structure
**********************************
/node-api
│── /node_modules      # Dependencies installed by npm
│── /src
│   │── /controllers   # Handles business logic
│   │── /models        # Defines data schema (if using a database)
│   │── /routes        # Defines API routes
│   │── /config        # Configuration files (e.g., DB connection)
│   │── /middlewares   # Custom middlewares (auth, logging, etc.)
│   │── /services      # Service layer for reusable logic
│   ├── app.js         # Express application setup
│   ├── server.js      # Server entry point
│── .env               # Environment variables
│── package.json       # Node.js project metadata
│── README.md          # Project documentation

/my-api
│── /config
│   ├── db.js              # MySQL connection setup
│   ├── routes.js          # Custom route aliases
│── /controllers
│   ├── SportsController.js
│   ├── UserController.js
│── /utils
│   ├── loader.js          # Loads controllers dynamically
│   ├── helpers.js         # Utility functions
│── /routes
│   ├── index.js           # Main routing logic
│── server.js              # Entry point


***********************
        Features
***********************
    MVC architecture (Model, View, Controller)
    Dynamic Routing
    Auto-load Model and Controller
    Form validation and error handling
    Flash Sessions
    Profiler
    
***************************************
        Tools | Technologies Used
***************************************
    Node.js: JavaScript runtime environment, back-end development tool
    Express: Node.js web application framework, allows us to more easily handle requests and build a robust server.
    EJS: template engine for Node.js and web applications, used to render dynamic HTML
    MySQL: relational database management system, used for storing and retrieving data
    Bootstrap: front-end CSS framework, used for building responsive and mobile-first web applications

**************************
    Instructions to Run
**************************
    Clone the repository
    Install dependencies using npm install
    Start the application using nodemon app.js
    Access the application in a web browser at http://localhost:8080
    Before starting the application, make sure that you have MYSQL installed and running on your machine.

**********************************************************
Created by: Mark Oliver Roman (markoliver01728@gmail.com)
**********************************************************

