import { supabaseAdmin } from "../../lib/supabase-admin";

export const getBalance = async (userId: string) => {
  const { data: txs, error } = await supabaseAdmin
    .from('walletTransactions')
    .select('amount, type')
    .eq('user_id', userId);
  
  if (error) throw error;

  return (txs || []).reduce((acc, tx) => {
    return tx.type === "credit"
      ? acc + (tx.amount || 0)
      : acc - (tx.amount || 0);
  }, 0);
};
