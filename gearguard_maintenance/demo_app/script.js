// --------------------
// Preloaded demo users
// --------------------
let users = [
    { username: "supraja", password: "password123" },
    { username: "alice", password: "alice123" },
    { username: "bob", password: "bob123" },
    { username: "charlie", password: "charlie123" }
];

// --------------------
// Technician avatars
// --------------------
const avatars = {
    alice: 'avatars/alice gemini ai.png',
    bob: 'avatars/bob gemini ai.png',
    charlie: 'avatars/charlie gemini ai.png',
    supraja: 'avatars/supraja.png'
};

// --------------------
// Login / Signup
// --------------------
function toggleAuth() {
    const loginBox = document.getElementById('login-box');
    const signupBox = document.getElementById('signup-box');
    loginBox.style.display = loginBox.style.display === 'none' ? 'block' : 'none';
    signupBox.style.display = signupBox.style.display === 'none' ? 'block' : 'none';
}

function signup() {
    const username = document.getElementById('signup-username').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    if (!username || !password) { alert("Enter valid details."); return; }
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) { alert("Username exists"); return; }
    users.push({ username, password });
    alert("Account created! Please login.");
    toggleAuth();
}

function login() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) { alert("Login successful! Welcome, " + username + "!"); window.location.href='dashboard.html'; }
    else alert("Invalid credentials. Check your username and password or create a new account.");
}

