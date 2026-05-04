import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Fonction helper pour charger une image
const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

// Génération PDF TH-01
const generatePDFTH01 = async (stagiaire, formation, session, logo) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const pageHeight = 297;

  // Logo
  if (logo) {
    pdf.addImage(logo, 'PNG', 15, 15, 40, 40);
  }

  // Titre
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TEST PRATIQUE', pageWidth / 2, 35, { align: 'center' });
  pdf.text('TRAVAIL EN HAUTEUR', pageWidth / 2, 45, { align: 'center' });

  // Cadre principal
  const startY = 60;
  pdf.rect(15, startY, pageWidth - 30, 190);

  // Ligne NOM Prénom / Date
  pdf.line(15, startY + 15, pageWidth - 15, startY + 15);
  pdf.line(140, startY, 140, startY + 15);

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('NOM Prénom', 20, startY + 6);
  pdf.text('Candidat :', 20, startY + 12);
  pdf.text('Date du test :', 145, startY + 10);

  pdf.setFont('helvetica', 'normal');
  pdf.text(`${stagiaire.nom} ${stagiaire.prenom}`, 50, startY + 12);
  const dateTest = stagiaire.dateEvaluation 
    ? format(new Date(stagiaire.dateEvaluation), 'dd/MM/yyyy', { locale: fr })
    : format(new Date(), 'dd/MM/yyyy', { locale: fr });
  pdf.text(dateTest, 175, startY + 10);

  // En-têtes colonnes
  pdf.line(15, startY + 20, pageWidth - 15, startY + 20);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text('THEMES', 20, startY + 25);
  pdf.text('Critères d\'évaluation', 70, startY + 25);
  pdf.text('Note', 150, startY + 18);
  pdf.text('Barème', 175, startY + 18);

  // Lignes verticales
  pdf.line(60, startY + 20, 60, startY + 180);
  pdf.line(145, startY + 15, 145, startY + 180);
  pdf.line(165, startY + 15, 165, startY + 180);

  // VÉRIFICATION
  let currentY = startY + 35;
  pdf.setFont('helvetica', 'bold');
  pdf.text('VÉRIFICATION', 18, currentY);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.text('Contrôle et port des EPI', 62, currentY);
  pdf.text('(longe, harnais, connecteurs,...)', 62, currentY + 4);
  pdf.text('(-2 par oubli)', 62, currentY + 8);
  
  const scoreEPI = stagiaire.evaluations['epi'] !== undefined ? stagiaire.evaluations['epi'] : 5;
  pdf.setFontSize(10);
  pdf.text(scoreEPI.toString(), 152, currentY + 3, { align: 'center' });
  pdf.text('5', 177, currentY + 3, { align: 'center' });

  pdf.line(15, currentY + 10, pageWidth - 15, currentY + 10);

  // PRATIQUE
  currentY += 15;
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PRATIQUE', 18, currentY);

  const criteresPratique = [
    { id: 'acces', nom: 'Contrôle et sécurisation des accès', detail: '(corde, anneau de sangle,...)', bareme: 8 },
    { id: 'ancrage', nom: 'Réalisation d\'ancrage et noeuds provisoire', detail: '', bareme: 8 },
    { id: 'ligne_vie', nom: 'Réalisation et contrôle d\'une ligne de vie provisoire', detail: '', bareme: 8 },
    { id: 'position', nom: 'Position sternale de sécurité', detail: '', bareme: 6 },
    { id: 'longes', nom: 'Utilisation des longes / harnais', detail: 'pendant toute la pratique', bareme: 10 },
    { id: 'stockage', nom: 'Stockage, conditionnement et nettoyage', detail: '', bareme: 5 }
  ];

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);

  criteresPratique.forEach((critere, index) => {
    currentY += (index === 0 ? 5 : 12);
    pdf.text(critere.nom, 62, currentY);
    if (critere.detail) {
      pdf.text(critere.detail, 62, currentY + 4);
    }
    pdf.text('(-2 par oubli)', 62, currentY + (critere.detail ? 8 : 4));

    const score = stagiaire.evaluations[critere.id] !== undefined 
      ? stagiaire.evaluations[critere.id] 
      : critere.bareme;
    
    pdf.setFontSize(10);
    pdf.text(score.toString(), 152, currentY + 3, { align: 'center' });
    pdf.text(critere.bareme.toString(), 177, currentY + 3, { align: 'center' });
    pdf.setFontSize(8);

    if (index < criteresPratique.length - 1) {
      pdf.line(60, currentY + 10, pageWidth - 15, currentY + 10);
    }
  });

  // TOTAL
  currentY += 15;
  pdf.line(15, currentY, pageWidth - 15, currentY);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TOTAL', 125, currentY + 5);
  pdf.text(stagiaire.scoreTotal.toString(), 152, currentY + 5, { align: 'center' });
  pdf.text('/50', 177, currentY + 5, { align: 'center' });

  // Conditions
  currentY += 12;
  pdf.line(15, currentY, pageWidth - 15, currentY);
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'italic');
  const conditions = [
    'La réussite aux épreuves pratiques nécessite l\'obtention :',
    '- d\'une moyenne minimale de 35/50 à l\'ensemble de l\'examen',
    '- et d\'une note supérieure ou égale à la moyenne pour chacun des 2 thèmes évalués'
  ];
  conditions.forEach((line, i) => {
    pdf.text(line, 18, currentY + 5 + (i * 4));
  });

  // ADMIS / REFUSÉ
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.text('ADMIS', 152, currentY + 10, { align: 'center' });
  pdf.text('REFUSÉ', 152, currentY + 18, { align: 'center' });

  // Case cochée
  if (stagiaire.admis) {
    pdf.rect(165, currentY + 6, 5, 5);
    pdf.line(166, currentY + 8.5, 167.5, currentY + 10);
    pdf.line(167.5, currentY + 10, 169.5, currentY + 7);
  } else {
    pdf.rect(165, currentY + 14, 5, 5);
    pdf.line(166, currentY + 15, 169, currentY + 18);
    pdf.line(169, currentY + 15, 166, currentY + 18);
  }

  // Signature
  currentY += 25;
  pdf.line(15, currentY, pageWidth - 15, currentY);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text('Nom Prénom et Signature Testeur :', 20, currentY + 5);

  if (stagiaire.signature) {
    pdf.addImage(stagiaire.signature, 'PNG', 20, currentY + 8, 60, 20);
  }

  pdf.line(15, startY + 180, pageWidth - 15, startY + 180);

  return pdf;
};

