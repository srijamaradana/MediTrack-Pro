import { useNotifications } from '../context/NotificationContext';
import { useState, useEffect } from 'react';

// Hook to use notifications
export const useNotificationContext = () => {
  const context = useNotifications();
  return context;
};

// Hook to get unread count with real-time updates
export const useUnreadCount = () => {
  const { unreadCount, fetchUnreadCount } = useNotifications();
  
  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  return unreadCount;
};

// Hook to get notifications with pagination
export const useNotificationsList = (limit = 10) => {
  const { notifications, loading, fetchNotifications } = useNotifications();
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications, page]);

  const paginatedNotifications = notifications.slice(0, page * limit);
  const hasMore = notifications.length > page * limit;

  const loadMore = () => {
    if (hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return {
    notifications: paginatedNotifications,
    loading,
    hasMore,
    loadMore,
    total: notifications.length,
  };
};

// Hook for notification actions
export const useNotificationActions = () => {
  const { markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  return { markAsRead, markAllAsRead, deleteNotification };
};

// Hook for toast notifications
export const useToastNotification = () => {
  const { socket } = useNotifications();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (data) => {
      if (data.type === 'notification' && data.notification.priority === 'high') {
        setToast({
          title: data.notification.title,
          message: data.notification.message,
          id: data.notification._id,
        });
      }
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleNotification(data);
      } catch (error) {
        console.error('Toast notification error:', error);
      }
    };

    return () => {
      socket.onmessage = null;
    };
  }, [socket]);

  return toast;
};