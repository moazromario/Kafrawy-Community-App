import { supabaseAdmin } from "../../lib/supabase-admin";

export const getProfile = async (userId: string) => {
  const { data, error } = await supabaseAdmin.from('userProfiles').select('*').eq('id', userId).single();
  if (error) throw error;
  return data;
};

export const updateProfile = async (userId: string, data: any) => {
  const { error } = await supabaseAdmin.from('userProfiles').upsert({ id: userId, ...data });
  if (error) throw error;
  const { data: updatedData, error: fetchError } = await supabaseAdmin.from('userProfiles').select('*').eq('id', userId).single();
  if (fetchError) throw fetchError;
  return updatedData;
};
