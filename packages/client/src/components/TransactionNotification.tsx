import React, { useCallback, useEffect, useState } from 'react';
import { useSounds } from './SoundProvider';

export interface TransactionNotificationData {
  id: number;
  type: 'send' | 'receive';
  amount: number;
  playerName: string;
  timestamp: number;
}

// Global queue for notifications (shared across components)
let notificationQueue: TransactionNotificationData[] = [];
let listeners: ((notifications: TransactionNotificationData[]) => void)[] = [];

const notifyListeners = () => {
  listeners.forEach(listener => listener([...notificationQueue]));
};

// Hook to add notifications to the queue
export const useTransactionNotifications = () => {
  const addNotification = useCallback((notification: Omit<TransactionNotificationData, 'id' | 'timestamp'>) => {
    const newNotification: TransactionNotificationData = {
      ...notification,
      id: Date.now() + Math.random(),
      timestamp: Date.now()
    };
    notificationQueue.push(newNotification);
    notifyListeners();
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      notificationQueue = notificationQueue.filter(n => n.id !== newNotification.id);
      notifyListeners();
    }, 3000);
  }, []);

  const clearNotifications = useCallback(() => {
    notificationQueue = [];
    notifyListeners();
  }, []);

  return { addNotification, clearNotifications };
};

// Hook to subscribe to notifications
export const useTransactionNotificationSubscription = () => {
  const [notifications, setNotifications] = useState<TransactionNotificationData[]>([]);

  useEffect(() => {
    const listener = (queue: TransactionNotificationData[]) => {
      setNotifications(queue);
    };
    listeners.push(listener);
    
    // Initial state
    setNotifications([...notificationQueue]);
    
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  return notifications;
};

const TransactionNotification: React.FC = () => {
  const notifications = useTransactionNotificationSubscription();
  const { playSound } = useSounds();

  // Play sound when notification appears
  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[notifications.length - 1];
      if (latest.type === 'send') {
        playSound('transaction');
      } else {
        playSound('money');
      }
    }
  }, [notifications, playSound]);

  if (notifications.length === 0) return null;

  // Show only the latest notification
  const notification = notifications[notifications.length - 1];

  if (notification.type === 'send') {
    return (
      <div className="transaction-notification send-notification">
        <div className="notification-content send-content">
          <img 
            src="/animations/money-send.svg" 
            alt="Enviado" 
            className="notification-animation send-animation"
          />
          <div className="notification-text send-text">
            <span className="notification-amount">${notification.amount.toLocaleString()}</span>
            <span className="notification-message">enviado a</span>
            <span className="notification-player">{notification.playerName}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-notification receive-notification">
      <div className="notification-content receive-content">
        <img 
          src="/animations/money-receive.svg" 
          alt="Recibido" 
          className="notification-animation receive-animation"
        />
        <div className="notification-text receive-text">
          <span className="notification-amount">+${notification.amount.toLocaleString()}</span>
          <span className="notification-message">de</span>
          <span className="notification-player">{notification.playerName}</span>
        </div>
      </div>
    </div>
  );
};

export default TransactionNotification;
