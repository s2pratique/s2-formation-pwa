// Configuration OAuth Google
export const GOOGLE_CLIENT_ID = "597289993836-p41mo5enbjg5lnkmf4vhekt2cnjobl1k.apps.googleusercontent.com";

// Grilles d'évaluation
export const FORMATIONS = {
  'TH-01': {
    code: 'TH-01',
    nom: 'Travail en Hauteur',
    seuil: 35,
    total: 50,
    sections: [
      {
        id: 'verification',
        nom: 'VÉRIFICATION',
        criteres: [
          {
            id: 'epi',
            libelle: 'Contrôle et port des EPI',
            detail: '(longe, harnais, connecteurs,...)',
            bareme: 5,
            penalite: -2
          }
        ]
      },
      {
        id: 'pratique',
        nom: 'PRATIQUE',
        criteres: [
          {
            id: 'acces',
            libelle: 'Contrôle et sécurisation des accès',
            detail: '(corde, anneau de sangle,...)',
            bareme: 8,
            penalite: -2
          },
          {
            id: 'ancrage',
            libelle: "Réalisation d'ancrage et noeuds provisoire",
            detail: '',
            bareme: 8,
            penalite: -2
          },
          {
            id: 'ligne_vie',
            libelle: "Réalisation et contrôle d'une ligne de vie provisoire",
            detail: '',
            bareme: 8,
            penalite: -2
          },
          {
            id: 'position',
            libelle: 'Position sternale de sécurité',
            detail: '',
            bareme: 6,
            penalite: -2
          },
          {
            id: 'longes',
            libelle: 'Utilisation des longes / harnais',
            detail: 'pendant toute la pratique',
            bareme: 10,
            penalite: -2
          },
          {
            id: 'stockage',
            libelle: 'Stockage, conditionnement et nettoyage',
            detail: '',
            bareme: 5,
            penalite: -2
          }
        ]
      }
    ],
    conditions: "La réussite aux épreuves pratiques nécessite l'obtention :\n- d'une moyenne minimale de 35/50 à l'ensemble de l'examen\n- et d'une note supérieure ou égale à la moyenne pour chacun des 2 thèmes évalués"
  },

  'ECHAF-01': {
    code: 'ECHAF-01',
    nom: 'Échafaudages Fixe et Roulants R408 & R457',
    profils: ['MONTAGE/DÉMONTAGE', 'UTILISATION', 'RÉCEPTION'],
    sections: {
      'MONTAGE/DÉMONTAGE': {
        id: 'montage',
        nom: 'MONTAGE & DEMONTAGE',
        detail: '(Monteurs en binôme)',
        temps: '50 min',
        total: 55,
        criteres: [
          { id: 'notice', libelle: 'Notice du fabricant -> Montage des gardes corps ?', bareme: 1, penalite: -1 },
          { id: 'controle_rust', libelle: 'Contrôle rouille, fissures, cassures, clavettes, sécurités', bareme: 5, penalite: -1 },
          { id: 'epi', libelle: 'Vérification du harnais / utilisation des EPI : Gant, Casque…', bareme: 6, penalite: -2 },
          { id: 'balisage', libelle: 'Balisage & comptage du matériel suivant le montage', bareme: 5, penalite: -1 },
          { id: 'ordre', libelle: "Respect ordre de montage des éléments suivant le plan\n(à évaluer durant tout le parcours)", bareme: 6, penalite: -1 },
          { id: 'cales', libelle: "Choix des cales, disposition, choix de l'emplacement", bareme: 2, penalite: -1 },
          { id: 'base', libelle: 'Montage de la base horizontale et vertical…', bareme: 6, penalite: -3 },
          { id: 'acces', libelle: 'Accès aux niveaux supérieurs en sécurité', bareme: 6, penalite: -2 },
          { id: 'pose', libelle: 'Pose des éléments en sécurité', bareme: 6, penalite: -2 },
          { id: 'verif_jour', libelle: "Vérification journalière par binome à faire sur l'application check chantier. À enregistrer sur dropbox Doc Techniques.", bareme: 6, penalite: -2 },
          { id: 'demontage', libelle: "Respect de l'ordre du démontage, stockage / rangement", bareme: 6, penalite: -2 }
        ]
      },
      'UTILISATION': {
        id: 'utilisation',
        nom: 'UTILISATION',
        detail: '(Utilisateur en individuel)',
        temps: '15 min',
        total: 20,
        criteres: [
          { id: 'controle_rust', libelle: 'Contrôle rouille, fissures, cassures, clavettes, sécurités', bareme: 6, penalite: -1 },
          { id: 'epi', libelle: 'Vérification du harnais / utilisation des EPI : Gant, Casque…', bareme: 4, penalite: -1 },
          { id: 'acces', libelle: 'Accès aux niveaux supérieurs en sécurité', bareme: 4, penalite: -2 },
          { id: 'verif_jour', libelle: "Vérification journalière à faire sur l'application check chantier. À enregistrer sur dropbox Doc Techniques.", bareme: 6, penalite: -2 }
        ]
      },
      'RÉCEPTION': {
        id: 'reception',
        nom: 'RECEPTION',
        detail: '(Réceptionniste en individuel)',
        temps: '25 min',
        total: 30,
        criteres: [
          { id: 'epi', libelle: 'Vérification du harnais / utilisation des EPI : Gant, Casque…', bareme: 6, penalite: -2 },
          { id: 'controle_rust', libelle: 'Contrôle rouille, fissures, cassures, clavettes, sécurités', bareme: 5, penalite: -1 },
          { id: 'acces', libelle: 'Accès aux niveaux supérieurs en sécurité', bareme: 4, penalite: -2 },
          { id: 'conformite', libelle: 'Vérification du montage et conformité au plan', bareme: 5, penalite: -1 },
          { id: 'verif_service', libelle: "Vérification de mise en service à faire sur l'application check chantier. À enregistrer sur dropbox Doc Techniques.", bareme: 8, penalite: -1 },
          { id: 'plaque', libelle: 'Plaque de conformité / réception a apposer sur échafaudage', bareme: 2, penalite: -1 }
        ]
      }
    },
    conditions: "La réussite de la pratique nécessite une note supérieure ou égale à la moyenne pour chaque thèmes évalués correspondant.\nLa vérification, le montage et démontage se feront par binôme avec une notation en simultané (une feuille par candidat)\nLa réception se fera et se notera individuellement."
  },

  'HABELEC-01': {
    code: 'HABELEC-01',
    nom: 'Habilitation Électrique',
    profils: ['B0/H0(V)/BF/HF', 'BE/HE MANŒUVRE', 'BS/BP', 'B1/B2/H1/H2', 'BR', 'BC/HC', 'BE/HE MESURE'],
    sections: {
      'B0/H0(V)/BF/HF': {
        id: 'b0h0',
        total: 10,
        criteres: [
          { id: 'zones', libelle: 'Identification des zones à risques.', bareme: 4, penalite: -1 },
          { id: 'signal', libelle: 'Compréhension de la signalisation électrique.', bareme: 2, penalite: -1 },
          { id: 'epi', libelle: 'Utilisation des (EPI) et (EPC).', bareme: 2, penalite: -1 },
          { id: 'outils', libelle: 'Manutention d\'outils à proximité des installations.', bareme: 2, penalite: -1 }
        ]
      },
      'BE/HE MANŒUVRE': {
        id: 'manoeuvre',
        total: 10,
        criteres: [
          { id: 'manipulation', libelle: 'Manipulation d\'un disjoncteur & sectionneur avec EPI', bareme: 5, penalite: -1 },
          { id: 'test', libelle: 'Test de fonctionnement interrupteur différentiel', bareme: 5, penalite: -1 }
        ]
      },
      'BS/BP': {
        id: 'bsbp',
        total: 10,
        criteres: [
          { id: 'consignation', libelle: 'Procédure de consignation complète avec (VAT).', bareme: 5, penalite: -1 },
          { id: 'remplacement', libelle: 'Remplacement d\'un éclairage / prise / fusible', bareme: 5, penalite: -1 }
        ]
      },
      'B1/B2/H1/H2': {
        id: 'b1b2',
        total: 5,
        criteres: [
          { id: 'identification', libelle: 'Identification de l\'installation et du circuit à travailler', bareme: 2, penalite: -1 },
          { id: 'raccordement', libelle: 'Raccordement disjoncteurs & éclairage ou prise', bareme: 3, penalite: -1 }
        ]
      },
      'BR': {
        id: 'br',
        total: 10,
        criteres: [
          { id: 'consignation', libelle: 'Procédure de consignation avec (VAT).', bareme: 5, penalite: -1 },
          { id: 'remplacement', libelle: 'Remplacement d\'un relais, contacteur, ou fusible.', bareme: 5, penalite: -1 }
        ]
      },
      'BC/HC': {
        id: 'bchc',
        total: 10,
        criteres: [
          { id: 'consignation', libelle: 'Consignation & VAT mono & triphasé', bareme: 10, penalite: -1 }
        ]
      },
      'BE/HE MESURE': {
        id: 'mesure',
        total: 5,
        criteres: [
          { id: 'mesure', libelle: 'Mesure de tension / intensité & continuité (fusible)', bareme: 5, penalite: -1 }
        ]
      }
    },
    conditions: "La réussite aux épreuves pratiques nécessite l'obtention :\n• et d'une note supérieure ou égale à la moyenne pour chacun des thèmes évalués.\n• La notation se fera de la manière suivante : -1 point / par oubli, erreur."
  }
};

// Couleurs S2 Formation (basé sur le logo)
export const COLORS = {
  primary: '#0066CC', // Bleu S2
  secondary: '#003D7A',
  success: '#28A745',
  danger: '#DC3545',
  warning: '#FFC107',
  light: '#F8F9FA',
  dark: '#212529',
  white: '#FFFFFF'
};
