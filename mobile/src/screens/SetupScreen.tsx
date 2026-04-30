import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
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

export default function SetupScreen({ navigation }: SetupScreenProps) {
  const [playerNames, setPlayerNames] = useState<string[]>(['', '', '']);
  const [theme, setTheme] = useState<Theme>('classique');
  const [impostorCount, setImpostorCount] = useState(1);
  const [balancedMode, setBalancedMode] = useState(false);
  const [hasMisterWhite, setHasMisterWhite] = useState(false);

  const activePlayers = playerNames.filter((n) => n.trim().length > 0);

  function addPlayer() {
    if (playerNames.length < 10) {
      setPlayerNames([...playerNames, '']);
    }
  }

  function removePlayer(index: number) {
    if (playerNames.length > 3) {
      setPlayerNames(playerNames.filter((_, i) => i !== index));
    }
  }

  function updateName(index: number, value: string) {
    const updated = [...playerNames];
    updated[index] = value;
    setPlayerNames(updated);
  }

  function startGame() {
    const names = playerNames.map((n) => n.trim()).filter((n) => n.length > 0);

    if (names.length < 3) {
      Alert.alert('Pas assez de joueurs', 'Il faut au minimum 3 joueurs.');
      return;
    }

    const hasDuplicate = new Set(names).size !== names.length;
    if (hasDuplicate) {
      Alert.alert('Noms en double', 'Chaque joueur doit avoir un nom unique.');
      return;
    }

    const resolvedImpostorCount = balancedMode
      ? computeBalancedImpostorCount(names.length)
      : impostorCount;

    const minPlayers = resolvedImpostorCount + (hasMisterWhite ? 1 : 0) + 1;
    if (names.length < minPlayers) {
      Alert.alert(
        'Configuration invalide',
        `Avec ${resolvedImpostorCount} imposteur(s)${hasMisterWhite ? ' et Mister White' : ''}, il faut au moins ${minPlayers} joueurs.`
      );
      return;
    }

    const config: GameConfig = {
      playerNames: names,
      theme,
      impostorCount: resolvedImpostorCount,
      hasMisterWhite,
    };

    const gameState = createGame(config);
    navigation.navigate('PassPhone', { gameState, playerIndex: 0 });
  }

  const effectiveImpostorCount = balancedMode
    ? computeBalancedImpostorCount(activePlayers.length)
    : impostorCount;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Nouvelle partie</Text>

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
              <TouchableOpacity
                onPress={() => removePlayer(index)}
                style={styles.removeButton}
              >
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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thème</Text>
        <View style={styles.themeGrid}>
          {THEMES.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={[styles.themeButton, theme === t.id && styles.themeButtonActive]}
              onPress={() => setTheme(t.id)}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  theme === t.id && styles.themeButtonTextActive,
                ]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Imposteurs</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Mode équilibré auto</Text>
          <Switch
            value={balancedMode}
            onValueChange={setBalancedMode}
            trackColor={{ true: '#6c4de6' }}
            thumbColor="#fff"
          />
        </View>
        {!balancedMode && (
          <View style={styles.counterRow}>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => setImpostorCount(Math.max(1, impostorCount - 1))}
            >
              <Text style={styles.counterButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.counterValue}>{effectiveImpostorCount}</Text>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => setImpostorCount(Math.min(4, impostorCount + 1))}
            >
              <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
        {balancedMode && (
          <Text style={styles.hint}>
            {effectiveImpostorCount} imposteur(s) pour {activePlayers.length} joueurs
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <View>
            <Text style={styles.label}>Mister White</Text>
            <Text style={styles.hint}>Ne connaît pas son mot — doit bluffer</Text>
          </View>
          <Switch
            value={hasMisterWhite}
            onValueChange={setHasMisterWhite}
            trackColor={{ true: '#6c4de6' }}
            thumbColor="#fff"
          />
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
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#e8e0ff',
    marginBottom: 32,
    marginTop: 60,
  },
  section: {
    marginBottom: 32,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8b7fc0',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#1a1730',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#e8e0ff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2a2445',
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2a2445',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: { color: '#8b7fc0', fontSize: 14 },
  addButton: {
    borderWidth: 1,
    borderColor: '#2a2445',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addButtonText: { color: '#6c4de6', fontSize: 15, fontWeight: '600' },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  themeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#1a1730',
    borderWidth: 1,
    borderColor: '#2a2445',
  },
  themeButtonActive: {
    backgroundColor: '#6c4de6',
    borderColor: '#6c4de6',
  },
  themeButtonText: { color: '#8b7fc0', fontSize: 14, fontWeight: '600' },
  themeButtonTextActive: { color: '#fff' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: { color: '#e8e0ff', fontSize: 16 },
  hint: { color: '#4a4060', fontSize: 13, marginTop: 4 },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  counterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1a1730',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2a2445',
  },
  counterButtonText: { color: '#e8e0ff', fontSize: 22 },
  counterValue: { color: '#e8e0ff', fontSize: 28, fontWeight: '700', minWidth: 32, textAlign: 'center' },
  startButton: {
    backgroundColor: '#6c4de6',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  startButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
