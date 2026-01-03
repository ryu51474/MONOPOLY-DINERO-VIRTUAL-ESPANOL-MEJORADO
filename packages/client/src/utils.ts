import { IGameStatePlayer } from "@monopoly-money/game-state";
import { routePaths } from "./constants";

export const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

export const sortPlayersByName = (players: IGameStatePlayer[]) =>
  players.slice().sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));

// Cute animal emojis for players (kept consistent with AVATAR_COLORS map)
export const PLAYER_ANIMAL_EMOJIS = [
  "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼",
  "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔",
  "🐧", "🐦", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗",
  "🦄", "🐝", "🐛", "🦋", "🐌", "🐞", "🐜", "🦟"
];

// Color mapping for each emoji (matches AvatarSelector colors)
export const AVATAR_COLORS: Record<string, string> = {
  "🐶": "#8B4513", // dog
  "🐱": "#FF6B6B", // cat
  "🐭": "#A0A0A0", // mouse
  "🐹": "#E8A0BF", // hamster (similar to rabbit pink)
  "🐰": "#FFB6C1", // rabbit
  "🦊": "#FF6B35", // fox
  "🐻": "#8B4513", // bear
  "🐼": "#2C3E50", // panda
  "🐨": "#7F8C8D", // koala
  "🐯": "#E74C3C", // tiger
  "🦁": "#F39C12", // lion
  "🐮": "#D5D8DC", // cow
  "🐷": "#FFB6C1", // pig
  "🐸": "#4CAF50", // frog (green)
  "🐵": "#8B4513", // monkey
  "🐔": "#FFB6C1", // chicken (pink-ish)
  "🐧": "#34495E", // penguin
  "🐦": "#87CEEB", // bird (sky blue)
  "🦆": "#4682B4", // duck (steel blue)
  "🦅": "#CD853F", // eagle (brown)
  "🦉": "#6B5B95", // owl (purple)
  "🦇": "#4A4A4A", // bat (dark gray)
  "🐺": "#696969", // wolf (dim gray)
  "🐗": "#8B4513", // boar (brown)
  "🦄": "#DDA0DD", // unicorn (plum)
  "🐝": "#FFD700", // bee (gold)
  "🐛": "#90EE90", // caterpillar (light green)
  "🦋": "#FF69B4", // butterfly (hot pink)
  "🐌": "#D2B48C", // snail (tan)
  "🐞": "#DC143C", // ladybug (crimson)
  "🐜": "#2F4F4F", // ant (dark slate gray)
  "🦟": "#778899", // mosquito (light slate gray)
};

// Get color for a player's emoji
export const getPlayerEmojiColor = (emoji: string): string => {
  return AVATAR_COLORS[emoji] || "#888888"; // Default gray if not found
};

// Get a deterministic animal emoji based on playerId (legacy function)
export const getPlayerEmoji = (playerId: string): string => {
  let hash = 0;
  for (let i = 0; i < playerId.length; i++) {
    hash = ((hash << 5) - hash) + playerId.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return PLAYER_ANIMAL_EMOJIS[Math.abs(hash) % PLAYER_ANIMAL_EMOJIS.length];
};

// Get unique emojis for all players to avoid duplicates
export const getUniquePlayerEmojis = (players: IGameStatePlayer[]): Map<string, string> => {
  const emojiMap = new Map<string, string>();
  const usedEmojis = new Set<string>();
  
  // Sort players to ensure consistent ordering
  const sortedPlayers = sortPlayersByName(players);
  
  for (const player of sortedPlayers) {
    let emoji: string | undefined;
    let attempts = 0;
    
    // Try to find an unused emoji
    while (attempts < PLAYER_ANIMAL_EMOJIS.length) {
      const hash = player.playerId.split('').reduce((acc, char, idx) => {
        return ((acc << 5) - acc) + char.charCodeAt(idx) + idx;
      }, 0);
      
      // Try different emojis based on player order
      const emojiIndex = (hash + attempts) % PLAYER_ANIMAL_EMOJIS.length;
      emoji = PLAYER_ANIMAL_EMOJIS[emojiIndex];
      
      if (!usedEmojis.has(emoji)) {
        break;
      }
      attempts++;
    }
    
    // Use the assigned emoji or fall back to the first available
    if (emoji && !usedEmojis.has(emoji)) {
      emojiMap.set(player.playerId, emoji);
      usedEmojis.add(emoji);
    } else {
      // Find any unused emoji
      for (const e of PLAYER_ANIMAL_EMOJIS) {
        if (!usedEmojis.has(e)) {
          emojiMap.set(player.playerId, e);
          usedEmojis.add(e);
          break;
        }
      }
    }
  }
  
  return emojiMap;
};

// Format player name with emoji - short names get emoji at start AND end
export const formatPlayerName = (name: string, emoji: string): string => {
  if (name.length <= 5) {
    return `${emoji} ${name} ${emoji}`;
  }
  return `${emoji} ${name}`;
};

// Get player display name with emoji for use in UI
export const getPlayerDisplayName = (name: string, playerId: string): string => {
  const emoji = getPlayerEmoji(playerId);
  return formatPlayerName(name, emoji);
};

// gtag.js integration

interface WindowWithGTag extends Window {
  gtag: ((...args: any) => void) | undefined;
}

const getWindowWithGTag = () => {
  return window as unknown as WindowWithGTag;
};

// These events are purely here for me to understand how the application is used

const tryToTrackGAEvent = (eventName: string, eventParams?: object) => {
  if (getWindowWithGTag().gtag !== undefined) {
    if (eventParams !== undefined) {
      getWindowWithGTag().gtag!("event", eventName, eventParams);
    } else {
      getWindowWithGTag().gtag!("event", eventName);
    }
  }
};

export const trackPageView = () =>
  tryToTrackGAEvent("page_view", {
    page_location: window.location.origin + window.location.pathname,
    page_path: window.location.pathname,
    page_title: document.title
  });

export const trackUnexpectedServerDisconnection = () =>
  tryToTrackGAEvent("Unexpected server disconnection", {
    event_category: "Network",
    non_interaction: true
  });

export const trackGameCreated = () => tryToTrackGAEvent("Game created");

export const trackGameJoined = () => tryToTrackGAEvent("Game joined");

export const trackGameCodeClick = () => tryToTrackGAEvent("Game code clicked");

export const trackInitialisedPlayerBalances = (amount: number) =>
  tryToTrackGAEvent("Initialised player balances", { initialisedAmount: amount });

export const trackFreeParkingDisabled = () => tryToTrackGAEvent("Free parking disabled");

export const trackFreeParkingEnabled = () => tryToTrackGAEvent("Free parking enabled");

export const trackNewPlayersNotAllowed = () => tryToTrackGAEvent("New players not allowed");

export const trackNewPlayersAllowed = () => tryToTrackGAEvent("New players allowed");

export const trackEndGame = () => tryToTrackGAEvent("Ended game");

const queryStringGameIdName = "gameId";

export const getGameIdFromQueryString = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const gameId = urlParams.get(queryStringGameIdName);
  return gameId;
};

export const getShareGameLink = (gameId: string) => {
  return `${window.location.origin}${routePaths.join}?${queryStringGameIdName}=${gameId}`;
};
