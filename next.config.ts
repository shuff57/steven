import type { NextConfig } from 'next'
import path from 'path'

const isProd = process.env.NODE_ENV === 'production'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isProd ? '/steven' : '',
  assetPrefix: isProd ? '/steven/' : '',
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? '/steven' : '',
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
