# Règles du jeu — Underword

Document de référence pour l'implémentation des règles de jeu.

---

## Joueurs

- Minimum : **3 joueurs**
- Maximum : **10 joueurs**
- Matériel : **un seul appareil mobile** (pass-and-play en V1)

---

## Rôles

### Civil
- Reçoit le **mot de la manche**
- Doit donner des indices suffisamment clairs pour que les autres civils le reconnaissent, mais pas trop explicites pour ne pas aider l'imposteur
- Gagne si tous les imposteurs sont éliminés

### Imposteur
- Reçoit un **mot différent mais sémantiquement proche** du mot civil
- Doit bluffer en écoutant les indices des civils pour deviner leur mot
- Gagne si les civils éliminent un innocent avant lui, ou s'il survit jusqu'à la fin

### Mister White *(optionnel)*
- Ne reçoit **aucun mot**
- Doit bluffer en écoutant les indices et en improvisant
- Si éliminé, peut tenter de **deviner le mot civil** : s'il trouve, il gagne malgré son élimination

---

## Configuration

| Paramètre | Options |
|-----------|---------|
| Nombre d'imposteurs | Manuel (1, 2…) ou mode équilibré automatique |
| Mister White | Activé / Désactivé |
| Thème | Classique, Anime, Pop Culture, Musique |

### Mode équilibré automatique

| Joueurs | Imposteurs recommandés |
|---------|----------------------|
| 3–4 | 1 |
| 5–6 | 1–2 |
| 7–9 | 2 |
| 10 | 2–3 |

---

## Déroulement d'une manche

### Phase 1 — Distribution secrète des rôles

1. L'application tire aléatoirement les rôles et une paire de mots
2. Le téléphone affiche "Passe le téléphone à [Nom]"
3. Le joueur concerné regarde seul son écran (rôle + mot)
4. Il cache l'écran et passe le téléphone au suivant
5. Répété pour chaque joueur

### Phase 2 — Discussion

- Chaque joueur donne **un indice** sur son mot, à tour de rôle
- L'ordre est défini par l'application (aléatoire ou dans l'ordre de saisie)
- Pas de révélation directe du mot
- Plusieurs tours possibles

### Phase 3 — Vote

- Chaque joueur vote pour la personne qu'il suspecte d'être l'imposteur
- Le joueur avec le plus de votes est **éliminé**
- En cas d'égalité : nouveau vote entre les ex-æquo (ou règle à préciser)
- Le rôle du joueur éliminé est révélé

### Phase 4 — Fin de manche

**Conditions de victoire :**

| Condition | Vainqueur |
|-----------|-----------|
| Tous les imposteurs sont éliminés | Civils |
| Les imposteurs sont en majorité ou à égalité avec les civils | Imposteurs |
| Mister White est éliminé ET devine le mot civil | Mister White |
| Mister White est éliminé ET rate sa devinette | Civils |

---

## Paires de mots

Les mots civil et imposteur doivent être :
- **Sémantiquement proches** (même domaine, même catégorie)
- **Suffisamment distincts** pour que les indices créent une ambiguïté
- **Adaptés au thème** choisi

Exemples :

| Thème | Mot civil | Mot imposteur |
|-------|-----------|---------------|
| Classique | Plage | Désert |
| Classique | Piano | Guitare |
| Classique | Café | Thé |
| Anime | Naruto | Boruto |
| Musique | Jazz | Blues |
| Pop Culture | Marvel | DC |

---

## Cas limites à implémenter

- **Égalité au vote** → nouveau vote entre les ex-æquo uniquement
- **1 civil vs 1 imposteur restants** → l'imposteur gagne (civils ne peuvent plus gagner)
- **Mister White seul survivant** → l'imposteur gagne (cas edge à confirmer)
- **Tous les imposteurs se révèlent** → les civils gagnent immédiatement
