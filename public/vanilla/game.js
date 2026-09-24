/**
 * ============================================================================
 * GAME.JS - LOGIKA DASBOR SISWA, 5 LEVEL INTERAKTIF & GENERATOR SERTIFIKAT
 * ============================================================================
 */

function checkStudentStatus() {
  const student = getCurrentUser();
  if (!student) {
    window.location.href = 'index.html';
    return null;
  }

  const profileEl = document.getElementById('studentProfileHeader');
  if (profileEl) {
    profileEl.innerHTML = `
      <div style="display:flex; align-items:center; gap:1rem;">
        <span style="font-size:3rem;">${student.avatar || '🤖'}</span>
        <div>
          <h2>Halo, ${student.name}!</h2>
          <p style="color:#64748b; font-weight:700;">Status Akun: <b>${student.status}</b> • XP: ★ ${student.xp || 0}</p>
        </div>
      </div>
    `;
  }

  // JIKA PENDING: Kunci materi belajar sesuai instruksi
  const pendingScreen = document.getElementById('pendingView');
  const activeScreen = document.getElementById('activeCurriculumView');

  if (student.status === 'Pending') {
    if (pendingScreen) pendingScreen.style.display = 'block';
    if (activeScreen) activeScreen.style.display = 'none';
  } else if (student.status === 'Active') {
    if (pendingScreen) pendingScreen.style.display = 'none';
    if (activeScreen) activeScreen.style.display = 'block';
  }

  return student;
}

// Simulasi Cepat Persetujuan Siswa di Layar Pending
function simulateQuickApprove() {
  const student = getCurrentUser();
  if (!student) return;
  const users = getStoredUsers();
  const idx = users.findIndex(u => u.id === student.id);
  if (idx !== -1) {
    users[idx].status = 'Active';
    saveStoredUsers(users);
    setCurrentUser(users[idx]);
    alert('Akun disetujui! Selamat menikmati petualangan coding.');
    window.location.reload();
  }
}

/**
 * Download Sertifikat Digital (Menggunakan Canvas & jsPDF)
 */
function downloadDigitalCertificate(studentName, levelNumber, levelTitle) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#FFFBEB';
  ctx.fillRect(0, 0, 1200, 800);

  // Border Emas
  ctx.lineWidth = 16;
  ctx.strokeStyle = '#F59E0B';
  ctx.strokeRect(30, 30, 1140, 740);

  // Inner Border
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#3B82F6';
  ctx.strokeRect(45, 45, 1110, 710);

  // Teks Header
  ctx.fillStyle = '#1E293B';
  ctx.font = 'bold 50px Fredoka, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SERTIFIKAT KELULUSAN', 600, 180);

  ctx.fillStyle = '#64748B';
  ctx.font = '24px Nunito, sans-serif';
  ctx.fillText('Diberikan dengan bangga kepada Siswa Berprestasi:', 600, 260);

  // Nama Siswa
  ctx.fillStyle = '#2563EB';
  ctx.font = 'bold 54px Fredoka, sans-serif';
  ctx.fillText(studentName.toUpperCase(), 600, 360);

  // Keterangan Level
  ctx.fillStyle = '#334155';
  ctx.font = '26px Nunito, sans-serif';
  ctx.fillText(`Telah sukses menuntaskan seluruh tantangan pemrograman:`, 600, 440);

  ctx.fillStyle = '#10B981';
  ctx.font = 'bold 36px Fredoka, sans-serif';
  ctx.fillText(`LEVEL ${levelNumber}: ${levelTitle.toUpperCase()}`, 600, 510);

  // Tanda Tangan Pembina
  ctx.fillStyle = '#1E3A8A';
  ctx.font = 'italic bold 28px Fredoka, cursive, sans-serif';
  ctx.fillText('Pak GuruAI', 950, 680);

  ctx.fillStyle = '#475569';
  ctx.font = '16px Nunito, sans-serif';
  ctx.fillText('Kepala Pembina KodingKids', 950, 710);

  // Footer Copyright Wajib
  ctx.fillStyle = '#94A3B8';
  ctx.font = '14px Nunito, sans-serif';
  ctx.fillText('@Copyright by. Pak GuruAI', 600, 750);

  // Ekspor ke Gambar / PDF
  const imgData = canvas.toDataURL('image/png');
  const downloadLink = document.createElement('a');
  downloadLink.download = `Sertifikat-KodingKids-Level${levelNumber}-${studentName}.png`;
  downloadLink.href = imgData;
  downloadLink.click();
}
