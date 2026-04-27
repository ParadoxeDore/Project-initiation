# CLAUDE.md

Ce fichier fournit des instructions à Claude Code (claude.ai/code) pour travailler dans ce dépôt.

## Statut du projet

Projet en cours d'initialisation. La stack technique (framework, base de données, etc.) n'a pas encore été définie.

## Architecture

Ce projet est structuré en trois couches distinctes :

- **`frontend/`** — Application web (React). Les composants réutilisables vont dans `src/components/`, les vues dans `src/pages/`, les appels API dans `src/services/`.
- **`mobile/`** — Application mobile React Native (Android APK / iOS). Les écrans vont dans `src/screens/`, les composants dans `src/components/`.
- **`backend/`** — API REST (Node.js / Express). La logique métier va dans `src/services/`, les endpoints dans `src/routes/`, la validation et auth dans `src/middleware/`.
- **`shared/`** — Types TypeScript et constantes partagés entre frontend, mobile et backend.

## Configuration Claude Code

- **`.claude/commands/`** — Commandes slash personnalisées du projet
- **`.claude/hooks/`** — Scripts exécutés automatiquement lors d'événements Claude Code
- **`.claude/settings.json`** — Permissions et configuration propres au projet

## Démarrage

Une fois la stack définie, mettre à jour ce fichier avec :
- Les commandes d'installation, de build et d'exécution par couche
- Les commandes de test (dont comment lancer un test unique)
- Les variables d'environnement requises
