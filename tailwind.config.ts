import { family as IBMPlexSansJP } from '@fontsource/ibm-plex-sans-jp/metadata.json';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['src/**/*.{ts,tsx}', 'index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: [IBMPlexSansJP, 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;