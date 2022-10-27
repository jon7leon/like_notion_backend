import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const memoSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  icon: {
    type: String,
    default: '🗒',
  },
  title: {
    type: String,
    default: '無題',
  },
  description: {
    type: String,
    default: 'ここに自由に記入してください'
  },
  position: {
    type: Number,
  },
  favorite: {
    type: Boolean,
    default: false
  },
  favoritePosition: {
    type: Number,
    default: 0
  }
});
export default mongoose.model('Memos', memoSchema);