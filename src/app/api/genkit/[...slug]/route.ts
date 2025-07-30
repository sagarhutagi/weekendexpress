import {nextPlugin} from '@genkit-ai/next';
import {genkit} from '@/ai/genkit';
export const {GET, POST} = nextPlugin(genkit);
