import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RoleRevealScreenProps } from '../navigation/types';

type Phase = 'waiting' | 'revealed' | 'masked-screen';

export default function RoleRevealScreen({ navigation, route }: RoleRevealScreenProps) {
  const { gameState, playerIndex } = route.params;
  const [phase, setPhase] = useState<Phase>('waiting');

  const player = gameState.players[playerIndex];
  const isLastPlayer = playerIndex === gameState.players.length - 1;

  function onNext() {
    if (isLastPlayer) {
      navigation.navigate('Vote', { gameState });
    } else {
      navigation.navigate('PassPhone', { gameState, playerIndex: playerIndex + 1 });
    }
  }

  if (phase === 'masked-screen') {
    return (
      <View style={styles.container}>
        <View style={styles.maskedContent}>
          <Text style={styles.maskedTitle}>Écran masqué</Text>
          <Text style={styles.maskedSubtitle}>Passe le téléphone au suivant</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={onNext}>
          <Text style={styles.buttonText}>
            {isLastPlayer ? 'Commencer la partie →' : 'Joueur suivant →'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (phase === 'waiting') {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.playerName}>{player.name}</Text>
          <Text style={styles.tapHint}>Appuie pour révéler ton rôle</Text>
          <TouchableOpacity style={styles.revealCard} onPress={() => setPhase('revealed')}>
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

        <View style={styles.roleCard}>
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
        <TouchableOpacity style={styles.maskScreenButton} onPress={() => setPhase('masked-screen')}>
          <Text style={styles.maskScreenButtonText}>Masquer l'écran</Text>
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
    flex: 1, backgroundColor: '#0d0d1a',
    paddingHorizontal: 24, paddingTop: 80, paddingBottom: 60,
    justifyContent: 'space-between',
  },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 },
  playerName: { fontSize: 32, fontWeight: '800', color: '#e8e0ff' },
  tapHint: { fontSize: 16, color: '#4a4060' },
  revealCard: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: '#1a1730', borderWidth: 2, borderColor: '#2a2445',
    alignItems: 'center', justifyContent: 'center',
  },
  revealCardText: { fontSize: 48 },
  roleCard: {
    width: '100%', backgroundColor: '#1a1730', borderRadius: 20,
    borderWidth: 2, borderColor: '#2a2445', padding: 28, alignItems: 'center', gap: 12,
    minHeight: 140, justifyContent: 'center',
  },
  wordLabel: { fontSize: 13, color: '#8b7fc0', textTransform: 'uppercase', letterSpacing: 2, marginTop: 8 },
  word: { fontSize: 36, fontWeight: '800', color: '#e8e0ff', textAlign: 'center' },
  noWordHint: { fontSize: 16, color: '#8b7fc0', textAlign: 'center', lineHeight: 24, marginTop: 8 },
  actions: { gap: 12 },
  maskScreenButton: {
    paddingVertical: 14, borderRadius: 16, alignItems: 'center',
    backgroundColor: '#1a1730', borderWidth: 1, borderColor: '#2a2445',
  },
  maskScreenButtonText: { color: '#8b7fc0', fontSize: 16, fontWeight: '600' },
  button: {
    backgroundColor: '#6c4de6', paddingVertical: 18,
    borderRadius: 16, alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  maskedContent: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  maskedTitle: { fontSize: 28, fontWeight: '800', color: '#2a2445' },
  maskedSubtitle: { fontSize: 16, color: '#2a2445' },
});
