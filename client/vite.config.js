import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr'; // 转换 SVG 格式图片为 React 组件
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'; // 实现图片压缩，静态打包

// const repoName = 'soluna.github.io'

// https://vite.dev/config/
export default defineConfig(() => ({
    plugins: [
        react(),
        svgr(),
        ViteImageOptimizer({
            png: {
                quality: 80
            },
            jpeg: {
                quality: 75
            },
            webp: {
                lossless: false,
                quality: 75
            }
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '#': '/public'
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
          @use "@/_assets/_scss/_variable.scss" as *; 
          @use "@/_assets/_scss/_layout.scss" as *; 
          @use "@/_assets/_scss/_functions.scss" as *;
          @use "@/_assets/_scss/_fonts.scss" as *;
        `,
                javascriptEnabled: true
            }
        }
    },
    base: '/', // 部署在域名根目录，必须设为/
    build: {
        outDir: 'dist', // 输出目录，保持默认
        assetsDir: 'assets', // 静态资源目录
        rollupOptions: {
            output: {
                // 确保静态资源路径正确解析
                assetFileNames: 'assets/[name]-[hash].[ext]',
                chunkFileNames: 'assets/[name]-[hash].js',
                entryFileNames: 'assets/[name]-[hash].js'
            }
        }
    },
    // 开发环境代理（本地调试用，不影响生产）
    server: {
        port: 3000, // 前端运行端口：<http://localhost:3000>
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true // 修改请求头 origin，避免跨域检测
            }
        }
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.js'
    }
}));
