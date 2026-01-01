import { GameEvent, IGameStatePlayer, ITransactionEvent } from '@monopoly-money/game-state';
import { useCallback, useEffect, useRef } from 'react';
import { useTransactionNotifications } from '../components/TransactionNotification';

// GameEntity types
type GameEntity = 'bank' | 'freeParking' | string; // string is playerId

interface UseTransactionDetectionProps {
  events: GameEvent[];
  players: IGameStatePlayer[];
  currentPlayerId: string;
}

// Get unique event times that have been shown in this browser session
const getShownEventTimes = (): Set<string> => {
  try {
    const stored = sessionStorage.getItem('shownEventTimes');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
};

const addShownEventTime = (eventTime: string): void => {
  try {
    const shown = getShownEventTimes();
    shown.add(eventTime);
    sessionStorage.setItem('shownEventTimes', JSON.stringify([...shown]));
  } catch {
    // Ignore storage errors
  }
};

export const useTransactionDetection = ({
  events,
  players,
  currentPlayerId
}: UseTransactionDetectionProps) => {
  const { addNotification, clearNotifications } = useTransactionNotifications();
  const lastProcessedEventIndex = useRef<number>(-1);
  const shownEventTimes = useRef<Set<string>>(new Set());

  const getPlayerName = useCallback((entity: GameEntity): string | null => {
    if (entity === 'bank') return 'Banco';
    if (entity === 'freeParking') return 'Parada Libre';
    
    const player = players.find(p => p.playerId === entity);
    return player?.name || null;
  }, [players]);

  // Clean up notifications on mount to prevent replay when returning to the page
  // Also sync with sessionStorage to track events shown across navigation
  useEffect(() => {
    // Clear any existing notifications on mount
    clearNotifications();
    
    // Sync with sessionStorage
    shownEventTimes.current = getShownEventTimes();
    
    // Clear sessionStorage when the page unloads to prevent stale data
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('shownEventTimes');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [clearNotifications]);

  useEffect(() => {
    if (events.length === 0) return;

    // Process new events
    const startIndex = lastProcessedEventIndex.current + 1;
    
    for (let i = startIndex; i < events.length; i++) {
      const event = events[i];
      
      // Skip if this event has already been shown in this session (use time as unique identifier)
      if (shownEventTimes.current.has(event.time)) {
        continue;
      }
      
      if (event.type === 'transaction') {
        const txEvent = event as ITransactionEvent;
        
        // Check if current user sent money (only to players, not bank/freeParking)
        if (txEvent.from === currentPlayerId) {
          const toName = getPlayerName(txEvent.to);
          if (toName) {
            addNotification({
              type: 'send',
              amount: txEvent.amount,
              playerName: toName
            });
            // Mark this event as shown
            shownEventTimes.current.add(event.time);
            addShownEventTime(event.time);
          }
        }
        
        // Check if current user received money (from anyone including bank/freeParking)
        if (txEvent.to === currentPlayerId) {
          const fromName = getPlayerName(txEvent.from);
          if (fromName) {
            addNotification({
              type: 'receive',
              amount: txEvent.amount,
              playerName: fromName
            });
            // Mark this event as shown
            shownEventTimes.current.add(event.time);
            addShownEventTime(event.time);
          }
        }
      }
    }
    
    // Update last processed index
    lastProcessedEventIndex.current = events.length - 1;
  }, [events, currentPlayerId, addNotification, getPlayerName]);
};

export default useTransactionDetection;

