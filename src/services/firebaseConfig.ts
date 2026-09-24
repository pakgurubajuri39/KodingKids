import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore, doc, getDocFromServer } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

/**
 * ============================================================================
 * KONFIGURASI FIREBASE RESMI (PRODUKSI KODINGKIDS)
 * ============================================================================
 * Terhubung langsung ke Project Firebase milik Pengguna: kodingkids-c6c58
 */
export const firebaseConfig = {
  apiKey: "AIzaSyDxCGpOiqxAiu6dpx_YTrdG1I9ZhrzqB64",
  authDomain: "kodingkids-c6c58.firebaseapp.com",
  projectId: "kodingkids-c6c58",
  storageBucket: "kodingkids-c6c58.firebasestorage.app",
  messagingSenderId: "1006539822859",
  appId: "1:1006539822859:web:e1f4955c294279c0fc340e"
};

// Inisialisasi Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Inisialisasi Firestore
export const db: Firestore = getFirestore(app);

// Inisialisasi Firebase Auth
export const auth: Auth = getAuth(app);

/**
 * Cek status konfigurasi Firebase aktif
 */
export const isFirebaseConfigured = (): boolean => {
  return (
    Boolean(firebaseConfig.apiKey) &&
    !firebaseConfig.apiKey.includes('GANTI_DENGAN') &&
    Boolean(firebaseConfig.projectId) &&
    !firebaseConfig.projectId.includes('GANTI_DENGAN')
  );
};

/**
 * Uji konektivitas langsung ke Firestore server
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, '_connection_test', 'status'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Klien Firestore offline, memeriksa koneksi jaringan.");
      return false;
    }
    // Jika hanya permission atau doc not found, koneksi ke server Firestore sebenarnya sukses
    return true;
  }
}

// Jalankan uji koneksi di latar belakang saat aplikasi dimuat
testFirestoreConnection().catch(() => {});
