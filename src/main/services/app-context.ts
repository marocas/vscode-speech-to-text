import { APP_NAME, APP_STORE_CWD } from '../../shared/constants';
import type { AppContext } from '../../shared/types';

export class AppContextDetector {
  async detectContext(): Promise<AppContext> {
    try {
      return {
        windowTitle: APP_NAME,
        appName: APP_STORE_CWD,
      };
    } catch (error) {
      console.error('Error detecting app context:', error);
      return {
        windowTitle: 'Unknown',
        appName: 'unknown',
      };
    }
  }
}
