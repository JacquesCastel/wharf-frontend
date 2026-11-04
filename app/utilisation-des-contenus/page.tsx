import './content-usage.css';
import Link from 'next/link';
import { generateMetadataFromStrapi } from '../lib/metadata';
import { WebPageJsonLd } from '../components/JsonLd';
import { contentUsagePath, contentUsageUpdatedAt } from '../lib/content-usage';

const title = 'Utilisation des contenus et intelligence artificielle';
const description = 'Les conditions d’utilisation des textes originaux de Wharf : recherche et réponses IA sourcées autorisées, entraînement de modèles sur autorisation.';
export const metadata = generateMetadataFromStrapi(`${title} | Wharf`, description, undefined, contentUsagePath);

export default function ContentUsagePage() {
  const updatedAt = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(contentUsageUpdatedAt));
  return <main id="main-content" className="wharf-public content-usage-page">
    <WebPageJsonLd path={contentUsagePath} title={title} description={description} />
    <div className="content-usage-container">
      <div className="content-usage-hero">
        <h1>{title}</h1>
        <p>Dernière mise à jour : <time dateTime={contentUsageUpdatedAt}>{updatedAt}</time>.</p>
        <p>Nous souhaitons que les idées et les textes de Wharf puissent être découverts, cités et compris. Cette politique précise les usages que nous autorisons aux moteurs de recherche et aux services d’intelligence artificielle.</p>
      </div>

      <section className="content-usage-section" aria-labelledby="perimetre">
        <h2 id="perimetre">Les contenus concernés</h2>
        <p>Les autorisations ci-dessous concernent uniquement les textes éditoriaux originaux, publiquement accessibles sur bywharf.com, dont Wharf détient les droits.</p>
        <p>Elles ne s’étendent pas aux photographies, images, films, musiques, logos, marques, témoignages, documents clients ou contributions de tiers. Elles ne couvrent pas non plus les contenus hébergés sur d’autres domaines, notamment les médias diffusés depuis admin.bywharf.com. Leur présence sur le site ne constitue pas une autorisation de réutilisation.</p>
        <p>Les espaces clients, les interfaces d’administration, les données personnelles et les ressources non publiques sont exclus de cette politique.</p>
      </section>

      <section className="content-usage-section" aria-labelledby="recherche-et-reponses">
        <h2 id="recherche-et-reponses">La recherche et les réponses IA sourcées</h2>
        <p>Pour les textes concernés, Wharf autorise :</p>
        <ul>
          <li>l’exploration et l’indexation par les moteurs de recherche, avec présentation de liens et de courts extraits ;</li>
          <li>la consultation et l’utilisation comme sources pour produire, à la demande d’un utilisateur, des réponses IA et des synthèses ponctuelles.</li>
        </ul>
        <p>Ces usages doivent identifier Wharf comme source, fournir un lien vers la page originale et préserver le sens du propos. Les citations restent courtes et proportionnées ; cette autorisation ne couvre pas la reproduction intégrale des articles ou la republication d’un ensemble de nos textes.</p>
        <p>Les copies techniques nécessaires à ces usages de recherche et de réponse restent limitées à ces finalités. Elles n’autorisent pas la constitution d’un jeu de données destiné à entraîner des modèles.</p>
      </section>

      <section className="content-usage-section" aria-labelledby="entrainement">
        <h2 id="entrainement">L’entraînement des modèles nécessite notre accord</h2>
        <p>Wharf réserve ses droits pour l’entraînement, le préentraînement et l’affinage de modèles d’intelligence artificielle à partir des contenus concernés, ainsi que pour la constitution ou l’enrichissement de jeux de données destinés à ces finalités. Ces usages nécessitent une autorisation écrite préalable.</p>
        <p>Cette réservation s’applique sous réserve des exceptions légales applicables. Elle ne prétend ni modifier ces exceptions ni réserver des droits appartenant à des tiers.</p>
      </section>

      <section className="content-usage-section" aria-labelledby="autres-usages">
        <h2 id="autres-usages">Demander une autorisation</h2>
        <p>Pour un usage dépassant ce cadre, écrivez à <a href="mailto:contact@bywharf.com">contact@bywharf.com</a> en précisant les contenus concernés, la finalité, le service utilisé et les modalités de diffusion ou de conservation envisagées. Une demande ne vaut pas autorisation tant qu’un accord n’a pas été donné.</p>
        <p>Pour les éléments appartenant à des tiers, une autorisation doit être obtenue auprès des titulaires des droits concernés.</p>
      </section>

      <section className="content-usage-section" aria-labelledby="declarations">
        <h2 id="declarations">Les déclarations destinées aux services automatisés</h2>
        <p>Nos préférences sont publiées dans le <a href="/robots.txt">fichier robots.txt</a>. La réservation des droits de fouille de textes et de données et le lien vers la présente politique figurent dans le <a href="/.well-known/tdmrep.json">fichier TDMRep</a>.</p>
        <p>Ces déclarations sont à lire dans le périmètre et selon les conditions définis sur cette page. Elles expriment nos choix d’usage ; leur prise en compte dépend des services qui consultent le site.</p>
        <p>La <Link href="/confidentialite">politique de confidentialité</Link> décrit séparément la mesure d’audience et le traitement des demandes de contact.</p>
      </section>
    </div>
  </main>;
}
