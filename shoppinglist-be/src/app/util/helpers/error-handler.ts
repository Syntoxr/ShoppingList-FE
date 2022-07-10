import { CustomError } from "../types";
import { logWrapper } from "./logger";

export function handleError(
  error: unknown,
  from?: "database_add" | "database_get" | "database_update" | "database_delete"
): CustomError {
  logWrapper.error(error);

  switch (from) {
    // ADD
    case "database_add":
      return {
        message: `could not add item to database: >>${error}<< For more infos look at the servers console.`,
        code: 500,
      };

    //GET
    case "database_get":
      return {
        message: `could not get items from database: >>${error}<< For more infos look at the servers console.`,
        code: 500,
      };

    //UPDATE
    case "database_update":
      return {
        message: `could not update item in database: >>${error}<< For more infos look at the servers console.`,
        code: 500,
      };

    //DELETE
    case "database_delete":
      return {
        message: `could not delete item from database: >>${error}<< For more infos look at the servers console.`,
        code: 500,
      };
  }
  return { message: "unknown error", code: 500 };
}
