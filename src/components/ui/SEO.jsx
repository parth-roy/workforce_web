import React from 'react'
import { Helmet } from 'react-helmet-async'

export default function SEO({
  title,
  description,
  schema,
  schemas = [],
  canonical,
  ogImage = 'https://metromitra.com/og-default.jpg',
  breadcrumbs = [],
}) {
  const allSchemas = []

  if (schema) allSchemas.push(schema)
  allSchemas.push(...schemas)

  if (breadcrumbs.length > 0) {
    allSchemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: b.label,
        item: `https://metromitra.com${b.href}`,
      })),
    })
  }

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Metro Mitra" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Schemas */}
      {allSchemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  )
}
