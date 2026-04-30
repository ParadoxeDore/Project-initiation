import { Theme, WordPair, WORD_PAIRS } from '../data/wordPairs';

export type Role = 'civil' | 'imposteur' | 'mister-white';

export interface Player {
  id: string;
  name: string;
  role: Role;
  word: string | null;
  isEliminated: boolean;
}

export interface GameConfig {
  playerNames: string[];
  themes: Theme[];
  impostorCount: number;
  misterWhiteCount: number;
}

export interface GameState {
  players: Player[];
  wordPair: WordPair;
  config: GameConfig;
  eliminatedPlayers: string[];
}

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickRandomWordPair(themes: Theme[]): WordPair {
  const pool = themes.flatMap((t) => WORD_PAIRS[t]);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function computeBalancedImpostorCount(playerCount: number): number {
  if (playerCount <= 6) return 1;
  if (playerCount <= 8) return 2;
  return 2;
}

export function createGame(config: GameConfig): GameState {
  const { playerNames, themes, impostorCount, misterWhiteCount } = config;
  const wordPair = pickRandomWordPair(themes);

  const roles: Role[] = [];

  for (let i = 0; i < misterWhiteCount; i++) {
    roles.push('mister-white');
  }
  for (let i = 0; i < impostorCount; i++) {
    roles.push('imposteur');
  }
  while (roles.length < playerNames.length) {
    roles.push('civil');
  }

  const shuffledRoles = shuffle(roles);

  const players: Player[] = playerNames.map((name, index) => {
    const role = shuffledRoles[index];
    return {
      id: `player-${index}`,
      name,
      role,
      word:
        role === 'civil'
          ? wordPair.civilWord
          : role === 'imposteur'
            ? wordPair.impostorWord
            : null,
      isEliminated: false,
    };
  });

  return {
    players,
    wordPair,
    config,
    eliminatedPlayers: [],
  };
}

export function eliminatePlayer(state: GameState, playerId: string): GameState {
  return {
    ...state,
    players: state.players.map((p) =>
      p.id === playerId ? { ...p, isEliminated: true } : p
    ),
    eliminatedPlayers: [...state.eliminatedPlayers, playerId],
  };
}

export type GameOutcome =
  | { winner: 'civils'; reason: 'impostors_eliminated' }
  | { winner: 'imposteurs'; reason: 'impostors_survived' }
  | { winner: 'mister-white'; reason: 'guessed_civil_word' }
  | null;

export function checkGameOutcome(state: GameState): GameOutcome {
  const activePlayers = state.players.filter((p) => !p.isEliminated);
  const activeImpostors = activePlayers.filter((p) => p.role === 'imposteur');
  const activeMisterWhites = activePlayers.filter((p) => p.role === 'mister-white');
  const activeCivils = activePlayers.filter((p) => p.role === 'civil');

  if (activeImpostors.length === 0 && activeMisterWhites.length === 0) {
    return { winner: 'civils', reason: 'impostors_eliminated' };
  }

  if (activeImpostors.length + activeMisterWhites.length >= activeCivils.length) {
    return { winner: 'imposteurs', reason: 'impostors_survived' };
  }

  return null;
}

export function getLastEliminated(state: GameState): Player | null {
  const lastId = state.eliminatedPlayers[state.eliminatedPlayers.length - 1];
  return state.players.find((p) => p.id === lastId) ?? null;
}
