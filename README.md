### ShoppingList

A simple selfhosted shopping list

⚠️ This is still in development and not ready for release yet.

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
```

## API

General API endpoint: `/api/`

### Websocket

The Frontend uses [socket.io](https://socket.io/) in order to communicate with the backend.

The following rooms are being used (from a client perspective):

| Name        | Sending        | Acknowledgement                                                  | Description                                                                                                                                 | Recieving      | Description                                                                                                                                               |
| :---------- | :------------- | ---------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ | :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ADD_ITEM    | `{item: Item}` | `{code: number, body: {oldId: number, newId: number} \| string}` | JSON object containing the Item that should be added. Returns object containing code and body. Body can contain item ids or an error string | `{item: Item}` | JSON object containing the Item that was added from some other client. This is being send to all clients except the one that send ADD_ITEM.               |
| GET_ITEMS   | `{}`           | `{code: number, body: Item[] \| string}`                         | Just an empty object in order to request items. Returns object containing code and body. Body can contain item array or an error string     | -              | -                                                                                                                                                         |
| UPDATE_ITEM | `{item: Item}` |                                                                  | JSON object containing the Item that should be updated                                                                                      | `{item: Item}` | JSON object containing the Item that was updated from some other client. This is being send to all clients except the one that send UPDATE_ITEM.          |
| DELETE_ITEM | `{id: number}` |                                                                  | JSON object containing the id of an item that should be deleted                                                                             | `{id: number}` | JSON object containing the id of an item that was deleted from some other client. This is being send to all clients except the one that send DELETE_ITEM. |

### REST

The Rest endpoint can be used to easily interact with the backend through other services.

The REST shopping list endpoint is served under `/api/shoppinglist`

The item list is a list of all entered items, regardless of whether they were checked or not. This is used for suggesting previously used items during input.

| **Name**    | **Endpoint**  | **Reguest type** | **Consumes data** | **Response data**                  | **Description**                                                                             |
| :---------- | :------------ | :--------------- | :---------------- | :--------------------------------- | :------------------------------------------------------------------------------------------ |
| add item    | `/item/`      | POST             | [Item](#item)     | `{ oldId: number, newId: number }` | Consumes an item with a temporary id and updates backend. Responds with the old- and new id |
| get items   | `/items/`     | GET              | -                 | [Item](#item)                      | Returns complete list of items in an array of items                                         |
| update item | `/item/{id}/` | PATCH            | [Item](#item)     | -                                  | Consumes an item and updates backend accordingly                                            |
| delete item | `/item/{id}/` | DELETE           | -                 | -                                  | Deletes item on backend                                                                     |

#### Item

| property       | datatype | description                                    |
| -------------- | -------- | ---------------------------------------------- |
| name           | string   | Guess you can get that                         |
| amount         | number   | as well as this                                |
| id             | number   | unique id to identify item                     |
| onShoppinglist | boolean  | if the item gets displayed in the shoppinglist |
