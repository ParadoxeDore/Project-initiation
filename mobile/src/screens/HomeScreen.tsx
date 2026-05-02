import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeScreenProps } from '../navigation/types';

export default function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>UNDERWORD</Text>
        <Text style={styles.subtitle}>Qui est l'imposteur parmi vous ?</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Setup')}
        >
          <Text style={styles.primaryButtonText}>Nouvelle partie</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>3 à 10 joueurs · Un seul téléphone</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d1a',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingBottom: 60,
  },
  header: {
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#e8e0ff',
    letterSpacing: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#8b7fc0',
    textAlign: 'center',
  },
  actions: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#6c4de6',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    textAlign: 'center',
    color: '#4a4060',
    fontSize: 13,
  },
});
