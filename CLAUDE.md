# CLAUDE.md

Ce fichier fournit des instructions à Claude Code (claude.ai/code) pour travailler dans ce dépôt.

---

## Concept du projet

**Nom provisoire :** Underword *(à confirmer)*

Jeu mobile de déduction sociale inspiré d'Undercover. Les joueurs se passent un seul téléphone à tour de rôle. Chaque joueur voit secrètement son rôle et son mot, puis cache l'écran avant de passer l'appareil au suivant. Les joueurs doivent débattre et voter pour identifier les imposteurs.

---

## Règles du jeu

- **3 à 10 joueurs**, un seul appareil partagé (pass-and-play).
- Chaque joueur reçoit secrètement un **rôle** :
  - **Civil** — reçoit le mot de la manche, doit se fondre dans la masse.
  - **Imposteur** — reçoit un mot différent mais proche, doit bluffer.
  - **Mister White** *(optionnel)* — ne reçoit aucun mot, doit deviner et bluffer.
- Les joueurs ne connaissent **pas leur rôle à l'avance**.
- Les mots sont **choisis automatiquement** par le jeu depuis une base de données.
- Phase de discussion : chaque joueur donne un indice sur son mot.
- Phase de vote : les joueurs élisent la personne à éliminer.
- Si Mister White est éliminé, il tente de **deviner le mot civil** pour inverser la victoire.

---

## Stack technique

| Couche    | Technologie                  |
|-----------|------------------------------|
| Mobile    | React Native (Expo)          |
| Backend   | Node.js / Express            |
| Temps-réel| WebSocket (Socket.io)        |
| Base de données | PostgreSQL (mots) + Redis (sessions) |
| Types partagés | TypeScript (`shared/`)  |

> **Portée actuelle :** application mobile pass-and-play uniquement.
> **Prévu plus tard :** mode multijoueur local avec code de salle (chaque joueur sur son propre appareil).

---

## Architecture

```
Project-initiation/
├── mobile/          # Application React Native (Expo)
│   └── src/
│       ├── screens/       # Écrans (Accueil, Configuration, Rôle secret, Résultats…)
│       ├── components/    # Composants réutilisables
│       ├── services/      # Appels API / Socket
│       ├── hooks/         # Hooks React personnalisés
│       ├── utils/         # Fonctions utilitaires
│       └── __tests__/     # Tests unitaires
├── backend/         # API REST + WebSocket (Node.js / Express)
│   └── src/
│       ├── routes/        # Endpoints REST
│       ├── services/      # Logique métier (tirage des rôles, des mots…)
│       ├── middleware/     # Auth, validation
│       ├── socket/        # Gestion des événements WebSocket
│       └── __tests__/     # Tests unitaires
├── shared/          # Types TypeScript et constantes partagés
│   ├── types/             # Types et interfaces TypeScript
│   ├── constants/         # Constantes partagées
│   └── __tests__/         # Tests des utilitaires partagés
├── docs/            # Documentation technique
│   ├── ARCHITECTURE.md    # Architecture détaillée
│   ├── WORKFLOW.md        # Workflow Git et rôles
│   ├── GAME_RULES.md      # Règles complètes du jeu
│   └── CONFIGURATION.md   # Variables d'environnement
└── .claude/
    ├── commands/    # Commandes slash : chef-projet, architecte, dev, reviewer, testeur
    ├── hooks/       # Scripts automatiques
    ├── SECURITE.md  # Documentation des règles de sécurité
    └── settings.json
```

---

## Modes de jeu (thèmes de mots)

| Mode         | Description                              |
|--------------|------------------------------------------|
| Classique    | Mots du quotidien, objets, animaux…      |
| Anime        | Personnages, séries, univers anime       |
| Pop Culture  | Films, séries, célébrités                |
| Musique      | Artistes, genres musicaux, instruments   |
| *(à venir)*  | D'autres thèmes peuvent être ajoutés     |

---

## Configuration d'une partie

