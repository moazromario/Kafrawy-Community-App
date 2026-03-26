import { db } from "../../config/firebase-admin";

export const getNotifications = async (userId: string) => {
  const snapshot = await db.collection('notifications')
    .where('user_id', '==', userId)
    .get();
  const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return notifications.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

export const markAsRead = async (id: string) => {
  await db.collection('notifications').doc(id).update({ is_read: true });
  const doc = await db.collection('notifications').doc(id).get();
  return { id: doc.id, ...doc.data() };
};
