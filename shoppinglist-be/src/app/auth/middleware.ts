import auth from "basic-auth";
import { User } from "./types";

// get users from environment
var envUsers: unknown[];

try {
  envUsers = JSON.parse(process.env.USERS ?? "[]");
} catch (e) {
  envUsers = [];
  console.warn("\x1b[33m%s\x1b[0m", "ERROR while parsing specified users: ", e);
}

const users = envUsers.filter<User>((user): user is User => isUser(user));

if (users.length === 0) {
  console.warn(
    "\x1b[33m%s\x1b[0m",
    "No valid users registered. You won't be able to log in"
  );
} else {
  console.log(
    `Valid usernames: ${JSON.stringify(users.map((user) => user.name))}`
  );
}

export function mwBasicAuth(req, res, next) {
  const user = auth(req);

  const foundUser = users.find((storedUser) => {
    return storedUser.name === user?.name && storedUser.password === user.pass;
  });

  if (user && foundUser) {
    req.username = user.name;
    next();
  } else {
    res.statusCode = 401;
    res.end("Access denied");
  }
}

/**Typeguard for User interface */
function isUser(payload: unknown): payload is User {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "name" in payload &&
    "password" in payload
  );
}
