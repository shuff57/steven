/**
 * Returns the base path for the application, set at build time via NEXT_PUBLIC_BASE_PATH.
 * '/steven' on GitHub Pages, '' at a domain root (Cloudflare) and in development.
 */
export function getBasePath(): string {
  return process.env.NEXT_PUBLIC_BASE_PATH ?? ''
}

export const CV_PDF_PATH = getBasePath() + '/Curriculum%20Vitae.pdf'
export const THESIS_PDF_PATH = getBasePath() + '/MS%20Thesis.pdf'

export const AI_FLUENCY_CERT_PATH = getBasePath() + '/certificates/ai-fluency-certificate.pdf'

export const DOCUMENTS_PATH = getBasePath() + '/documents'
