(() => {
  const Z=window.Zucco,B=Z.business,P=Z.platform,S=Z.state;
  Object.assign(Z.routeTitles,{
    [Z.ROUTES.DASHBOARD]:['Иш майдони','Марказ фаолияти'],[Z.ROUTES.LEADS]:['Қабул','Лидлар'],[Z.ROUTES.STUDENT]:['Талабалар','Талаба профили'],[Z.ROUTES.COURSE]:['Курслар','Курс маълумотлари'],[Z.ROUTES.GROUP]:['Гуруҳлар','Гуруҳ маълумотлари']
  });
  const leadsNav=Z.navigation.find(n=>n.route===Z.ROUTES.LEADS);if(leadsNav)leadsNav.count=()=>S.leads.filter(l=>l.status==='Active'&&(S.branch==='All branches'||l.branch===S.branch)).length;
  B.actionPermission['b-unfreeze']='students.freeze';
  const originalRender=Z.render;
  Z.render=()=>{
    originalRender();
    if(!B.can(B.routePermission[S.page]))document.getElementById('main').innerHTML=`<div class="permission-denied">${Z.icon('shield')}<h1>Бу бўлимга кириш ҳуқуқи йўқ</h1><p>Марказ раҳбарига мурожаат қилинг ёки макетда бошқа ролни танланг.</p></div>`;
    document.querySelectorAll('.nav-link[data-action^="go:"]').forEach(el=>{const route=el.dataset.action.slice(3);if(!B.can(B.routePermission[route]))el.style.display='none';});
    document.querySelectorAll('.navigation').forEach(nav=>{if([...nav.children].every(el=>el.style.display==='none')){nav.style.display='none';if(nav.previousElementSibling?.classList.contains('nav-group-label'))nav.previousElementSibling.style.display='none';}});
    document.querySelectorAll('[data-action]').forEach(el=>{const action=el.dataset.action.split(':')[0],permission=B.actionPermission[action];if(permission&&!B.can(permission)){el.disabled=true;el.setAttribute('title','Бу амал учун рухсат берилмаган');}});
    const header=document.querySelector('.topbar');if(header){const control=document.createElement('label');control.className='role-preview';control.innerHTML=`<span>Кўриниш роли</span><select class="select" data-role-preview aria-label="Макетда кўриш роли">${Object.keys(B.roles).map(r=>`<option value="${r}" ${r===B.role?'selected':''}>${Z.t(r)}</option>`).join('')}</select>`;header.insertBefore(control,header.querySelector('.top-divider'));}
    Z.localize();
    const roleLabel=document.querySelector('.sidebar-bottom .tiny');if(roleLabel)roleLabel.textContent=Z.t(B.role);
    const actor=P.staff.find(s=>s.id===({Teacher:'u2',Cashier:'u8',Administrator:'u7',Owner:'u1'})[B.role]);if(actor){const label=document.querySelector('.sidebar-bottom .truncate');if(label)label.textContent=Z.t(actor.name);for(const avatar of document.querySelectorAll('.sidebar-bottom>.avatar,.topbar>.avatar'))avatar.outerHTML=Z.avatar(actor.name);}
  };
  for(const fn of ['actionDialog','toast','command']){const original=Z[fn];Z[fn]=(...args)=>{const result=original(...args);Z.localize();return result;};}
  const originalMatch=Z.ui.match;
  Z.ui.match=(id,...values)=>originalMatch(id,...values,...values.map(v=>Z.t(v)));
  // Direct list and dialog updates also pass through presentation localization.
  let scheduled=false;const observer=new MutationObserver(()=>{if(scheduled)return;scheduled=true;queueMicrotask(()=>{observer.disconnect();Z.localize();scheduled=false;observer.observe(document.body,{childList:true,subtree:true});});});
  observer.observe(document.body,{childList:true,subtree:true});
  const navigate=Z.navigate;Z.navigate=route=>{if(!B.can(B.routePermission[route])){Z.toast('Бу бўлим учун рухсат берилмаган.');return;}navigate(route);};
  Z.render();
  const view=new URLSearchParams(location.search).get('view');if(view)B.openPreview(view);
})();
