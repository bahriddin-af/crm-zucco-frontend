const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.ZUCCO_PLAYWRIGHT || 'playwright');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'exports');
async function writeExport(file,data){
  for(let attempt=0;attempt<4;attempt++)try{fs.writeFileSync(file,data);return;}catch(e){if(attempt===3||!['UNKNOWN','EBUSY','EPERM'].includes(e.code))throw e;await new Promise(resolve=>setTimeout(resolve,150*(attempt+1)));}
}
// Export actual visible DOM boxes and text into vector SVG. No UI raster or
// foreignObject is used; Figma imports the resulting text, groups and paths.
async function editableSVG(page, name) {
  const scene = await page.evaluate(() => {
    const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
    const width=innerWidth, height=innerHeight;
    let id=0, textCount=0, rectCount=0, iconCount=0;
    const context=document.createElement('canvas').getContext('2d');
    const paint = color => color && color!=='transparent' && color!=='rgba(0, 0, 0, 0)';
    const n = v => Math.round(v*100)/100;
    const rectangle=(r,fill,radius=0,stroke=null,sw=0)=>{rectCount++;return `<rect x="${n(r.x)}" y="${n(r.y)}" width="${n(r.width)}" height="${n(r.height)}" rx="${n(radius)}" fill="${esc(fill||'none')}"${stroke?` stroke="${esc(stroke)}" stroke-width="${n(sw)}"`:''}/>`;};
    const text=(value,r,s)=>{
      if(!value.trim())return '';
      context.font=`${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
      const metrics=context.measureText(value), ascent=metrics.fontBoundingBoxAscent||parseFloat(s.fontSize)*.8;
      textCount++;
      return `<text x="${n(r.x)}" y="${n(r.y+ascent)}" fill="${esc(s.color)}" font-family="Inter, Arial, sans-serif" font-size="${s.fontSize}" font-weight="${s.fontWeight}" letter-spacing="${s.letterSpacing==='normal'?0:s.letterSpacing}"${s.fontVariantNumeric.includes('tabular-nums')?' style="font-variant-numeric:tabular-nums"':''}>${esc(value)}</text>`;
    };
    function textNode(t,s){
      const raw=t.textContent, first=raw.search(/\S/);if(first<0)return '';
      const end=raw.length-(raw.match(/\s*$/)?.[0].length||0), range=document.createRange();
      range.setStart(t,first);range.setEnd(t,end);
      const rects=[...range.getClientRects()];
      if(rects.length<=1)return text(raw.slice(first,end),range.getBoundingClientRect(),s);
      let lines=[], lastY=null, start=first, bounds=null;
      for(let i=first;i<end;i++){
        range.setStart(t,i);range.setEnd(t,i+1);const r=range.getBoundingClientRect();
        if(lastY!==null&&Math.abs(r.y-lastY)>2){lines.push({value:raw.slice(start,i).trimEnd(),r:bounds});start=i;bounds=r;}
        if(!bounds)bounds=r;lastY=r.y;
      }
      lines.push({value:raw.slice(start,end),r:bounds});return lines.map(l=>text(l.value,l.r,s)).join('');
    }
    function walk(el){
      if(!(el instanceof Element)||['SCRIPT','STYLE','LINK','META'].includes(el.tagName))return '';
      const s=getComputedStyle(el),r=el.getBoundingClientRect();
      if(s.display==='none'||s.visibility==='hidden'||Number(s.opacity)===0||el.classList.contains('sr-only')||el.classList.contains('skip-link')||r.width<=0||r.height<=0||r.bottom<0||r.y>height||r.right<0||r.x>width)return '';
      const label=el.dataset.component||el.id||el.getAttribute('aria-label')||el.className?.baseVal||el.className||el.tagName;
      let content='';
      if(el instanceof SVGElement&&el.tagName.toLowerCase()==='svg'){
        iconCount++;const clone=el.cloneNode(true);clone.setAttribute('x',n(r.x));clone.setAttribute('y',n(r.y));clone.setAttribute('width',n(r.width));clone.setAttribute('height',n(r.height));clone.setAttribute('color',s.color);clone.setAttribute('fill',s.fill);clone.setAttribute('stroke',s.stroke);clone.setAttribute('stroke-width',s.strokeWidth);clone.setAttribute('stroke-linecap',s.strokeLinecap);clone.setAttribute('stroke-linejoin',s.strokeLinejoin);clone.removeAttribute('class');return clone.outerHTML;
      }
      if(paint(s.backgroundColor))content+=rectangle(r,s.backgroundColor,parseFloat(s.borderTopLeftRadius)||0);
      if(el.classList.contains('day-column'))for(let y=48;y<r.height;y+=48)content+=`<path d="M${n(r.x)} ${n(r.y+y)}H${n(r.right)}" stroke="#F0F4F1" stroke-width="1"/>`;
      const borders=['Top','Right','Bottom','Left'].map(side=>({side,width:parseFloat(s['border'+side+'Width']),color:s['border'+side+'Color'],style:s['border'+side+'Style']}));
      if(borders.every(b=>b.width>0&&b.style!=='none'&&b.color===borders[0].color&&b.width===borders[0].width))content+=rectangle({...r,x:r.x+borders[0].width/2,y:r.y+borders[0].width/2,width:r.width-borders[0].width,height:r.height-borders[0].width},'none',parseFloat(s.borderTopLeftRadius)||0,borders[0].color,borders[0].width);
      else for(const b of borders)if(b.width>0&&b.style!=='none'&&paint(b.color)){const coords={Top:[r.x,r.y+b.width/2,r.right,r.y+b.width/2],Bottom:[r.x,r.bottom-b.width/2,r.right,r.bottom-b.width/2],Left:[r.x+b.width/2,r.y,r.x+b.width/2,r.bottom],Right:[r.right-b.width/2,r.y,r.right-b.width/2,r.bottom]}[b.side];content+=`<line x1="${n(coords[0])}" y1="${n(coords[1])}" x2="${n(coords[2])}" y2="${n(coords[3])}" stroke="${esc(b.color)}" stroke-width="${b.width}"${b.style==='dashed'?' stroke-dasharray="3 3"':''}/>`;}
      if(el.matches('input[type=checkbox]')){
        const color=el.checked?(el.disabled?'#92B4A3':'#146B52'):'#FFFFFF';
        content+=rectangle({x:r.x+.5,y:r.y+.5,width:r.width-1,height:r.height-1},color,3,el.checked?color:'#BBDCCB',1);
        if(el.checked)content+=`<path d="M${n(r.x+r.width*.22)} ${n(r.y+r.height*.5)}l${n(r.width*.19)} ${n(r.height*.2)} ${n(r.width*.38)} -${n(r.height*.4)}" fill="none" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`;
      }else if(el.matches('input:not([type=checkbox]),select,textarea')){
        let value=el.matches('select')?el.selectedOptions[0]?.textContent:el.value||el.placeholder;
        if(el.matches('input[type=date]')&&el.value){const[y,m,d]=el.value.split('-');value=`${m}/${d}/${y}`;}
        const size=parseFloat(s.fontSize), inset=parseFloat(s.paddingLeft)+parseFloat(s.borderLeftWidth), valueWidth=context.measureText(value||'').width;
        const tx=s.textAlign==='center'?r.x+(r.width-valueWidth)/2:r.x+inset;
        content+=text(value||'',{x:tx,y:r.y+(r.height-size*1.2)/2},!el.value?{...s,color:'#8B9C91',fontSize:s.fontSize,fontWeight:s.fontWeight,fontFamily:s.fontFamily,letterSpacing:s.letterSpacing,fontVariantNumeric:s.fontVariantNumeric}:s);
        if(el.matches('select'))content+=`<path d="m${n(r.right-15)} ${n(r.y+r.height/2-2)} 4 4 4-4" fill="none" stroke="${s.color}" stroke-width="1.4"/>`;
        if(el.matches('input[type=date]'))content+=`<g transform="translate(${n(r.right-23)} ${n(r.y+r.height/2-6)})" fill="none" stroke="#4D6255" stroke-width="1.1"><rect width="12" height="12" rx="1"/><path d="M0 4H12M3-2V2M9-2V2"/></g>`;
      }else for(const child of el.childNodes)content+=child.nodeType===Node.TEXT_NODE?textNode(child,s):walk(child);
      if(['auto','hidden','scroll','clip'].includes(s.overflowX)||['auto','hidden','scroll','clip'].includes(s.overflowY)){
        const clipId='clip-layer-'+(++id);content=`<defs><clipPath id="${clipId}"><rect x="${n(r.x)}" y="${n(r.y)}" width="${n(r.width)}" height="${n(r.height)}" rx="${n(parseFloat(s.borderTopLeftRadius)||0)}"/></clipPath></defs><g clip-path="url(#${clipId})">${content}</g>`;
      }
      return `<g id="layer-${++id}" data-name="${esc(String(label).slice(0,90))}"${Number(s.opacity)<1?` opacity="${s.opacity}"`:''}>${content}</g>`;
    }
    let content=rectangle({x:0,y:0,width,height},'#F6F8F7');
    content+=walk(document.getElementById('app'));
    for(const modal of document.querySelectorAll('dialog[open]')){
      content+=rectangle({x:0,y:0,width,height},'rgba(30,43,36,0.3)');content+=walk(modal);
    }
    return {content,width,height,textCount,rectCount,iconCount};
  });
  const fonts=[400,500,600,700].map(weight=>`@font-face{font-family:Inter;font-weight:${weight};src:url(data:font/ttf;base64,${fs.readFileSync(path.join(root,'assets',`inter-${weight}.ttf`)).toString('base64')})}`).join('');
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${scene.width}" height="${scene.height}" viewBox="0 0 ${scene.width} ${scene.height}"><title>Zucco — ${name}</title><desc>Editable vector interface: native text, UI groups, geometric shapes and icon paths. All displayed data is sample data.</desc><defs><style>${fonts}</style><clipPath id="viewport"><rect width="${scene.width}" height="${scene.height}"/></clipPath></defs><g clip-path="url(#viewport)">${scene.content}</g></svg>`;
  if(svg.includes('<foreignObject')||svg.includes('<image'))throw new Error('Export must contain editable vectors only');
  return {svg,audit:{textNodes:scene.textCount,rectangles:scene.rectCount,icons:scene.iconCount,editable:true,width:scene.width,height:scene.height}};
}

(async()=>{
  fs.mkdirSync(output,{recursive:true});
  const browser=await chromium.launch({headless:true,executablePath:process.env.ZUCCO_CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    const audits=[];
    const manifest=JSON.parse(fs.readFileSync(path.join(root,'screen-manifest.json'),'utf8'));
    for(const{file:name,route,title,view,height=1000}of manifest){
      await page.setViewportSize({width:1440,height});
      await page.goto(pathToFileURL(path.join(root,'index.html')).href+'?frame='+name+(view?'&view='+view:'')+'#'+route);
      await page.waitForFunction(()=>!!window.Zucco?.business?.openPreview);await page.evaluate(()=>document.fonts.ready);
      const fullHeight=await page.evaluate(()=>Math.max(innerHeight,document.documentElement.scrollHeight));
      if(fullHeight>height)await page.setViewportSize({width:1440,height:fullHeight});
      await writeExport(path.join(output,name+'.png'),await page.screenshot());
      const exported=await editableSVG(page,title);await writeExport(path.join(output,name+'.svg'),exported.svg);
      audits.push({name,title,route,view:view||null,...exported.audit,documentWidth:await page.evaluate(()=>document.documentElement.scrollWidth),documentHeight:await page.evaluate(()=>document.documentElement.scrollHeight)});
    }
    if(errors.length)throw new Error(errors.join('\n'));
    fs.writeFileSync(path.join(output,'export-audit.json'),JSON.stringify({font:'Inter',viewport:'1440px wide; minimum 1000px high',screens:audits,consoleErrors:errors},null,2));
    process.stdout.write(JSON.stringify({screens:audits.length,editable:audits.every(s=>s.editable),width:1440,consoleErrors:errors},null,2)+'\n');
  }finally{await browser.close();}
})().catch(e=>{process.stderr.write(e.stack+'\n');process.exitCode=1;});