// --------------------
// Section Tabs
// --------------------
function showSection(id){
    document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

// --------------------
// Dropdowns
// --------------------
let equipments = ['Printer 01','Laptop 02','CNC Machine'];
let workcenters = ['Assembly Line 1','Assembly Line 2'];
let requestId = 0;

function updateDropdowns(){
    const equipSel = document.getElementById('equipment-select');
    if(equipSel){
        equipSel.innerHTML='';
        equipments.forEach(eq=>{
            let opt=document.createElement('option');
            opt.value=eq; opt.textContent=eq;
            equipSel.appendChild(opt);
        });
    }
    const workSel = document.getElementById('workcenter-select');
    if(workSel){
        workSel.innerHTML='';
        workcenters.forEach(wc=>{
            let opt=document.createElement('option');
            opt.value=wc; opt.textContent=wc;
            workSel.appendChild(opt);
        });
    }
    const techSel = document.getElementById('assign-tech');
    if(techSel){
        techSel.innerHTML='';
        Object.keys(avatars).forEach(name=>{
            let opt=document.createElement('option');
            opt.value=name; opt.textContent=name;
            techSel.appendChild(opt);
        });
    }

    const equipTechSel = document.getElementById('equip-tech');
    if(equipTechSel){
        equipTechSel.innerHTML='';
        Object.keys(avatars).forEach(name=>{
            let opt=document.createElement('option');
            opt.value=name; opt.textContent=name;
            equipTechSel.appendChild(opt);
        });
    }
}
window.onload = updateDropdowns;

// --------------------
// Toggle Equipment / Workcenter
// --------------------
function toggleWorkCenter(){
    const type = document.getElementById('type-select').value;
    document.getElementById('equipment-field').style.display = type==='equipment'?'block':'none';
    document.getElementById('workcenter-field').style.display = type==='workcenter'?'block':'none';
}

// --------------------
// Kanban: Create Request Card
// --------------------
function createRequest(){
    const type = document.getElementById('type-select').value;
    const tech = document.getElementById('assign-tech').value;
    let name = type==='equipment'? document.getElementById('equipment-select').value : document.getElementById('workcenter-select').value;

    const card=document.createElement('div');
    card.className='card'; card.id='card-'+requestId++;

    const avatar=document.createElement('img');
    avatar.src=avatars[tech]||'avatars/default.png'; avatar.alt=tech; avatar.className='avatar';

    const text=document.createElement('span'); text.textContent=name+" - New Request";

    const badge=document.createElement('span'); badge.className='badge new'; badge.textContent='NEW';

    card.appendChild(avatar); card.appendChild(text); card.appendChild(badge);
    card.setAttribute('draggable','true'); card.ondragstart=drag;

    document.getElementById('new').appendChild(card);
}

// --------------------
// Drag & Drop
// --------------------
function allowDrop(ev){ ev.preventDefault(); }
function drag(ev){ ev.dataTransfer.setData("text", ev.target.id); }
function drop(ev){
    ev.preventDefault();
    const id = ev.dataTransfer.getData("text");
    const card = document.getElementById(id);
    const column = ev.target.closest('.column'); if(!column) return;
    column.appendChild(card);
    const badge = card.querySelector('.badge'); badge.className='badge';
    switch(column.id){
        case 'new': badge.classList.add('new'); badge.textContent='NEW'; break;
        case 'in-progress': badge.classList.add('progress'); badge.textContent='IN PROGRESS'; break;
        case 'repaired': badge.classList.add('repaired'); badge.textContent='REPAIRED'; break;
        case 'scrap': badge.classList.add('scrap'); badge.textContent='SCRAP'; break;
    }
}

// --------------------
// Filter Cards
// --------------------
function filterCards(){
    const teamFilter=document.getElementById('filter-team').value;
    const typeFilter=document.getElementById('filter-type').value;
    document.querySelectorAll('.kanban .card').forEach(card=>{
        const tech=card.querySelector('img').alt;
        const isType=card.querySelector('span').textContent.includes('Work Center')?'workcenter':'equipment';
        card.style.display=((teamFilter==='all'||teamFilter===tech)&&(typeFilter==='all'||typeFilter===isType))?'flex':'none';
    });
}

// --------------------
// Equipment Section
// --------------------
let equipmentList=[];
function addEquipment(){
    const name=document.getElementById('equip-name').value;
    const category=document.getElementById('equip-category').value;
    const company=document.getElementById('equip-company').value;
    const location=document.getElementById('equip-location').value;
    const tech=document.getElementById('equip-tech').value;
    const desc=document.getElementById('equip-desc').value;

    equipmentList.push({name,category,company,location,tech,desc});
    updateEquipmentTable();
    if(!equipments.includes(name)) equipments.push(name);
    updateDropdowns();
    document.getElementById('equipment-form')?.reset();
}
function updateEquipmentTable(){
    const tbody=document.querySelector('#equipment-table tbody');
    if(!tbody) return;
    tbody.innerHTML='';
    equipmentList.forEach((eq,i)=>{
        const tr=document.createElement('tr');
        tr.innerHTML=`<td>${eq.name}</td><td>${eq.category}</td><td>${eq.company}</td><td>${eq.location}</td><td>${eq.tech}</td><td>${eq.desc}</td>
        <td><button onclick="deleteEquipment(${i})">Delete</button></td>`;
        tbody.appendChild(tr);
    });
}
function deleteEquipment(i){ equipmentList.splice(i,1); updateEquipmentTable(); updateDropdowns(); }

// --------------------
// Teams Section
// --------------------
let teamList=[];
function addTeam(){
    const name=document.getElementById('team-name').value;
    const members=document.getElementById('team-members').value;
    const company=document.getElementById('team-company').value;

    teamList.push({name,members,company});
    updateTeamsTable();
    document.getElementById('team-form')?.reset();
}
function updateTeamsTable(){
    const tbody=document.querySelector('#teams-table tbody');
    if(!tbody) return;
    tbody.innerHTML='';
    teamList.forEach((team,i)=>{
        const tr=document.createElement('tr');
        tr.innerHTML=`<td>${team.name}</td><td>${team.members}</td><td>${team.company}</td>
        <td><button onclick="deleteTeam(${i})">Delete</button></td>`;
        tbody.appendChild(tr);
    });
}
function deleteTeam(i){ teamList.splice(i,1); updateTeamsTable(); }

// --------------------
// Calendar Section
// --------------------
let calendarList=[];
function addCalendar(){
    const item=document.getElementById('cal-item').value;
    const type=document.getElementById('cal-type').value;
    const team=document.getElementById('cal-team').value;
    const tech=document.getElementById('cal-tech').value;
    const date=document.getElementById('cal-date').value;
    const notes=document.getElementById('cal-notes').value;

    calendarList.push({item,type,team,tech,date,notes});
    updateCalendarTable();
    document.getElementById('calendar-form')?.reset();
}
function updateCalendarTable(){
    const tbody=document.querySelector('#calendar-table tbody');
    if(!tbody) return;
    tbody.innerHTML='';
    calendarList.forEach((c,i)=>{
        const tr=document.createElement('tr');
        tr.innerHTML=`<td>${c.item}</td><td>${c.type}</td><td>${c.team}</td><td>${c.tech}</td><td>${c.date}</td><td>${c.notes}</td>
        <td><button onclick="deleteCalendar(${i})">Delete</button></td>`;
        tbody.appendChild(tr);
    });
}
function deleteCalendar(i){ calendarList.splice(i,1); updateCalendarTable(); }
