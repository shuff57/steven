const isProd = process.env.NODE_ENV === 'production'

/**
 * Returns the base path for the application.
 * In production: '/steven'
 * In development: ''
 */
export function getBasePath(): string {
  return isProd ? '/steven' : ''
}

export const CV_PDF_PATH = getBasePath() + '/Curriculum%20Vitae.pdf'
export const THESIS_PDF_PATH = getBasePath() + '/MS%20Thesis.pdf'

export const AI_FLUENCY_CERT_PATH = getBasePath() + '/certificates/ai-fluency-certificate.pdf'

export const DOCUMENTS_PATH = getBasePath() + '/documents'
