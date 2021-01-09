import { Request, Response, Router } from "express";
import * as mongoose from "mongoose";
import UserController from "../controllers/UserController";
import User, { IUser } from "../models/User"
// const User = require("../models/User")
const router = Router();

/**
 * Register a user with a username and password
 * Fails if password too short or username already exists
 * body {
 *  username: username,
 *  password: password
 * }
 */
router.post("/register", (req: Request, res: Response) => {
  let username = req.body.username;
  let password = req.body.password;

  UserController.createUser(username, password, (err:string, user:IUser) => {
    if (err != null) {
      return res.status(401).send(err);
    }
    return res.status(200).json({user: user});
  })
  
});

/**
   * Login a user with a username and password.
   * Otherwise, 401.
   *
   * body {
   *  username, username
   *  password: password
   * }
   *
   */
  router.post('/login',
    function(req: Request, res: Response, next){
      let username = req.body.username;
      let password = req.body.password;

      UserController.loginWithPassword(
        username,
        password,
        function (err, user) {
          if (err || !user) {
            return res.status(401).send(err);
          }
          return res.json({
            user: user,
          });
        }
      );

  });

export default router;