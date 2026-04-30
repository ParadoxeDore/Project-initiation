import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { VoteScreenProps } from '../navigation/types';
import {
  checkGameOutcome,
  eliminatePlayer,
  GameState,
  Player,
} from '../utils/gameEngine';

type VotePhase = 'voting' | 'eliminated' | 'mister-white-guess';

export default function VoteScreen({ navigation, route }: VoteScreenProps) {
  const [gameState, setGameState] = useState<GameState>(route.params.gameState);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [phase, setPhase] = useState<VotePhase>('voting');
  const [misterWhiteGuess, setMisterWhiteGuess] = useState('');
  const [eliminated, setEliminated] = useState<Player | null>(null);

  const activePlayers = gameState.players.filter((p) => !p.isEliminated);

  function confirmElimination() {
    if (!selectedPlayerId) return;

    const newState = eliminatePlayer(gameState, selectedPlayerId);
    const eliminatedPlayer = newState.players.find((p) => p.id === selectedPlayerId)!;
    setEliminated(eliminatedPlayer);
    setGameState(newState);

    if (eliminatedPlayer.role === 'mister-white') {
      setPhase('mister-white-guess');
      return;
    }

    const outcome = checkGameOutcome(newState);
    if (outcome) {
      navigation.navigate('Result', { gameState: newState, outcome: outcome.winner });
    } else {
      setPhase('eliminated');
    }
  }

  function continueAfterElimination() {
    setPhase('voting');
    setSelectedPlayerId(null);
  }

  function submitMisterWhiteGuess() {
    const guess = misterWhiteGuess.trim().toLowerCase();
    const civilWord = gameState.wordPair.civilWord.toLowerCase();
    if (guess === civilWord) {
      navigation.navigate('Result', { gameState, outcome: 'mister-white' });
    } else {
      const outcome = checkGameOutcome(gameState);
      navigation.navigate('Result', {
        gameState,
        outcome: outcome?.winner ?? 'civils',
      });
    }
  }

  if (phase === 'mister-white-guess') {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.mwTitle}>Mister White éliminé !</Text>
          <Text style={styles.mwHint}>
            {eliminated?.name}, devine le mot des civils pour renverser la partie :
          </Text>
          <TextInput
            style={styles.guessInput}
            placeholder="Ton mot…"
            placeholderTextColor="#4a4060"
            value={misterWhiteGuess}
            onChangeText={setMisterWhiteGuess}
            autoFocus
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity
          style={[styles.primaryButton, !misterWhiteGuess.trim() && styles.primaryButtonDisabled]}
          onPress={submitMisterWhiteGuess}
          disabled={!misterWhiteGuess.trim()}
        >
          <Text style={styles.primaryButtonText}>Valider ma réponse</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (phase === 'eliminated') {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.eliminatedEmoji}>💀</Text>
          <Text style={styles.eliminatedName}>{eliminated?.name}</Text>
          <Text style={styles.eliminatedRole}>
            {eliminated?.role === 'civil' ? 'était un Civil' : 'était un Imposteur'}
          </Text>
        </View>
        <TouchableOpacity style={styles.primaryButton} onPress={continueAfterElimination}>
          <Text style={styles.primaryButtonText}>Tour suivant</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vote</Text>
      <Text style={styles.subtitle}>Qui soupçonnes-tu d'être l'imposteur ?</Text>

      <View style={styles.playerList}>
        {activePlayers.map((player) => (
          <TouchableOpacity
            key={player.id}
            style={[
              styles.playerCard,
              selectedPlayerId === player.id && styles.playerCardSelected,
            ]}
            onPress={() =>
              setSelectedPlayerId(selectedPlayerId === player.id ? null : player.id)
            }
          >
            <Text style={[styles.playerCardText, selectedPlayerId === player.id && styles.playerCardTextSelected]}>
              {player.name}
            </Text>
            {selectedPlayerId === player.id && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, !selectedPlayerId && styles.primaryButtonDisabled]}
        onPress={confirmElimination}
        disabled={!selectedPlayerId}
      >
        <Text style={styles.primaryButtonText}>Éliminer ce joueur</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#0d0d1a',
    paddingHorizontal: 24, paddingTop: 80, paddingBottom: 60,
  },
  title: { fontSize: 32, fontWeight: '900', color: '#e8e0ff', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#8b7fc0', marginBottom: 32 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  playerList: { flex: 1, gap: 10 },
  playerCard: {
    backgroundColor: '#1a1730', borderRadius: 14,
    paddingVertical: 16, paddingHorizontal: 20,
    borderWidth: 1, borderColor: '#2a2445',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  playerCardSelected: { borderColor: '#e64d6c', backgroundColor: '#2a1020' },
  playerCardText: { fontSize: 18, color: '#e8e0ff', fontWeight: '600' },
  playerCardTextSelected: { color: '#e64d6c' },
  checkmark: { color: '#e64d6c', fontSize: 18, fontWeight: '700' },
  primaryButton: {
    backgroundColor: '#e64d6c', paddingVertical: 18,
    borderRadius: 16, alignItems: 'center', marginTop: 12,
  },
  primaryButtonDisabled: { backgroundColor: '#2a2445' },
  primaryButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  eliminatedEmoji: { fontSize: 64 },
  eliminatedName: { fontSize: 36, fontWeight: '900', color: '#e8e0ff' },
  eliminatedRole: { fontSize: 18, color: '#8b7fc0' },
  mwTitle: { fontSize: 28, fontWeight: '800', color: '#e8e0ff', textAlign: 'center' },
  mwHint: { fontSize: 16, color: '#8b7fc0', textAlign: 'center', lineHeight: 24 },
  guessInput: {
    width: '100%', backgroundColor: '#1a1730', borderRadius: 14,
    padding: 18, borderWidth: 1, borderColor: '#2a2445',
    fontSize: 20, color: '#e8e0ff', textAlign: 'center', marginTop: 8,
  },
});
