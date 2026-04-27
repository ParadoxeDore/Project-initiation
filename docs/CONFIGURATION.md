# Configuration — Underword

Variables d'environnement et configuration par couche.

---

## Backend (`backend/.env`)

```env
# Serveur
PORT=3000
NODE_ENV=development

# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/underword

# Redis
REDIS_URL=redis://localhost:6379

# Sécurité
JWT_SECRET=changez-cette-valeur-en-production
SESSION_TTL_HOURS=24
```

---

## Mobile (`mobile/.env`)

```env
# API Backend
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_SOCKET_URL=http://localhost:3000
```

---

## Docker Compose (développement local)

```yaml
# docker-compose.yml (à créer à la racine)
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: underword
    ports:
      - "5432:5432"

  redis:
    image: redis:7
    ports:
      - "6379:6379"
```

Lancer : `docker compose up -d`

---

## Notes

- Ne jamais commiter les fichiers `.env` (déjà dans `.gitignore`)
- Copier `.env.example` → `.env` et remplir les valeurs
- En production, utiliser les variables d'environnement du serveur directement
