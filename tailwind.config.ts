import { family as IBMPlexSansJP } from '@fontsource/ibm-plex-sans-jp/metadata.json';
import { addDynamicIconSelectors } from '@iconify/tailwind';
import type { Config } from 'tailwindcss';


const config: Config = {
  content: ['src/**/*.{ts,tsx}', 'index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: [IBMPlexSansJP, 'sans-serif'],
      },
      colors: {
        screen: '#191919',
      },
    },
  },
  plugins: [addDynamicIconSelectors()],
};

export default config;