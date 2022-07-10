import { CustomError } from "../types";

class LogWrap {
  log(content: unknown) {
    console.log(content);
  }

  warn(content: unknown) {
    console.log("\x1b[33m%s\x1b[0m", content);
  }

  error(content: unknown) {
    console.log("\x1b[31m%s\x1b[0m", content);
  }
}

export const logWrapper = new LogWrap();
