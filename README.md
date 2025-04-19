# Flask React Project

This is the starter for the Flask React project.

## Getting started

1. Clone this repository (only this branch).

2. Install dependencies.

   ```bash
   pipenv install -r requirements.txt
   ```

3. Create a __.env__ file based on the example with proper settings for your
   development environment.

4. Make sure the SQLite3 database connection URL is in the __.env__ file.

5. This starter organizes all tables inside the `flask_schema` schema, defined
   by the `SCHEMA` environment variable.  Replace the value for
   `SCHEMA` with a unique name, **making sure you use the snake_case
   convention.**

6. Get into your pipenv, migrate your database, seed your database, and run your
   Flask app:

   ```bash
   pipenv shell
   ```

   ```bash
   flask db upgrade
   ```

   ```bash
   flask seed all
   ```

   ```bash
   flask run
   ```

7. The React frontend has no styling applied. Copy the __.css__ files from your
   Authenticate Me project into the corresponding locations in the
   __react-vite__ folder to give your project a unique look.

8. To run the React frontend in development, `cd` into the __react-vite__
   directory and run `npm i` to install dependencies. Next, run `npm run build`
   to create the `dist` folder. The starter has modified the `npm run build`
   command to include the `--watch` flag. This flag will rebuild the __dist__
   folder whenever you change your code, keeping the production version up to
   date.

## Deployment through Render.com

First, recall that Vite is a development dependency, so it will not be used in
production. This means that you must already have the __dist__ folder located in
the root of your __react-vite__ folder when you push to GitHub. This __dist__
folder contains your React code and all necessary dependencies minified and
bundled into a smaller footprint, ready to be served from your Python API.

Begin deployment by running `npm run build` in your __react-vite__ folder and
pushing any changes to GitHub.

Refer to your Render.com deployment articles for more detailed instructions
about getting started with [Render.com], creating a production database, and
deployment debugging tips.

From the Render [Dashboard], click on the "New +" button in the navigation bar,
and click on "Web Service" to create the application that will be deployed.

Select that you want to "Build and deploy from a Git repository" and click
"Next". On the next page, find the name of the application repo you want to
deploy and click the "Connect" button to the right of the name.

Now you need to fill out the form to configure your app. Most of the setup will
be handled by the __Dockerfile__, but you do need to fill in a few fields.

Start by giving your application a name.

Make sure the Region is set to the location closest to you, the Branch is set to
"main", and Runtime is set to "Docker". You can leave the Root Directory field
blank. (By default, Render will run commands from the root directory.)

Select "Free" as your Instance Type.

### Add environment variables

In the development environment, you have been securing your environment
variables in a __.env__ file, which has been removed from source control (i.e.,
the file is gitignored). In this step, you will need to input the keys and
values for the environment variables you need for production into the Render
GUI.

Add the following keys and values in the Render GUI form:

- SECRET_KEY (click "Generate" to generate a secure secret for production)
- FLASK_ENV production
- FLASK_APP app
- SCHEMA (your unique schema name, in snake_case)

In a new tab, navigate to your dashboard and click on your Postgres database
instance.

Add the following keys and values:

- DATABASE_URL (copy value from the **External Database URL** field)

**Note:** Add any other keys and values that may be present in your local
__.env__ file. As you work to further develop your project, you may need to add
more environment variables to your local __.env__ file. Make sure you add these
environment variables to the Render GUI as well for the next deployment.

### Deploy

Now you are finally ready to deploy! Click "Create Web Service" to deploy your
project. The deployment process will likely take about 10-15 minutes if
everything works as expected. You can monitor the logs to see your Dockerfile
commands being executed and any errors that occur.

When deployment is complete, open your deployed site and check to see that you
have successfully deployed your Flask application to Render! You can find the
URL for your site just below the name of the Web Service at the top of the page.

**Note:** By default, Render will set Auto-Deploy for your project to true. This
setting will cause Render to re-deploy your application every time you push to
main, always keeping it up to date.

[Render.com]: https://render.com/
[Dashboard]: https://dashboard.render.com/






# API DOCUMENTATION

_________________________


## API Documentation



## USER AUTHENTICATION/AUTHORIZATION




### All endpoints that require authentication

All endpoints that require a current user to be logged in.

* Request: endpoints that require authentication
* Error Response: Require authentication
  * Status Code: 401
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Authentication required"
    }
    ```

### All endpoints that require proper authorization

All endpoints that require authentication and the current user does not have the
correct role(s) or permission(s).

* Request: endpoints that require proper authorization
* Error Response: Require proper authorization
  * Status Code: 403
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Forbidden"
    }
    ```

### Get the Current User

Returns the information about the current user that is logged in.

* Require Authentication: false
* Request
  * Method: GET
  * Route path: /api/session
  * Body: none

