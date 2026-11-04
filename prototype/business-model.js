/* Contract-shaped sample state for the design prototype. No network requests. */
(() => {
  const Z=window.Zucco, P=Z.platform, S=Z.state;
  const B=Z.business={today:'2026-11-02',role:'Owner',operations:new Map(),charges:[],freezes:[],schemes:[],calculations:[],journal:new Map(),payments:[],expenses:[]};
  const uid=()=>crypto.randomUUID(), round=n=>Math.round((n+Number.EPSILON)*100)/100;
  B.uid=uid;B.round=round;
  B.amount=value=>{if(!/^\d+(\.\d{1,2})?$/.test(String(value))||Number(value)<=0)throw Error('Сумма 0 дан катта ва кўпи билан 2 каср хонали бўлиши керак.');return round(Number(value));};
  B.once=(operationId,payload,work)=>{if(!operationId)throw Error('Амал идентификатори йўқ. Формани қайта очинг.');const key=JSON.stringify(payload),old=B.operations.get(operationId);if(old){if(old.key!==key)throw Error('Бу амал аввал бошқа маълумотлар билан бажарилган.');return old.result;}const result=work();B.operations.set(operationId,{key,result});return result;};
  B.accounts=[{id:'a1',name:'Юнусобод кассаси',type:'Cash',branch:'Yunusobod',balance:8500000},{id:'a2',name:'Банк ҳисоб рақами',type:'BankAccount',branch:'All branches',balance:24600000},{id:'a3',name:'Юнусобод терминали',type:'Terminal',branch:'Yunusobod',balance:6800000},{id:'a4',name:'Онлайн тўловлар',type:'OnlineAggregator',branch:'All branches',balance:4250000},{id:'a5',name:'Чилонзор кассаси',type:'Cash',branch:'Chilonzor',balance:3200000}];
  B.categories=[{id:'ec1',name:'Ўқув материаллари'},{id:'ec2',name:'Ижара'},{id:'ec3',name:'Коммунал хизматлар'},{id:'ec4',name:'Маркетинг'},{id:'ec5',name:'Иш ҳақи'}];
  B.billingLabels={MonthlyCalendar:'Календарь ойи',CycleBased:'30 кунлик давр',PerLesson:'Ҳар бир дарс',FullCourse:'Тўлиқ курс'};
  const mode={'Monthly calendar':'MonthlyCalendar','30-day cycle':'CycleBased','Per lesson':'PerLesson','Full course':'FullCourse'};
  P.courses.forEach(c=>{if(c.status==='Draft')c.status='Inactive';if(c.level==='Foundation')c.level='Beginner';c.subjectId=c.subject==='Technology'?'sb3':c.subject==='Mathematics'?'sb2':'sb1';});
  P.staff.forEach(s=>{s.roleType=({Owner:'CEO',Administrator:'BranchManager'})[s.role]||s.role;s.hireDate='2026-01-05';s.email='';});
  P.groups.forEach(g=>{g.billingMode=mode[g.billing];g.billing=B.billingLabels[g.billingMode];g.startDate='2026-08-12';g.endDate='2027-02-12';g.teacherId=P.staff.find(s=>s.name===g.teacher)?.id;g.branchId=P.branches.find(b=>b.name===g.branch)?.id;g.roomId=P.rooms.find(r=>r.name===g.room&&r.branch===g.branchId)?.id;g.daysSchedule=g.days.startsWith('Mon')?'OddDays':'EvenDays';});
  B.enrollments=P.students.map((s,i)=>({id:uid(),studentId:s.id,groupId:i>=12?'g'+(5+i%4):P.groups.find(g=>g.name===s.group)?.id||'g1',joinedDate:'2026-08-12',status:s.status==='Trial'?'Trial':s.status==='Completed'?'Completed':'Active',customPrice:null,leftDate:s.status==='Completed'?'2026-10-30':null}));
  B.enrollments.push({id:uid(),studentId:'s1',groupId:'g3',joinedDate:'2026-09-01',status:'Active',customPrice:400000,leftDate:null});
  // A populated IELTS cohort also illustrates real multiple-group enrollments.
  P.students.slice(0,12).filter(s=>!B.enrollments.some(e=>e.studentId===s.id&&e.groupId==='g1')).forEach(s=>B.enrollments.push({id:uid(),studentId:s.id,groupId:'g1',joinedDate:'2026-09-01',status:'Active',customPrice:null,leftDate:null}));
  B.freezes.push({studentId:'s4',fromDate:'2026-10-28',toDate:'2026-11-10',reason:'Соғлиқ сабабли'});
  B.forStudent=id=>B.enrollments.filter(e=>e.studentId===id);
  B.activeEnrollment=e=>['Active','Trial','Frozen'].includes(e.status)&&!e.leftDate;
  B.forGroup=id=>B.enrollments.filter(e=>e.groupId===id&&B.activeEnrollment(e));
  B.occupied=id=>B.forGroup(id).filter(e=>['Active','Trial'].includes(e.status));
  B.refresh=()=>{P.groups.forEach(g=>g.enrolled=B.occupied(g.id).length);P.courses.forEach(c=>{const groups=P.groups.filter(g=>g.course===c.id);c.groups=groups.length;c.students=new Set(B.enrollments.filter(e=>groups.some(g=>g.id===e.groupId)&&B.activeEnrollment(e)).map(e=>e.studentId)).size;});P.students.forEach(s=>s.group=B.forStudent(s.id).filter(B.activeEnrollment).map(e=>P.groups.find(g=>g.id===e.groupId)?.name).join(', ')||'—');};
  B.visibleGroup=g=>S.branch==='All branches'||g.branch===S.branch;
  B.visibleStudent=s=>S.branch==='All branches'||B.forStudent(s.id).some(e=>B.activeEnrollment(e)&&B.visibleGroup(P.groups.find(g=>g.id===e.groupId)))||B.forStudent(s.id).length===0;
  B.frozen=(studentId,date)=>B.freezes.some(f=>f.studentId===studentId&&f.fromDate<=date&&date<=f.toDate);
  B.addEnrollment=({studentId,groupId,joinedDate,status='Active',customPrice=null})=>{
    const g=P.groups.find(g=>g.id===groupId),s=P.students.find(s=>s.id===studentId);
    if(!g||!s||!joinedDate)throw Error('Талаба, гуруҳ ва қўшилиш санасини танланг.');
    const existing=B.enrollments.find(e=>e.groupId===groupId&&e.studentId===studentId);
    if(existing&&['Active','Trial'].includes(existing.status))throw Error('Талаба бу гуруҳга аввал ёзилган.');
    if(B.occupied(groupId).length>=g.capacity)throw Error('Гуруҳда бўш жой қолмаган.');
    const e={id:uid(),studentId,groupId,joinedDate,status,customPrice:customPrice===''||customPrice===null?null:Number(customPrice),leftDate:null};
    if(e.customPrice!==null&&(!Number.isFinite(e.customPrice)||e.customPrice<0))throw Error('Шахсий нарх манфий бўлмаслиги керак.');
    if(existing){existing.status=status;existing.leftDate=null;if(e.customPrice!==null)existing.customPrice=e.customPrice;B.refresh();return existing;}
    B.enrollments.push(e);B.refresh();return e;
  };
  Z.STAGES=Object.freeze(['Янги лид','Боғланилди','Синов белгиланди','Синовда қатнашди','Кутиш рўйхати','Талабага айланди','Йўқотилди']);
  S.leads.forEach((l,i)=>{l.branch=i%5===0?'Chilonzor':'Yunusobod';l.status=l.stage===5?'Converted':'Active';if(l.stage===5){const s=P.students.find(s=>s.name===l.name);if(s)l.studentId=s.id;}});
  B.convert=(leadId,groupId,joinedDate)=>{
    const l=S.leads.find(l=>l.id===leadId);if(!l)throw Error('Лид топилмади.');if(l.studentId)return P.students.find(s=>s.id===l.studentId);
    if(l.status==='Lost')throw Error('Йўқотилган лидни аввал фаол босқичга қайтаринг.');
    if(groupId){const g=P.groups.find(g=>g.id===groupId);if(!g||B.occupied(groupId).length>=g.capacity)throw Error('Гуруҳда бўш жой қолмаган.');}
    const existing=P.students.find(s=>s.phone.replaceAll(' ','')===l.phone.replaceAll(' ',''));
    if(existing&&groupId&&B.occupied(groupId).some(e=>e.studentId===existing.id))throw Error('Талаба бу гуруҳга аввал ёзилган.');
    const s=existing||{id:uid(),name:l.name,phone:l.phone,code:'ZU-'+(249+P.students.length),status:'Active',parent:'',parentPhone:'',balance:0,coins:0,note:''};
    if(!existing)P.students.push(s);if(groupId)B.addEnrollment({studentId:s.id,groupId,joinedDate:joinedDate||B.today});
    l.status='Converted';l.stage=5;l.studentId=s.id;B.refresh();return s;
  };
  B.lessons=[];
  P.groups.forEach(g=>(g.daysSchedule==='EvenDays'?['2026-10-27','2026-10-29','2026-10-31','2026-11-03','2026-11-05']:['2026-10-26','2026-10-28','2026-10-30','2026-11-02','2026-11-04']).forEach((date,i)=>{
    const lesson={id:g.id+'-'+date,groupId:g.id,teacherId:g.teacherId,date,start:g.time.split('–')[0],end:g.time.split('–')[1],status:i<3?'Completed':'Scheduled',topic:i===3?'Оғзаки нутқ ва машқлар':'Мавзуни мустаҳкамлаш',attendance:[]};
    if(i<3||(g.id==='g1'&&date===B.today)){lesson.status='Completed';lesson.attendance=B.forGroup(g.id).filter(e=>!B.frozen(e.studentId,date)).map((e,j)=>({studentId:e.studentId,status:j===3?'Excused':j===2?'Late':j===5?'Unexcused':'Present',score:j===3||j===5?null:88+j%5,homeworkStatus:j===5?'NotDone':j===2?'Partial':'Completed'}));}
    B.lessons.push(lesson);
  }));
  S.transactions.forEach((t,i)=>{t.method=t.method==='Terminal'?'Card':t.method==='Payme / Click'?'Payme':t.method;t.accountId=t.method==='Cash'?'a1':t.method==='Card'?'a3':'a4';t.date=B.today;t.operationId=uid();t.studentId=P.students.find(s=>s.name===t.name)?.id;t.groupId=B.forStudent(t.studentId).find(B.activeEnrollment)?.groupId||null;t.billingPeriod=t.kind==='income'?'2026-11':null;t.categoryId=t.kind==='expense'?'ec1':null;});
  B.payments=S.transactions.filter(t=>t.kind==='income');B.expenses=S.transactions.filter(t=>t.kind==='expense');
  // Historical fixtures carry both group and billing period, as payroll requires.
  B.payments.push(...P.students.slice(0,12).map((s,i)=>({id:'HIST-'+i,studentId:s.id,groupId:B.forStudent(s.id)[0].groupId,billingPeriod:'2026-10',amount:P.groups.find(g=>g.id===B.forStudent(s.id)[0].groupId).price,method:'Cash',date:'2026-10-20',accountId:'a1'})));
  B.setBalance=(s,amount)=>{s.balance=round(amount);if(s.id==='s1')S.balance=s.balance;if(s.balance<0&&s.status==='Active')s.status='Debtor';else if(s.balance>=0&&s.status==='Debtor')s.status='Active';};
  B.setCoins=(s,amount)=>{s.coins=amount;if(s.id==='s1')S.coins=amount;const row=S.attendance.find(a=>a.id===s.id);if(row)row.coins=amount;};
  B.recordPayment=p=>B.once(p.operationId,p,()=>{const s=P.students.find(s=>s.id===p.studentId),a=B.accounts.find(a=>a.id===p.accountId),amount=B.amount(p.amount);if(!s||!a)throw Error('Талаба ва пул ҳисобини танланг.');if(!['Cash','Card','BankTransfer','Click','Payme','Uzum'].includes(p.method))throw Error('Тўлов усулини танланг.');if(p.billingPeriod&&!/^\d{4}-\d{2}$/.test(p.billingPeriod))throw Error('Даврни ЙЙЙЙ-ОО шаклида киритинг.');
    const t={...p,amount,id:'RCPT-'+(2049+B.payments.length-18),name:s.name,kind:'income',course:p.groupId?P.groups.find(g=>g.id===p.groupId)?.name:'Умумий баланс',date:B.today,time:'10:48'};
    B.setBalance(s,Z.studentBalance(s)+amount);a.balance=round(a.balance+amount);B.payments.unshift(t);S.transactions.unshift(t);S.pendingDebt=P.students.reduce((n,s)=>n+Math.max(0,-Z.studentBalance(s)),0);return t;
  });
  B.recordExpense=p=>B.once(p.operationId,p,()=>{const a=B.accounts.find(a=>a.id===p.accountId),amount=B.amount(p.amount);if(!a||!B.categories.some(c=>c.id===p.categoryId)||!p.description)throw Error('Ҳисоб, харажат тури ва изоҳни тўлдиринг.');const t={...p,id:'EXP-'+(87+B.expenses.length),amount,name:p.description,kind:'expense',course:B.categories.find(c=>c.id===p.categoryId).name,date:B.today,time:'10:48',method:a.type==='Cash'?'Cash':'BankTransfer'};a.balance=round(a.balance-amount);S.transactions.unshift(t);B.expenses.unshift(t);S.expenses+=amount;return t;});
  B.issueCoins=p=>B.once(p.operationId,p,()=>{const s=P.students.find(s=>s.id===p.studentId);if(!s||!Number.isInteger(p.amount)||p.amount===0)throw Error('Танга ўзгариши 0 дан фарқли бутун сон бўлиши керак.');const balance=Z.studentCoins(s)+p.amount;if(balance<0||balance>2147483647)throw Error('Тангалар баланси рухсат этилган чегарадан чиқади.');B.setCoins(s,balance);P.coinLedger.unshift({name:s.name,amount:p.amount,reason:p.description||p.reason,balance:Z.studentCoins(s),time:'Ҳозир'});return {balance:Z.studentCoins(s)};});
  const plusDays=(d,n)=>new Date(Date.parse(d+'T00:00:00Z')+n*86400000).toISOString().slice(0,10);
  B.billingPreview=()=>{
    const rows=[];const add=(e,g,key,amount,start,end)=>{const id=e.id+'|'+g.billingMode+'|'+key;if(!B.charges.some(c=>c.id===id)&&amount>0)rows.push({id,enrollmentId:e.id,studentId:e.studentId,groupId:g.id,mode:g.billingMode,period:key,amount:round(amount),start,end});};
    B.enrollments.forEach(e=>{const g=P.groups.find(g=>g.id===e.groupId),student=P.students.find(s=>s.id===e.studentId);if(e.status!=='Active'||g.status!=='Active'||e.joinedDate>B.today||g.startDate>B.today||(g.endDate&&g.endDate<B.today)||!['Active','Debtor','Frozen'].includes(student.status)||e.leftDate||B.frozen(e.studentId,B.today))return;const price=e.customPrice??g.price,c=P.courses.find(c=>c.id===g.course),joined=e.joinedDate>g.startDate?e.joinedDate:g.startDate;if(price<=0)return;
      if(g.billingMode==='MonthlyCalendar')add(e,g,B.today.slice(0,7),price,B.today.slice(0,7)+'-01','2026-11-30');
      if(g.billingMode==='CycleBased'){const index=Math.floor((Date.parse(B.today)-Date.parse(joined))/86400000/30),start=plusDays(joined,index*30);add(e,g,start,price,start,plusDays(start,29));}
      if(g.billingMode==='FullCourse')add(e,g,joined,price*c.months,joined,g.endDate);
      if(g.billingMode==='PerLesson')B.lessons.filter(l=>l.groupId===g.id&&l.status==='Completed'&&l.date>=joined&&l.date<=B.today&&!B.frozen(e.studentId,l.date)&&l.attendance.some(a=>a.studentId===e.studentId&&a.status!=='Excused')).forEach(l=>add(e,g,l.id,round(price/c.lessons),l.date,l.date));
    });return rows;
  };
  B.runBilling=()=>{const rows=B.billingPreview();P.students.forEach(s=>{if(s.status==='Frozen'&&!B.frozen(s.id,B.today)&&B.freezes.some(f=>f.studentId===s.id&&f.toDate<B.today))s.status=Z.studentBalance(s)<0?'Debtor':'Active';});rows.forEach(c=>{B.charges.push(c);const s=P.students.find(s=>s.id===c.studentId);B.setBalance(s,Z.studentBalance(s)-c.amount);});return rows;};
  B.previewTeacherId='u2';
  B.canMarkLesson=l=>!!l&&B.can('attendance.mark')&&(B.role!=='Teacher'||B.can('groups.update')||l.teacherId===B.previewTeacherId);
  B.canAttend=(studentId,date,groupId)=>B.enrollments.some(e=>e.studentId===studentId&&e.groupId===groupId&&['Active','Trial'].includes(e.status)&&e.joinedDate<=date&&(!e.leftDate||e.leftDate>=date))&&!B.frozen(studentId,date);
  B.generateSchedule=({groupId,startFromDate,totalLessons})=>{
    const g=P.groups.find(g=>g.id===groupId);if(!g||startFromDate<g.startDate||!Number.isInteger(totalLessons)||totalLessons<1||totalLessons>366)throw Error('Дарслар сони ва бошланиш санасини текширинг.');
    const days=g.daysSchedule==='OddDays'?[1,3,5]:g.daysSchedule==='EvenDays'?[2,4,6]:g.daysSchedule==='Everyday'?[1,2,3,4,5,6]:g.customDays,selected=[],pending=[];let date=startFromDate;
    while(selected.length<totalLessons){if(g.endDate&&date>g.endDate)throw Error('Белгиланган дарслар гуруҳнинг тугаш санасигача сиғмайди.');if(days.includes(new Date(date+'T00:00:00Z').getUTCDay())){const existing=B.lessons.find(l=>l.groupId===g.id&&l.date===date&&l.start===g.time.split('–')[0]);if(existing)selected.push(existing);else{const lesson={id:g.id+'-'+date,groupId:g.id,teacherId:g.teacherId,date,start:g.time.split('–')[0],end:g.time.split('–')[1],status:'Scheduled',topic:'Мавзу белгиланмаган',attendance:[]};pending.push(lesson);selected.push(lesson);}}date=plusDays(date,1);}
    B.lessons.push(...pending);return selected;
  };
  B.schemes=P.staff.filter(s=>s.role==='Teacher').map((s,i)=>({id:uid(),teacherId:s.id,groupId:null,type:['PerLessonRate','FixedPerStudent','PercentageOfRevenue','FixedMonthlySalary','PerLessonRate'][i],rate:[150000,90000,35,4000000,120000][i],onlyPaidStudents:true,requireAttendanceMarked:true,active:true}));
  B.schemes.push({id:uid(),teacherId:'u2',groupId:'g1',type:'PercentageOfRevenue',rate:30,onlyPaidStudents:true,requireAttendanceMarked:true,active:true});
  B.schemeLabels={PercentageOfRevenue:'Тушумдан фоиз',FixedPerStudent:'Ҳар бир талаба учун',PerLessonRate:'Ҳар бир дарс учун',FixedMonthlySalary:'Ойлик белгиланган маош'};
  B.calculate=({teacherId,period,bonus=0,deduction=0})=>{
    if(!/^\d{4}-\d{2}$/.test(period))throw Error('Ҳисоблаш даврини танланг.');const schemes=B.schemes.filter(s=>s.teacherId===teacherId&&s.active);if(!schemes.length)throw Error('Аввал ўқитувчи учун маош схемасини белгиланг.');
    const old=B.calculations.find(p=>p.teacherId===teacherId&&p.period===period);if(old?.status==='Paid')throw Error('Тўланган маошни қайта ҳисоблаб бўлмайди.');
    const start=period+'-01',end=new Date(Date.UTC(Number(period.slice(0,4)),Number(period.slice(5,7)),1)).toISOString().slice(0,10),groups=P.groups.filter(g=>g.teacherId===teacherId&&g.startDate<end&&(!g.endDate||g.endDate>=start)),fallback=schemes.find(s=>!s.groupId),parts=[],studentIds=new Set(),lessonIds=new Set();let usesDefault=groups.length===0;
    for(const g of groups){const scheme=schemes.find(s=>s.groupId===g.id)||fallback;if(!scheme)throw Error('Бу гуруҳ учун маош схемаси белгиланмаган.');usesDefault ||= scheme===fallback;
      const all=B.lessons.filter(l=>l.teacherId===teacherId&&l.groupId===g.id&&l.status==='Completed'&&l.date>=start&&l.date<end),lessons=all.filter(l=>!scheme.requireAttendanceMarked||l.attendance.length),payments=B.payments.filter(p=>p.groupId===g.id&&p.billingPeriod===period),students=B.enrollments.filter(e=>e.groupId===g.id&&e.joinedDate<end&&(!e.leftDate||e.leftDate>=start)&&!['Trial','Frozen'].includes(e.status)&&(!scheme.onlyPaidStudents||payments.some(p=>p.studentId===e.studentId))&&(!scheme.requireAttendanceMarked||all.some(l=>l.attendance.some(a=>a.studentId===e.studentId))));
      students.forEach(e=>studentIds.add(e.studentId));lessons.forEach(l=>lessonIds.add(l.id));const revenue=scheme.onlyPaidStudents?payments.filter(p=>students.some(e=>e.studentId===p.studentId)).reduce((n,p)=>n+p.amount,0):students.reduce((n,e)=>n+(e.customPrice??g.price),0);
      const amount=scheme.type==='PercentageOfRevenue'?revenue*scheme.rate/100:scheme.type==='FixedPerStudent'?students.length*scheme.rate:scheme.type==='PerLessonRate'?lessons.length*scheme.rate:scheme.groupId?scheme.rate:0;parts.push({groupId:g.id,scheme:scheme.type,amount:round(amount),revenue,students:students.length,lessons:lessons.length});
    }
    if(usesDefault&&fallback?.type==='FixedMonthlySalary')parts.push({groupId:null,scheme:fallback.type,amount:fallback.rate,revenue:0,students:0,lessons:0});
    const base=round(parts.reduce((n,p)=>n+p.amount,0));if(bonus<0||deduction<0||deduction>base+bonus)throw Error('Ушланма ҳисобланган маош ва бонусдан ошмаслиги керак.');const result={id:old?.id||uid(),teacherId,teacher:P.staff.find(s=>s.id===teacherId)?.name,period,parts,base,bonus,deduction,lessons:lessonIds.size,students:studentIds.size,status:'Pending'};if(old)Object.assign(old,result);else B.calculations.push(result);return result;
  };
  P.staff.filter(s=>s.role==='Teacher').forEach((s,i)=>{const p=B.calculate({teacherId:s.id,period:'2026-10',bonus:i===0?300000:0});p.status=i===0?'Approved':i===2?'Paid':'Pending';});
  const domains={branches:['view','create','update','delete'],rooms:['view','create','update','delete'],staff:['view','create','update','delete','roles_manage'],courses:['view','create','update','delete'],leads:['view','create','update','delete','convert'],groups:['view','create','update','delete'],students:['view','create','update','delete','freeze'],attendance:['view','mark','cancel_lesson','grade'],finance:['view','payment_create','expense_create','refund','cash_account_manage','run_billing_job'],payroll:['view','calculate','approve','pay'],gamification:['view','coins_issue','items_manage','orders_manage','purchase'],notifications:['view','send_sms','template_manage']};
  B.permissionGroups=domains;B.permissions=Object.entries(domains).flatMap(([d,a])=>a.map(v=>d+'.'+v));
  // Match the checked-in DbSeeder defaults; roles can be configured separately.
  B.roles={Owner:new Set(B.permissions),Administrator:new Set(B.permissions),Teacher:new Set(['attendance.view','attendance.mark','attendance.grade','groups.view','students.view']),Cashier:new Set(['finance.view','finance.payment_create','finance.expense_create','students.view'])};
  B.can=permission=>!permission||B.roles[B.role]?.has(permission);
  B.routePermission={['/leads']:'leads.view',['/students']:'students.view',['/students/zu-0248']:'students.view',['/courses']:'courses.view',['/courses/ielts-foundation']:'courses.view',['/groups']:'groups.view',['/groups/if-09']:'groups.view',['/schedule']:'groups.view',['/attendance']:'attendance.view',['/finance']:'finance.view',['/expenses']:'finance.view',['/payroll']:'payroll.view',['/staff']:'staff.view',['/branches']:'branches.view',['/market']:'gamification.view',['/coins']:'gamification.view',['/sms']:'notifications.view',['/settings/roles']:'staff.roles_manage',['/reports']:'finance.view'};
  B.refresh();
})();
