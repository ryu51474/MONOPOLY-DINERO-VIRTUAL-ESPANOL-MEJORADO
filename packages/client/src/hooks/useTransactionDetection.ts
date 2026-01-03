import { GameEvent, IGameStatePlayer, ITransactionEvent } from '@monopoly-money/game-state';
import { useCallback, useEffect, useRef } from 'react';
import { useTransactionNotifications } from '../components/TransactionNotification';
import { bankName } from '../constants';

// GameEntity types
type GameEntity = 'bank' | 'freeParking' | string; // string is playerId

interface UseTransactionDetectionProps {
  events: GameEvent[];
  players: IGameStatePlayer[];
  currentPlayerId: string;
}

export const useTransactionDetection = ({
  events,
  players,
  currentPlayerId
}: UseTransactionDetectionProps) => {
  const { addNotification, clearNotifications } = useTransactionNotifications();
  const lastProcessedEventIndex = useRef<number>(-1);
  const processedEventsRef = useRef<Set<string>>(new Set());

  const getPlayerInfo = useCallback((entity: GameEntity): { name: string; id?: string } | null => {
    if (entity === 'bank') return { name: bankName };
    if (entity === 'freeParking') return { name: '🚗 Parada Libre' };
    
    const player = players.find(p => p.playerId === entity);
    return player ? { name: player.name, id: player.playerId } : null;
  }, [players]);

  useEffect(() => {
    // Clear any existing notifications on mount
    clearNotifications();
    
    // Clear processed events on mount
    processedEventsRef.current.clear();
    
    return () => {
      // Cleanup on unmount
    };
  }, [clearNotifications]);

  useEffect(() => {
    if (events.length === 0) return;

    // Process new events starting from the last processed index
    const startIndex = Math.max(0, lastProcessedEventIndex.current + 1);
    
    for (let i = startIndex; i < events.length; i++) {
      const event = events[i];
      
      // Skip if this event has already been processed
      if (processedEventsRef.current.has(event.time)) {
        continue;
      }
      
      // Mark as processed
      processedEventsRef.current.add(event.time);
      
      if (event.type === 'transaction') {
        const txEvent = event as ITransactionEvent;
        
        // Check if current user sent money (only to players, not bank/freeParking)
        if (txEvent.from === currentPlayerId) {
          const toInfo = getPlayerInfo(txEvent.to);
          if (toInfo) {
            addNotification({
              type: 'send',
              amount: txEvent.amount,
              playerName: toInfo.name,
              playerId: toInfo.id
            });
          }
        }
        
        // Check if current user received money (from anyone including bank/freeParking)
        if (txEvent.to === currentPlayerId) {
          const fromInfo = getPlayerInfo(txEvent.from);
          if (fromInfo) {
            addNotification({
              type: 'receive',
              amount: txEvent.amount,
              playerName: fromInfo.name,
              playerId: fromInfo.id
            });
          }
        }
      }
    }
    
    // Update last processed index
    lastProcessedEventIndex.current = events.length - 1;
  }, [events, currentPlayerId, addNotification, getPlayerInfo]);
};

export default useTransactionDetection;