* Successful Response when there is a logged in user
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith"
      }
    }
    ```

* Successful Response when there is no logged in user
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "user": null
    }
    ```

### Log In a User

Logs in a current user with valid credentials and returns the current user's
information.

* Require Authentication: false
* Request
  * Method: POST
  * Route path: /api/session
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "credential": "john.smith@gmail.com",
      "password": "secret password"
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith"
      }
    }
    ```

* Error Response: Invalid credentials
  * Status Code: 401
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Invalid credentials"
    }
    ```

* Error response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "credential": "Email or username is required",
        "password": "Password is required"
      }
    }
    ```

### Sign Up a User

Creates a new user, logs them in as the current user, and returns the current
user's information.

* Require Authentication: false
* Request
  * Method: POST
  * Route path: /api/users
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith@gmail.com",
      "username": "JohnSmith",
      "password": "secret password"
    }
    ```

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith"
      }
    }
    ```

* Error response: User already exists with the specified email or username
  * Status Code: 500
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "User already exists",
      "errors": {
        "email": "User with that email already exists",
        "username": "User with that username already exists"
      }
    }
    ```

* Error response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "email": "Invalid email",
        "username": "Username is required",
        "firstName": "First Name is required",
        "lastName": "Last Name is required"
      }
    }
    ```




<!--

Portfolio

GET portfolio -- view portfolio                            (/api/portfolio)
POST portfolio -- create new portfolio                     (/api/portfolio)    ?!?!?!?!?!?
PATCH portfolio -- add fake money                          (/api/portfolio)
DELETE portfolio -- delete portfolio                       (/api/portfolio)    ?!?!?!?!?!?




Stock Details

GET stock details   -- api call to real time market        (/api/stocks/:stockId)
POST stocks  -- Buy stocks and add it to portfolio         (/api/portfolio/stocks/:stockId)
   -_- open market position
PATCH stocks -- Increase or Decrease market position,      (/api/portfolio/stocks/:stockId)
   shares , equity.... Update amount of stocks to
   purchase or sell -_- update market position
DELETE stocks -- close position on stock                    (/api/portfolio/stocks/:stockId)




Watchlist

GET watched stocks -- returns a list of watched stocks      (/api/watchlist)
POST watched stock -- add stock to watchlist                (/api/watchlist)
DELETE watched stock -- Removes stock from watchlist        (/api/watchlist/stocks/:stockId)




Search

GET Specific Stock -- filter stocks by name                 (/api/stocks)
GET Stock Deatails -- Stock details from specific stock     (/api/stocks/:stockId)




## Bonus
Transactions

GET Transaction history -- returns a list of all            (/api/transactions)
  transactions ordered by dates and times
POST Transaction -- order stocks at specific                (/api/transactions)
  times/frequencies.
DELETE Transactions -- cancel orders/transactions           (/api/transactions/:transactionId)



 -->






## STOCKS





### Get all Stocks

Returns all the stocks.

* Require Authentication: false
* Request
  * Method: GET
  * Route path: /api/stocks
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "Stocks": [
        {
          "id": 1,
          "name": "Toad Coin",
          "price": 123,
          "marketcap":100000000.00,
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36",
        }
      ]
    }
    ```











### Get all Stocks owned by the Current User
|PORTFOLIO|
Returns all the stocks owned (created) by the current user.

* Require Authentication: true
* Request
  * Method: GET
  * Route path: /api/portfolio/stocks
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "Portfolio": {
         "user": {
            "id":1,
            "username":"demo user ",
            "email":"demo@aa.io"
         },

         "total_cash": 100,
         "available_cash": 30,

         "Stocks": [
         {
            "id": 1,
            "name": "Toad Coin",
            "price": 123,
            "marketcap":100000000.00,
            "createdAt": "2021-11-19 20:39:36",
            "updatedAt": "2021-11-19 20:39:36",

         }
         ]
      }
    }
    ```








### Get details of a Stock from an id

Returns the details of a stock specified by its id.

* Require Authentication: false
* Request
  * Method: GET
  * Route path: /api/stocks/:stockId
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "id": 1,
      "name": "Toad Coin",
      "price": 123,
      "marketcap":100000000.00,
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36",

    }
    ```

* Error response: Couldn't find a Stock with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Stock couldn't be found"
    }
    ```
 ### Buy a Stock

Creates and returns a new stock.

* Require Authentication: true
* Require validations
* Request
  * Method: POST
  * Route path: /api/portfolio/stocks/:stockId
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {


      "name": "Toad Coin",
      "price": 123,
      "marketcap":100000000.00,
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36",
         "transactions": {
            "bought_at":123.456,
            "shares": 10,
            "createdAt": "2021-11-19 20:39:36",
            "updatedAt": "2021-11-19 20:39:36",
         },
      "users": {
         "id":1,
         "username":"DEMO USER YEAH"
      }
    }
    ```

