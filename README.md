### ShoppingList

A simple selfhosted shopping list

> ## ⚠️ This is still in development and not ready for release yet.

## Demo

An up to date demo with a simulated backend can be seen here: [https://syntoxr.github.io/ShoppingList/](https://syntoxr.github.io/ShoppingList/)

This is my first web application so feel free to report any issues you find.

## Getting started

> In order to run docker containers, you obviously need to install docker and optionally docker-compose.

The shopping list can be run in two separate docker containers:

- shoppinglist-ui (frontend)
- shoppinglist-be (backend)

I suggest using docker-compose to run them in a stack:

```yml
#docker-compose.yml
version: "3.9"

volumes:
  backend_data:

services:
  frontend:
    image: ghcr.io/syntoxr/shoppinglist-ui:latest
    container_name: shoppinglist-frontend
    ports:
      - 80:80
    hostname: shoppinglist-ui
    environment:
      - API_HOST= http://shoppinglist-be:8080

  backend:
    image: ghcr.io/syntoxr/shoppinglist-be:latest
    container_name: shoppinglist-backend
    expose:
      - 8080
    hostname: shoppinglist-be
    volumes:
      - backend_data:/usr/local/server/data
    environment:
      - 'USERS=[{"name": "user", "password": "notSave"}]'
      - TOKEN_SECRET=RaNdOm-StRiNg
      - TOKEN_LIFETIME=3600
```

can also be seen [here](docker-compose.yml)

### Environment variables

#### Frontend

| Key      | Default value | Description                                       |
| :------- | :-----------: | :------------------------------------------------ |
| API_HOST |       -       | Host which the api requests should be proxied to. |

#### Backend

| Key                | Default value | Description                                                                                                                                                                              |
| :----------------- | :-----------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| USERS              |      [ ]      | JSON array which contains all users that schould be albe to login. If not provided no one will be able to login.                                                                         |
| TOKEN_SECRET       |       ?       | Secret which the JWTs should be signed with. If left empty, a new one will be generated at each startup. When changed all clients have to login again. The longer the secret the better. |
| TOKEN_LIFETIME     |     3600      | Number in seconds new tokens should be valid. Clients with expired tokens obviously can't acces resources anymore.                                                                       |
| LOGIN_RATE_LIMT    |       5       | Allowed number of login requests per minute.                                                                                                                                             |
| RESOURCE_RATE_LIMT |      50       | Allowed number of resource requests per minute.                                                                                                                                          |

## API

General API endpoint: `/api/`

### Websocket

The Frontend uses [socket.io](https://socket.io/) in order to communicate with the backend, wich is reachable under `/api/socket`.

The following rooms are being used (from a client perspective):

| Name        |    Sending     | Acknowledgement                                                  | Description                                                                                                                                 |   Recieving    | Description                                                                                                                                               |
| :---------- | :------------: | ---------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ | :------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ADD_ITEM    | `{item: Item}` | `{code: number, body: {oldId: number, newId: number} \| string}` | JSON object containing the Item that should be added. Returns object containing code and body. Body can contain item ids or an error string | `{item: Item}` | JSON object containing the Item that was added from some other client. This is being send to all clients except the one that send ADD_ITEM.               |
| GET_ITEMS   |      `{}`      | `{code: number, body: Item[] \| string}`                         | Just an empty object in order to request items. Returns object containing code and body. Body can contain item array or an error string     |       -        | -                                                                                                                                                         |
| UPDATE_ITEM | `{item: Item}` |                                                                  | JSON object containing the Item that should be updated                                                                                      | `{item: Item}` | JSON object containing the Item that was updated from some other client. This is being send to all clients except the one that send UPDATE_ITEM.          |
| DELETE_ITEM | `{id: number}` |                                                                  | JSON object containing the id of an item that should be deleted                                                                             | `{id: number}` | JSON object containing the id of an item that was deleted from some other client. This is being send to all clients except the one that send DELETE_ITEM. |

### REST

The Rest endpoint can be used to easily interact with the backend through other services.

The REST endpoints are served under `/api/`

| **Name**     |        **Endpoint**        | **Reguest type** | **Consumes data** |         **Response data**          | **Description**                                                                                         |
| :----------- | :------------------------: | :--------------: | :---------------: | :--------------------------------: | :------------------------------------------------------------------------------------------------------ |
| authenticate |     `/auth/api/login/`     |       GET        |         -         |           `{token: JWT}`           | Requires basic auth cretentials as a Bearer Token authorization header. Responds with a JSON web token. |
| add item     |   `/shoppinglist/item/`    |       POST       |   [Item](#item)   | `{ oldId: number, newId: number }` | Consumes an item with a temporary id and updates backend. Responds with the old- and new id             |
| get items    |   `/shoppinglist/items/`   |       GET        |         -         |           [Item](#item)            | Returns complete list of items in an array of items                                                     |
| update item  | `/shoppinglist/item/{id}/` |      PATCH       |   [Item](#item)   |                 -                  | Consumes an item and updates backend accordingly                                                        |
| delete item  | `/shoppinglist/item/{id}/` |      DELETE      |         -         |                 -                  | Deletes item on backend                                                                                 |

#### Item

The item list is a list of all entered items, regardless of whether they were checked or not. This is used for suggesting previously used items during input.

| property       | datatype | description                                    |
| -------------- | -------- | ---------------------------------------------- |
| name           | string   | Guess you can get that                         |
| amount         | number   | as well as this                                |
| id             | number   | unique id to identify item                     |
| onShoppinglist | boolean  | if the item gets displayed in the shoppinglist |

### Authentication

Authentication is done via a GET request with basic auth credentials to `/api/auth/login`.
With correct credentials the response will be a JSON web token (JWT) which can be used to access all other resources like (REST and socket.io). The token has to be sent in each HTTP request or the socket connect call as a Bearer Token authorization header.

#### Backend settings

Valid users can be set via [environment variables](#environment-variables) .
