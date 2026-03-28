import { supabaseAdmin } from "../../lib/supabase-admin";

export const getNotifications = async (userId: string) => {
  const { data, error } = await supabaseAdmin
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
  return data;
};

export const markAsRead = async (id: string) => {
  const { data, error } = await supabaseAdmin
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
  return data;
};
