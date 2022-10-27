import express from 'express';
import crypto from 'crypto-js';
import JWT from 'jsonwebtoken';
import Users from '../models/Users';
import { CustomRequest } from '../../types/request';

export interface AuthUserInfo {
  username: string,
  password: string,
}

export const registerUser = async (req: CustomRequest<AuthUserInfo>, res: express.Response) => {
  try {
    const password = crypto.AES.encrypt(req.body.password, process.env.SECRET_KEY!);
    const user = await Users.create({
      username: req.body.username,
      password: password.toString()
    });
    const token = JWT.sign({id: user._id}, process.env.JWT_SECRET_KEY!, {
      expiresIn: "24h"
    });
    return res.status(200).json({user, token})
  } catch (error) {
    console.log(error);
    return res.status(500).json({error})
  }
}

export const loginUser = async (req: CustomRequest<AuthUserInfo>, res: express.Response) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findOne({username});
    if (!user) {
      return res.status(401).json({
        errors: [{
          param: "username",
          msg: "ユーザー名が無効です"
        }]
      });
    }

    const decreptedPassword = crypto.AES.decrypt(user!.password, process.env.SECRET_KEY!).toString(crypto.enc.Utf8);
    if (password !== decreptedPassword.toString()) {
      return res.status(401).json({
        errors: [{
          param: "password",
          msg: "パスワードが無効です"
        }]
      })
    }

    const token = JWT.sign({id: user!._id}, process.env.JWT_SECRET_KEY!, {
      expiresIn: "24h"
    });

    return res.status(201).json({user, token})

  } catch(error) {
    console.log(error);
  }
}