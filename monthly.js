(function(){
 const KEY='dividas-organizadas-v1';
 const names=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
 const brl=n=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(n)||0);
 function load(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return []}}
 function save(data){localStorage.setItem(KEY,JSON.stringify(data))}
 function paid(d){return (d.payments||[]).reduce((s,p)=>s+(Number(p.amount)||0),0)}
 function balance(d){return Math.max(0,Number(d.amount)-paid(d))}
 function refresh(){if(typeof window.refreshDebtApp==='function')window.refreshDebtApp()}
 function paint(){
  const root=document.getElementById('debtList'); if(!root)return;
  const data=load(); const cards=root.querySelectorAll('.debt');
  cards.forEach(card=>{
   if(card.querySelector('.monthly-box'))return;
   const d=data.find(item=>item.id===card.dataset.debtId); if(!d)return;
   if(!d.monthsPaid)d.monthsPaid={};
   const box=document.createElement('div');box.className='monthly-box';
   box.style.cssText='margin-top:12px;padding:12px;border:1px solid #273750;border-radius:12px;background:#0d1728';
   const title=document.createElement('strong');title.textContent='📅 Parcelas por mês';title.style.cssText='display:block;margin-bottom:5px;font-size:14px';box.append(title);
   const hint=document.createElement('div');hint.textContent='Marque um mês para abater uma parcela do saldo. Desmarcar desfaz esse abatimento mensal.';hint.style.cssText='font-size:12px;color:#9eafc7;line-height:1.4;margin-bottom:10px';box.append(hint);
   const grid=document.createElement('div');grid.style.cssText='display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px';
   names.forEach((month,i)=>{
    const label=document.createElement('label');label.style.cssText='display:flex;align-items:center;gap:6px;padding:8px 5px;border:1px solid #30415c;border-radius:8px;font-size:12px;min-width:0;cursor:pointer';
    const cb=document.createElement('input');cb.type='checkbox';cb.checked=!!d.monthsPaid[i];cb.style.cssText='width:16px;height:16px;accent-color:#44d7a8;flex-shrink:0';
    const txt=document.createElement('span');txt.textContent=month;label.append(cb,txt);
    cb.addEventListener('change',()=>{
     const current=load();const target=current.find(x=>x.id===d.id);if(!target)return;
     if(!target.monthsPaid)target.monthsPaid={};
     if(!Array.isArray(target.payments))target.payments=[];
     const paymentId='monthly-installment-'+i;
     const existing=target.payments.find(p=>p.id===paymentId);
     if(cb.checked){
      if(!existing){
       const count=Math.max(1,Math.floor(Number(target.installments)||1));
       const installment=i===count-1?Number(target.amount)-(Number(target.amount)/count)*(count-1):Number(target.amount)/count;
       const value=Math.round(installment*100)/100;
       if(value>balance(target)+0.001){alert('O saldo restante ('+brl(balance(target))+') é menor que o valor desta parcela ('+brl(value)+').');cb.checked=false;return;}
       target.payments.push({id:paymentId,amount:value,date:new Date().toISOString().slice(0,10),note:'Parcela de '+month+' marcada como paga',source:'monthly',monthIndex:i});
      }
      target.monthsPaid[i]=true;
     }else{
      if(existing)target.payments=target.payments.filter(p=>p.id!==paymentId);
      target.monthsPaid[i]=false;
     }
     save(current);
     refresh();
    });
    if(cb.checked){label.style.background='#123a34';label.style.borderColor='#44d7a8'}
    grid.append(label);
   });
   box.append(grid);
   const summary=document.createElement('div');summary.style.cssText='font-size:12px;color:#9eafc7;margin-top:9px';
   const count=Object.values(d.monthsPaid).filter(Boolean).length;
   summary.textContent=count+' de 12 meses selecionados · Valor estimado por parcela: '+brl(Number(d.amount)/Math.max(1,Math.floor(Number(d.installments)||1)));
   box.append(summary);card.append(box);
  });
 }
 const observer=new MutationObserver(()=>paint());
 window.addEventListener('load',()=>{paint();const root=document.getElementById('debtList');if(root)observer.observe(root,{childList:true,subtree:true})});
 })();