// Génération PDF ECHAF-01
const generatePDFECHAF01 = async (stagiaire, formation, session, logo) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const pageHeight = 297;

  // Logo
  if (logo) {
    pdf.addImage(logo, 'PNG', 15, 15, 40, 40);
  }

  // Titre
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TESTS PRATIQUE ECHAFAUDAGE', pageWidth / 2, 35, { align: 'center' });
  pdf.text('FIXE ET ROULANTS R408 & R457', pageWidth / 2, 43, { align: 'center' });

  // En-tête
  const startY = 55;
  pdf.rect(15, startY, pageWidth - 30, 15);
  pdf.line(140, startY, 140, startY + 15);

  pdf.setFontSize(10);
  pdf.text('NOM PRENOM', 20, startY + 6);
  pdf.text('CANDIDAT :', 20, startY + 12);
  pdf.text('Date du test :', 145, startY + 10);

  pdf.setFont('helvetica', 'normal');
  pdf.text(`${stagiaire.nom} ${stagiaire.prenom}`, 55, startY + 12);
  const dateTest = stagiaire.dateEvaluation 
    ? format(new Date(stagiaire.dateEvaluation), 'dd/MM/yyyy', { locale: fr })
    : format(new Date(), 'dd/MM/yyyy', { locale: fr });
  pdf.text(dateTest, 175, startY + 10);

  // Récupérer la section selon le profil
  const profilData = formation.sections[session.profil];
  
  if (!profilData) {
    throw new Error('Profil non trouvé');
  }

  // Tableau
  let currentY = startY + 25;
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  
  // En-tête profil
  pdf.rect(15, currentY, 40, 10);
  pdf.rect(55, currentY, 95, 10);
  pdf.rect(150, currentY, 30, 10);
  pdf.rect(180, currentY, 15, 10);

  pdf.text('THEMES', 17, currentY + 6);
  pdf.text('Critères d\'Evaluations', 57, currentY + 6);
  pdf.text('Note', 155, currentY + 6);
  pdf.text('Barème', 182, currentY + 6);

  currentY += 10;

  // Critères
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);

  profilData.criteres.forEach((critere, index) => {
    const lineHeight = 8;
    pdf.rect(55, currentY, 95, lineHeight);
    pdf.rect(150, currentY, 30, lineHeight);
    pdf.rect(180, currentY, 15, lineHeight);

    // Texte critère
    const lines = pdf.splitTextToSize(critere.libelle, 90);
    pdf.text(lines, 57, currentY + 4);

    // Score
    const score = stagiaire.evaluations[critere.id] !== undefined 
      ? stagiaire.evaluations[critere.id] 
      : critere.bareme;
    
    pdf.setFontSize(9);
    pdf.text(score.toString(), 165, currentY + 5, { align: 'center' });
    pdf.text(critere.bareme.toString(), 187, currentY + 5, { align: 'center' });
    pdf.setFontSize(7);

    currentY += lineHeight;
  });

  // Total
  pdf.rect(55, currentY, 95, 8);
  pdf.rect(150, currentY, 30, 8);
  pdf.rect(180, currentY, 15, 8);
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text(`SOUS-TOTAL ${profilData.nom.toUpperCase()} :`, 57, currentY + 5);
  pdf.text(stagiaire.scoreTotal.toString(), 165, currentY + 5, { align: 'center' });
  pdf.text(`/${profilData.total}`, 187, currentY + 5, { align: 'center' });

  // Conditions
  currentY += 15;
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(7);
  pdf.text('La réussite de la pratique nécessite une note supérieure ou égale à la moyenne pour chaque', 20, currentY);
  pdf.text('thèmes évalués correspondant.', 20, currentY + 4);

  // ADMIS / REFUSÉ
  currentY += 12;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text('☐ ADMIS', 150, currentY);
  pdf.text('☐ REFUSÉ', 150, currentY + 6);

  if (stagiaire.admis !== null) {
    if (stagiaire.admis) {
      pdf.text('☑', 150, currentY);
    } else {
      pdf.text('☑', 150, currentY + 6);
    }
  }

  // Signature
  currentY += 15;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text('Nom Prénom et Signature Testeur :', 20, currentY);

  if (stagiaire.signature) {
    pdf.addImage(stagiaire.signature, 'PNG', 20, currentY + 3, 60, 20);
  }

  return pdf;
};

