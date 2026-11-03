export const agencyPath = '/agence';
export const agencyRevision = '2026-11-03';
export const agencyBookUrl = 'https://www.editions-kawa.com/home/120-marques-engagez-le-dialogue-pour-une-com-plus-rentable.html';
export const agencyProjectUrl = 'https://postgenius.network/';
export const agencyParagraphs = (text: string) => text.split(/\n\s*\n/).map(paragraph => paragraph.trim()).filter(Boolean);
