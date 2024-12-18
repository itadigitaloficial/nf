import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { notificationService } from '../lib/notifications';
import type { Notification } from '../types/notification';

export function useNotifications() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Buscar notificações não lidas
  const { 
    data: notifications, 
    isLoading, 
    error 
  } = useQuery<Notification[]>({
    queryKey: ['notifications', 'unread'],
    queryFn: async () => {
      const { data, error } = await notificationService.getUnreadNotifications();
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    refetchInterval: 30000 // Recarregar a cada 30 segundos
  });

  // Marcar notificação como lida
  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await notificationService.markAsRead(notificationId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread'] });
    }
  });

  // Inscrever-se em notificações em tempo real
  useEffect(() => {
    if (!user) return;

    const unsubscribe = notificationService.subscribeToNotifications(
      user.id,
      (notification) => {
        // Atualizar cache do React Query
        queryClient.setQueryData<Notification[]>(
          ['notifications', 'unread'],
          (old) => old ? [...old, notification] : [notification]
        );
      }
    );

    // Solicitar permissão para notificações do navegador
    notificationService.requestNotificationPermission();

    return () => {
      unsubscribe();
    };
  }, [user, queryClient]);

  return {
    notifications: notifications || [],
    isLoading,
    error,
    markAsRead,
    unreadCount: notifications?.length || 0
  };
}
