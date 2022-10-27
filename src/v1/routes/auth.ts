import express from 'express';
import Users from '../models/Users';
import { loginUser, registerUser } from '../controllers/user';
import { body } from 'express-validator';
import { validate } from '../handlers/validation';
import { verifyToken } from '../handlers/tokenHandler';

const router = express.Router();

// ユーザー新規登録API
router.post(
  '/register',
  body('username').isLength({min: 8}).withMessage('ユーザー名は最低で8文字入力してください'),
  body('password').isLength({min: 8}).withMessage('パスワードはは最低で8文字入力してください'),
  body('confirmPassword').isLength({min: 8}).withMessage('確認用パスワードはは最低で8文字入力してください'),
  body('username').custom((value) => {
    return Users.findOne({username: value}).then((user) => {
      if (user) {
        return Promise.reject('ユーザーが存在しています。')
      }
    })
  }),
  validate,
  registerUser
);
// ログインAPI
router.post(
  '/login',
  body('username').isLength({min: 8}).withMessage('ユーザー名は最低で8文字入力してください'),
  body('password').isLength({min: 8}).withMessage('パスワードはは最低で8文字入力してください'),
  // body().custom(({username, password}) => {
  //   const JWTPassword = crypto.AES.encrypt(password, process.env.SECRET_KEY!);
  //   console.log(JWTPassword.toString());
  //   console.log(password);
  //   return Users.findOne({username, password: JWTPassword.toString()}).then((user) => {
  //     if (!user) {
  //       return Promise.reject('ユーザーが存在しません')
  //     }
  //   })
  // }),
  validate,
  loginUser
);

router.post(
  "/verify-token",
  verifyToken,
  (req, res) => {
    return res.status(200).json({ user: req.body.user });
  }
);

export default router;