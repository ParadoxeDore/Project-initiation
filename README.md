# Underword

Jeu mobile de déduction sociale inspiré d'Undercover. Les joueurs se passent un seul téléphone à tour de rôle — chacun découvre secrètement son rôle et son mot, puis le groupe débat et vote pour identifier les imposteurs.

---

## Sommaire

- [Règles du jeu](#règles-du-jeu)
- [Stack technique](#stack-technique)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Lancer le projet](#lancer-le-projet)
- [Structure du projet](#structure-du-projet)
- [Contribuer](#contribuer)
- [Documentation](#documentation)

---

## Règles du jeu

- **3 à 10 joueurs**, un seul appareil partagé (pass-and-play)
- Chaque joueur reçoit secrètement un rôle :
  - **Civil** — reçoit le mot de la manche, doit se fondre dans la masse
  - **Imposteur** — reçoit un mot différent mais proche, doit bluffer
  - **Mister White** *(optionnel)* — ne reçoit aucun mot, doit deviner en écoutant les autres
- Les joueurs ne connaissent pas leur rôle à l'avance
- Chaque joueur donne un indice sur son mot → vote → élimination → révélation

---

## Stack technique

| Couche | Technologie | Version |
|--------|-------------|---------|
| Mobile | React Native (Expo) | À définir |
| Backend | Node.js / Express | À définir |
| Temps-réel | Socket.io | À définir |
| Base de données | PostgreSQL + Redis | À définir |
| Langage | TypeScript (strict) | À définir |

---

## Prérequis

- [Node.js](https://nodejs.org/) >= 18
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Docker](https://www.docker.com/) (pour PostgreSQL et Redis en local)
- Un émulateur Android/iOS ou l'application Expo Go sur un appareil physique

---

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/ParadoxeDore/Project-initiation.git
cd Project-initiation

# Installer les dépendances — mobile
cd mobile && npm install

# Installer les dépendances — backend
cd ../backend && npm install

# Installer les dépendances — types partagés
cd ../shared && npm install
```

> Les variables d'environnement requises sont documentées dans [`docs/CONFIGURATION.md`](docs/CONFIGURATION.md).

---

## Lancer le projet

```bash
# Backend (API + WebSocket)
cd backend && npm run dev

# Mobile (Expo)
cd mobile && npx expo start
```

---

## Structure du projet

```
Project-initiation/
├── mobile/          # Application React Native (Expo)
│   └── src/
│       ├── screens/       # Écrans
│       ├── components/    # Composants réutilisables
│       ├── services/      # Appels API / Socket
│       ├── hooks/         # Hooks React personnalisés
│       ├── utils/         # Utilitaires
│       └── __tests__/
├── backend/         # API REST + WebSocket
│   └── src/
│       ├── routes/        # Endpoints REST
│       ├── services/      # Logique métier
│       ├── middleware/     # Auth, validation
│       ├── socket/        # Événements WebSocket
│       └── __tests__/
├── shared/          # Types TypeScript partagés
│   ├── types/
│   ├── constants/
│   └── __tests__/
└── docs/            # Documentation technique
```

---

## Contribuer

Ce projet suit un workflow structuré en 5 rôles. Consulte [`docs/WORKFLOW.md`](docs/WORKFLOW.md) pour le détail complet.

### Résumé rapide

**1. Récupérer une tâche**
Les tâches techniques sont listées dans les [issues GitHub](https://github.com/ParadoxeDore/Project-initiation/issues?q=label%3Atask).

**2. Créer une branche**
```bash
git checkout -b feat/TASK-XX-nom-court
```

**3. Conventions de commit**
```
feat: description courte en français
fix: description courte en français
```

Types valides : `feat`, `fix`, `refactor`, `test`, `chore`, `docs`

**4. Ouvrir une PR**
- La PR doit référencer l'issue (`Closes #XX`)
- Une PR = une tâche technique
- Le merge nécessite l'approbation du Reviewer + validation du Testeur

### Règles TypeScript

- Mode strict activé — zéro `any` non justifié
- Types partagés dans `shared/types/`
- Validation des entrées uniquement aux frontières (inputs utilisateur, API externe)

---

## Documentation

| Document | Description |
|----------|-------------|
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Architecture technique détaillée |
| [`docs/WORKFLOW.md`](docs/WORKFLOW.md) | Workflow, rôles et conventions Git |
| [`docs/GAME_RULES.md`](docs/GAME_RULES.md) | Règles complètes du jeu |
| [`docs/CONFIGURATION.md`](docs/CONFIGURATION.md) | Variables d'environnement et configuration |
| [`.claude/SECURITE.md`](.claude/SECURITE.md) | Règles de sécurité Claude Code |
