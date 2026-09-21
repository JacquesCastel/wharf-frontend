// Contenus de l’audit Wharf. Les médias et les réalisations restent gérés dans Strapi.
export const positioning = 'Agence de stratégie, contenus & production vidéo B2B';
export const description = 'Wharf accompagne les entreprises dans leur communication corporate, de la stratégie éditoriale à la production audiovisuelle.';
export const pageSeo = {
  home: { title: 'Wharf — Contenus & production vidéo B2B', description },
  we: { title: 'WE — Le design narratif, méthode Wharf', description: 'Du constat à la création : découvrez comment le design narratif relie stratégie, contenus et vidéo à la réalité de votre entreprise.' },
  work: { title: 'WORK — Stratégie, contenus & vidéo B2B | Wharf', description: 'Stratégie éditoriale, contenus B2B et production vidéo : découvrez les expertises Wharf et nos réalisations.' },
  you: { title: 'YOU — Vos enjeux de communication B2B | Wharf', description: 'Visibilité, parole dirigeante, recrutement, transformation, réseaux sociaux ou film corporate : partons de votre besoin.' },
  insights: { title: 'INSIGHTS — Vidéo & communication B2B | Wharf', description: 'Analyses et guides sur l’IA, la visibilité, la crédibilité des entreprises et la production de contenus B2B.' },
};
export const offers = [
  { id: 'strategy', name: 'STRATEGY', title: 'Donner une direction à votre communication', description: 'Clarifier ce que votre entreprise veut faire comprendre, à qui et pourquoi. Le design narratif relie votre réalité aux messages que vous portez.', items: ['Communication corporate', 'Plateforme narrative', 'Stratégie éditoriale', 'Marque employeur', 'Communication du changement', 'Prise de parole dirigeant'] },
  { id: 'content', name: 'CONTENT', title: 'Faire vivre votre expertise', description: 'Construire des contenus B2B utiles à vos publics et cohérents dans le temps, avec une ligne éditoriale et des formats adaptés à leurs usages.', items: ['Contenus LinkedIn et YouTube', 'Formats éditoriaux et social media', 'Interviews et témoignages', 'Podcasts', 'Déclinaisons de contenus'] },
  { id: 'video', name: 'VIDEO', title: 'Donner corps à votre récit', description: 'Concevoir et produire les images qui incarnent votre entreprise, de la préparation du tournage à la postproduction et aux formats de diffusion.', items: ['Film corporate et film de marque', 'Interview dirigeant', 'Portrait collaborateur', 'Série vidéo', 'Motion design', 'Social video et captation'] },
];
export const situations = [
  { id: 'visibilite', titre: 'Faire connaître votre entreprise', description: 'Votre expertise mérite d’être mieux comprise. Clarifions votre message et les preuves qui aideront vos publics à reconnaître votre valeur.', formats: 'Communication corporate, stratégie éditoriale, contenus B2B.' },
  { id: 'dirigeants', titre: 'Donner la parole à vos dirigeants', description: 'Vous avez une vision ou une conviction à partager. Construisons une prise de parole claire, incarnée et adaptée à ceux qui doivent l’entendre.', formats: 'Conseil éditorial, interview, LinkedIn, vidéo.' },
  { id: 'recrutement', titre: 'Attirer et recruter', description: 'Faire découvrir vos métiers et votre environnement de travail aide les candidats à se projeter. Partons de la réalité vécue par vos équipes.', formats: 'Marque employeur, témoignages collaborateurs, campagnes vidéo.' },
  { id: 'transformation', titre: 'Expliquer une transformation', description: 'Vos équipes ont besoin de comprendre ce qui change et ce que cela implique. Rendons la transformation concrète et donnons la parole à ceux qui la vivent.', formats: 'Communication interne, récit du changement, films et contenus pédagogiques.' },
  { id: 'reseaux', titre: 'Produire régulièrement pour vos réseaux', description: 'Vous souhaitez prendre la parole dans la durée. Organisons les sujets, les tournages et les déclinaisons autour de vos priorités éditoriales.', formats: 'Stratégie social media, journées de tournage, séries vidéo, déclinaisons.' },
  { id: 'film', titre: 'Produire un film', description: 'Vous avez un sujet, une échéance ou un brief. Définissons le parti pris, les moyens et les formats nécessaires pour lui donner forme.', formats: 'Conception, réalisation, production, postproduction.' },
];
export const insightTopics = [
  { slug: 'video-b2b', title: 'Vidéo B2B', description: 'Préparer un film, organiser un tournage et choisir les formats de diffusion.', subjects: ['Quels postes font varier le budget d’une vidéo corporate ?', 'Comment préparer une interview dirigeant ?', 'Comment décliner un tournage en plusieurs formats ?'] },
  { slug: 'communication-corporate', title: 'Communication corporate', description: 'Rendre la réalité de l’entreprise compréhensible et construire une parole cohérente.', subjects: ['Comment traduire une transformation en messages concrets ?', 'Comment relier plateforme narrative et prises de parole ?'] },
  { slug: 'content-b2b', title: 'Content B2B', description: 'Faire vivre une expertise à travers une ligne éditoriale et des contenus réguliers.', subjects: ['Comment construire un calendrier éditorial à partir des enjeux clients ?', 'Quels formats préparer pour LinkedIn et YouTube ?'] },
  { slug: 'marque-employeur', title: 'Marque employeur', description: 'Faire découvrir les métiers, les équipes et l’expérience de travail.', subjects: ['Comment préparer un témoignage collaborateur ?', 'Comment montrer la réalité d’un métier en vidéo ?'] },
];
