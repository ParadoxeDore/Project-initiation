#!/bin/bash
# Vérifie que les fichiers CLAUDE.md sont commités avant un git push.
# Reçoit le JSON de l'outil Bash sur stdin.

INPUT=$(cat)

# Ne s'applique qu'aux commandes git push
if ! echo "$INPUT" | grep -qi '"git push'; then
    exit 0
fi

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
if [ -z "$REPO_ROOT" ]; then
    exit 0
fi

UNSTAGED=$(git -C "$REPO_ROOT" diff --name-only 2>/dev/null | grep "CLAUDE\.md")
STAGED=$(git -C "$REPO_ROOT" diff --cached --name-only 2>/dev/null | grep "CLAUDE\.md")

if [ -n "$UNSTAGED" ] || [ -n "$STAGED" ]; then
    echo ""
    echo "╔══════════════════════════════════════════════════════╗"
    echo "║  BLOQUÉ — CLAUDE.md modifié et non commité          ║"
    echo "╚══════════════════════════════════════════════════════╝"
    echo ""
    if [ -n "$UNSTAGED" ]; then
        echo "Fichiers non stagés :"
        echo "$UNSTAGED" | sed 's/^/  - /'
    fi
    if [ -n "$STAGED" ]; then
        echo "Fichiers stagés non commités :"
        echo "$STAGED" | sed 's/^/  - /'
    fi
    echo ""
    echo "Commitez ces fichiers avant de pousser."
    exit 2
fi

exit 0
