// Fêtes du calendrier grégorien français — index 0 = 1er janvier
const FETES: string[] = [
  'Ste Marie','St Basile','Ste Geneviève','St Odilon','St Édouard','St Melchior','St Raymond','St Lucien','St Alix','St Guillaume',
  'St Paulin','Ste Tatiana','St Yvette','St Félix','St Rémi','St Marcel','St Roseline','Ste Prisca','St Marius','St Sébastien',
  'Ste Agnès','St Vincent','St Barnard','St François de Sales','Ste Conv. de Paul','Ste Timothée','Ste Angèle','St Thomas d\'Aquin','Ste Gildas','Ste Martine',
  'St Jean Bosco','Ste Présentation','St Blaise','St Véronique','Ste Agathe','Ste Gaston','St Eugène','Ste Jacqueline','St Apolline','St Arnaud',
  'N.-D. de Lourdes','Ste Félicité','St Béatrice','St Valentin','St Claude','St Juliane','St Alexis','St Siméon','St Gabin','Ste Jacqueline',
  'St Damien','St Faustin','Ste Isabelle','Ste Bernadette','St Roméo','St Gabriel','Ste Honorine','St Romain','St Auguste','Ste Rosine',
  'St Aubin','Ste Simplice','Ste Guénolé','St Casimir','Ste Olive','Ste Colette','Ste Félicité','St Jean de Dieu','Ste Françoise','St Vivien',
  'Ste Rosine','St Grégoire','Ste Patricia','Ste Mathilde','St César','Ste Bénédicte','St Patrick','St Cyrille','St Joseph','St Herbert',
  'St Benoît','Ste Léa','St Victorien','Ste Laetitia','Ste Annonciation','St Larissa','St Habib','St Gontran','St Gwladys','St Amédée',
  'St Hugues','Ste Catherine','St Richard','St Isidore','Ste Irène','St Marcellin','Ste Julie','St Gauthier','St Emma','St Stanislas',
  'St Léon','Ste Ida','Ste Roland','St Gilles','Ste Maxime','Ste Bernadette','Ste Zita','St Pierre Chanel','Ste Catherine','Ste Sophie',
  'Ste Pèlerine','Ste Croix','Ste Estelle','Ste Judith','St Achille','St Pancrace','St Servais','St Matthias','Ste Denise','St Bernardin',
  'St Constantin','Ste Rita','St Didier','St Donatien','St Germain','Ste Blandine','St Justin','Ste Clotilde','St Kévin','St Médard',
  'St Barnabé','St Guy','Ste Antoinette','St Élisée','St Germaine','Ste Régis','St Hervé','St Léonce','St Gervais','Ste Alban',
  'St Louis','St Alban','Ste Audrey','St Jean Baptiste','Ste Prosper','Sts Pierre Paul','Ste Martial','Ste Ester','Ste Thibaut','Ste Raoul',
  'Ste Esther','St Florent','Ste Thomas','Ste Ambroise','Ste Camille','Ste Frédéric','St Henri','Ste Marguerite','St Arsène','St Marina',
  'St Victor','Ste Marie-Madeleine','Ste Brigitte','Ste Christine','St Jacques','Ste Anne','Ste Nathalie','St Samson','Ste Marthe','St Ignace',
  'St Alphonse','Ste Eusèbe','St Lydie','Ste Jean-Baptiste','Ste Abel','Ste Gaétan','St Dominique','Ste Amour','St Laurent','Ste Claire',
  'Ste Radegonde','Ste Hippolyte','Ste Eusèbe','Ste Assomption','Ste Armel','St Roch','Ste Hyacinthe','Ste Hélène','St Jean-Eudes','St Bernard',
  'Ste Christophe','Ste Fabrice','Ste Rose','St Louis','Ste Zéphyrin','St Monique','St Augustin','Ste Sabine','St Fiacre','Ste Bertrand',
  'St Gilles','Ste Ingrid','St Grégoire','Ste Rosalie','Ste Raïssa','Ste Bertrand','Ste Reine','St Adrien','Ste Apollinaire','Ste Nicolas',
  'Ste Maurille','Ste Mathieu','St Maurice','Ste Konstance','Ste Hermann','Ste Côme','St Vincent','Ste Wenceslas','Ste Michel','Ste Jérôme',
  'Ste Thérèse','St Léger','Ste Gérard','St François','Ste Fleur','Ste Bruno','Ste Frédéric','Ste Pélagie','St Denis','Ste Ghislain',
  'St Firmin','Ste Wilfrid','Ste Édouard','Ste Géraud','Ste Thérèse','Ste Luc','St René','Ste Laura','Ste Adeline','Ste Céline',
  'Ste Ursula','Ste Élodie','St Jean','Ste Florentin','Ste Crépin','Ste Dimitri','Ste Émeline','Ste Simon','Ste Narcisse','Ste Bienvenu',
  'Ste Toussaint','Ste Victorin','St Hubert','Ste Charles','Ste Sylvie','Ste Bertille','Ste Carine','Ste Geoffroy','St Léon','Ste Nathalie',
  'Ste Martin','Ste Christian','St Brice','Ste Sidoine','Ste Albert','Ste Marguerite','Ste Élisabeth','Ste Aude','Ste Tanguy','Ste Edmond',
  'Ste Présentation','St Delphine','Ste Cécile','St Clément','Ste Flora','Ste Catherine','Ste Delphine','St Sévrin','Ste Saturnin','St André',
  'St François Xavier','Ste Viviane','St Jean','Ste Barbara','Ste Gérald','Ste Nicolas','St Ambroise','Ste Immaculée','St Pierre Fourier','Ste Romaric',
  'Ste Damase','Ste Chantal','Ste Lucie','Ste Odile','Ste Ninon','Ste Alice','Ste Gaël','Ste Urbain','Ste Anastasie','Ste Adèle',
  'St Thomas','Ste Françoise','St Étienne','St Jean','Sts Innocents','Ste Colombe','Ste Félix','Ste Sylvestre',
];

export function getFeteduJour(date = new Date()): string {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24)) - 1;
  const fete = FETES[Math.min(dayOfYear, FETES.length - 1)];
  return `Fête de ${fete}`;
}
