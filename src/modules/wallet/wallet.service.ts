import { WalletTransaction } from "../../models";

export const getBalance = async (userId: string) => {
  const txs = await WalletTransaction.find({ user_id: userId });

  return txs.reduce((acc, tx) => {
    return tx.type === "credit"
      ? acc + (tx.amount || 0)
      : acc - (tx.amount || 0);
  }, 0);
};