// Génération PDF HABELEC-01
const generatePDFHABELEC01 = async (stagiaire, formation, session, logo) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;

  // Logo
  if (logo) {
    pdf.addImage(logo, 'PNG', 15, 15, 40, 40);
  }

  // Titre
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TESTS PRATIQUES HABILITATION ELECTRIQUE', pageWidth / 2, 35, { align: 'center' });
  pdf.setFontSize(11);
  pdf.text('(Entourer les niveaux à évaluer)', pageWidth / 2, 42, { align: 'center' });

  // En-tête
  const startY = 52;
  pdf.rect(15, startY, 125, 10);
  pdf.rect(140, startY, 55, 10);

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('NOM Prénom', 20, startY + 4);
  pdf.text('Candidat :', 20, startY + 8);
  pdf.text('Date du test :', 145, startY + 7);

  pdf.setFont('helvetica', 'normal');
  pdf.text(`${stagiaire.nom} ${stagiaire.prenom}`, 50, startY + 8);
  const dateTest = stagiaire.dateEvaluation 
    ? format(new Date(stagiaire.dateEvaluation), 'dd/MM/yyyy', { locale: fr })
    : format(new Date(), 'dd/MM/yyyy', { locale: fr });
  pdf.text(dateTest, 175, startY + 7);

  // Profil sélectionné
  let currentY = startY + 20;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.text(`Profil : ${session.profil}`, 20, currentY);

  currentY += 10;

  // Tableau
  const profilData = formation.sections[session.profil];
  
  pdf.setFontSize(9);
  pdf.rect(15, currentY, 125, 8);
  pdf.rect(140, currentY, 30, 8);
  pdf.rect(170, currentY, 25, 8);
  
  pdf.text('Critères d\'Evaluations', 20, currentY + 5);
  pdf.text('Note', 145, currentY + 5);
  pdf.text('Barême', 175, currentY + 5);

  currentY += 8;

  // Critères
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);

  profilData.criteres.forEach((critere) => {
    const lineHeight = 7;
    pdf.rect(15, currentY, 125, lineHeight);
    pdf.rect(140, currentY, 30, lineHeight);
    pdf.rect(170, currentY, 25, lineHeight);

    pdf.text(`• ${critere.libelle}`, 17, currentY + 4.5);

    const score = stagiaire.evaluations[critere.id] !== undefined 
      ? stagiaire.evaluations[critere.id] 
      : critere.bareme;
    
    pdf.setFontSize(9);
    pdf.text(score.toString(), 155, currentY + 4.5, { align: 'center' });
    pdf.text(critere.bareme.toString(), 182, currentY + 4.5, { align: 'center' });
    pdf.setFontSize(8);

    currentY += lineHeight;
  });

  // Total
  pdf.rect(15, currentY, 125, 7);
  pdf.rect(140, currentY, 30, 7);
  pdf.rect(170, currentY, 25, 7);
  
  pdf.setFont('helvetica', 'bold');
  pdf.text('TOTAL :', 120, currentY + 4.5);
  pdf.setFontSize(9);
  pdf.text(stagiaire.scoreTotal.toString(), 155, currentY + 4.5, { align: 'center' });
  pdf.text(`/${profilData.total}`, 182, currentY + 4.5, { align: 'center' });

  // Conditions
  currentY += 12;
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(7);
  pdf.text('La réussite aux épreuves pratiques nécessite l\'obtention :', 20, currentY);
  pdf.text('• et d\'une note supérieure ou égale à la moyenne pour chacun des thèmes évalués.', 20, currentY + 4);
  pdf.text('• La notation se fera de la manière suivante : -1 point / par oubli, erreur.', 20, currentY + 8);

  // Signature
  currentY += 15;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text('Nom Prénom et Signature Testeur :', 20, currentY);

  if (stagiaire.signature) {
    pdf.addImage(stagiaire.signature, 'PNG', 20, currentY + 3, 60, 20);
  }

  return pdf;
};

// Fonction principale
export const generatePDF = async (stagiaire, formation, session) => {
  try {
    // Charger le logo
    let logo = null;
    try {
      logo = await loadImage('/logo-s2.png');
    } catch (error) {
      console.warn('Logo non chargé, PDF généré sans logo');
    }

    let pdf;
    
    if (formation.code === 'TH-01') {
      pdf = await generatePDFTH01(stagiaire, formation, session, logo);
    } else if (formation.code === 'ECHAF-01') {
      pdf = await generatePDFECHAF01(stagiaire, formation, session, logo);
    } else if (formation.code === 'HABELEC-01') {
      pdf = await generatePDFHABELEC01(stagiaire, formation, session, logo);
    } else {
      throw new Error('Formation non reconnue');
    }

    // Télécharger
    const fileName = `${formation.code}_${stagiaire.nom}_${stagiaire.prenom}_${format(new Date(), 'yyyyMMdd')}.pdf`;
    pdf.save(fileName);

    return pdf;
  } catch (error) {
    console.error('Erreur génération PDF:', error);
    throw error;
  }
};
