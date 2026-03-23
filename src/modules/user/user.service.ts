import { UserProfile } from "../../models";

export const getProfile = async (userId: string) => {
  return await UserProfile.findOne({ user_id: userId });
};

export const updateProfile = async (userId: string, data: any) => {
  return await UserProfile.findOneAndUpdate(
    { user_id: userId },
    { $set: data },
    { new: true, upsert: true }
  );
};
