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

const TripSchema = new mongoose.Schema({
  rider_id: String,
  driver_id: String,
  pickup: String,
  destination: String,
  price: Number,
  status: { type: String, enum: ['searching', 'accepted', 'on_trip', 'completed', 'cancelled'] },
  created_at: { type: Date, default: Date.now },
  completed_at: Date
});

export const Trip = mongoose.model('Trip', TripSchema);

const DriverSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  full_name: String,
  phone: String,
  rating: { type: Number, default: 5.0 },
  is_banned: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

export const Driver = mongoose.model('Driver', DriverSchema);
