import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'vendor-react',
              test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/,
            },
            {
              name: 'vendor-motion',
              test: /node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/,
            },
            {
              name: 'vendor-icons',
              test: /node_modules[\\/]@fortawesome[\\/]/,
            },
          ],
        },
      },
    },
  },
})
