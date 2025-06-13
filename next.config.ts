import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['localhost', '45.77.255.243'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'http://45.77.255.243', // เช่น www.kobshop.com
        port: '3001', // ถ้าไม่มี port ไม่ต้องใส่
        pathname: '/public/uploads/**', // สมมติรูปอยู่ที่ /uploads/xxx.png
      },
    ],
  }
};

export default nextConfig;
