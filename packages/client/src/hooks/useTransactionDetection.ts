import { GameEvent, IAuctionEndEvent, IGameStatePlayer, ITransactionEvent } from '@monopoly-money/game-state';
import { useCallback, useEffect, useRef } from 'react';
import { useTransactionNotifications } from '../components/TransactionNotification';
import { getLastProcessedEventIndex, getProcessedSoundEvents, PLAYER_ANIMAL_EMOJIS, saveLastProcessedEventIndex, saveProcessedSoundEvents } from '../utils';

// GameEntity types
type GameEntity = 'bank' | 'freeParking' | string; // string is playerId

interface UseTransactionDetectionProps {
  events: GameEvent[];
  players: IGameStatePlayer[];
  currentPlayerId: string;
  gameId: string; // Required for localStorage persistence
}

export const useTransactionDetection = ({
  events,
  players,
  currentPlayerId,
  gameId,
}: UseTransactionDetectionProps) => {
  const { addNotification, clearNotifications } = useTransactionNotifications();
  
  // Load last processed index from localStorage to prevent reprocessing on tab focus
  const lastProcessedEventIndex = useRef<number>(getLastProcessedEventIndex(gameId));
  
  // Track which events have already had sounds played (persist across tab switches)
  const processedSoundEvents = useRef<Set<string>>(getProcessedSoundEvents(gameId));

  // Helper function to determine if sound should be played for this event
  const shouldPlaySound = useCallback((eventTime: string): boolean => {
    if (!processedSoundEvents.current.has(eventTime)) {
      // Mark this event as having had sound played
      processedSoundEvents.current.add(eventTime);
      saveProcessedSoundEvents(gameId, processedSoundEvents.current);
      return true;
    }
    return false;
  }, [gameId]);

  const getPlayerInfo = useCallback((entity: GameEntity): { name: string; id?: string; emoji?: string } | null => {
    if (entity === 'bank') return { name: 'Banco', id: 'bank', emoji: '🏦' };
    if (entity === 'freeParking') return { name: 'Parada Libre', id: 'freeParking', emoji: '🚗' };
    
    const player = players.find(p => p.playerId === entity);
    if (player) {
      // Use deterministic emoji based on playerId for consistency across devices
      const emoji = PLAYER_ANIMAL_EMOJIS[Math.abs(entity.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0)) % PLAYER_ANIMAL_EMOJIS.length];
      return { name: player.name, id: player.playerId, emoji };
    }
    return null;
  }, [players]);

  useEffect(() => {
    // Clear any existing notifications on mount
    clearNotifications();
    
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
      
      if (event.type === 'transaction') {
        const txEvent = event as ITransactionEvent;
        const eventTime = event.time;
        
        // Check if current user sent money (only to players, not bank/freeParking)
        if (txEvent.from === currentPlayerId) {
          const toInfo = getPlayerInfo(txEvent.to);
          if (toInfo) {
            addNotification({
              type: 'send',
              amount: txEvent.amount,
              playerName: toInfo.name,
              playerId: toInfo.id,
              playerEmoji: toInfo.emoji,
              shouldPlaySound: shouldPlaySound(eventTime)
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
              playerId: fromInfo.id,
              playerEmoji: fromInfo.emoji,
              shouldPlaySound: shouldPlaySound(eventTime)
            });
          }
        }
      } else if (event.type === 'auctionEnd') {
        // Auction ended - if current user won, show a notification
        const auctionEnd = event as IAuctionEndEvent;
        if (!auctionEnd.cancelled && auctionEnd.winnerId === currentPlayerId && auctionEnd.amount) {
          addNotification({
            type: 'send', // Winner pays money
            amount: auctionEnd.amount,
            playerName: 'Banco', // Player pays to bank for the property
            playerId: 'bank',
            playerEmoji: '🏦',
            shouldPlaySound: shouldPlaySound(auctionEnd.time)
          });
        }
      }
    }
    
    // Update last processed index and save to localStorage for persistence
    lastProcessedEventIndex.current = events.length - 1;
    saveLastProcessedEventIndex(gameId, lastProcessedEventIndex.current);
  }, [events, currentPlayerId, gameId, addNotification, getPlayerInfo, shouldPlaySound]);
};

export default useTransactionDetection;

