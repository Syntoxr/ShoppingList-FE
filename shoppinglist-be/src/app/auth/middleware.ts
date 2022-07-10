import auth from "basic-auth";
import type { Request, Response, NextFunction } from "express";
import type { Socket } from "socket.io";
import { verify } from "jsonwebtoken";
import { envUsers, tokenSecret } from "./variables";
import { ExtendedError } from "socket.io/dist/namespace";

// get users from environment

if (envUsers.length === 0) {
  console.warn(
    "\x1b[33m%s\x1b[0m",
    "No valid users registered. You won't be able to log in"
  );
} else {
  console.log(
    `Usable usernames: ${JSON.stringify(envUsers.map((user) => user.name))}`
  );
}

export function mwBasicAuth(req: Request, res: Response, next: NextFunction) {
  const clientUser = auth(req);

  const matchedUser = envUsers.find((registeredUser) => {
    return (
      registeredUser.name === clientUser?.name &&
      registeredUser.password === clientUser.pass
    );
  });

  if (clientUser && matchedUser) {
    res.locals.username = clientUser.name;
    next();
  } else {
    res.statusCode = 401;
    res.end("Access denied");
  }
}

export function mwTokenAuth(req: Request, res: Response, next: NextFunction) {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) {
    console.warn(
      `Unauthorized connection from ${
        req.ip
      } at ${new Date().toString()}. Reason: missing token`
    );
    res.json({ message: "missing token" }).sendStatus(403).end();
    return;
  }

  const bearerToken = bearerHeader.split(" ")[1];
  verify(bearerToken, tokenSecret, (err, decoded) => {
    if (err) {
      console.warn(
        `Unauthorized connection from ${
          req.ip
        } at ${new Date().toString()}. Reason: ${err.message}`
      );
      res.json({ message: err.message }).status(403).end();
    } else {
      res.locals.decodedToken = decoded;
      next();
    }
  });
}

export function mwSocketTokenAuth(
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void
) {
  const bearerHeader = socket.handshake?.headers["authorization"];
  if (!bearerHeader) {
    console.warn(
      `Unauthorized connection from ${
        socket.handshake?.address
      } at ${new Date().toString()}. Reason: missing token`
    );
    return next(new Error("missing token"));
    // next(new Error("Authentication error"));
  }
  const bearerToken = bearerHeader.split(" ")[1];
  verify(bearerToken, tokenSecret, (err, decoded) => {
    if (err) {
      console.warn(
        `Unauthorized connection from ${
          socket.handshake?.address
        } at ${new Date().toString()}. Reason: ${err.message}`
      );
      return next(new Error(err.message));
    } else {
      socket.data.decodedToken = decoded;
      next();
    }
  });
}
