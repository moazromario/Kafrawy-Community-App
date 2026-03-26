import { db } from "../../config/firebase-admin";

export const getBalance = async (userId: string) => {
  const snapshot = await db.collection('walletTransactions')
    .where('user_id', '==', userId)
    .get();
  
  const txs = snapshot.docs.map(doc => doc.data());

  return txs.reduce((acc, tx) => {
    return tx.type === "credit"
      ? acc + (tx.amount || 0)
      : acc - (tx.amount || 0);
  }, 0);
};
