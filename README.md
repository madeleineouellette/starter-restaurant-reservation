# Periodic Tables

## Deployed site: https://periodic-tables-frontend-mo.herokuapp.com/dashboard

## Table of Contents
* [General Information](#general-information)
* [Technologies](#technologies)
* [Summary of Features](#summary-of-features)
* [API](#api)
* [Installation](#installation)
* [Running Tests](#running-tests)

## General Information
Periodic Tables is a restaurant reservation management application that allows the user to manage reservations and table assignments. The user has the ability to create new reservations, create new tables and dictate the capacity, and seat customers at tables when they arrive. Reservations can also be edited and cancelled. 

## Technologies
### Frontend
* React JS
* CSS
* Bootstrap 4
* JSX

### Backend
* PostgreSQL
* Knex JS
* Node JS
* Express JS

## Summary of Features

## API

### Create Reservation

**POST** `/reservations`

* Required Body:

| Param | Type |
|-------|------|
|`first_name`| `string`|
|`last_name`| `string`|
|`mobile_number`| `string`|
|`people`|`integer`|
|`reservation_date`| `date`|
|`reservation_time`|`time`|

### Get Reservation by ID

`/reservations/:reservation_id`

#### Available Methods

* **GET** - returns a reservation given an existing reservation ID
* **PUT** - updates an existing reservation given an existing reservation ID

* Required Params: `reservation_id (int)`

* Required Body:

| Param | Type |
|-------|------|
|`first_name`| `string`|
|`last_name`|`string`|
| `mobile_number` | `string`|
| `people`| `integer` |
| `reservation_date`| `date`|
| `reservation_time`| `time`|

### Get Reservation Status

**GET** `/reservations/:reservation_id/status`

Returns a status of `booked` `seated` `finished` or `cancelled` for the given reservation.

### Create Table

**POST** `/tables`

Creates a table to be listed in the tables list.

* Requried Body:  

| Params | Type |
|--------|------|
| `capacity` | `integer` |
| `table_name` | `string` |

### Get Tables

**GET** `/tables`

Returns all available tables.

### Seat Table

**PUT** `/tables/:table_id/seat`

Seats a reservation, tying the table directly to that reservation. This also updates the reservation status to `seated`.

* Required Body:  

| Params | Type |
|--------|------|
| `reservation_id` | `integer` |

### Finish Table

**DELETE** `/tables/:table_id/seat`

Clears the table's association to a reservation, and sets that reservation's status to `finished`.

## Installation
1. Fork and clone this repository.
1. Run `cp ./back-end/.env.sample ./back-end/.env`.
1. Update the `./back-end/.env` file with the connection URL's to your ElephantSQL database instance.
1. Run `cp ./front-end/.env.sample ./front-end/.env`.
1. You should not need to make changes to the `./front-end/.env` file unless you want to connect to a backend at a location other than `http://localhost:5000`.
1. Run `npm install` to install project dependencies.
1. Run `npm run start:dev` to start your server in development mode.

### Database setup

 Set up four new ElephantSQL database instances - development, test, preview, and production.

### Knex

Run `npx knex` commands from within the `back-end` folder, which is where the `knexfile.js` file is located.

## Running Tests

This project has unit, integration, and end-to-end (e2e) tests.

Test are split up by user story. You can run the tests for a given user story by running:

`npm run test:X` where `X` is the user story number.

Have a look at the following examples:

* `npm run test:1` runs all the tests for user story 1 (both frontend and backend).
* `npm run test:3:backend` runs only the backend tests for user story 3.
* `npm run test:3:frontend` runs only the frontend tests for user story 3.

Whenever possible, frontend tests will run before backend tests to help you follow outside-in development.

> **Note** When running `npm run test:X` If the frontend tests fail, the tests will stop before running the backend tests. Remember, you can always run `npm run test:X:backend` or `npm run test:X:frontend` to target a specific part of the application.

If you would like a reminder of which npm scripts are available, run `npm run` to see a list of available commands.

Note that the logging level for the backend is set to `warn` when running tests and `info` otherwise.

> **Note**: After running `npm test`, `npm run test:X`, or `npm run test:e2e` you might see something like the following in the output: `[start:frontend] Assertion failed:`. This is not a failure, it is just the frontend project getting shutdown automatically.

> **Note**: If you are getting a `unable to resolve dependency tree` error when running the frontend tests, run the following command: `npm install --force --prefix front-end`. This will allow you to run the frontend tests.