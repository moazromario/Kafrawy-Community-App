import mongoose from 'mongoose';

const UserProfileSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  full_name: String,
  avatar_url: String,
  phone: String,
  address: String,
  bio: String,
  account_type: String,
  level: { type: Number, default: 1 },
  points: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
});

export const UserProfile = mongoose.model('UserProfile', UserProfileSchema);

const NotificationSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  type: String,
  title: String,
  body: String,
  is_read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

export const Notification = mongoose.model('Notification', NotificationSchema);

const WalletTransactionSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  amount: Number,
  type: { type: String, enum: ['credit', 'debit'] },
  status: String,
  created_at: { type: Date, default: Date.now }
});

export const WalletTransaction = mongoose.model('WalletTransaction', WalletTransactionSchema);
