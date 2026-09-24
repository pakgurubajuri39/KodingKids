/**
 * ============================================================================
 * AUTH.JS - SISTEM AUTENTIKASI SISWA & ADMIN (FIREBASE + LOCAL FALLBACK)
 * ============================================================================
 * 
 * PETUNJUK PENYESUAIAN:
 * Silakan ganti objek `firebaseConfig` di bawah dengan konfigurasi proyek Firebase Anda!
 */

const firebaseConfig = {
  // === SESUAIKAN DENGAN API KEY FIREBASE ANDA ===
  apiKey: "AIzaSy_GANTI_DENGAN_API_KEY_ANDA",
  authDomain: "kodingkids-edtech.firebaseapp.com",
  projectId: "kodingkids-edtech",
  storageBucket: "kodingkids-edtech.appspot.com",
  messagingSenderId: "109433823227",
  appId: "1:109433823227:web:abcdef123456"
};

// Cek apakah user telah mengonfigurasi Firebase asli
const isFirebaseReal = Boolean(firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('GANTI_DENGAN'));

// Penyimpanan Lokal (Fallback otomatis saat belum menyematkan Firebase Keys)
const STORAGE_KEY = 'kodingkids_users_db_v1';
const CURRENT_USER_KEY = 'kodingkids_current_user_v1';

function getStoredUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveStoredUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function getCurrentUser() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function setCurrentUser(user) {
  if (!user) {
    localStorage.removeItem(CURRENT_USER_KEY);
  } else {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }
}

/**
 * Login function supporting:
 * - Admin credentials: username "admin", password "bajuri39"
 * - Registered students
 */
function handleLogin(usernameOrEmail, password) {
  const userClean = usernameOrEmail.trim().toLowerCase();
  const passClean = password.trim();

  // 1. Cek Kredensial Khusus Admin
  if (userClean === 'admin' && passClean === 'bajuri39') {
    const adminUser = {
      id: 'admin-root',
      name: 'Pak GuruAI (Admin)',
      username: 'admin',
      role: 'admin',
      status: 'Active',
      xp: 9999
    };
    setCurrentUser(adminUser);
    return { success: true, redirect: 'admin.html', user: adminUser };
  }

  // 2. Cek Siswa Terdaftar
  const users = getStoredUsers();
  const student = users.find(u => u.username.toLowerCase() === userClean || u.email.toLowerCase() === userClean);

  if (!student) {
    return { success: false, message: 'Username/Email tidak ditemukan. Silakan daftar akun siswa baru!' };
  }

  setCurrentUser(student);
  return { success: true, redirect: 'dashboard.html', user: student };
}

/**
 * Register student function
 * Sesuai spesifikasi: Status awal siswa wajib "Pending"
 */
function handleRegister(name, username, email, age, avatar = '🤖') {
  const userClean = username.trim().toLowerCase();
  if (userClean === 'admin') {
    return { success: false, message: 'Username admin dicadangkan untuk pengajar.' };
  }

  const users = getStoredUsers();
  const exists = users.some(u => u.username.toLowerCase() === userClean);
  if (exists) {
    return { success: false, message: 'Username sudah dipakai! Pilih username lain.' };
  }

  const newStudent = {
    id: 'student-' + Date.now(),
    name: name.trim(),
    username: userClean,
    email: email.trim() || userClean + '@kodingkids.id',
    age: Number(age) || 8,
    avatar: avatar,
    role: 'student',
    status: 'Pending', // WAJIB PENDING SETELAH DAFTAR
    createdAt: new Date().toISOString().split('T')[0],
    xp: 0,
    completedStages: {},
    certificates: []
  };

  users.push(newStudent);
  saveStoredUsers(users);
  setCurrentUser(newStudent);

  return {
    success: true,
    redirect: 'dashboard.html',
    user: newStudent,
    message: 'Pendaftaran berhasil! Akun Anda berstatus Pending menunggu Approve dari Admin.'
  };
}

function handleLogout() {
  setCurrentUser(null);
  window.location.href = 'index.html';
}
