### ShoppingList

A simple selfhosted shopping list

:warning: This is still in development and not ready for release yet.

## Demo

An up to date demo with a simulated backend can be seen here: [https://syntoxr.github.io/ShoppingList/](https://syntoxr.github.io/ShoppingList/)

This is my first web application so feel free to report any issues you find.

## Getting started

> In order to run docker containers, you obviously need to install docker and optionally docker-compose.

The shopping list can be run in two separate docker containers: 
* shoppinglist-ui (frontend)
* shoppinglist-be (backend)

I suggest using docker-compose to run them in a stack:

```yml
#docker-compose.yml
version: "3.9"

volumes:
  backend_data:

services:
  frontend:
    image: syntox/shoppinglist-ui
    container_name: shoppinglist-frontend
    ports:
      - 80:80
    hostname: shoppinglist-ui
    environment:
      - API_HOST= http://shoppinglist-be:8080
  
  backend:
    image: syntox/shoppinglist-be
    container_name: shoppinglist-backend
    expose:
     - 8080
    hostname: shoppinglist-be
    volumes:
      - backend_data:/usr/local/server/data
``` 

## API

General shoppinglist endpoint: `/api/shoppinglist`

The item list is a list of all entered items, regardless of whether they were checked or not. This is used for suggesting previously used items during input.

| **Name**    | **Endpoint**  | **Reguest type** | **Consumes data** | **Response data**                  | **Description**                                                                             |
| ----------- | ------------- | :--------------: | ----------------- | :--------------------------------- | ------------------------------------------------------------------------------------------- |
| add item    | `/item/`      |       POST       | [Item](#item)     | `{ oldId: number, newId: number }` | Consumes an item with a temporary id and updates backend. Responds with the old- and new id |
| get items   | `/items/`     |       GET        | -                 | [Item](#item)                      | Returns complete list of items in an array of items                                         |
| update item | `/item/{id}/` |      PATCH       | [Item](#item)     | -                                  | Consumes an item and updates backend accordingly                                            |
| delete item | `/item/{id}/` |      DELETE      | -                 | -                                  | Deletes item on backend                                                                     |

#### Item

| property       | datatype | description                                    |
| -------------- | -------- | ---------------------------------------------- |
| name           | string   | Guess you can get that                         |
| amount         | number   | as well as this                                |
| id             | number   | unique id to identify item                     |
| onShoppinglist | boolean  | if the item gets displayed in the shoppinglist |

### Instant updates

Instant updates are most likely being implemented via SignalR and the `/api/stream` endpoint.
