import { useRef, useState } from 'react';
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

  const [players, setPlayers] = useState<Array<{ id: number; name: string }>>(
    () => (initial?.playerNames ?? ['', '', '']).map((name, i) => ({ id: i, name }))
  );
  const nextId = useRef(initial?.playerNames?.length ?? 3);
  const [themes, setThemes] = useState<Theme[]>(initial?.themes ?? ['classique']);
  const [impostorCount, setImpostorCount] = useState(initial?.impostorCount ?? 1);
  const [misterWhiteCount, setMisterWhiteCount] = useState(initial?.misterWhiteCount ?? 0);
  const [balancedMode, setBalancedMode] = useState(false);

  const activePlayers = players.filter((p) => p.name.trim().length > 0);
  const balancedTotal = computeBalancedImpostorCount(activePlayers.length);

  const effectiveMWCount = balancedMode ? Math.min(misterWhiteCount, balancedTotal) : misterWhiteCount;
  const effectiveImpostorCount = balancedMode ? balancedTotal - effectiveMWCount : impostorCount;

  const aMinusDisabled = balancedMode ? effectiveImpostorCount === 0 : impostorCount === 0;
  const aPlusDisabled  = balancedMode ? effectiveMWCount === 0       : impostorCount >= 4;
  const bMinusDisabled = effectiveMWCount === 0;
  const bPlusDisabled  = balancedMode ? effectiveImpostorCount === 0 : misterWhiteCount >= 3;

  function addPlayer() {
    if (players.length < 10) setPlayers([...players, { id: nextId.current++, name: '' }]);
  }

  function removePlayer(id: number) {
    if (players.length > 3) setPlayers(players.filter((p) => p.id !== id));
  }

  function updateName(id: number, value: string) {
    setPlayers(players.map((p) => p.id === id ? { ...p, name: value } : p));
  }

  function toggleTheme(theme: Theme) {
    if (themes.includes(theme)) {
      if (themes.length === 1) return;
      setThemes(themes.filter((t) => t !== theme));
    } else {
      setThemes([...themes, theme]);
    }
  }

  function toggleBalancedMode() {
    const next = !balancedMode;
    if (next) {
      const bt = computeBalancedImpostorCount(activePlayers.length);
      setMisterWhiteCount(Math.min(misterWhiteCount, bt));
    }
    setBalancedMode(next);
  }

  function onAMinus() {
    if (balancedMode) {
      setMisterWhiteCount(Math.min(balancedTotal, effectiveMWCount + 1));
    } else {
      setImpostorCount(Math.max(0, impostorCount - 1));
    }
  }

  function onAPlus() {
    if (balancedMode) {
      setMisterWhiteCount(Math.max(0, effectiveMWCount - 1));
    } else {
      setImpostorCount(Math.min(4, impostorCount + 1));
    }
  }

  function onBMinus() {
    if (balancedMode) {
      setMisterWhiteCount(Math.max(0, effectiveMWCount - 1));
    } else {
      setMisterWhiteCount(Math.max(0, misterWhiteCount - 1));
    }
  }

  function onBPlus() {
    if (balancedMode) {
      setMisterWhiteCount(Math.min(balancedTotal, effectiveMWCount + 1));
    } else {
      setMisterWhiteCount(Math.min(3, misterWhiteCount + 1));
    }
  }

  function startGame() {
    const names = players.map((p) => p.name.trim()).filter((n) => n.length > 0);

    if (names.length < 3) {
      Alert.alert('Pas assez de joueurs', 'Il faut au minimum 3 joueurs.');
      return;
    }

    if (new Set(names).size !== names.length) {
      Alert.alert('Noms en double', 'Chaque joueur doit avoir un nom unique.');
      return;
    }

    const resolvedBT = computeBalancedImpostorCount(names.length);
    const resolvedMW = balancedMode ? Math.min(misterWhiteCount, resolvedBT) : misterWhiteCount;
    const resolvedImpostorCount = balancedMode ? resolvedBT - resolvedMW : impostorCount;

    const minPlayers = resolvedImpostorCount + resolvedMW + 1;
    if (names.length < minPlayers) {
      Alert.alert(
        'Configuration invalide',
        `Avec ${resolvedImpostorCount} imposteur(s) et ${resolvedMW} Mister White, il faut au moins ${minPlayers} joueurs.`
      );
      return;
    }

    const config: GameConfig = {
      playerNames: names,
      themes,
      impostorCount: resolvedImpostorCount,
      misterWhiteCount: resolvedMW,
    };

    const gameState = createGame(config);
    navigation.navigate('PassPhone', { gameState, playerIndex: 0 });
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Nouvelle partie</Text>

      {/* Joueurs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Joueurs</Text>
        {players.map((player, index) => (
          <View key={player.id} style={styles.playerRow}>
            <TextInput
              style={styles.input}
              placeholder={`Joueur ${index + 1}`}
              placeholderTextColor="#4a4060"
              value={player.name}
              onChangeText={(v) => updateName(player.id, v)}
              maxLength={20}
            />
            {players.length > 3 && (
              <TouchableOpacity onPress={() => removePlayer(player.id)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        {players.length < 10 && (
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
                style={[styles.counterButton, aMinusDisabled && styles.counterButtonDisabled]}
                onPress={onAMinus}
                disabled={aMinusDisabled}
              >
                <Text style={styles.counterButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.counterValue}>{effectiveImpostorCount}</Text>
              <TouchableOpacity
                style={[styles.counterButton, aPlusDisabled && styles.counterButtonDisabled]}
                onPress={onAPlus}
                disabled={aPlusDisabled}
              >
                <Text style={styles.counterButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.counterRow}>
            <Text style={styles.counterLabel}>Mister White</Text>
            <View style={styles.counter}>
              <TouchableOpacity
                style={[styles.counterButton, bMinusDisabled && styles.counterButtonDisabled]}
                onPress={onBMinus}
                disabled={bMinusDisabled}
              >
                <Text style={styles.counterButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.counterValue}>{effectiveMWCount}</Text>
              <TouchableOpacity
                style={[styles.counterButton, bPlusDisabled && styles.counterButtonDisabled]}
                onPress={onBPlus}
                disabled={bPlusDisabled}
              >
                <Text style={styles.counterButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.balancedButton, balancedMode && styles.balancedButtonActive]}
            onPress={toggleBalancedMode}
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
  counterButtonDisabled: { opacity: 0.3 },
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
