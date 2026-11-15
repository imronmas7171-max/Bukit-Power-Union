// รหัสผ่านแอดมิน (เปลี่ยนเป็นรหัสของคุณเองได้เลย)
const ADMIN_PASSWORD = "admin123";

// ข้อมูลเริ่มต้นจากรูปที่คุณส่งมา
let teamsData = [
    { pos: 1, name: "Arsenal", mp: 10, w: 9, d: 1, l: 0, gf: 15, ga: 5 },
    { pos: 2, name: "Brighton", mp: 10, w: 7, d: 1, l: 2, gf: 26, ga: 7 },
    { pos: 3, name: "Manchester City", mp: 10, w: 7, d: 0, l: 3, gf: 21, ga: 13 },
    { pos: 4, name: "Liverpool", mp: 10, w: 5, d: 3, l: 2, gf: 14, ga: 10 },
    { pos: 5, name: "Chelsea", mp: 10, w: 5, d: 1, l: 4, gf: 19, ga: 16 },
    { pos: 6, name: "Everton", mp: 10, w: 4, d: 4, l: 2, gf: 12, ga: 10 },
];

let selectedIndex = null;

// โหลดข้อมูลจาก localStorage ถ้ามี
function loadData() {
    const saved = localStorage.getItem('leagueData');
    if (saved) {
        teamsData = JSON.parse(saved);
    }
}

// บันทึกข้อมูลลง localStorage
function saveData() {
    localStorage.setItem('leagueData', JSON.stringify(teamsData));
}

// คำนวณผลต่างประตู และคะแนน
function calcTeam(team) {
    let gd = team.gf - team.ga;
    let pts = (team.w * 3) + (team.d * 1);
    return { gd, pts };
}

// เรียงลำดับทีมตามคะแนน
function sortTeams() {
    teamsData.sort((a, b) => {
        const ptsA = (a.w * 3) + a.d;
        const ptsB = (b.w * 3) + b.d;
        if (ptsB !== ptsA) return ptsB - ptsA;
        const gdA = a.gf - a.ga;
        const gdB = b.gf - b.ga;
        return gdB - gdA;
    });
    // อัปเดตลำดับ
    teamsData.forEach((t, i) => t.pos = i + 1);
}

// แสดงตารางในหน้าสาธารณะ
function renderPublicTable() {
    loadData();
    sortTeams();
    const tbody = document.getElementById('table-body');
    if (!tbody) return;
    
    tbody.innerHTML = teamsData.map(team => {
        const { gd, pts } = calcTeam(team);
        return `
            <tr>
                <td class="pos-col">${team.pos}</td>
                <td class="team-name">${team.name}</td>
                <td>${team.mp}</td>
                <td>${team.w}</td>
                <td>${team.d}</td>
                <td>${team.l}</td>
                <td>${team.gf}</td>
                <td>${team.ga}</td>
                <td class="${gd >= 0 ? 'plus' : 'minus'}">${gd > 0 ? '+' : ''}${gd}</td>
                <td class="pts-col">${pts}</td>
            </tr>
        `;
    }).join('');
}

// แสดงตารางในหน้าแอดมิน
function renderAdminTable() {
    loadData();
    sortTeams();
    const tbody = document.getElementById('admin-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = teamsData.map((team, idx) => {
        const { gd, pts } = calcTeam(team);
        return `
            <tr onclick="selectTeam(${idx})" class="team-row">
                <td class="pos-col">${team.pos}</td>
                <td class="team-name">${team.name}</td>
                <td>${team.mp}</td>
                <td>${team.w}</td>
                <td>${team.d}</td>
                <td>${team.l}</td>
                <td>${team.gf}</td>
                <td>${team.ga}</td>
                <td class="${gd >= 0 ? 'plus' : 'minus'}">${gd > 0 ? '+' : ''}${gd}</td>
                <td class="pts-col">${pts}</td>
            </tr>
        `;
    }).join('');
}

// เลือกทีมเพื่อแก้ไข
function selectTeam(idx) {
    selectedIndex = idx;
    const team = teamsData[idx];
    document.getElementById('edit-name').value = team.name;
    document.getElementById('edit-mp').value = team.mp;
    document.getElementById('edit-w').value = team.w;
    document.getElementById('edit-d').value = team.d;
    document.getElementById('edit-l').value = team.l;
    document.getElementById('edit-gf').value = team.gf;
    document.getElementById('edit-ga').value = team.ga;
}

// บันทึกข้อมูลทีม
function saveTeam() {
    if (selectedIndex === null) {
        alert("กรุณาเลือกทีมจากตารางก่อนครับ");
        return;
    }
    
    teamsData[selectedIndex].mp = parseInt(document.getElementById('edit-mp').value) || 0;
    teamsData[selectedIndex].w = parseInt(document.getElementById('edit-w').value) || 0;
    teamsData[selectedIndex].d = parseInt(document.getElementById('edit-d').value) || 0;
    teamsData[selectedIndex].l = parseInt(document.getElementById('edit-l').value) || 0;
    teamsData[selectedIndex].gf = parseInt(document.getElementById('edit-gf').value) || 0;
    teamsData[selectedIndex].ga = parseInt(document.getElementById('edit-ga').value) || 0;
    
    saveData();
    renderAdminTable();
    selectedIndex = null;
    document.getElementById('save-msg').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('save-msg').classList.add('hidden');
    }, 2000);
    
    // ล้างฟอร์ม
    document.getElementById('edit-name').value = '';
    document.getElementById('edit-mp').value = '';
    document.getElementById('edit-w').value = '';
    document.getElementById('edit-d').value = '';
    document.getElementById('edit-l').value = '';
    document.getElementById('edit-gf').value = '';
    document.getElementById('edit-ga').value = '';
}

// ตรวจสอบรหัสผ่าน
function checkPassword() {
    const input = document.getElementById('admin-password').value;
    if (input === ADMIN_PASSWORD) {
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('admin-panel').classList.remove('hidden');
        document.getElementById('admin-table-wrapper').classList.remove('hidden');
        renderAdminTable();
    } else {
        document.getElementById('error-msg').textContent = "❌ รหัสผ่านไม่ถูกต้อง";
    }
}

// ออกจากระบบ
function logout() {
    document.getElementById('admin-password').value = '';
    document.getElementById('login-section').classList.remove('hidden');
    document.getElementById('admin-panel').classList.add('hidden');
    document.getElementById('admin-table-wrapper').classList.add('hidden');
    selectedIndex = null;
}

// เรียกใช้เมื่อโหลดหน้า
window.onload = function() {
    if (document.getElementById('table-body')) {
        renderPublicTable();
    }
};
