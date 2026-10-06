export type PortfolioCategory = { documentId: string; nom: string; slug: string; ordre?: number };
export function projectCategories(value: unknown): PortfolioCategory[] {
  if (!Array.isArray(value)) return [];
  const categories = new Map<string, PortfolioCategory>();
  for (const entry of value) {
    if (!entry || typeof entry !== 'object') continue;
    const category = entry as PortfolioCategory;
    if (typeof category.nom !== 'string' || !category.nom.trim() || typeof category.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(category.slug)) continue;
    categories.set(category.slug, { documentId: category.documentId, nom: category.nom.trim(), slug: category.slug, ordre: category.ordre });
  }
  return [...categories.values()].sort((a, b) => (a.ordre ?? 100) - (b.ordre ?? 100) || a.nom.localeCompare(b.nom, 'fr'));
}
export function portfolioCategories(projects: { categories?: PortfolioCategory[] }[]) {
  const categories = projectCategories(projects.flatMap(project => project.categories ?? []));
  return categories.map(category => ({ ...category, count: projects.filter(project => project.categories?.some(item => item.slug === category.slug)).length }));
}
