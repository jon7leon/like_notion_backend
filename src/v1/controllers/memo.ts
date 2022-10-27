import express from 'express';
import Memos from '../models/Memos';
import { CustomRequest } from '../../types/request';

export interface MemoInfo {
  user: {
    _id: string
  }
  _id: string
  icon?: string
  title?: string
  position?: number
  description?: string
  favorite?: boolean
  favoritePosition?: number
}

export const create = async (req: CustomRequest<MemoInfo>, res: express.Response) => {
  try {
    const memoCount = await Memos.find().count();
    const memo = await Memos.create({
      user: req.body.user._id,
      position: memoCount > 0 ? memoCount : 0
    });
    return res.status(201).json(memo)
  } catch (error) {
    return res.status(500).json(error)
  }
}

export const getAll = async(req: CustomRequest<MemoInfo>, res: express.Response) => {
  try {
    const memos = await Memos.find({user: req.body.user._id}).sort('-position');
    return res.status(200).json(memos);
  } catch (error) {
    return res.status(500).json(error);
  }
}

export const getOne = async(req: CustomRequest<MemoInfo>, res: express.Response) => {
  const { memoId } = req.params;
  try {
    const memo = await Memos.findOne({
      user: req.body.user._id,
      _id: memoId
    })
    if (!memo) {
      return res.status(404).json("メモが存在しません");
    }
    return res.status(200).json(memo);
  } catch (error) {
    return res.status(500).json(error);
  }
}

export const update = async(req: CustomRequest<MemoInfo>, res: express.Response) => {
  const { memoId } = req.params;
  const { title, description } = req.body;
  try {
    if (title === '') {
      req.body.title = '無題';
    }
    if (description === '') {
      req.body.description = 'ここに自由に記入してください';
    }
    const memo = await Memos.findOne({user: req.body.user._id, _id: memoId});
    if (!memo) {
      return res.status(404).json("メモが存在しません");
    }
    const updatedMemo = await Memos.findByIdAndUpdate(memoId, {
      $set: req.body,
    })

  } catch (error) {
    console.log(error);
  }
}

export const deleteOne = async(req: CustomRequest<MemoInfo>, res: express.Response) => {
  const { memoId } = req.params;
  try {
    const memo = await Memos.findOne({
      user: req.body.user._id,
      _id: memoId
    })
    if (!memo) {
      return res.status(404).json("メモが存在しません");
    }
    await Memos.deleteOne({_id: memoId});
    return res.status(200).json('削除しました');
  } catch (error) {
    return res.status(500).json(error);
  }
}