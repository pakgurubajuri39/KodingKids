import { StudentUser, CertificateItem } from '../types';
import { db } from './firebaseConfig';
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  query 
} from 'firebase/firestore';

const USERS_STORAGE_KEY = 'kodingkids_users_db_v1';
const CURRENT_USER_KEY = 'kodingkids_current_user_v1';

// Seed initial users for new database provisioning
const INITIAL_USERS: StudentUser[] = [
  {
    id: 'user-budi-01',
    name: 'Budi Santoso',
    username: 'budi_coding',
    email: 'budi@gmail.com',
    age: 9,
    avatar: '🤖',
    role: 'student',
    status: 'Active',
    createdAt: '2026-09-20',
    xp: 225,
    completedStages: {
      '1-1': true,
      '1-2': true,
      '1-3': true,
    },
    certificates: [
      {
        id: 'cert-1-1',
        levelNumber: 1,
        levelTitle: 'Drag and Drop',
        studentName: 'Budi Santoso',
        issueDate: '2026-09-21',
        certificateCode: 'KK-LVL1-84920',
      }
    ]
  },
  {
    id: 'user-siti-02',
    name: 'Siti Rahma',
    username: 'siti_cilik',
    email: 'siti@gmail.com',
    age: 8,
    avatar: '🐱',
    role: 'student',
    status: 'Pending',
    createdAt: '2026-09-23',
    xp: 0,
    completedStages: {},
    certificates: []
  },
  {
    id: 'user-arka-03',
    name: 'Arka Dewantara',
    username: 'arka_gamers',
    email: 'arka@gmail.com',
    age: 10,
    avatar: '🚀',
    role: 'student',
    status: 'Pending',
    createdAt: '2026-09-23',
    xp: 0,
    completedStages: {},
    certificates: []
  }
];

let firestoreConnected = false;
let memoryUsers: StudentUser[] = [];

// Initialize memory users from localStorage first for fast rendering
try {
  const local = localStorage.getItem(USERS_STORAGE_KEY);
  if (local) {
    memoryUsers = JSON.parse(local);
  } else {
    memoryUsers = INITIAL_USERS;
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
  }
} catch {
  memoryUsers = INITIAL_USERS;
}

export function isFirebaseLive(): boolean {
  return firestoreConnected;
}

/**
 * Inisialisasi Sinkronisasi Real-time dengan Cloud Firestore
 */
export function initFirestoreSync() {
  try {
    const usersCol = collection(db, 'users');
    
    // Subscribe to real-time updates from Firestore
    onSnapshot(usersCol, async (snapshot) => {
      firestoreConnected = true;
      if (snapshot.empty) {
        // If Firestore is empty, seed initial data directly to real Firestore database
        for (const u of INITIAL_USERS) {
          try {
            await setDoc(doc(db, 'users', u.id), u);
          } catch (e) {
            console.warn('Seeding initial student error:', e);
          }
        }
      } else {
        const remoteUsers: StudentUser[] = [];
        snapshot.forEach((snapDoc) => {
          const data = snapDoc.data() as StudentUser;
          remoteUsers.push({ ...data, id: snapDoc.id });
        });
        if (remoteUsers.length > 0) {
          memoryUsers = remoteUsers;
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(memoryUsers));
          
          // Update current user session if status or progress changed
          const current = getCurrentUser();
          if (current && current.role === 'student') {
            const updatedCurrent = remoteUsers.find(u => u.id === current.id);
            if (updatedCurrent) {
              localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedCurrent));
            }
          }
          window.dispatchEvent(new Event('auth_state_changed'));
        }
      }
    }, (error) => {
      console.warn('Firestore snapshot error, falling back to local storage:', error);
      firestoreConnected = false;
    });

  } catch (err) {
    console.warn('Could not initialize Firestore connection:', err);
    firestoreConnected = false;
  }
}

// Auto-run Firestore sync on module import
initFirestoreSync();

export function getUsers(): StudentUser[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return memoryUsers.length > 0 ? memoryUsers : INITIAL_USERS;
}

export function saveUsers(users: StudentUser[]) {
  memoryUsers = users;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function getCurrentUser(): StudentUser | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw);
    if (user.role === 'student') {
      const allUsers = getUsers();
      const fresh = allUsers.find(u => u.id === user.id);
      return fresh || user;
    }
    return user;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: StudentUser | null) {
  if (!user) {
    localStorage.removeItem(CURRENT_USER_KEY);
  } else {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }
  window.dispatchEvent(new Event('auth_state_changed'));
}

export function loginUser(usernameInput: string, passwordInput: string): { success: boolean; user?: StudentUser; message: string } {
  const cleanUser = usernameInput.trim().toLowerCase();
  const cleanPass = passwordInput.trim();

  // 1. Check Admin credentials: username "admin", password "bajuri39"
  if (cleanUser === 'admin' && cleanPass === 'bajuri39') {
    const adminUser: StudentUser = {
      id: 'admin-root',
      name: 'Pak GuruAI (Admin)',
      username: 'admin',
      email: 'admin@kodingkids.id',
      age: 35,
      avatar: '👑',
      role: 'admin',
      status: 'Active',
      createdAt: '2026-01-01',
      xp: 9999,
      completedStages: {},
      certificates: [],
    };
    setCurrentUser(adminUser);
    return { success: true, user: adminUser, message: 'Selamat datang, Admin Pak GuruAI!' };
  }

  // 2. Check Student accounts
  const users = getUsers();
  const found = users.find(u => u.username.toLowerCase() === cleanUser || u.email.toLowerCase() === cleanUser);

  if (!found) {
    return { success: false, message: 'Username atau email belum terdaftar. Silakan daftar akun baru!' };
  }

  setCurrentUser(found);
  return { success: true, user: found, message: `Halo ${found.name}, kamu berhasil masuk!` };
}

