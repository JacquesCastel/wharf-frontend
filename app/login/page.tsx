import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../lib/auth';
import LoginForm from './LoginForm';
import LoginSessionProvider from './LoginSessionProvider';

export const metadata = {
  title: 'Connexion — Espace client Wharf',
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect(session.user.role === 'admin' ? '/admin' : '/sommaire');

  const today = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <>
      <style>{`
        .header, footer, .accessibility-widget { display: none !important; }
        body { background: var(--paper); }
      `}</style>
      <LoginSessionProvider>
        <div className="login-shell">

          {/* Colonne gauche — manifeste sombre */}
          <div className="login-left">
            <div className="lh-top">
              <div className="lh-mark">Wharf</div>
              <div>N°01 / Vol. i · {today}</div>
            </div>
            <div className="lh-body">
              <div className="lh-issue">Espace client — Édition privée</div>
              <h1>L'atelier <em>continue</em> entre les rendez-vous.</h1>
              <div className="lh-quote">
                « Nous croyons qu'un récit de marque se travaille comme une revue :
                par numéros, par chapitres, à voix nue.
                Cet espace est la coulisse de ce travail. »
              </div>
            </div>
            <div className="lh-foot">
              <div>Atelier — 122 rue Amelot, 75011 Paris</div>
              <div>bywharf.com</div>
            </div>
          </div>

          {/* Colonne droite — formulaire */}
          <div className="login-right">
            <div className="lr-top">
              <div>Espace client</div>
              <div>Aide · Signaler</div>
            </div>
            <LoginForm />
            <div className="lr-foot">
              <div>Session chiffrée · TLS 1.3</div>
              <div>v. 2026.05</div>
            </div>
          </div>

        </div>
      </LoginSessionProvider>
    </>
  );
}
