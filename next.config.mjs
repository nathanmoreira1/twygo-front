/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/courses/:id/videos/:video_id/stream",
        destination: `${process.env.API_URL}/courses/:id/videos/:video_id/stream`,
      },
    ];
  },
};

export default nextConfig;
