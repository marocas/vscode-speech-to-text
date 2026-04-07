// electron-store v11+ is ESM-only.
// The Electron main process compiles to CJS, so we must use dynamic import().
let StoreClass: any = null;

export async function getStoreClass(): Promise<any> {
  if (!StoreClass) {
    const mod = await import('electron-store');
    StoreClass = mod.default;
  }
  return StoreClass;
}
