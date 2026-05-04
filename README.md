# S2 Formation - PWA Évaluation Pratique

Application Progressive Web App pour l'évaluation pratique des formations CACES (Travail en Hauteur, Échafaudages, Habilitation Électrique).

## 🚀 Fonctionnalités

- ✅ Authentification Google OAuth
- ✅ Mode session multi-stagiaires
- ✅ Grilles d'évaluation interactives (TH-01, ECHAF-01, HABELEC-01)
- ✅ Calcul automatique des scores
- ✅ Signature tactile formateur
- ✅ Génération PDF conforme aux templates
- ✅ Stockage local offline (IndexedDB)
- ✅ Synchronisation Firebase
- ✅ Dashboard statistiques
- ✅ PWA installable sur smartphone

## 📋 Configuration Firebase

### 1. Créer un projet Firebase

1. Aller sur https://console.firebase.google.com
2. Cliquer sur "Ajouter un projet"
3. Nom du projet : `s2-formation-pwa`
4. Activer Google Analytics (optionnel)

### 2. Activer l'authentification Google

1. Dans la console Firebase, aller dans **Authentication**
2. Cliquer sur **Commencer**
3. Dans l'onglet **Sign-in method**, activer **Google**
4. Dans **Domaines autorisés**, ajouter :
   - `localhost`
   - `s2pratique.github.io`

### 3. Créer Firestore Database

1. Dans la console Firebase, aller dans **Firestore Database**
2. Cliquer sur **Créer une base de données**
3. Choisir **Mode test** (à changer en production)
4. Sélectionner une région (europe-west1 ou europe-west3)

### 4. Récupérer les clés de configuration

1. Dans **Paramètres du projet** (⚙️), aller dans **Vos applications**
2. Cliquer sur l'icône Web `</>`
3. Enregistrer l'app avec le surnom `s2-formation-pwa`
4. Copier les valeurs de `firebaseConfig`

### 5. Mettre à jour le fichier de configuration

Éditer le fichier `src/config/firebase.js` et remplacer les valeurs :

```javascript
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "s2-formation-pwa.firebaseapp.com",
  projectId: "s2-formation-pwa",
  storageBucket: "s2-formation-pwa.appspot.com",
  messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
  appId: "VOTRE_APP_ID"
};
```

## 🔧 Installation locale

```bash
# Cloner le repository
git clone https://github.com/s2pratique/s2-formation-pwa.git
cd s2-formation-pwa

# Installer les dépendances
npm install --legacy-peer-deps

# Lancer en dev
npm run dev
```

## 📦 Déploiement GitHub Pages

### 1. Configuration du repository

1. Aller dans **Settings** > **Pages**
2. Source : **GitHub Actions**

### 2. Push vers GitHub

```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/s2pratique/s2-formation-pwa.git
git push -u origin main
```

Le déploiement se fait automatiquement via GitHub Actions.

URL de l'application : https://s2pratique.github.io/s2-formation-pwa/

## 📱 Utilisation

### Connexion formateurs

- Utiliser votre compte Google professionnel
- Client ID : `597289993836-p41mo5enbjg5lnkmf4vhekt2cnjobl1k.apps.googleusercontent.com`

### Créer une session

1. Cliquer sur "Nouvelle session"
2. Sélectionner la formation (TH-01, ECHAF-01, HABELEC-01)
3. Sélectionner le profil si applicable
4. Ajouter les stagiaires (nom, prénom)
5. Démarrer la session

### Évaluation

1. Naviguer entre stagiaires avec les flèches
2. Cliquer sur les boutons de pénalité (-2 pts ou -1 pt selon la formation)
3. Le score se calcule automatiquement
4. Bouton "Reset" pour remettre un critère au maximum
5. Signer l'évaluation
6. Générer le PDF conforme

### PDF générés

Les PDF respectent strictement les templates fournis :
- Logo S2 Formation
- Mise en page identique
- Signature dans la case prévue
- Case ADMIS/REFUSÉ cochée automatiquement

## 🛠️ Technologies

- **React** 18 + Vite
- **Zustand** - State management
- **Firebase** - Auth + Firestore
- **jsPDF** - Génération PDF
- **Google OAuth** - Authentification
- **IndexedDB** (Dexie.js) - Stockage offline
- **PWA** - Service Worker + Manifest

## 📄 Licence

Propriétaire - S2 Formation © 2025

## 👥 Support

Contact : formation@s2formation.fr
