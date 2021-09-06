![Speckio](https://i1.wp.com/speckio-teams.com/wp-content/uploads/2020/09/cropped-speckio_logo_full_text_only.png?fit=1700%2C424 "Speckio")

# Speckio API
This project is also contributed by Matthew Mulheran and Jason Hummrich

## Description
The Speckio API is organized around REST, built for [Speckio Teams](http://speckio-teams.com) using [nodejs](https://nodejs.org/en/). Our API has predictable resource-oriented URLs, accepts queries and form-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes and authentication.
The API can run on macOS, Linux or Windows and supports all routes required by the Speckio web app.

## Prerequisites
This API is built on nodejs, the installer can be found [here.](https://nodejs.org/en/download/) The API also requires a MySQL database, the installer can be found [here.](https://dev.mysql.com/downloads/) OpenSSL will be required to create SSL certificates to serve the site on https. OpenSSL can be installed by running ```brew install openssl``` on macOS and ```apt-get install openssl``` on Linux or Windows GitBash.

# Installation
1. The API uses the following packages, which will need to be installed:

    |Package| Version^|
    |-------|------:|
    |bcrypt| 5.0.0|
    |cookie-parser| 1.4.5|
    |cors| 2.8.5|
    |crypto| 1.0.1|
    |debug| 4.1.1|
    |express| 4.17.1|
    |helmet| 3.23.3|
    |http-errors| 1.8.0|
    |http-server| 0.12.3|
    |jade| 1.11.0|
    |jsonwebtoken| 8.5.1|
    |knex| 0.21.2|
    |knex-on-duplicate-update| 1.1.3|
    |morgan| 1.10.0|
    |mysql| 2.18.1|
    |nodemailer| 6.4.12|
    |standard| 14.3.4|
    |swagger-ui-express| 4.1.4|

    To install these dependencies, run the following command in the projects base directory.
    ```bash
    npm install
    ```

2. Run the ```./databases/speckio.sql``` query on MySQL to setup the Speckio database.

3. Change the contents of the ```./knexfile``` to allow the API to access the Speckio database.
    ```javascript
    module.exports = {
    client: 'mysql',
    connection: {
        host: 'localhost', // or an external address that the db was setup on
        database: 'Speckio',
        user: 'yourUsername',
        password: 'yourPassword'
        }
    }
    ```

# Usage

Run ```npm test``` to resolve any formatting errors.

Run ```npm start``` to start the app. Go to https://localhost to view the Swagger Doc. All current routes, their usage and their responses are documented there.

# Issues
**Registering an organisation:**
The API as it stands has no way to add an organisation, user or admin, so it would have to be added via an sql query. There is an sql script that will create a default org, user and add that user as an admin for that org at ```./database/defaultOrgCreation```. This issue can be resolved by implementing the register an organisation route as listed in the backlog.

**EQi and DiSC descriptions incomplete:**
Some of the descptions in the disctypes and eqidescriptions tables is incomplete. Placeholder text has been put in its place. Follow up with Christina on what the descriptions should be.

**Licenses:**
Currently no way to input the end date for a license, or update a license for an organisation.

# Backlog
## Routes
* **Register an organisation:**
    ```
    Route: POST /organisation
    Pre: publicKey, req.body.orgName, req.body.tier, req.body.firstName, req.body.lastName, req.body.email, req.body.password
    Post: 201: organisation created, 400: Bad Request

    Function:
    Check that public key matches some private key pair. Note: No key pair currently exists.
    Insert organisation, tier, isActive:true to org table
    Encrypt the req.body.password -> hash
    Insert firstName, lastName, email, hash, isRegistered:true to users table
    Insert user to admins table
    ```

* **Forgot my password:**
    ```
    Route: POST /forgot
    Pre: req.body.email
    Post: 200: Reset link sent to email address if valid, 400: Missing email

    Function:
    Check if email address matches user
    Generate token -- same as in invite route.
    Insert token, email, userID to forgot -- this table is yet to be created.
    ```

* **Delete a user:**
    ```
    Route: DELETE /user
    Pre: req.query.userID
    Post: 200: user deleted, 400: user not found

    Function:
    Check if current user is orgAdmin
    Delete user id if exists 200: user deleted, else return 400: user not found
    ```

## Tools
* **orgLimit:**
    ```
    Checks to see if an organisation has reached their user limit. Should be run on POST /register
    Pre: orgID
    Post: next(), 400: License limit reached

    Function:
    Find license limit form organisations license tier.
    Count users with orgID in users table
    If count is less thant limit: next()
    else: res.status(400).json({message: License limit reached})
    ```
* **checkInviteAddress:**
    ```
    Check to see if email address for invite is already a user in organisation. Prevents wastage of licenses
    Pre: req.token.orgID, req.query.email
    Post: next(), 400: User already registered

    Function:
    Check if users exists with email in org
    If true: 400: User already regitered,
    Else: next()
    ```

## Contact
Christina Cardarello: christina@speckiogroup.com
