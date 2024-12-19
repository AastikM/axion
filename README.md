# School Management API

This project provides an API for managing schools, classrooms, and students with secure authentication, CRUD operations, and logging.

## Table of Contents
1. [Installation](#installation)
2. [Setup Instructions](#setup-instructions)
3. [Running the Project](#running-the-project)
4. [Using the API](#using-the-api)
5. [Testing](#testing)
6. [Error Handling](#error-handling)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/school-management-api.git
cd school-management-api
```
### 2. Install Dependencies

Install all necessary npm dependencies:
```bash
npm install
```
This will install the following dependencies: <br/>
	•	express: Web framework to build the server. <br/>
	•	mongoose: MongoDB ORM to interact with the database.<br/>
	•	dotenv: To manage environment variables.<br/>
	•	cors: For handling cross-origin requests.<br/>
	•	express-rate-limit: To protect against brute-force attacks.<br/>
	•	helmet: For securing the app by setting various HTTP headers.<br/>
	•	supertest and jest: For writing and running test cases.<br/>
	•	jsonwebtoken and bcryptjs: For handling JWT authentication and password encryption.<br/>
***
## Setup Instructions

### 1. MongoDB Setup

You will need to have MongoDB installed and running locally or use a remote MongoDB cluster.

### 2. Environment Variables

Create a .env file in the root of the project with the following configuration:
```bash
PORT=3000
MONGO_URI=mongodb://localhost:27017/school_management  (MongoDB connection string)
JWT_SECRET=your_jwt_secret  (Secret key for JWT)
NODE_ENV=PROD
```

This file will store sensitive credentials like the MongoDB URI and JWT secret.

For reference, env.example file is present in the root of folder
***
## Running the Project

### 1. Start MongoDB

Make sure MongoDB is running before starting the server. If you’re running MongoDB locally, execute:
```bash
mongod
```

MongoDB will run on localhost:27017 by default. If you’re using a remote MongoDB, update the connection string in the .env file.<br/>
If it doesnt work, try to set path by running this command:

```bash
mongod --dbpath ~/mongodb-data
```

## 2. Start the Node Server

Run the server:
```bash
node server.js
```

The server should now be running on http://localhost:3000 (default).

***

## Using the API

### 1. Authentication

To access the CRUD operations (for schools, classrooms, students), you need to authenticate with a JWT token.<br/> Here’s how:
#### Login Endpoint: POST /auth/login
Example request:

{
  "username": "superadmin",
  "password": "yourpassword"
}

Response:

{
  "token": "your_jwt_token_here"
}
#### Default username and password are <br>
##### _superadmin:password123_ <br/>
##### _schooladmin:password123_ <br>

Using the Token: Include the token in the Authorization header for all subsequent requests:

curl -H "Authorization: Bearer <your_jwt_token>" http://localhost:3000/schools


### 2. CRUD Operations

#### Once authenticated, you can perform CRUD operations for the following entities:<br/>

	Schools: GET /schools, POST /schools, PUT /schools/:id, DELETE /schools/:id <br/>
	Classrooms: GET /classrooms, POST /classrooms, PUT /classrooms/:id, DELETE /classrooms/:id<br/>
	Students: GET /students/:schoolId, POST /students, PUT /students/:id, DELETE /students/:id<br/>

Ensure the required role (Superadmin or SchoolAdmin) is assigned to the authenticated user for performing these operations.
***
## Testing

### 1. Setup Jest and Supertest

To run tests, you need to have Jest and Supertest installed, which have already been added as development dependencies.</br>
Inside the .env file, write 
```bash
NODE_ENV = test npm test
```

#### 2. Run the following command to run tests:
```bash
npm test
```

This will run Jest tests and output the results.

### 3. Writing Test Cases

Tests are located in the tests/ folder. Example for auth.test.js:
```bash
const request = require('supertest');
const app = require('../server'); // Express app from server.js

describe('POST /auth/login', () => {
  it('should return a JWT token for valid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        username: 'superadmin',
        password: 'yourpassword'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
```
***
## Error Handling

### 1. Error Handling

The project includes basic error handling using try-catch blocks and centralized error handling middleware (middlewares/errorHandler.js). <br/> In case of errors during database queries or any other issues, the app responds with appropriate status codes <br/> and error messages.

Example error response:

{
  "status": 500,
  "message": "Failed to fetch students",
  "error": "Some error message"
}

### 2. Security Measures
	1.	Helmet: Helmet is used to secure HTTP headers and protect against common security vulnerabilities.
	2.	Rate Limiting: To prevent brute-force attacks, the app uses the express-rate-limit package to <br> limit repeated requests to sensitive routes (e.g., login).
	3.	JWT Authentication: The app uses JSON Web Tokens (JWT) for authentication, ensuring secure access to routes.

### Contributing

Feel free to fork this project and submit pull requests. <br/>If you encounter any issues or have suggestions for improvements, open an issue.

Let me know if you need any further changes or additions to this README!
