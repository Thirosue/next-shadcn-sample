/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: 'build',
    logging: {
        fetches: {
          fullUrl: true,
        },
    },
};

export default nextConfig;
