/**
 * ============================================================================
 * ADMIN.JS - LOGIKA DASHBOARD ADMIN & PERSETUJUAN (APPROVE) SISWA
 * ============================================================================
 */

function checkAdminAuth() {
  const current = getCurrentUser();
  if (!current || current.role !== 'admin') {
    alert('Akses khusus Admin! Silakan login dengan user: admin, password: bajuri39');
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

function renderAdminStudents() {
  const listEl = document.getElementById('studentsList');
  if (!listEl) return;

  const users = getStoredUsers().filter(u => u.role === 'student');
  listEl.innerHTML = '';

  if (users.length === 0) {
    listEl.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 2rem;">Belum ada siswa yang mendaftar.</td></tr>';
    return;
  }

  users.forEach(student => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid #e2e8f0';

    const statusBadge = student.status === 'Pending'
      ? '<span style="background:#fef3c7; color:#92400e; padding:4px 8px; border-radius:12px; font-weight:800; font-size:11px;">Pending</span>'
      : student.status === 'Active'
      ? '<span style="background:#d1fae5; color:#065f46; padding:4px 8px; border-radius:12px; font-weight:800; font-size:11px;">Aktif (Approved)</span>'
      : '<span style="background:#fee2e2; color:#991b1b; padding:4px 8px; border-radius:12px; font-weight:800; font-size:11px;">Ditolak</span>';

    const actionBtn = student.status === 'Pending'
      ? `<button class="btn btn-success" style="padding:6px 12px; font-size:11px;" onclick="approveStudentAction('${student.id}')">✓ Approve (Setujui)</button>`
      : `<button class="btn btn-danger" style="padding:6px 12px; font-size:11px;" onclick="rejectStudentAction('${student.id}')">Tangguhkan</button>`;

    tr.innerHTML = `
      <td style="padding:12px;"><b>${student.name}</b><br><small style="color:#64748b">@${student.username}</small></td>
      <td style="padding:12px;">${student.age} Tahun</td>
      <td style="padding:12px;">${statusBadge}</td>
      <td style="padding:12px; font-weight:800; color:#d97706;">★ ${student.xp || 0} XP</td>
      <td style="padding:12px;">${student.createdAt}</td>
      <td style="padding:12px; text-align:right;">${actionBtn}</td>
    `;

    listEl.appendChild(tr);
  });
}

function approveStudentAction(studentId) {
  const users = getStoredUsers();
  const idx = users.findIndex(u => u.id === studentId);
  if (idx !== -1) {
    users[idx].status = 'Active';
    saveStoredUsers(users);
    alert('Siswa ' + users[idx].name + ' berhasil di-Approve! Sekarang siswa bisa mengakses materi belajar.');
    renderAdminStudents();
  }
}

function rejectStudentAction(studentId) {
  const users = getStoredUsers();
  const idx = users.findIndex(u => u.id === studentId);
  if (idx !== -1) {
    users[idx].status = 'Rejected';
    saveStoredUsers(users);
    renderAdminStudents();
  }
}
