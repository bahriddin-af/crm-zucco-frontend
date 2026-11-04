window.Zucco = (() => {
  const ROUTES = Object.freeze({ DASHBOARD:'/overview', LEADS:'/leads', STUDENTS:'/students', STUDENT:'/students/zu-0248', COURSES:'/courses', COURSE:'/courses/ielts-foundation', GROUPS:'/groups', GROUP:'/groups/if-09', SCHEDULE:'/schedule', ATTENDANCE:'/attendance', FINANCE:'/finance', EXPENSES:'/expenses', PAYROLL:'/payroll', STAFF:'/staff', BRANCHES:'/branches', MARKET:'/market', COINS:'/coins', SMS:'/sms', REPORTS:'/reports', SETTINGS:'/settings', ROLES:'/settings/roles', LOGIN:'/auth/login' });
  const STAGES = Object.freeze(['New Leads', 'Contacted', 'Trial Scheduled', 'Attended Trial', 'Waiting Payment', 'Enrolled']);
  const STATUS = Object.freeze({ PRESENT: 'present', EXCUSED: 'excused', ABSENT: 'absent', LATE: 'late' });
  const PATHS = {
    panel:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/>',
    chevron:'<path d="m9 5 7 7-7 7"/>', down:'<path d="m6 9 6 6 6-6"/>', left:'<path d="m15 5-7 7 7 7"/>',
    search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
    bell:'<path d="M18 8a6 6 0 0 0-12 0c0 6-3 7-3 9h18c0-2-3-3-3-9M10 21h4"/>',
    users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/><circle cx="9" cy="7" r="4"/>',
    leads:'<rect x="3" y="4" width="5" height="16" rx="1"/><rect x="10" y="4" width="5" height="11" rx="1"/><rect x="17" y="4" width="4" height="14" rx="1"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
    book:'<path d="M3 4h6a3 3 0 0 1 3 3v14a3 3 0 0 0-3-3H3V4Zm18 0h-6a3 3 0 0 0-3 3v14a3 3 0 0 1 3-3h6V4Z"/>',
    wallet:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 8h18m-5 6h5"/><circle cx="16" cy="14" r=".5"/>',
    building:'<path d="M4 21V5l8-2v18M4 9h3m-3 5h3m-3 5h3m5-12h8v14M15 11h2m-2 4h2M2 21h20"/>',
    plus:'<path d="M12 5v14M5 12h14"/>', more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    filter:'<path d="M4 7h16M7 12h10M10 17h4"/>', sort:'<path d="M7 3v18m-4-4 4 4 4-4M14 5h7m-7 5h5m-5 5h3"/>',
    phone:'<path d="m7 3 3 5-2 2a15 15 0 0 0 6 6l2-2 5 3-1 4C10 22 2 14 3 4l4-1Z"/>',
    instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5"/>',
    telegram:'<path d="m3 10 18-7-5 18-5-6-4 3 1-7 13-8-10 12"/>',
    globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c6 5 6 13 0 18-6-5-6-13 0-18Z"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    convert:'<circle cx="8" cy="7" r="3"/><path d="M2 21v-3a5 5 0 0 1 9-3m3-3 7 0m-3-3 3 3-3 3m-4 6h7"/>',
    check:'<path d="m5 12 4 4L19 6"/>', close:'<path d="m6 6 12 12M18 6 6 18"/>',
    checkCircle:'<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    alert:'<circle cx="12" cy="12" r="9"/><path d="M12 7v6m0 3h.01"/>',
    arrow:'<path d="M4 12h16m-5-5 5 5-5 5"/>', download:'<path d="M12 3v12m-4-4 4 4 4-4M4 17v4h16v-4"/>',
    message:'<path d="M21 11a8 8 0 0 1-8 8H7l-5 3 2-6A8 8 0 1 1 21 11Z"/>',
    mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
    coins:'<ellipse cx="10" cy="7" rx="7" ry="4"/><path d="M3 7v5c0 5 14 5 14 0V7M3 12v5c0 5 14 5 14 0v-5m4-3v8c0 2-3 4-6 4"/>',
    coin:'<circle cx="12" cy="12" r="9"/><path d="m14 7-5 5 5 5M8 7h7M8 17h7"/>',
    card:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 9h20M6 15h3"/>',
    cash:'<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M5 9h.01M19 15h.01"/>',
    arrowDown:'<path d="M12 4v16m-6-6 6 6 6-6"/>', arrowUp:'<path d="M12 20V4m-6 6 6-6 6 6"/>',
    receipt:'<path d="M5 3v18l3-2 4 2 4-2 3 2V3l-3 2-4-2-4 2-3-2ZM9 9h6m-6 4h6"/>',
    print:'<path d="M6 9V3h12v6M6 18H3V9h18v9h-3M6 14h12v7H6Z"/><path d="M17 12h.01"/>',
    shield:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
    settings:'<path d="m12 2 2 3 4 1 1 4 3 2-3 2-1 4-4 1-2 3-2-3-4-1-1-4-3-2 3-2 1-4 4-1 2-3Z"/><circle cx="12" cy="12" r="3"/>',
    help:'<circle cx="12" cy="12" r="9"/><path d="M9 8a3 3 0 0 1 6 1c0 2-3 2-3 5m0 3h.01"/>',
    trend:'<path d="m3 17 6-6 4 4L21 6m-6 0h6v6"/>', group:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 9v12"/>',
    save:'<path d="M3 3h15l3 3v15H3V3Zm4 0v6h10V3M7 21v-8h10v8"/>',
    pin:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    external:'<path d="M14 3h7v7m0-7L10 14M10 3H3v18h18v-7"/>', grip:'<circle cx="9" cy="5" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="19" r="1"/>'
  };
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${PATHS[name] || PATHS.group}</svg>`;
  const initials = name => (window.Zucco?.t?.(name)||name).split(' ').slice(0, 2).map(n => n[0]).join('');
  const avatar = (name, tone = '', size = '') => `<span class="avatar ${tone} ${size}" aria-label="${escape(name)}">${initials(name)}</span>`;
  const badge = (label, tone = '', dot = false) => `<span class="badge ${tone}">${dot ? '<span class="dot"></span>' : ''}${escape(label)}</span>`;
  const btn = (label, action, glyph = '', type = '') => `<button type="button" class="btn ${type}" data-action="${action}"${label?'':' aria-label="Close dialog"'}>${glyph ? icon(glyph) : ''}${label}</button>`;
  const money = (amount, unit = false) => `${new Intl.NumberFormat('ru-RU',{maximumFractionDigits:2}).format(Math.abs(amount))}${unit ? ' сўм' : ''}`;
  const signedMoney = amount => `${amount < 0 ? '−' : amount > 0 ? '+' : ''}${money(amount)}`;
  const heading = (title, subtitle, actions = '') => `<div class="page-heading"><div><h1>${title}</h1><p>${subtitle}</p></div><div class="page-actions">${actions}</div></div>`;
  const leadNames = ['Diyorbek Sobirov','Sevara Komilova','Temur Abduvaliyev','Munisa Qodirova','Akmal Xolmatov','Zilola Nurmatova','Behruz Akbarov','Sarvinoz Aliyeva','Sabrina Ergasheva','Islom Rustamov','Shahzod Tursunov','Madina Alimova','Javohir Ismoilov','Nilufar Ahmedova'];
  const stages = [0,0,0,1,1,2,2,2,3,3,4,4,5,5];
  const courses = ['IELTS Foundation','General English','Mathematics','Frontend Development'];
  const sources = ['Instagram','Telegram','Website','Referral'];
  const leads = leadNames.map((name, i) => ({id:`lead-${i+1}`, name, phone:`+998 ${[90,91,93,94,95,97,99][i%7]} ${110+i*11} ${String(20+i).padStart(2,'0')} ${String(30+i).padStart(2,'0')}`, course:courses[i%4], source:sources[i%4], age:['12m','28m','1h','2h','3h','4h','5h','Yesterday'][i%8], stage:stages[i], assignee:i%2?'Aziza Rahimova':'Madina Karimova'}));
  const studentNames=['Azizbek Karimov','Shahnoza Aliyeva','Muhammad Rasulov','Malika Tursunova','Javohir Ismoilov','Nilufar Ahmedova','Sardor Bekmurodov','Sevara Komilova','Diyorbek Sobirov','Munisa Qodirova'];
  const attendance=studentNames.map((name,i)=>({id:`s${i+1}`,name,code:`ZU-${String(248-i).padStart(4,'0')}`,status:[STATUS.PRESENT,STATUS.PRESENT,STATUS.LATE,STATUS.EXCUSED,STATUS.PRESENT,STATUS.ABSENT,STATUS.PRESENT,STATUS.PRESENT,STATUS.PRESENT,STATUS.PRESENT][i],homework:i===5?'Not submitted':i===2?'Partial':'Completed',grade:i===3||i===5?'':[92,88,76,0,95,0,90,86,89,93][i],coins:[450,180,320,95,410,125,275,215,160,230][i]}));
  const transactions=[
    {id:'RCPT-2048',name:'Azizbek Karimov',course:'IELTS Foundation · IF-09',amount:450000,method:'Cash',time:'10:42',kind:'income'},
    {id:'RCPT-2047',name:'Shahnoza Aliyeva',course:'Mathematics · MT-12',amount:600000,method:'Payme / Click',time:'10:36',kind:'income'},
    {id:'RCPT-2046',name:'Muhammad Rasulov',course:'General English · GE-04',amount:850000,method:'Terminal',time:'10:24',kind:'income'},
    {id:'EXP-0086',name:'Office supplies',course:'Operating expenses',amount:190000,method:'Cash',time:'10:15',kind:'expense'},
    {id:'RCPT-2045',name:'Malika Tursunova',course:'IELTS Foundation · IF-09',amount:600000,method:'Cash',time:'09:58',kind:'income'},
    {id:'RCPT-2044',name:'Javohir Ismoilov',course:'Frontend Development · FE-02',amount:1200000,method:'Terminal',time:'09:41',kind:'income'},
    {id:'EXP-0085',name:'Internet & utilities',course:'Operating expenses',amount:450000,method:'Terminal',time:'09:30',kind:'expense'},
    {id:'RCPT-2043',name:'Sardor Bekmurodov',course:'General English · GE-04',amount:450000,method:'Cash',time:'09:12',kind:'income'}
  ];
  const state={page:ROUTES.LEADS,collapsed:innerWidth<1360,branch:'Yunusobod',profileTab:'groups',financeTab:'all',financeSearch:'',leadSearch:'',leadCourse:'all',leadAssignee:'all',leadSource:'all',leadView:'pipeline',leads,attendance,transactions,balance:-600000,coins:450,paymentMethod:'Cash',amount:600000,paymentStudent:'Azizbek Karimov',weekOffset:0,scheduleMode:'week',scheduleCourse:'all',attendanceGroup:'IELTS Foundation · IF-09',attendanceDate:'2026-11-02',unsaved:false,dirtyRewards:0,lastSaved:'All changes saved',cashIncome:1500000,cardIncome:2650000,pendingDebt:18600000,expenses:640000};
  return {ROUTES,STAGES,STATUS,state,escape,icon,avatar,badge,btn,money,signedMoney,heading,initials,renderers:{}};
})();
