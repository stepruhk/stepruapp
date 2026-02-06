# EduBoost (version simple)

Application web pour vos cours en communication.

Fonctions principales :
- Vue étudiant / vue professeur
- Cours
- Contenu (PDF + liens)
- Notes Evernote (par cours)
- Cartes mémo (par cours)
- Assistant IA

## 1) Démarrer l'app sur votre Mac

### Prérequis
- Node.js installé

### Étapes
1. Ouvrir le Terminal
2. Aller dans le dossier du projet :
   ```bash
   cd /Users/stephaneprudhomme/Desktop/codex
   ```
3. Installer les dépendances :
   ```bash
   npm install
   ```
4. Démarrer l'app :
   ```bash
   npm run dev
   ```
5. Ouvrir l'URL affichée dans le Terminal (souvent `http://localhost:3000` ou `http://localhost:3001`)

## 2) Fichier `.env.local`

Le fichier `.env.local` doit rester privé (jamais sur GitHub).

Exemple :
```env
OPENAI_API_KEY=votre_cle_openai
APP_PASSWORD=votre_mot_de_passe_etudiant
PROF_PASSWORD=votre_mot_de_passe_prof
```

## 3) Déploiement sur Render

Paramètres Render (Web Service Node) :
- Build Command :
  ```bash
  npm install && npm run build
  ```
- Start Command :
  ```bash
  npm run start
  ```

Variables d'environnement Render à ajouter :
- `OPENAI_API_KEY`
- `APP_PASSWORD`
- `PROF_PASSWORD`

Après une modification :
1. Mettre à jour les fichiers sur GitHub
2. Sur Render : `Manual Deploy` -> `Clear build cache & deploy`

## 4) Important

- Ne pas uploader `node_modules` sur GitHub
- Ne pas uploader `.env.local` sur GitHub
- Si Render affiche une erreur de build, lire la **première** ligne d'erreur utile dans `deploy logs`

## 5) Commandes utiles

```bash
npm run dev
npm run build
npm run start
```
