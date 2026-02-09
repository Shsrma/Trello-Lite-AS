import React, { useState, useEffect } from 'react';
import { notificationAPI } from '../../api/notification.api';
import { useSocket } from '../../hooks/useSocket';

interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { socket } = useSocket();

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('notification:new', (notification: Notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });

      return () => {
        socket.off('notification:new');
      };
    }
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getNotifications({ limit: 10 });
      setNotifications(response.notifications);
      setUnreadCount(response.unreadCount);
    } catch (error) {
      // Error handled
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      // Error handled
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Notifications</h3>
          </div>
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No notifications</div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleMarkAsRead(notification._id)}
                >
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