export async function registerStudent(
  name: string,
  username: string,
  email: string,
  age: number,
  avatar: string
): Promise<{ success: boolean; user?: StudentUser; message: string }> {
  const cleanUser = username.trim().toLowerCase();
  const cleanEmail = email.trim().toLowerCase();

  if (cleanUser === 'admin') {
    return { success: false, message: 'Username "admin" dicadangkan khusus untuk administrator.' };
  }

  const users = getUsers();
  const exists = users.some(u => u.username.toLowerCase() === cleanUser || (cleanEmail && u.email.toLowerCase() === cleanEmail));
  if (exists) {
    return { success: false, message: 'Username atau email sudah digunakan! Silakan gunakan yang lain.' };
  }

  const newStudent: StudentUser = {
    id: `student-${Date.now()}`,
    name: name.trim(),
    username: cleanUser,
    email: cleanEmail || `${cleanUser}@siswa.kodingkids.id`,
    age: Number(age) || 8,
    avatar: avatar || '🚀',
    role: 'student',
    status: 'Pending', // Status WAJIB Pending setelah mendaftar
    createdAt: new Date().toISOString().split('T')[0],
    xp: 0,
    completedStages: {},
    certificates: [],
  };

  users.push(newStudent);
  saveUsers(users);
  setCurrentUser(newStudent);

  // Write directly to real Firebase Firestore collection 'users'
  try {
    await setDoc(doc(db, 'users', newStudent.id), newStudent);
    firestoreConnected = true;
  } catch (err) {
    console.warn('Failed writing user to Firestore, saved to local store:', err);
  }

  return {
    success: true,
    user: newStudent,
    message: 'Pendaftaran berhasil disimpan ke database! Akunmu berstatus Pending dan sedang menunggu persetujuan Admin.'
  };
}

export async function approveStudent(studentId: string): Promise<boolean> {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === studentId);
  if (idx !== -1) {
    users[idx].status = 'Active';
    saveUsers(users);
    
    const current = getCurrentUser();
    if (current && current.id === studentId) {
      setCurrentUser(users[idx]);
    } else {
      window.dispatchEvent(new Event('auth_state_changed'));
    }

    // Update real Firestore database
    try {
      await updateDoc(doc(db, 'users', studentId), { status: 'Active' });
      firestoreConnected = true;
    } catch (err) {
      console.warn('Failed updating approval in Firestore:', err);
    }

    return true;
  }
  return false;
}

export async function rejectStudent(studentId: string): Promise<boolean> {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === studentId);
  if (idx !== -1) {
    users[idx].status = 'Rejected';
    saveUsers(users);
    window.dispatchEvent(new Event('auth_state_changed'));

    // Update real Firestore database
    try {
      await updateDoc(doc(db, 'users', studentId), { status: 'Rejected' });
      firestoreConnected = true;
    } catch (err) {
      console.warn('Failed updating rejection in Firestore:', err);
    }

    return true;
  }
  return false;
}

export async function awardStageCompletion(
  levelId: number, 
  stageId: number, 
  xpReward: number
): Promise<{ completedAllLevel: boolean; newCert?: CertificateItem }> {
  const current = getCurrentUser();
  if (!current || current.role !== 'student') return { completedAllLevel: false };

  const key = `${levelId}-${stageId}`;
  const users = getUsers();
  const idx = users.findIndex(u => u.id === current.id);
  if (idx === -1) return { completedAllLevel: false };

  const user = users[idx];
  const isFirstTime = !user.completedStages[key];
  if (isFirstTime) {
    user.completedStages[key] = true;
    user.xp = (user.xp || 0) + xpReward;
  }

  // Check if all 3 stages for this level are completed
  const hasStage1 = user.completedStages[`${levelId}-1`];
  const hasStage2 = user.completedStages[`${levelId}-2`];
  const hasStage3 = user.completedStages[`${levelId}-3`];
  const completedAllLevel = Boolean(hasStage1 && hasStage2 && hasStage3);

  let newCert: CertificateItem | undefined;

  if (completedAllLevel) {
    const existingCert = user.certificates?.find(c => c.levelNumber === levelId);
    if (!existingCert) {
      const levelNames: Record<number, string> = {
        1: 'Drag and Drop',
        2: 'Scrolling Navigasi',
        3: 'Mengetik Kode Cilik',
        4: 'Computational Thinking',
        5: 'Project Sandbox Mandiri',
      };
      newCert = {
        id: `cert-${levelId}-${Date.now()}`,
        levelNumber: levelId,
        levelTitle: levelNames[levelId] || `Level ${levelId}`,
        studentName: user.name,
        issueDate: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
        certificateCode: `KK-L${levelId}-${Math.floor(10000 + Math.random() * 90000)}`,
      };
      user.certificates = user.certificates || [];
      user.certificates.push(newCert);

      // Save certificate in Firestore collection 'certificates'
      try {
        await setDoc(doc(db, 'certificates', newCert.id), {
          ...newCert,
          userId: user.id,
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Failed writing certificate to Firestore:', err);
      }
    }
  }

  users[idx] = user;
  saveUsers(users);
  setCurrentUser(user);

  // Sync updated XP and completedStages to Firestore
  try {
    await updateDoc(doc(db, 'users', user.id), {
      xp: user.xp,
      completedStages: user.completedStages,
      certificates: user.certificates || []
    });
    firestoreConnected = true;
  } catch (err) {
    console.warn('Failed updating student XP in Firestore:', err);
  }

  return { completedAllLevel, newCert };
}
