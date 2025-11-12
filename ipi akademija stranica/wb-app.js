(function(){
  const canvas=document.getElementById('board'); if(!canvas) return; const ctx=canvas.getContext('2d');
  const colorPicker=document.getElementById('colorPicker');
  const brushSize=document.getElementById('brushSize');
  const clearBtn=document.getElementById('clearBtn');
  const saveBtn=document.getElementById('saveBtn');
  const eraserBtn=document.getElementById('eraserBtn');

  let drawing=false; let currentColor=colorPicker.value; let isErasing=false;

  function startDraw(e){ drawing=true; draw(e); }
  function endDraw(){ drawing=false; ctx.beginPath(); }
  function getXY(e){ const rect=canvas.getBoundingClientRect(); const scaleX=canvas.width/rect.width; const scaleY=canvas.height/rect.height; const clientX=(e.clientX??(e.touches&&e.touches[0].clientX)); const clientY=(e.clientY??(e.touches&&e.touches[0].clientY)); return { x:(clientX-rect.left)*scaleX, y:(clientY-rect.top)*scaleY }; }
  function draw(e){ if(!drawing) return; const {x,y}=getXY(e); ctx.lineWidth=brushSize.value; ctx.lineCap='round'; ctx.strokeStyle=isErasing? '#FFFFFF' : currentColor; ctx.lineTo(x,y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x,y); }

  // Mouse
  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mouseup', endDraw);
  canvas.addEventListener('mousemove', draw);
  // Touch
  canvas.addEventListener('touchstart', startDraw);
  canvas.addEventListener('touchmove', (e)=>{ draw(e); e.preventDefault();});
  canvas.addEventListener('touchend', endDraw);

  colorPicker.addEventListener('input', ()=>{ currentColor=colorPicker.value; isErasing=false; });
  eraserBtn.addEventListener('click', ()=>{ isErasing=!isErasing; eraserBtn.textContent=isErasing? 'Crtaj':'Briši'; });
  clearBtn.addEventListener('click', ()=>{ ctx.clearRect(0,0,canvas.width,canvas.height); });
  saveBtn.addEventListener('click', ()=>{ const image=canvas.toDataURL('image/png'); const a=document.createElement('a'); a.href=image; a.download='moj_crtez.png'; a.click(); });

  // IPI logo on initial load at 50% opacity
  function loadDefaultLogo(){
    const sources = [
      'slike/logo-ipi-square.png',
      '../whiteboard/slike/logo-ipi-square.png',
      'slike/logo-ipi.png'
    ];
    let idx = 0;
    const img = new Image();
    const tryNext = ()=>{
      if(idx >= sources.length) return; img.src = sources[idx++];
    };
    img.onload = ()=>{ const logoWidth=200; const logoHeight=(img.height/img.width)*logoWidth; const x=(canvas.width-logoWidth)/2; const y=(canvas.height-logoHeight)/2; ctx.save(); ctx.globalAlpha=0.5; ctx.drawImage(img,x,y,logoWidth,logoHeight); ctx.restore(); };
    img.onerror = tryNext;
    tryNext();
  }
  loadDefaultLogo();
})();