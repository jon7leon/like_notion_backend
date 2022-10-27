import express, { NextFunction } from 'express';
import crypto from 'crypto-js';
import JWT from 'jsonwebtoken';
import Users from '../models/Users';

const tokenDecode = (req: express.Request) => {
  try {
    const token = req.headers["authorization"]?.replace("Bearer ", "");
    if (!token) {
      throw new Error("Authoriztion header is not attached!!!");
    }
    return {
      success: true,
      value: (JWT.verify(token, process.env.JWT_SECRET_KEY!) as {id : string}).id
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      value: error.message
    }
  }

}

export const verifyToken = async(req: express.Request, res: express.Response, next: NextFunction) => {
    const decryptedPassword = tokenDecode(req);

    if(decryptedPassword.success) {
      const user = await Users.findById(decryptedPassword.value);
      if (!user) {
        return res.status(401).json({
          param: 'verity-token',
          msg: '権限がありません'
        });
      }
      req.body.user = user;
      next();
    } else {
      return res.status(401).json({
        param: 'verity-token',
        msg: decryptedPassword.value
      });
    }
}