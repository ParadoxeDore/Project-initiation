import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ResultScreenProps } from '../navigation/types';

const OUTCOME_MESSAGES: Record<string, { title: string; subtitle: string; color: string }> = {
  civils: {
    title: 'Les Civils gagnent !',
    subtitle: "L'imposteur a été démasqué.",
    color: '#4de6a0',
  },
  imposteurs: {
    title: 'Les Imposteurs gagnent !',
    subtitle: 'Ils ont réussi à se fondre dans la masse.',
    color: '#e64d6c',
  },
  'mister-white': {
    title: 'Mister White gagne !',
    subtitle: 'Il a deviné le mot civil.',
    color: '#e6c44d',
  },
};

const ROLE_LABELS: Record<string, string> = {
  civil: 'Civil',
  imposteur: 'Imposteur',
  'mister-white': 'Mister White',
};

const ROLE_COLORS: Record<string, string> = {
  civil: '#4de6a0',
  imposteur: '#e64d6c',
  'mister-white': '#e6c44d',
};

export default function ResultScreen({ navigation, route }: ResultScreenProps) {
  const { gameState, outcome } = route.params;
  const message = OUTCOME_MESSAGES[outcome] ?? OUTCOME_MESSAGES['civils'];

  function playAgain() {
    navigation.navigate('Setup', { initialConfig: gameState.config });
  }

  function backToHome() {
    Alert.alert(
      'Retour à l\'accueil',
      'La partie en cours sera perdue. Continuer ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Quitter',
          style: 'destructive',
          onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Home' }] }),
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.outcomeSection}>
        <Text style={[styles.outcomeTitle, { color: message.color }]}>{message.title}</Text>
        <Text style={styles.outcomeSubtitle}>{message.subtitle}</Text>
      </View>

      <View style={styles.wordsSection}>
        <View style={styles.wordCard}>
          <Text style={styles.wordCardLabel}>Mot des Civils</Text>
          <Text style={styles.wordCardValue}>{gameState.wordPair.civilWord}</Text>
        </View>
        <View style={styles.wordCard}>
          <Text style={styles.wordCardLabel}>Mot Imposteur</Text>
          <Text style={[styles.wordCardValue, { color: '#e64d6c' }]}>
            {gameState.wordPair.impostorWord}
          </Text>
        </View>
      </View>

      <View style={styles.playersSection}>
        <Text style={styles.sectionTitle}>Récapitulatif</Text>
        {gameState.players.map((player) => (
          <View key={player.id} style={styles.playerRow}>
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={[styles.playerRole, { color: ROLE_COLORS[player.role] }]}>
                {ROLE_LABELS[player.role]}
              </Text>
            </View>
            {player.isEliminated && (
              <Text style={styles.eliminatedBadge}>Éliminé</Text>
            )}
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryButton} onPress={playAgain}>
          <Text style={styles.primaryButtonText}>Rejouer (mêmes joueurs)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={backToHome}>
          <Text style={styles.secondaryButtonText}>Accueil</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0d0d1a' },
  scroll: { flex: 1 },
  container: { padding: 24, paddingBottom: 60, gap: 32 },
  outcomeSection: { alignItems: 'center', gap: 10 },
  outcomeTitle: { fontSize: 32, fontWeight: '900', textAlign: 'center' },
  outcomeSubtitle: { fontSize: 16, color: '#8b7fc0', textAlign: 'center' },
  wordsSection: { flexDirection: 'row', gap: 12 },
  wordCard: {
    flex: 1, backgroundColor: '#1a1730', borderRadius: 16,
    padding: 16, alignItems: 'center', gap: 8,
    borderWidth: 1, borderColor: '#2a2445',
  },
  wordCardLabel: { fontSize: 11, color: '#8b7fc0', textTransform: 'uppercase', letterSpacing: 1 },
  wordCardValue: { fontSize: 20, fontWeight: '800', color: '#4de6a0', textAlign: 'center' },
  playersSection: { gap: 10 },
  sectionTitle: {
    fontSize: 13, color: '#8b7fc0',
    textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4,
  },
  playerRow: {
    backgroundColor: '#1a1730', borderRadius: 14,
    paddingVertical: 14, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#2a2445', gap: 12,
  },
  playerInfo: { flex: 1 },
  playerName: { fontSize: 16, fontWeight: '700', color: '#e8e0ff' },
  playerRole: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  eliminatedBadge: {
    fontSize: 11, color: '#e64d6c', backgroundColor: '#2a1020',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  actions: { gap: 12 },
  primaryButton: {
    backgroundColor: '#6c4de6', paddingVertical: 18,
    borderRadius: 16, alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  secondaryButton: {
    paddingVertical: 14, borderRadius: 16, alignItems: 'center',
    backgroundColor: '#1a1730', borderWidth: 1, borderColor: '#2a2445',
  },
  secondaryButtonText: { color: '#8b7fc0', fontSize: 16, fontWeight: '600' },
});
