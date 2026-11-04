(() => {
  const Z=window.Zucco,B=Z.business,H=Z.businessHandlers;
  B.openPreview=view=>{
    const actions={payment:()=>Z.openPayment('s1'),convert:()=>Z.showConversion('lead-2'),lost:()=>B.showLost('lead-2'),enrollment:()=>H['b-student-enroll'](['s1']),freeze:()=>H['b-freeze'](['s1']),billing:()=>B.showBilling(),scheme:()=>B.showScheme(),calculation:()=>B.showCalculation(),expense:()=>B.showExpense(),staff:()=>H['ext-new-staff']([]),sms:()=>H['ext-new-sms']([]),group:()=>H['ext-new-group']([]),teacher:()=>{B.role='Teacher';Z.render();},empty:()=>{Z.platform.filters.students='Топилмайдиган';Z.render();},denied:()=>{B.role='Teacher';Z.state.page=Z.ROUTES.FINANCE;Z.render();},error:()=>{H['ext-redeem'](['m4']);document.querySelector('[data-business-form="purchase"]').requestSubmit();}};
    actions[view]?.();Z.localize?.();
  };
})();
