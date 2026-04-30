# Architecture technique — Underword

## Vue d'ensemble

Underword est structuré en trois couches indépendantes qui communiquent via une API REST et des événements WebSocket.

```
┌─────────────────────────────────────┐
│         Mobile (React Native)        │
│  Expo · TypeScript · Socket.io-client│
└──────────────┬──────────────────────┘
               │ REST + WebSocket
┌──────────────▼──────────────────────┐
│       Backend (Node.js / Express)    │
│  Express · Socket.io · TypeScript   │
└──────┬───────────────────┬──────────┘
       │                   │
┌──────▼──────┐   ┌────────▼────────┐
│  PostgreSQL  │   │      Redis      │
│  (mots, BDD) │   │  (sessions jeu) │
└─────────────┘   └─────────────────┘
```

---

## Couche Mobile

**Technologie :** React Native avec Expo

### Dossiers

| Dossier | Rôle |
|---------|------|
| `screens/` | Écrans complets (une responsabilité par écran) |
| `components/` | Composants réutilisables sans état métier |
| `services/` | Appels REST et gestion Socket.io |
| `hooks/` | Hooks React personnalisés (état, effets) |
| `utils/` | Fonctions pures utilitaires |
| `__tests__/` | Tests unitaires et d'intégration |

### Écrans principaux (V1 — pass-and-play) ✅ Implémentés

| Écran | Description |
|-------|-------------|
| `HomeScreen` | Accueil — créer une partie |
| `SetupScreen` | Configuration : noms, multi-thèmes, nb imposteurs, nb Mister White, mode équilibré |
| `PassPhoneScreen` | "Passe le téléphone à [nom]" |
| `RoleRevealScreen` | Révélation secrète du rôle et du mot, toggle cacher/montrer |
| `VoteScreen` | Liste des joueurs actifs, vote, élimination, devinette Mister White |
| `ResultScreen` | Fin de partie — révélation des rôles, rejouer avec config conservée |

### Logique de jeu (`utils/gameEngine.ts`) ✅ Implémentée

Logique pure sans dépendance UI : création de partie, tirage des rôles, sélection de mots, élimination, détection des conditions de victoire.

### Données de mots (`data/wordPairs.ts`) ✅ Proto

32 paires codées en dur sur 4 thèmes. **À remplacer par des appels API** une fois le backend branché.

---

## Couche Backend

**Technologie :** Node.js avec Express + Socket.io

### Dossiers

| Dossier | Rôle |
|---------|------|
| `routes/` | Définition des endpoints REST |
| `services/` | Logique métier (tirage des mots, attribution des rôles, votes) |
| `middleware/` | Validation des entrées, gestion des erreurs |
| `socket/` | Événements WebSocket (futur multijoueur) |
| `__tests__/` | Tests unitaires des services et routes |

### Endpoints REST (V1)

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/api/game/create` | Créer une partie |
| `GET` | `/api/game/:id` | État d'une partie |
| `POST` | `/api/game/:id/assign` | Tirer les rôles et les mots |
| `POST` | `/api/game/:id/vote` | Soumettre un vote |
| `GET` | `/api/words/pair` | Obtenir une paire civil/imposteur |

### Événements WebSocket (V2 — multijoueur)

| Événement | Émetteur | Description |
|-----------|----------|-------------|
| `game:join` | Client | Rejoindre une salle |
| `game:start` | Serveur | Démarrer la partie |
| `game:role` | Serveur | Envoyer le rôle au joueur |
| `game:vote` | Client | Envoyer un vote |
| `game:result` | Serveur | Diffuser le résultat |

---

## Couche Shared

Types TypeScript partagés entre mobile et backend. **Aucune logique métier ici.**

```typescript
// mobile/src/utils/gameEngine.ts (source de vérité proto)
export type Role = 'civil' | 'imposteur' | 'mister-white'

export interface Player {
  id: string
  name: string
  role: Role
  word: string | null  // null pour Mister White
  isEliminated: boolean
}

export interface GameConfig {
  playerNames: string[]
  themes: Theme[]          // multi-thèmes supportés
  impostorCount: number
  misterWhiteCount: number // indépendant de impostorCount
}

export type Theme = 'classique' | 'anime' | 'pop-culture' | 'musique'
```

> Ces types doivent migrer dans `shared/types/game.ts` lors du branchement backend.

---

## Base de données

### PostgreSQL — schéma des mots

```sql
-- Paires de mots civil/imposteur
CREATE TABLE word_pairs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  theme       TEXT NOT NULL,
  civil_word  TEXT NOT NULL,
  impostor_word TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_word_pairs_theme ON word_pairs(theme);
```

### Redis — sessions de jeu

Clé : `game:<id>` — TTL : 24h

```json
{
  "id": "uuid",
  "config": { "...": "..." },
  "players": [],
  "wordPair": { "civil": "...", "impostor": "..." },
  "phase": "setup | reveal | discussion | vote | result",
  "votes": {}
}
```

---

## Décisions d'architecture

| Décision | Choix | Raison |
|----------|-------|--------|
| État de jeu | Redis | Données temporaires, TTL natif, accès rapide |
| Mots | PostgreSQL | Données persistantes, requêtes par thème |
| Types partagés | `shared/` | Cohérence mobile ↔ backend sans duplication |
| Pass-and-play V1 | Pas de WebSocket actif | Simplifie la V1, un seul appareil |
| WebSocket V2 | Socket.io | Reconnexion automatique, rooms natives |
