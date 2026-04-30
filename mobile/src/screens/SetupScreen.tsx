import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { THEMES, Theme } from '../data/wordPairs';
import { SetupScreenProps } from '../navigation/types';
import {
  computeBalancedImpostorCount,
  createGame,
  GameConfig,
} from '../utils/gameEngine';

export default function SetupScreen({ navigation, route }: SetupScreenProps) {
  const initial = route?.params?.initialConfig;

  const [playerNames, setPlayerNames] = useState<string[]>(
    initial?.playerNames ?? ['', '', '']
  );
  const [themes, setThemes] = useState<Theme[]>(initial?.themes ?? ['classique']);
  const [impostorCount, setImpostorCount] = useState(initial?.impostorCount ?? 1);
  const [misterWhiteCount, setMisterWhiteCount] = useState(initial?.misterWhiteCount ?? 0);
  const [balancedMode, setBalancedMode] = useState(false);

  const activePlayers = playerNames.filter((n) => n.trim().length > 0);

  function addPlayer() {
    if (playerNames.length < 10) setPlayerNames([...playerNames, '']);
  }

  function removePlayer(index: number) {
    if (playerNames.length > 3) setPlayerNames(playerNames.filter((_, i) => i !== index));
  }

  function updateName(index: number, value: string) {
    const updated = [...playerNames];
    updated[index] = value;
    setPlayerNames(updated);
  }

  function toggleTheme(theme: Theme) {
    if (themes.includes(theme)) {
      if (themes.length === 1) return; // au moins un thème requis
      setThemes(themes.filter((t) => t !== theme));
    } else {
      setThemes([...themes, theme]);
    }
  }

  function startGame() {
    const names = playerNames.map((n) => n.trim()).filter((n) => n.length > 0);

    if (names.length < 3) {
      Alert.alert('Pas assez de joueurs', 'Il faut au minimum 3 joueurs.');
      return;
    }

    if (new Set(names).size !== names.length) {
      Alert.alert('Noms en double', 'Chaque joueur doit avoir un nom unique.');
      return;
    }

    const resolvedImpostorCount = balancedMode
      ? Math.max(0, computeBalancedImpostorCount(names.length) - misterWhiteCount)
      : impostorCount;

    const minPlayers = resolvedImpostorCount + misterWhiteCount + 1;
    if (names.length < minPlayers) {
      Alert.alert(
        'Configuration invalide',
        `Avec ${resolvedImpostorCount} imposteur(s) et ${misterWhiteCount} Mister White, il faut au moins ${minPlayers} joueurs.`
      );
      return;
    }

    const config: GameConfig = {
      playerNames: names,
      themes,
      impostorCount: resolvedImpostorCount,
      misterWhiteCount,
    };

    const gameState = createGame(config);
    navigation.navigate('PassPhone', { gameState, playerIndex: 0 });
  }

  const effectiveImpostorCount = balancedMode
    ? Math.max(0, computeBalancedImpostorCount(activePlayers.length) - misterWhiteCount)
    : impostorCount;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Nouvelle partie</Text>

      {/* Joueurs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Joueurs</Text>
        {playerNames.map((name, index) => (
          <View key={index} style={styles.playerRow}>
            <TextInput
              style={styles.input}
              placeholder={`Joueur ${index + 1}`}
              placeholderTextColor="#4a4060"
              value={name}
              onChangeText={(v) => updateName(index, v)}
              maxLength={20}
            />
            {playerNames.length > 3 && (
              <TouchableOpacity onPress={() => removePlayer(index)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        {playerNames.length < 10 && (
          <TouchableOpacity style={styles.addButton} onPress={addPlayer}>
            <Text style={styles.addButtonText}>+ Ajouter un joueur</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Thèmes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thèmes</Text>
        <Text style={styles.hint}>Plusieurs thèmes peuvent être combinés</Text>
        <View style={styles.themeGrid}>
          {THEMES.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={[styles.themeButton, themes.includes(t.id) && styles.themeButtonActive]}
              onPress={() => toggleTheme(t.id)}
            >
              <Text style={[styles.themeButtonText, themes.includes(t.id) && styles.themeButtonTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Imposteurs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Imposteurs</Text>
        <View style={styles.counterBlock}>
          <View style={styles.counterRow}>
            <Text style={styles.counterLabel}>Imposteurs</Text>
            <View style={styles.counter}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => { setBalancedMode(false); setImpostorCount(Math.max(0, impostorCount - 1)); }}
              >
                <Text style={styles.counterButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.counterValue}>{effectiveImpostorCount}</Text>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => { setBalancedMode(false); setImpostorCount(Math.min(4, impostorCount + 1)); }}
              >
                <Text style={styles.counterButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.counterRow}>
            <Text style={styles.counterLabel}>Mister White</Text>
            <View style={styles.counter}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setMisterWhiteCount(Math.max(0, misterWhiteCount - 1))}
              >
                <Text style={styles.counterButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.counterValue}>{misterWhiteCount}</Text>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setMisterWhiteCount(Math.min(3, misterWhiteCount + 1))}
              >
                <Text style={styles.counterButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.balancedButton, balancedMode && styles.balancedButtonActive]}
            onPress={() => setBalancedMode(!balancedMode)}
          >
            <Text style={[styles.balancedButtonText, balancedMode && styles.balancedButtonTextActive]}>
              {balancedMode ? '✓ Mode équilibré auto' : 'Mode équilibré auto'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.startButton} onPress={startGame}>
        <Text style={styles.startButtonText}>Lancer la partie</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#0d0d1a' },
  container: { padding: 24, paddingBottom: 60 },
  title: { fontSize: 28, fontWeight: '800', color: '#e8e0ff', marginBottom: 32, marginTop: 60 },
  section: { marginBottom: 32, gap: 12 },
  sectionTitle: {
    fontSize: 13, fontWeight: '600', color: '#8b7fc0',
    textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4,
  },
  playerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: {
    flex: 1, backgroundColor: '#1a1730', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14, color: '#e8e0ff',
    fontSize: 16, borderWidth: 1, borderColor: '#2a2445',
  },
  removeButton: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#2a2445', alignItems: 'center', justifyContent: 'center',
  },
  removeButtonText: { color: '#8b7fc0', fontSize: 14 },
  addButton: {
    borderWidth: 1, borderColor: '#2a2445', borderStyle: 'dashed',
    borderRadius: 12, paddingVertical: 12, alignItems: 'center',
  },
  addButtonText: { color: '#6c4de6', fontSize: 15, fontWeight: '600' },
  hint: { color: '#4a4060', fontSize: 13 },
  themeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  themeButton: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
    backgroundColor: '#1a1730', borderWidth: 1, borderColor: '#2a2445',
  },
  themeButtonActive: { backgroundColor: '#6c4de6', borderColor: '#6c4de6' },
  themeButtonText: { color: '#8b7fc0', fontSize: 14, fontWeight: '600' },
  themeButtonTextActive: { color: '#fff' },
  counterBlock: { backgroundColor: '#1a1730', borderRadius: 16, padding: 16, gap: 16, borderWidth: 1, borderColor: '#2a2445' },
  counterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  counterLabel: { color: '#e8e0ff', fontSize: 16 },
  counter: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  counterButton: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#2a2445', alignItems: 'center', justifyContent: 'center',
  },
  counterButtonText: { color: '#e8e0ff', fontSize: 20 },
  counterValue: { color: '#e8e0ff', fontSize: 24, fontWeight: '700', minWidth: 28, textAlign: 'center' },
  balancedButton: {
    paddingVertical: 10, borderRadius: 10, alignItems: 'center',
    borderWidth: 1, borderColor: '#2a2445',
  },
  balancedButtonActive: { borderColor: '#6c4de6', backgroundColor: '#1e1540' },
  balancedButtonText: { color: '#4a4060', fontSize: 14, fontWeight: '600' },
  balancedButtonTextActive: { color: '#6c4de6' },
  startButton: {
    backgroundColor: '#6c4de6', paddingVertical: 18,
    borderRadius: 16, alignItems: 'center', marginTop: 8,
  },
  startButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
