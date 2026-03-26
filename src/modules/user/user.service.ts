import { db } from "../../config/firebase-admin";

export const getProfile = async (userId: string) => {
  const doc = await db.collection('userProfiles').doc(userId).get();
  return doc.exists ? doc.data() : null;
};

export const updateProfile = async (userId: string, data: any) => {
  await db.collection('userProfiles').doc(userId).set(data, { merge: true });
  const doc = await db.collection('userProfiles').doc(userId).get();
  return doc.data();
};
