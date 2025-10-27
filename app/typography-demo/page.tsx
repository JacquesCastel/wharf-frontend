export default function TypographyDemo() {
  return (
    <main className="pt-24 pb-12">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Lora:wght@400;500;700&family=Crimson+Text:wght@400;600&family=Cormorant:wght@400;600;700&family=Libre+Baskerville:wght@400;700&display=swap');
      `}</style>

      <div className="px-6">
        {/* Option 1 : Playfair Display */}
        <section className="mb-24 max-w-4xl mx-auto">
          <h2 className="text-sm font-bold text-zinc-600 uppercase tracking-wide mb-8">
            Option 1 : Playfair Display (très premium, classique)
          </h2>
          <div style={{ fontFamily: 'Playfair Display, serif' }}>
            <h1 className="text-7xl font-bold text-zinc-950 mb-6">
              Retrouver le récit qui relie
            </h1>
            <p className="text-2xl text-zinc-700 mb-6 font-light">
              Baseline : Dans une société où tout s'accélère, les entreprises disent vrai mais ne sont plus toujours entendues.
            </p>
            <p className="text-lg text-zinc-600 leading-relaxed" style={{ fontFamily: 'Lora, serif', fontWeight: 400 }}>
              Ce style est très premium, très fin, très luxury. Parfait pour une agence haut de gamme. Très élégant mais peut sembler "vieux" pour une agence moderne.
            </p>
          </div>
          <div className="mt-8 p-6 bg-zinc-50 rounded">
            <p style={{ fontFamily: 'Lora, serif' }} className="text-base text-zinc-700 leading-relaxed">
              Voici un paragraphe de corps de texte. Les entreprises parlent, mais ne sont plus toujours écoutées. Elles agissent avec sincérité, mais leurs publics ne le voient plus. Un écart se creuse, invisible et destructeur.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto border-t border-zinc-200 my-16" />

        {/* Option 2 : Lora */}
        <section className="mb-24 max-w-4xl mx-auto">
          <h2 className="text-sm font-bold text-zinc-600 uppercase tracking-wide mb-8">
            Option 2 : Lora (moderne et raffiné)
          </h2>
          <div style={{ fontFamily: 'Lora, serif' }}>
            <h1 className="text-7xl font-bold text-zinc-950 mb-6">
              Retrouver le récit qui relie
            </h1>
            <p className="text-2xl text-zinc-700 mb-6 font-light">
              Baseline : Dans une société où tout s'accélère, les entreprises disent vrai mais ne sont plus toujours entendues.
            </p>
            <p className="text-lg text-zinc-600 leading-relaxed">
              Ce style est élégant ET moderne. C'est le meilleur équilibre pour une agence audiovisuelle. Fin, raffiné, premium mais contemporain. C'est ma recommandation pour Wharf.
            </p>
          </div>
          <div className="mt-8 p-6 bg-zinc-50 rounded">
            <p style={{ fontFamily: 'Lora, serif' }} className="text-base text-zinc-700 leading-relaxed">
              Voici un paragraphe de corps de texte. Les entreprises parlent, mais ne sont plus toujours écoutées. Elles agissent avec sincérité, mais leurs publics ne le voient plus. Un écart se creuse, invisible et destructeur.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto border-t border-zinc-200 my-16" />

        {/* Option 3 : Crimson Text */}
        <section className="mb-24 max-w-4xl mx-auto">
          <h2 className="text-sm font-bold text-zinc-600 uppercase tracking-wide mb-8">
            Option 3 : Crimson Text (élégant et lisible)
          </h2>
          <div style={{ fontFamily: 'Crimson Text, serif' }}>
            <h1 className="text-7xl font-bold text-zinc-950 mb-6">
              Retrouver le récit qui relie
            </h1>
            <p className="text-2xl text-zinc-700 mb-6 font-light">
              Baseline : Dans une société où tout s'accélère, les entreprises disent vrai mais ne sont plus toujours entendues.
            </p>
            <p className="text-lg text-zinc-600 leading-relaxed">
              Ce style mélange classique et moderne avec une excellente lisibilité. Très élégant sans être "vieux". Bon pour une agence qui veut être intemporelle.
            </p>
          </div>
          <div className="mt-8 p-6 bg-zinc-50 rounded">
            <p style={{ fontFamily: 'Crimson Text, serif' }} className="text-base text-zinc-700 leading-relaxed">
              Voici un paragraphe de corps de texte. Les entreprises parlent, mais ne sont plus toujours écoutées. Elles agissent avec sincérité, mais leurs publics ne le voient plus. Un écart se creuse, invisible et destructeur.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto border-t border-zinc-200 my-16" />

        {/* Option 4 : Cormorant */}
        <section className="mb-24 max-w-4xl mx-auto">
          <h2 className="text-sm font-bold text-zinc-600 uppercase tracking-wide mb-8">
            Option 4 : Cormorant (très fin et luxury)
          </h2>
          <div style={{ fontFamily: 'Cormorant, serif' }}>
            <h1 className="text-8xl font-bold text-zinc-950 mb-6">
              Retrouver le récit qui relie
            </h1>
            <p className="text-3xl text-zinc-700 mb-6 font-light">
              Baseline : Dans une société où tout s'accélère, les entreprises disent vrai mais ne sont plus toujours entendues.
            </p>
            <p className="text-lg text-zinc-600 leading-relaxed" style={{ fontFamily: 'Lora, serif' }}>
              Ce style est très fin, très luxury, très haut de gamme. Parfait pour un site premium. Mais moins lisible, plus "fashion".
            </p>
          </div>
          <div className="mt-8 p-6 bg-zinc-50 rounded">
            <p style={{ fontFamily: 'Lora, serif' }} className="text-base text-zinc-700 leading-relaxed">
              Voici un paragraphe de corps de texte. Les entreprises parlent, mais ne sont plus toujours écoutées. Elles agissent avec sincérité, mais leurs publics ne le voient plus. Un écart se creuse, invisible et destructeur.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto border-t border-zinc-200 my-16" />

        {/* Option 5 : Libre Baskerville */}
        <section className="mb-24 max-w-4xl mx-auto">
          <h2 className="text-sm font-bold text-zinc-600 uppercase tracking-wide mb-8">
            Option 5 : Libre Baskerville (classique intemporel)
          </h2>
          <div style={{ fontFamily: 'Libre Baskerville, serif' }}>
            <h1 className="text-7xl font-bold text-zinc-950 mb-6">
              Retrouver le récit qui relie
            </h1>
            <p className="text-2xl text-zinc-700 mb-6 font-light">
              Baseline : Dans une société où tout s'accélère, les entreprises disent vrai mais ne sont plus toujours entendues.
            </p>
            <p className="text-lg text-zinc-600 leading-relaxed">
              Ce style est intemporel, classique, très lisible. Parfait pour un site qui veut être "établi" et crédible. Moins moderne que Lora mais plus accessible.
            </p>
          </div>
          <div className="mt-8 p-6 bg-zinc-50 rounded">
            <p style={{ fontFamily: 'Libre Baskerville, serif' }} className="text-base text-zinc-700 leading-relaxed">
              Voici un paragraphe de corps de texte. Les entreprises parlent, mais ne sont plus toujours écoutées. Elles agissent avec sincérité, mais leurs publics ne le voient plus. Un écart se creuse, invisible et destructeur.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto text-center pt-12 border-t border-zinc-200">
          <p className="text-zinc-700 mb-6">Laquelle vous plaît le plus ? 1, 2, 3, 4 ou 5 ?</p>
          <a href="/" className="inline-block px-6 py-2 bg-zinc-950 text-white hover:bg-zinc-800">
            Retour à l'accueil
          </a>
        </div>
      </div>
    </main>
  );
}