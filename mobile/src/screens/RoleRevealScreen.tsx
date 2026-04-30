import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RoleRevealScreenProps } from '../navigation/types';
import { checkGameOutcome } from '../utils/gameEngine';

const ROLE_LABELS: Record<string, string> = {
  civil: 'CIVIL',
  imposteur: 'IMPOSTEUR',
  'mister-white': 'MISTER WHITE',
};

const ROLE_COLORS: Record<string, string> = {
  civil: '#4de6a0',
  imposteur: '#e64d6c',
  'mister-white': '#e6c44d',
};

export default function RoleRevealScreen({ navigation, route }: RoleRevealScreenProps) {
  const { gameState, playerIndex } = route.params;
  const [revealed, setRevealed] = useState(false);
  const [hidden, setHidden] = useState(false);

  const player = gameState.players[playerIndex];
  const isLastPlayer = playerIndex === gameState.players.length - 1;

  function onNext() {
    if (isLastPlayer) {
      navigation.navigate('Vote', { gameState });
    } else {
      navigation.navigate('PassPhone', {
        gameState,
        playerIndex: playerIndex + 1,
      });
    }
  }

  if (hidden) {
    return (
      <View style={styles.container}>
        <View style={styles.hiddenContent}>
          <Text style={styles.hiddenTitle}>Écran masqué</Text>
          <Text style={styles.hiddenSubtitle}>Passe le téléphone au suivant</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={onNext}>
          <Text style={styles.buttonText}>
            {isLastPlayer ? 'Commencer la partie →' : 'Joueur suivant →'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!revealed) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.playerName}>{player.name}</Text>
          <Text style={styles.tapHint}>Appuie pour révéler ton rôle</Text>
          <TouchableOpacity style={styles.revealCard} onPress={() => setRevealed(true)}>
            <Text style={styles.revealCardText}>👁</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.playerName}>{player.name}</Text>

        <View style={[styles.roleCard, { borderColor: ROLE_COLORS[player.role] }]}>
          <Text style={[styles.roleLabel, { color: ROLE_COLORS[player.role] }]}>
            {ROLE_LABELS[player.role]}
          </Text>
          {player.word ? (
            <>
              <Text style={styles.wordLabel}>Ton mot :</Text>
              <Text style={styles.word}>{player.word}</Text>
            </>
          ) : (
            <Text style={styles.noWordHint}>Tu n'as pas de mot.{'\n'}Bluff et devine !</Text>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.hideButton} onPress={() => setHidden(true)}>
          <Text style={styles.hideButtonText}>Masquer l'écran</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onNext}>
          <Text style={styles.buttonText}>
            {isLastPlayer ? 'Commencer la partie →' : 'Joueur suivant →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d1a',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 60,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  playerName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#e8e0ff',
  },
  tapHint: {
    fontSize: 16,
    color: '#4a4060',
  },
  revealCard: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1a1730',
    borderWidth: 2,
    borderColor: '#2a2445',
    alignItems: 'center',
    justifyContent: 'center',
  },
  revealCardText: { fontSize: 48 },
  roleCard: {
    width: '100%',
    backgroundColor: '#1a1730',
    borderRadius: 20,
    borderWidth: 2,
    padding: 28,
    alignItems: 'center',
    gap: 12,
  },
  roleLabel: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 3,
  },
  wordLabel: {
    fontSize: 13,
    color: '#8b7fc0',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 8,
  },
  word: {
    fontSize: 36,
    fontWeight: '800',
    color: '#e8e0ff',
    textAlign: 'center',
  },
  noWordHint: {
    fontSize: 16,
    color: '#8b7fc0',
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 8,
  },
  actions: { gap: 12 },
  hideButton: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#1a1730',
    borderWidth: 1,
    borderColor: '#2a2445',
  },
  hideButtonText: { color: '#8b7fc0', fontSize: 16, fontWeight: '600' },
  button: {
    backgroundColor: '#6c4de6',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  hiddenContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  hiddenTitle: { fontSize: 28, fontWeight: '800', color: '#2a2445' },
  hiddenSubtitle: { fontSize: 16, color: '#2a2445' },
});
