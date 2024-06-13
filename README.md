# Welcome to project...
A small project for organizations where they can opt for a monthly request limit. And on the basic of limit they can access API.


## Database

This project is using postgres, and the below are the db details.

Tables:

```text
1. organizations

- organization_id       - primary key
- name
- email                 - unique
- time_stamp
```

```text
2. organization_subscriptions

- subscription_id       - primary key
- organization_id       - foreign key
- api_key               - unique
- subscription_plan
- monthly_limit
```

```text
3. requests

- request_id            - primary key
- organization_id       - foreign key
- time_stamp
```

Indexes:

```text
1. idx_organization_request_count - (organization_id, time_stamp)
```

Views:

```text
1. view_organization_subscription_details

- organization_id
- name
- email
- subscription_plan
- api_key
- monthly_limit
- time_stamp
```

## Engineering Design Decisions
1. Separated `organization` table and `organization_subscriptions` table. As we may need change in subscription details. To maintain the safety.
2. Created index on `requests` table for getting the `monthly request count` efficiently.
3. Created `view` to remove redundancy of using same join and same information everywhere.
4. Here we could have use `Materialized Views` for the `monthly request count` as a caching. But we need to refresh the view periodically to maintain consistency.
5. Middleware is used to handle the `monthly limit` so we can reuse the functionality.
6. In middleware I have attached `organization data` to the request object. So that we can use in any controller later.
7. Used `row level lock` for the managing the concurrency in the project as multiple read, insert may cause problem.



## Features
- _Register organization_
- _Admin dashboard_ : admin can see all organization details.
- _Organization details_ : this api has a monthly limit.


## Useful commands

The project makes use of node and its package manager to help you out carrying some common tasks such as running project.

### Install dependencies

```console
$ yarn
```

### Run the application

Run the application which will be listening on port `8080`. There are two ways to run the application.

- Run the application with the current code

  ```console
  $ yarn start
  ```

- Run the application with reload on save

  ```console
  $ yarn dev
  ```


## API's

Below is a list of API endpoints with their respective input and output. Please note that the application needs to be running for the following endpoints to work.


#### Register organization

Endpoint

```text
POST api/v1/organization
```

Example of body

```json
{
    "name": <organizationName>,
    "email": <organizationEmail>,
    "subscriptionPlan": <subscriptionPlan>,
    "limit": <monthlyLimit>
}
```

Parameters

| Parameter          | Required | Description                                   | Options / Examples             |
| ------------------ | -------- | --------------------------------------------- | ------------------------------ |
| `name`             | Yes      | Name of an organization                       | `IMB`                          |
| `email`            | Yes      | Email of organization or a person registering | `akshay@imb.com`               |
| `subscriptionPlan` | Yes      | Subscription plan for the monthly limit       | {`basic`, `advance`, `custom`} |
| `limit`            | Optional | Request limit number                          | Positive Integer - `13`        |


Example of output - when organization registered successfully

`HTTP Status Code: 200`

```json
{
    "info": "Organization registered successfully!",
    "data": {
        "organizationID": 1,
        "apiKey": "yT4mCk25dC"
    }
}
```

Example of output - when entered wrong plan

`HTTP Status Code: 400`

```json
{
    "info": "Unknown subscription plan! Please enter correct plan.",
    "data": null
}
```

Example of output - on internal error

`HTTP Status Code: 500`

```json
{
    "info": "Something went wrong. An error has occurred.",
    "data": null
}
```


#### Admin dashboard

Endpoint

```text
GET api/v1/dashboard
```

Example of output - no data

`HTTP Status Code: 404`

```json
{
    "info": "No data found!",
    "data": []
}
```

Example of output - when details fetched

`HTTP Status Code: 200`

```json
{
    "info": "Organization list fetched successfully!",
    "data": [
        {
            "organization_id": 1,
            "name": "JNV",
            "email": "akshay@jnv.com",
            "subscription_plan": "basic",
            "monthly_limit": 10,
            "request_made": "0",
            "request_remaining": "10"
        },
        {
            "organization_id": 2,
            "name": "IMB",
            "email": "akshay@imb.com",
            "subscription_plan": "custom",
            "monthly_limit": 5,
            "request_made": "4",
            "request_remaining": "1"
        }
    ]
}
```

Example of output - on internal error

`HTTP Status Code: 500`

```json
{
    "info": "Something went wrong. An error has occurred.",
    "data": null
}
```


#### Request for organization details - required api-key

Endpoint

```text
GET api/v1/request
```

--header 'x-api-key: yT4mCk25dC'
Headers

| Header      | Description                             | Options / Examples |
| ----------- | --------------------------------------- | ------------------ |
| `x-api-key` | Get api key by registering organization | `yT4mCk25dC`       |


Example of output - When API key is not provided

`HTTP Status Code: 401`

```json
{
    "info": "Please add API key!",
    "data": null
}

```

Example of output - When API key is provided but invalid

`HTTP Status Code: 403`

```json
{
    "info": "Invalid add API key!",
    "data": null
}

```

Example of output - When API key is provided and valid

`HTTP Status Code: 200`

```json
{
    "info": "Organization details fetched successfully!",
    "data": {
        "organizationID": 1,
        "organizationName": "IMB",
        "organizationEmail": "akshay@imb.com",
        "subscriptionPlan": "custom",
        "monthlyRequestLimit": 13,
        "remainingRequestCount": 7
    }
}

```

Example of output - When reached monthly limit

`HTTP Status Code: 429`

```json
{
    "info": "Too may requests.",
    "data": null
}

```

Example of output - on internal error

`HTTP Status Code: 500`

```json
{
    "info": "Something went wrong. An error has occurred.",
    "data": null
}
```


## TODO's
- Need to hash the `APIKey` and then store in the DB for security purpose.
- Need to implement the `isAdmin` check using middleware for Authorization purpose.
- Add more routes for dashboard and organization to enrich the experience.
- Need to add test cases for whole project.



## Thank you!! Happy Coding!!