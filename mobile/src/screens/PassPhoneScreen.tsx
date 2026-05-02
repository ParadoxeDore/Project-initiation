import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PassPhoneScreenProps } from '../navigation/types';

export default function PassPhoneScreen({ navigation, route }: PassPhoneScreenProps) {
  const { gameState, playerIndex } = route.params;
  const player = gameState.players[playerIndex];

  function onReady() {
    navigation.navigate('RoleReveal', { gameState, playerIndex });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.instruction}>Passe le téléphone à</Text>
        <Text style={styles.playerName}>{player.name}</Text>
        <Text style={styles.warning}>
          Assure-toi que seul(e) {player.name} regarde l'écran.
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={onReady}>
        <Text style={styles.buttonText}>Je suis prêt(e) →</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d1a',
    paddingHorizontal: 32,
    paddingBottom: 60,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  instruction: {
    fontSize: 20,
    color: '#8b7fc0',
    textAlign: 'center',
  },
  playerName: {
    fontSize: 48,
    fontWeight: '900',
    color: '#e8e0ff',
    textAlign: 'center',
  },
  warning: {
    fontSize: 14,
    color: '#4a4060',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#6c4de6',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