* Successful Response
  * Status Code: 201
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
     {


      "name": "Toad Coin",
      "price": 123,
      "marketcap":100000000.00,
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36",
         "transactions": {
            "bought_at":123.456,
            "shares": 10,
            "createdAt": "2021-11-19 20:39:36",
            "updatedAt": "2021-11-19 20:39:36",
         },
      "users": {
         "id":1,
         "username":"DEMO USER YEAH"
      }
    }
    ```

* Error Response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Bad Request",
      "errors": {
        "name": "Name must be less than 50 characters",
        "price": "Price must be a positive number",
        "bought_at":"bought_at must be a positive number",
        "shares":"shares must be a positive number"
      }
    }
    ```







### Edit a Stock

Updates user position and returns user portfolio.

* Require Authentication: true
* Require proper authorization: Stock must belong to the current user
* Request
  * Method: PATCH
  * Route path: /api/portfolio/stocks/:stockId
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "name": "Toad Coin",
      "price": 123,
      "marketcap":100000000.00,
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36",
         "transactions": {
            "bought_at":123.456,
            "sold_at":123.456,
            // bought_at && sold_at can be null.  < xor >
            "shares": 10,
            "createdAt": "2021-11-19 20:39:36",
            "updatedAt": "2021-11-19 20:39:36",
         },
      "users": {
         "id":1,
         "username":"DEMO USER YEAH",
         "available_cash": 123
      }
    }
    ```

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
    "name": "Toad Coin",
      "price": 123,
      "marketcap":100000000.00,
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36",
         "transactions": {
            "bought_at":123.456,
            "sold_at":123.456,
            "shares": 10,
            "createdAt": "2021-11-19 20:39:36",
            "updatedAt": "2021-11-19 20:39:36",
         },
      "users": {
         "id":1,
         "username":"DEMO USER YEAH",
         "available_cash": 123
      }
    }
    ```

* Error Response: Body validation errors
  * Status Code: 400
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Bad Request", // (or "Validation error" if generated by Sequelize),
      "errors": {
        "name": "Name must be less than 50 characters",
        "price": "Price per day must be a positive number",
        "bought_at": "Must be a positive number",
        "sold_at": "Must be a positive number",
        "available_cash": "available_cash must be greater than stock price",
        "shares": "shares must be positive number",
        "": ""
      }
    }
    ```

* Error response: Couldn't find a Stock with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Stock couldn't be found"
    }
    ```

### Delete a Stock

Sells off the stock completely and Removes it from user portfolio.

* Require Authentication: true
* Require proper authorization: Stock must belong to the current user
* Request
  * Method: DELETE
  * Route path: /api/portfolio/stocks/:stockId
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Successfully deleted"
    }
    ```

* Error response: Couldn't find a Stock with the specified id
  * Status Code: 404
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "message": "Stock couldn't be found"
    }
    ```

## WatchList

### Get all Stocks of the Current User Watchlist

Returns all the stocks added to watchlist by the current user.

* Require Authentication: true
* Request
  * Method: GET
  * Route path: /api/watchlist
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:

    ```json
    {
      "Watchlist": [
        {
          "id": 1,
          "userId": 1,
          "createdAt": "2021-11-19 20:39:36",
          "updatedAt": "2021-11-19 20:39:36" ,
          "User": {
            "id": 1,
            "firstName": "John",
            "lastName": "Smith"
          },
          "Stocks": [
            {
            "id": 1,
            "name": "Netflix",
            "price": 123,
            "market_cap": 1000000000,
            },
            {
            "id": 2,
            "name": "Amazon",
            "price": 123,
            "market_cap": 1000000000,
            }
          ],
        }
      ]
    }
    ```



### Add stock to watchlist                (/api/watchlist)
add stock to watchlist


* Require Authentication: true
* Request
  * Method: POST
  * Route path: /api/watchlist/stocks/:stockId
  * Body: none

* Successful Response
  * Status Code: 200
  * Headers:
    * Content-Type: application/json
  * Body:
  ```json
    {


      "name": "Toad Coin",
      "price": 123,
      "marketcap":100000000.00,
      "createdAt": "2021-11-19 20:39:36",
      "updatedAt": "2021-11-19 20:39:36",
         "transactions": {
            "bought_at":123.456,
            "shares": 10,
            "createdAt": "2021-11-19 20:39:36",
            "updatedAt": "2021-11-19 20:39:36",
         },
      "users": {
         "id":1,
         "username":"DEMO USER YEAH"
      }
    }
    ```




add stuff to readme for a git commit
add stuff to readme for a git commit

add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
add stuff to readme for a git commit