- Nombre d'imposteurs : **manuel** (1, 2…) ou **mode équilibré automatique**.
- Activation de **Mister White** : oui / non.
- Choix du **thème** (mode de jeu).
- Possibilité de **mélanger les thèmes** *(à préciser)*.

---

## Epics et User Stories

### Epic 1 — Création et configuration d'une partie
| ID   | User Story |
|------|------------|
| US-01 | En tant que joueur, je peux créer une nouvelle partie et saisir les noms des participants (3–10). |
| US-02 | En tant que joueur, je peux choisir le thème de la partie (Classique, Anime, Pop Culture, Musique…). |
| US-03 | En tant que joueur, je peux définir manuellement le nombre d'imposteurs. |
| US-04 | En tant que joueur, je peux activer le rôle Mister White. |
| US-05 | En tant que joueur, je peux activer le mode équilibré automatique (le jeu calcule le nombre d'imposteurs selon le nombre de joueurs). |

### Epic 2 — Attribution secrète des rôles
| ID   | User Story |
|------|------------|
| US-06 | En tant que joueur, le téléphone me présente un écran "Passe le téléphone à [nom]" avant de révéler mon rôle. |
| US-07 | En tant que civil, je vois mon mot secret après avoir confirmé que je suis seul à regarder. |
| US-08 | En tant qu'imposteur, je vois "IMPOSTEUR" et mon mot (différent du mot civil). |
| US-09 | En tant que Mister White, je vois "MISTER WHITE" sans aucun mot. |
| US-10 | En tant que joueur, je peux masquer l'écran (appuyer pour cacher) avant de passer l'appareil au suivant. |

### Epic 3 — Phase de jeu (discussion et vote)
| ID   | User Story |
|------|------------|
| US-11 | En tant que joueur, je peux voir la liste de tous les joueurs encore en jeu. |
| US-12 | En tant que joueur, je peux voter pour éliminer un suspect à la fin du tour de discussion. |
| US-13 | En tant que joueur, je vois le résultat du vote et le joueur éliminé. |
| US-14 | En tant que Mister White éliminé, j'ai la possibilité de saisir le mot civil pour tenter de gagner. |

### Epic 4 — Fin de partie et résultats
| ID   | User Story |
|------|------------|
| US-15 | En tant que joueur, je vois qui était l'imposteur / Mister White à la fin de la partie. |
| US-16 | En tant que joueur, je vois le mot civil et le mot imposteur révélés en fin de partie. |
| US-17 | En tant que joueur, je peux relancer une nouvelle partie rapidement. |

### Epic 5 — Base de données de mots
| ID   | User Story |
|------|------------|
| US-18 | En tant que développeur, je dispose d'une grande base de mots organisée par thème (Classique, Anime, Pop Culture, Musique…). |
| US-19 | En tant que système, je génère automatiquement une paire de mots (mot civil / mot imposteur) cohérente et liée sémantiquement. |
| US-20 | En tant qu'administrateur, je peux ajouter ou modifier des paires de mots dans la base. |

### Epic 6 — Multijoueur local avec code de salle *(prévu — non prioritaire)*
| ID   | User Story |
|------|------------|
| US-21 | En tant que joueur, je peux créer une salle et obtenir un code à partager. |
| US-22 | En tant que joueur, je peux rejoindre une salle existante avec un code. |
| US-23 | En tant que joueur, chaque participant utilise son propre appareil pour voir son rôle secret. |

---

## Démarrage *(à compléter une fois la stack initialisée)*

```bash
# Mobile
cd mobile && npm install && npx expo start

# Backend
cd backend && npm install && npm run dev
```

Variables d'environnement requises : voir [`docs/CONFIGURATION.md`](docs/CONFIGURATION.md)

---

## Priorités de développement

1. Epic 5 — Base de données de mots (fondation du jeu)
2. Epic 1 — Création et configuration d'une partie
3. Epic 2 — Attribution secrète des rôles
4. Epic 3 — Phase de discussion et vote
5. Epic 4 — Fin de partie et résultats
6. Epic 6 — Multijoueur local *(plus tard)*

---

## Règles transversales

Ces règles s'appliquent à tous les rôles sans exception.

### Langue

- Issues GitHub, commentaires, commits, noms de branches : **français**
- Code (variables, fonctions, types) : **anglais**

### Branches Git

```
feat/TASK-XX-nom-court     ← nouvelle fonctionnalité (liée à une tâche technique)
fix/BUG-XX-nom-court       ← correction de bug (liée à une issue bug)
chore/description-courte   ← tâche technique (config, deps…)
```

### Commits

Format : `type: description courte en français`

| Type | Usage |
|------|-------|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `refactor` | Refactorisation sans changement de comportement |
| `test` | Ajout ou modification de tests |
| `chore` | Tâche technique (config, dépendances…) |
| `docs` | Documentation uniquement |

Exemple : `feat: affichage du rôle secret au joueur`

### TypeScript

- Mode **strict** activé partout
- Zéro `any` non justifié
- Les types partagés entre mobile et backend vont dans `shared/`
- Pas d'import circulaire entre les couches

### Qualité du code

- Une fonction = une responsabilité
- Validation des entrées **uniquement aux frontières** (input utilisateur, API externe)
- Zéro secret en dur dans le code (utiliser les variables d'environnement)
- Pas de commentaires qui expliquent le *quoi* — seulement le *pourquoi* si non évident

### Critères de merge

Une PR ne peut être mergée que si :
1. Le **Reviewer** a approuvé
2. Le **Testeur** a validé les critères d'acceptation
3. Aucun test ne passe en rouge

---

## Rôles et workflow

Ce projet utilise 5 rôles activables via des commandes slash Claude Code.

### Workflow

```
/chef-projet  →  rédige US + critères d'acceptation (GitHub)
      ↓
/architecte   →  specs techniques + découpe en tâches (GitHub)
      ↓
/dev          →  implémente les tâches, ouvre une PR
      ↓
/reviewer     →  revue de code, approuve ou demande corrections
      ↓
/testeur      →  exécute les tests, rapporte les bugs (GitHub)
      ↓
/chef-projet  →  vérifie la conformité, clôture la US
```

### Permissions par rôle

| Rôle | Lire code | Écrire code | Fichiers test | GitHub issues | Lancer tests | Créer PR |
|------|:---------:|:-----------:|:-------------:|:-------------:|:------------:|:--------:|
| `/chef-projet` | Oui | Non | Non | Créer / Fermer | Non | Non |
| `/architecte`  | Oui | Specs uniquement | Non | Créer tâches | Non | Non |
| `/dev`         | Oui | Oui | Non | Commenter | Non | Oui |
| `/reviewer`    | Oui | Non | Non | Commenter | Non | Non |
| `/testeur`     | Oui | Non | Oui | Créer bugs | Oui | Non |

### Labels GitHub

| Label | Usage |
|-------|-------|
| `epic` | Issue Epic |
| `user-story` | User Story business |
| `task` | Tâche technique (créée par l'Architecte) |
| `bug` | Bug rapporté par le Testeur |
| `epic:configuration-partie` | Filtre Epic 1 |
| `epic:attribution-roles` | Filtre Epic 2 |
| `epic:phase-jeu` | Filtre Epic 3 |
| `epic:fin-partie` | Filtre Epic 4 |
| `epic:base-de-mots` | Filtre Epic 5 |
| `epic:multijoueur-local` | Filtre Epic 6 (V2) |

### Commandes slash disponibles

Les fichiers de commande sont dans `.claude/commands/` :

- `/chef-projet` — Active le rôle Chef de Projet
- `/architecte` — Active le rôle Architecte
- `/dev` — Active le rôle Développeur
- `/reviewer` — Active le rôle Reviewer
- `/testeur` — Active le rôle Testeur
