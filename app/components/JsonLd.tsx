import { organizationSchema, websiteSchema, webPageSchema, breadcrumbsSchema, servicesSchema, projectSchema } from '../lib/structured-data';
import type { Schema } from '../lib/structured-data';

export default function JsonLd({ data }: { data: Schema | Schema[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}
export const OrganizationJsonLd = () => <JsonLd data={organizationSchema()} />;
export const WebSiteJsonLd = () => <JsonLd data={websiteSchema()} />;
export const WebPageJsonLd = (props: Parameters<typeof webPageSchema>[0]) => <JsonLd data={webPageSchema(props)} />;
export const BreadcrumbJsonLd = ({ items }: { items: Parameters<typeof breadcrumbsSchema>[0] }) => <JsonLd data={breadcrumbsSchema(items)} />;
export const ServicesJsonLd = ({ items }: { items?: Parameters<typeof servicesSchema>[0] }) => <JsonLd data={servicesSchema(items)} />;
export const ProjectJsonLd = (props: Parameters<typeof projectSchema>[0]) => <JsonLd data={projectSchema(props)} />;
