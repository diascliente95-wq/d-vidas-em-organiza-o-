(function(){
 const KEY='dividas-organizadas-v1';
 const names=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
 function load(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return []}}
 function save(data){localStorage.setItem(KEY,JSON.stringify(data))}
 function paint(){
  const root=document.getElementById('debtList'); if(!root)return;
  const data=load(); const cards=root.querySelectorAll('.debt');
  cards.forEach((card,index)=>{
   if(card.querySelector('.monthly-box'))return;
   const d=data[index]; if(!d)return;
   if(!d.monthsPaid)d.monthsPaid={};
   const box=document.createElement('div');box.className='monthly-box';
   box.style.cssText='margin-top:12px;padding:12px;border:1px solid #273750;border-radius:12px;background:#0d1728';
   const title=document.createElement('strong');title.textContent='📅 Parcelas por mês';title.style.cssText='display:block;margin-bottom:10px;font-size:14px';box.append(title);
   const grid=document.createElement('div');grid.style.cssText='display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px';
   names.forEach((month,i)=>{
    const label=document.createElement('label');label.style.cssText='display:flex;align-items:center;gap:6px;padding:8px 5px;border:1px solid #30415c;border-radius:8px;font-size:12px;min-width:0;cursor:pointer';
    const cb=document.createElement('input');cb.type='checkbox';cb.checked=!!d.monthsPaid[i];cb.style.cssText='width:16px;height:16px;accent-color:#44d7a8;flex-shrink:0';
    const txt=document.createElement('span');txt.textContent=month;label.append(cb,txt);
    cb.addEventListener('change',()=>{
     const current=load();const target=current.find(x=>x.id===d.id);if(!target)return;
     if(!target.monthsPaid)target.monthsPaid={};target.monthsPaid[i]=cb.checked;save(current);
     label.style.background=cb.checked?'#123a34':'transparent';
     label.style.borderColor=cb.checked?'#44d7a8':'#30415c';
     const count=Object.values(target.monthsPaid).filter(Boolean).length;
     summary.textContent=count+' de 12 meses selecionados';
    });
    if(cb.checked){label.style.background='#123a34';label.style.borderColor='#44d7a8'}
    grid.append(label);
   });
   box.append(grid);
   const summary=document.createElement('div');summary.style.cssText='font-size:12px;color:#9eafc7;margin-top:9px';
   summary.textContent=Object.values(d.monthsPaid).filter(Boolean).length+' de 12 meses selecionados';
   box.append(summary);card.append(box);
  });
 }
 const observer=new MutationObserver(()=>paint());
 window.addEventListener('load',()=>{paint();const root=document.getElementById('debtList');if(root)observer.observe(root,{childList:true,subtree:true})});
 })();