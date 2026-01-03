import React, { useCallback, useEffect, useRef, useState } from 'react';
import { bankName, freeParkingName } from '../constants';
import { getPlayerEmoji } from '../utils';
import { useSounds } from './SoundProvider';
import './TransactionNotification.scss';

export interface TransactionNotificationData {
  id: number;
  type: 'send' | 'receive';
  amount: number;
  playerName: string;
  playerId?: string;
  timestamp: number;
  exiting?: boolean;
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
    
    // Auto-remove after 4 seconds (increased for better visibility)
    setTimeout(() => {
      const index = notificationQueue.findIndex(n => n.id === newNotification.id);
      if (index !== -1) {
        // Mark as exiting for animation
        notificationQueue[index] = { ...notificationQueue[index], exiting: true };
        notifyListeners();
        
        // Remove after animation completes
        setTimeout(() => {
          notificationQueue = notificationQueue.filter(n => n.id !== newNotification.id);
          notifyListeners();
        }, 300);
      }
    }, 4000);
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
  const previousLengthRef = useRef<number>(0);

  // Play sound when notification appears
  useEffect(() => {
    if (notifications.length > previousLengthRef.current) {
      const latest = notifications[notifications.length - 1];
      if (!latest.exiting) {
        if (latest.type === 'send') {
          playSound('transaction');
        } else {
          playSound('money');
        }
      }
    }
    previousLengthRef.current = notifications.length;
  }, [notifications, playSound]);

  if (notifications.length === 0) return null;

  // Show all non-exiting notifications, but limit to 3
  const visibleNotifications = notifications
    .filter(n => !n.exiting)
    .slice(-3);

  return (
    <div className="notifications-container">
      {visibleNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`transaction-notification ${notification.type}-notification ${notification.exiting ? 'exiting' : ''}`}
        >
          <div className={`notification-content ${notification.type}-content`}>
            {notification.type === 'send' ? (
              <>
                <img 
                  src="/animations/money-send.svg" 
                  alt="Enviado" 
                  className="notification-animation send-animation"
                />
                <div className="notification-text send-text">
                  <span className="notification-amount">-${notification.amount.toLocaleString()}</span>
                  <span className="notification-message">enviado a</span>
                  {notification.playerName === freeParkingName ? (
                    <span className="notification-player-emoji" role="img" aria-label="free-parking">
                      🚗
                    </span>
                  ) : notification.playerName === bankName ? (
                    <span className="notification-player-emoji" role="img" aria-label="bank">
                      🏦
                    </span>
                  ) : notification.playerId && (
                    <span className="notification-player-emoji" role="img" aria-label="animal">
                      {getPlayerEmoji(notification.playerId)}
                    </span>
                  )}
                  <span className="notification-player">{notification.playerName}</span>
                </div>
              </>
            ) : (
              <>
                <img 
                  src="/animations/money-receive.svg" 
                  alt="Recibido" 
                  className="notification-animation receive-animation"
                />
                <div className="notification-text receive-text">
                  <span className="notification-amount">+${notification.amount.toLocaleString()}</span>
                  <span className="notification-message">de</span>
                  {notification.playerName === freeParkingName ? (
                    <span className="notification-player-emoji" role="img" aria-label="free-parking">
                      🚗
                    </span>
                  ) : notification.playerName === bankName ? (
                    <span className="notification-player-emoji" role="img" aria-label="bank">
                      🏦
                    </span>
                  ) : notification.playerId && (
                    <span className="notification-player-emoji" role="img" aria-label="animal">
                      {getPlayerEmoji(notification.playerId)}
                    </span>
                  )}
                  <span className="notification-player">{notification.playerName}</span>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionNotification;

