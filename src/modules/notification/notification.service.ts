import { Notification } from "../../models";

export const getNotifications = async (userId: string) => {
  return await Notification.find({ user_id: userId }).sort({ created_at: -1 });
};

export const markAsRead = async (id: string) => {
  return await Notification.findByIdAndUpdate(id, { is_read: true }, { new: true });
};
