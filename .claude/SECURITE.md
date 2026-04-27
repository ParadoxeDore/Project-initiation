# Règles de sécurité Claude Code

Ce fichier documente les règles de sécurité définies dans `settings.json`.
Ces règles s'appliquent à Claude Code et à tous ses agents sur ce projet.

---

## Suppressions de fichiers

| Règle bloquée | Risque |
|---------------|--------|
| `rm -rf *` | Suppression récursive forcée — peut vider un dossier entier |
| `rm -r *` | Suppression récursive sans confirmation |
| `rm * /*` | Suppression sur chemin absolu (hors projet) |
| `rm * ~*` | Suppression dans le répertoire home |
| `del /f /s /q *` | Équivalent Windows de `rm -rf` |
| `rd /s /q *` | Suppression récursive de répertoire Windows |
| `Remove-Item -Recurse *` | Suppression récursive PowerShell |
| `Remove-Item -Force *` | Suppression forcée PowerShell |
| `Format-Volume *` | Formatage d'un volume disque |
| `Clear-Disk *` | Effacement complet d'un disque |
| `Remove-Partition *` | Suppression de partition |

> Pour supprimer un fichier suivi par Git, utiliser `git rm <fichier>`.
> Pour un fichier non suivi, demander confirmation explicite à l'utilisateur.

---

## Opérations Git destructives

| Règle bloquée | Risque |
|---------------|--------|
| `git push --force *` | Écrase l'historique distant — perte de commits |
| `git push -f *` | Idem (forme courte) |
| `git push * master` | Push direct sur master sans PR |
| `git push * main` | Push direct sur main sans PR |
| `git reset --hard *` | Supprime les modifications non commitées |
| `git clean -f *` | Supprime les fichiers non suivis |
| `git clean -fd *` | Supprime les fichiers et répertoires non suivis |
| `git clean -fdx *` | Idem + ignore les fichiers dans .gitignore |
| `git branch -D *` | Suppression forcée de branche (perte de commits non mergés) |

---

## Contournement des protections

| Règle bloquée | Risque |
|---------------|--------|
| `--no-verify` | Bypass des hooks pre-commit/pre-push (validation ignorée) |
| `-c commit.gpgsign=false` | Bypass de la signature GPG des commits |

---

## Commandes système dangereuses

| Règle bloquée | Risque |
|---------------|--------|
| `dd *` | Écriture directe sur un périphérique — peut effacer un disque |
| `mkfs *` | Formatage d'un système de fichiers |
| `shutdown *` | Extinction du système |
| `reboot *` | Redémarrage du système |
| `format *` | Formatage Windows |
| `cipher /w *` | Écrasement sécurisé de l'espace libre (irréversible) |
| `diskpart *` | Outil de partitionnement Windows (destructif) |
| `Stop-Computer *` | Extinction PowerShell |
| `Restart-Computer *` | Redémarrage PowerShell |

---

## Publication accidentelle

| Règle bloquée | Risque |
|---------------|--------|
| `npm publish *` | Publication d'un paquet sur npm sans intention |
| `yarn publish *` | Idem via Yarn |
| `npx publish *` | Idem via npx |

---

## Bombes logiques et écrasements disque

| Règle bloquée | Risque |
|---------------|--------|
| `:(){ \|:& };:` | Fork bomb bash — sature les processus système |
| `* > /dev/sda *` | Écriture directe sur le disque principal |
| `* > /dev/sdb *` | Écriture directe sur un disque secondaire |
| `chmod -R 777 /*` | Ouvre toutes les permissions sur le système entier |
| `chown -R * /*` | Changement de propriétaire sur tout le système |

---

## Ce qui reste autorisé

Ces opérations **ne sont pas bloquées** car elles sont nécessaires au développement :

- `git rm <fichier>` — suppression de fichiers suivis par Git
- `git push origin <branche-feature>` — push de branches de travail
- `git reset HEAD <fichier>` — désindexation d'un fichier (non destructif)
- `git stash` — mise en réserve des modifications
- `npm install`, `npm run *` — gestion des dépendances et scripts
- `rm <fichier-unique>` — suppression d'un fichier précis (non récursif)

---

## Modifier ces règles

Toute modification de `settings.json` doit être :
1. Discutée et approuvée explicitement par l'utilisateur
2. Documentée dans ce fichier avec le risque associé
3. Commitée via une PR dédiée (pas en direct sur main)
