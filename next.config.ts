import type { NextConfig } from 'next'
import path from 'path'

// Mount path comes from the deploy target: '/steven' for GitHub Pages, unset (root) for Cloudflare.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  assetPrefix: basePath ? `${basePath}/` : '',
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: { unoptimized: true },
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      {
        source: '/courses',
        destination: '/professional-development',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
