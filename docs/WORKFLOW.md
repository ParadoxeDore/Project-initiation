# Workflow de développement — Underword

## Les 5 rôles

| Rôle | Commande | Responsabilité |
|------|----------|----------------|
| Chef de Projet | `/chef-projet` | US business, critères d'acceptation, conformité finale |
| Architecte | `/architecte` | Specs techniques, découpe en tâches GitHub |
| Développeur | `/dev` | Implémentation des tâches, PRs |
| Reviewer | `/reviewer` | Revue de code, conformité architecturale |
| Testeur | `/testeur` | Exécution des tests, rapport de bugs |

---

## Cycle de vie d'une fonctionnalité

```
1. Chef de Projet   →  crée une User Story sur GitHub (label: user-story)
2. Architecte       →  crée les tâches techniques liées (label: task)
3. Développeur      →  prend une tâche, crée une branche, développe, ouvre une PR
4. Reviewer         →  relit le code, approuve ou demande des corrections
5. Testeur          →  exécute les tests, crée des issues bug si nécessaire (label: bug)
6. Chef de Projet   →  vérifie la conformité, ferme la User Story
```

---

## Git Flow

### Branches

```
main                    ← production (protégée)
feat/TASK-XX-nom-court  ← nouvelle fonctionnalité
fix/BUG-XX-nom-court    ← correction de bug
chore/description       ← tâche technique (config, deps…)
```

**Règles :**
- Ne jamais pousser directement sur `main`
- Une branche = une tâche technique (atomique)
- Supprimer la branche après merge

### Commits

Format : `type: description courte en français`

```bash
feat: affichage du rôle secret au joueur
fix: correction du calcul du nombre d'imposteurs
refactor: extraction de la logique de vote en service
test: ajout des tests unitaires pour le service de mots
chore: configuration de l'environnement PostgreSQL
docs: mise à jour de l'architecture dans ARCHITECTURE.md
```

### Pull Requests

- Titre : `feat: [TASK-XX] Description courte`
- Body : référencer l'issue avec `Closes #XX`
- Une PR = une tâche technique
- **Merge interdit** sans approbation Reviewer + validation Testeur

---

## Labels GitHub

| Label | Créé par | Description |
|-------|----------|-------------|
| `epic` | — | Fonctionnalité majeure regroupant des US |
| `user-story` | Chef de Projet | Besoin utilisateur business |
| `task` | Architecte | Tâche technique issue d'une US |
| `bug` | Testeur | Anomalie constatée lors des tests |
| `epic:*` | — | Filtre par Epic (configuration-partie, attribution-roles…) |

---

## Tests

### Emplacement

```
mobile/src/__tests__/     ← Tests composants et screens (React Native Testing Library)
backend/src/__tests__/    ← Tests services et routes (Jest + Supertest)
shared/__tests__/         ← Tests des utilitaires partagés (Jest)
```

### Conventions

- Un fichier de test par fichier source (`monService.test.ts`)
- Les tests couvrent les critères d'acceptation de la US
- Pas de mock de base de données — tester contre une BDD de test réelle

### Commandes

```bash
# Tous les tests
cd backend && npm test
cd mobile && npm test

# Un test précis
cd backend && npm test -- --testPathPattern="wordService"
```

---

## Conventions de code

| Règle | Détail |
|-------|--------|
| Langage du code | Anglais (variables, fonctions, types) |
| Langage des issues/commits | Français |
| TypeScript | Mode strict — zéro `any` non justifié |
| Types partagés | Dans `shared/types/` |
| Validation | Uniquement aux frontières (input utilisateur, API externe) |
| Commentaires | Seulement si le POURQUOI n'est pas évident |
| Secrets | Variables d'environnement uniquement — jamais en dur |
