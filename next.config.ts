import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['localhost', 'www.kobshop.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '', // เช่น www.kobshop.com
        port: '', // ถ้าไม่มี port ไม่ต้องใส่
        pathname: '/uploads/**', // สมมติรูปอยู่ที่ /uploads/xxx.png
      },
    ],
  }
};

export default nextConfig;
