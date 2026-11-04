(() => {
  const Z=window.Zucco,{state,ROUTES:R}=Z;
  Z.navigation=[
    ['Overview',R.DASHBOARD,'trend','OVERVIEW'],['Leads',R.LEADS,'leads','CRM'],['Students',R.STUDENTS,'users','CRM'],['SMS center',R.SMS,'message','CRM'],
    ['Courses',R.COURSES,'book','ACADEMY'],['Groups',R.GROUPS,'group','ACADEMY'],['Schedule',R.SCHEDULE,'calendar','ACADEMY'],['Attendance',R.ATTENDANCE,'checkCircle','ACADEMY'],
    ['Financial desk',R.FINANCE,'wallet','BUSINESS'],['Expenses',R.EXPENSES,'arrowUp','BUSINESS'],['Payroll',R.PAYROLL,'cash','BUSINESS'],['Staff',R.STAFF,'users','BUSINESS'],['Reports',R.REPORTS,'trend','BUSINESS'],
    ['Reward market',R.MARKET,'coin','REWARDS'],['Coin activity',R.COINS,'coins','REWARDS'],['Branches & rooms',R.BRANCHES,'building','WORKSPACE'],['Settings',R.SETTINGS,'settings','WORKSPACE']
  ].map(([label,route,icon,group])=>({label,route,icon,group,...(route===R.LEADS?{count:()=>state.leads.filter(l=>l.stage<5).length}:{})}));
  Z.routeTitles=Object.fromEntries(Z.navigation.map(n=>[n.route,[n.group[0]+n.group.slice(1).toLowerCase(),n.label]]));
  Object.assign(Z.routeTitles,{[R.STUDENT]:['Students','Student profile'],[R.COURSE]:['Courses','Course details'],[R.GROUP]:['Groups','Group details'],[R.ROLES]:['Settings','Roles & permissions'],[R.LOGIN]:['Account','Sign in']});
  const extraNames=['Temur Abduvaliyev','Zilola Nurmatova','Akmal Xolmatov','Sabrina Ergasheva','Islom Rustamov','Madina Alimova','Behruz Akbarov','Sarvinoz Aliyeva','Shahzod Tursunov','Dilnoza Akramova'];
  const names=[...state.attendance.map(s=>s.name),...extraNames];
  const students=names.map((name,i)=>({id:'s'+(i+1),name,code:'ZU-'+String(248-i).padStart(4,'0'),phone:i===0?'+998 90 123 45 67':`+998 ${[91,93,94,95,97,99][i%6]} ${220+i*7} ${20+i} ${40+i}`,status:i===3?'Frozen':i===5?'Debtor':i===17?'Completed':i===18?'Trial':'Active',group:['IF-09','MT-12','GE-04','FE-02'][i%4],balance:i===0?-600000:i%5===0?-350000:i%4===0?450000:0,coins:state.attendance[i]?.coins||75+i*10,parent:i===0?'Dilshod Karimov':`${name.split(' ')[1].replace(/(ov|ova|ev|eva)$/,'')} family`,parentPhone:'+998 91 234 56 78'}));
  const courses=[
    {id:'c1',name:'IELTS Foundation',subject:'English language',level:'Foundation',months:3,lessons:12,minutes:90,price:600000,groups:3,students:42,status:'Active',icon:'book',description:'Build the reading, writing, listening, and speaking skills for a confident IELTS start.'},
    {id:'c2',name:'General English',subject:'English language',level:'Intermediate',months:6,lessons:12,minutes:90,price:450000,groups:4,students:56,status:'Active',icon:'message',description:'Practical English for everyday communication, study, and the next step.'},
    {id:'c3',name:'Mathematics',subject:'Mathematics',level:'General',months:4,lessons:12,minutes:90,price:450000,groups:3,students:45,status:'Active',icon:'group',description:'Strengthen core concepts and build a reliable problem-solving approach.'},
    {id:'c4',name:'Frontend Development',subject:'Technology',level:'Beginner',months:6,lessons:12,minutes:120,price:1200000,groups:2,students:28,status:'Active',icon:'panel',description:'From the first HTML page to a portfolio of interactive web applications.'},
    {id:'c5',name:'IELTS Advanced',subject:'English language',level:'Advanced',months:3,lessons:12,minutes:120,price:850000,groups:2,students:24,status:'Active',icon:'trend',description:'Targeted preparation, mock exams, and feedback for the score you are working toward.'},
    {id:'c6',name:'Kids English',subject:'English language',level:'Beginner',months:6,lessons:8,minutes:60,price:350000,groups:0,students:0,status:'Draft',icon:'users',description:'A playful, structured introduction to English for young learners.'}
  ];
  const groups=[
    {id:'g1',name:'IF-09',course:'c1',teacher:'Madina Karimova',branch:'Yunusobod',room:'201',days:'Mon · Wed · Fri',time:'09:00–10:30',capacity:16,enrolled:12,status:'Active',price:600000,billing:'Monthly calendar'},
    {id:'g2',name:'GE-04',course:'c2',teacher:'Aziza Rahimova',branch:'Yunusobod',room:'202',days:'Mon · Wed · Fri',time:'16:00–17:30',capacity:14,enrolled:10,status:'Active',price:450000,billing:'Monthly calendar'},
    {id:'g3',name:'MT-12',course:'c3',teacher:'Jasur Aliyev',branch:'Yunusobod',room:'103',days:'Tue · Thu · Sat',time:'15:00–16:30',capacity:16,enrolled:12,status:'Active',price:450000,billing:'Per lesson'},
    {id:'g4',name:'FE-02',course:'c4',teacher:'Sardor Tursunov',branch:'Yunusobod',room:'Lab 01',days:'Mon · Wed · Fri',time:'12:00–14:00',capacity:16,enrolled:14,status:'Active',price:1200000,billing:'30-day cycle'},
    {id:'g5',name:'IA-02',course:'c5',teacher:'Madina Karimova',branch:'Chilonzor',room:'101',days:'Tue · Thu · Sat',time:'11:00–13:00',capacity:16,enrolled:12,status:'Recruiting',price:850000,billing:'Monthly calendar'},
    {id:'g6',name:'IF-10',course:'c1',teacher:'Nodira Saidova',branch:'Chilonzor',room:'102',days:'Mon · Wed · Fri',time:'14:00–15:30',capacity:16,enrolled:8,status:'Recruiting',price:600000,billing:'Monthly calendar'},
    {id:'g7',name:'GE-05',course:'c2',teacher:'Aziza Rahimova',branch:'Chilonzor',room:'101',days:'Tue · Thu · Sat',time:'09:00–10:30',capacity:14,enrolled:11,status:'Active',price:450000,billing:'Full course'},
    {id:'g8',name:'MT-08',course:'c3',teacher:'Jasur Aliyev',branch:'Yunusobod',room:'103',days:'Mon · Wed · Fri',time:'11:00–12:30',capacity:18,enrolled:15,status:'Active',price:450000,billing:'Per lesson'}
  ];
  const staff=[
    {id:'u1',name:'Asilbek Bekhbudiyev',role:'Owner',specialty:'Workspace administration',branch:'All branches',groups:0,phone:'+998 90 101 20 30',status:'Active'},
    {id:'u2',name:'Madina Karimova',role:'Teacher',specialty:'IELTS & English',branch:'Yunusobod',groups:3,phone:'+998 91 202 30 40',status:'Active'},
    {id:'u3',name:'Jasur Aliyev',role:'Teacher',specialty:'Mathematics',branch:'Yunusobod',groups:2,phone:'+998 93 303 40 50',status:'Active'},
    {id:'u4',name:'Aziza Rahimova',role:'Teacher',specialty:'General English',branch:'Chilonzor',groups:3,phone:'+998 94 404 50 60',status:'Active'},
    {id:'u5',name:'Sardor Tursunov',role:'Teacher',specialty:'Frontend Development',branch:'Yunusobod',groups:2,phone:'+998 95 505 60 70',status:'Active'},
    {id:'u6',name:'Nodira Saidova',role:'Teacher',specialty:'English foundation',branch:'Chilonzor',groups:1,phone:'+998 97 606 70 80',status:'Active'},
    {id:'u7',name:'Dilnoza Akramova',role:'Administrator',specialty:'Admissions & student care',branch:'Yunusobod',groups:0,phone:'+998 99 707 80 90',status:'Active'},
    {id:'u8',name:'Timur Usmonov',role:'Cashier',specialty:'Payments & reconciliation',branch:'Yunusobod',groups:0,phone:'+998 90 808 90 10',status:'Active'}
  ];
  const payroll=staff.filter(s=>s.role==='Teacher').map((s,i)=>({id:'pay'+i,teacher:s.name,lessons:[36,24,36,24,12][i],students:[42,27,38,28,16][i],scheme:i===3?'35% of paid tuition':'Per completed lesson',base:[5400000,3600000,4860000,6720000,1800000][i],bonus:[300000,0,200000,0,0][i],deduction:0,status:['Approved','Draft','Paid','Draft','Draft'][i]}));
  const branches=[{id:'b1',name:'Yunusobod',address:'12 Amir Temur Avenue, Tashkent',phone:'+998 71 200 10 10',main:true,status:'Active'},{id:'b2',name:'Chilonzor',address:'8 Bunyodkor Avenue, Tashkent',phone:'+998 71 200 20 20',main:false,status:'Active'}];
  const rooms=[['r1','b1','201',16,'Classroom'],['r2','b1','202',14,'Classroom'],['r3','b1','103',18,'Classroom'],['r4','b1','Lab 01',16,'Computer lab'],['r5','b2','101',16,'Classroom'],['r6','b2','102',16,'Classroom'],['r7','b2','Lab 02',14,'Computer lab']].map(([id,branch,name,capacity,type])=>({id,branch,name,capacity,type,status:'Available'}));
  const market=[['m1','Academy notebook',120,42,'book','A fresh page for your next big idea.'],['m2','Stainless water bottle',250,18,'wallet','Stay hydrated through every lesson.'],['m3','Canvas tote bag',180,26,'group','Carry your learning wherever you go.'],['m4','Zucco hoodie',600,12,'users','Made for our community of learners.'],['m5','IELTS mock exam',350,20,'receipt','A practice test with personal feedback.'],['m6','Study desk kit',220,15,'panel','The little things that keep you organized.']].map(([id,name,price,stock,icon,description])=>({id,name,price,stock,icon,description}));
  Z.platform={students,courses,groups,staff,payroll,branches,rooms,market,orders:[{id:'ORD-0108',student:'Shahnoza Aliyeva',item:'Academy notebook',price:120,status:'Delivered'},{id:'ORD-0109',student:'Muhammad Rasulov',item:'Canvas tote bag',price:180,status:'Pending'}],
    coinLedger:[{name:'Azizbek Karimov',amount:5,reason:'Excellent speaking',balance:450,time:'Today, 09:40'},{name:'Shahnoza Aliyeva',amount:-120,reason:'Academy notebook',balance:180,time:'Today, 09:15'},{name:'Javohir Ismoilov',amount:10,reason:'Weekly progress',balance:410,time:'1 Nov, 16:20'},{name:'Muhammad Rasulov',amount:-180,reason:'Canvas tote bag',balance:320,time:'1 Nov, 15:10'},{name:'Sardor Bekmurodov',amount:5,reason:'Homework completed',balance:275,time:'1 Nov, 11:30'}],
    sms:[{id:'SMS-0118',name:'November tuition reminder',audience:'24 students',type:'Payment reminder',status:'Pending',time:'Today, 09:00'},{id:'SMS-0117',name:'IELTS lesson reminder',audience:'12 students',type:'Lesson reminder',status:'Accepted',time:'Today, 08:30'},{id:'SMS-0116',name:'Welcome to Zucco Academy',audience:'3 students',type:'Welcome',status:'Accepted',time:'1 Nov, 17:15'},{id:'SMS-0115',name:'Updated Saturday schedule',audience:'16 students',type:'General notice',status:'Unknown',time:'1 Nov, 14:05'},{id:'SMS-0114',name:'Your trial lesson is booked',audience:'2 leads',type:'Trial confirmation',status:'Failed',time:'1 Nov, 11:45'}],
    templates:[{name:'Tuition reminder',body:'Hi {student_name}, your balance is {balance} UZS. Please contact {branch_name} to arrange payment.'},{name:'Lesson reminder',body:'Hi {student_name}, your {course_name} lesson starts at {lesson_time}. See you at {branch_name}!'},{name:'Welcome to Zucco',body:'Welcome, {student_name}! Your learning journey at Zucco Academy starts here.'},{name:'Trial confirmation',body:'Your {course_name} trial is booked for {lesson_date} at {lesson_time}. We look forward to meeting you.'}],
    organization:{name:'Zucco Academy',phone:'+998 71 200 10 10',email:'hello@zucco.academy',timezone:'Asia/Tashkent',language:'English',currency:'UZS'},
    filters:{},studentPage:1,selectedStudent:'s1',selectedCourse:'c1',selectedGroup:'g1',selectedBranch:'b1',groupTab:'students',marketTab:'catalog',smsTab:'history',settingsTab:'general',selectedRole:'Administrator',roleOverrides:{},budgetPeriod:'2026-11'};
  Z.selectedStudent=()=>students.find(s=>s.id===Z.platform.selectedStudent)||students[0];
  Z.studentBalance=s=>s.id==='s1'?state.balance:s.balance;
  Z.studentCoins=s=>s.id==='s1'?state.coins:(state.attendance.find(a=>a.id===s.id)?.coins??s.coins);
  Z.selectedCourse=()=>courses.find(c=>c.id===Z.platform.selectedCourse)||courses[0];
  Z.selectedGroup=()=>groups.find(g=>g.id===Z.platform.selectedGroup)||groups[0];
  Z.courseName=id=>courses.find(c=>c.id===id)?.name||'New course';
})();
