import express from 'express';
import auth from './auth';
import memo from './memo';
const router = express.Router();

router.use('/auth', auth);
router.use('/memo', memo);

export default router;