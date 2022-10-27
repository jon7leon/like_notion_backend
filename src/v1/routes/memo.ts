import express from 'express';
import { create, deleteOne, getAll, getOne, update } from '../controllers/memo';
import { verifyToken } from '../handlers/tokenHandler';

const router = express.Router();

router.post(
  '/',
  verifyToken,
  create
);

router.get(
  '/',
  verifyToken,
  getAll
);

router.get(
  '/:memoId',
  verifyToken,
  getOne
);

router.put(
  '/:memoId',
  verifyToken,
  update
);

router.delete(
  '/:memoId',
  verifyToken,
  deleteOne
);

export default router;