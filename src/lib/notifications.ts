import { supabase } from './supabase';
import type { Notification, NotificationResponse } from '../types/notification';

export const notificationService = {
  // Buscar notificações não lidas
  getUnreadNotifications: async (): Promise<NotificationResponse> => {
    try {
      const { data, error } = await supabase
        .rpc('get_unread_notifications');

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      return { data: null, error: error as Error };
    }
  },

  // Marcar notificação como lida
  markAsRead: async (notificationId: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase
        .rpc('mark_notification_as_read', {
          notification_id: notificationId
        });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      return { error: error as Error };
    }
  },

  // Criar nova notificação
  createNotification: async (
    userId: string,
    message: string,
    type: Notification['type']
  ): Promise<NotificationResponse> => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          message,
          type,
          read: false
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      return { data: null, error: error as Error };
    }
  },

  // Inscrever-se em notificações em tempo real
  subscribeToNotifications: (
    userId: string,
    onNotification: (notification: Notification) => void
  ) => {
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const notification = payload.new as Notification;
          onNotification(notification);

          // Mostrar notificação do navegador se permitido
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Nova notificação', {
              body: notification.message,
              icon: '/favicon.ico'
            });
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  },

  // Solicitar permissão para notificações do navegador
  requestNotificationPermission: async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('Este navegador não suporta notificações desktop');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Erro ao solicitar permissão para notificações:', error);
      return false;
    }
  }
};
