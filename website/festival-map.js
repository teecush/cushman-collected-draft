// Festival-scoped coordinates prevent identically named theatres in different cities
// from being averaged together. See reports/festival_maps_2026-09-21/sources.json.
export function festivalLocation(festival,venue){
  const name=venue.label.toLowerCase();
  const locations=festival==='shaw'?{
    'festival theatre':[43.252,-79.0677], 'shaw festival theatre':[43.252,-79.0677],
    'court house theatre':[43.2557,-79.0719], 'royal george theatre':[43.2563,-79.0732],
    'studio theatre':[43.252,-79.0677], 'jackie maxwell studio':[43.252,-79.0677], 'jackie maxwell studio theatre':[43.252,-79.0677]
  }:{'festival theatre':[43.3744,-80.9686],'stratford festival theatre':[43.3744,-80.9686],
    'avon theatre':[43.3692,-80.9811],'tom patterson theatre':[43.3736,-80.9781],
    'third stage':[43.3736,-80.9781],'studio theatre':[43.3695,-80.9801],
    'studio annex':[43.3743517,-80.9685714]};
  const position=locations[name];return position?{...venue,lat:position[0],lon:position[1],precision:'venue'}:venue;
}

// Original decorative theatre drawings, shared by map callouts and venue cards.
// These are stylised identifiers, not architectural plans.
export function theatreIllustration(festival,label) {
  const name=label.toLowerCase();
  let building;
  if(name.includes('avon'))building='<path d="M25 77V24h70v53Z" fill="#d7aa94"/><path d="M20 24h80M28 18h64M36 77V57a24 24 0 0 1 48 0v20"/><path d="M45 77V59a15 15 0 0 1 30 0v18" fill="#fff8ea"/><path d="M35 32h10v10H35zm20 0h10v10H55zm20 0h10v10H75z"/>';
  else if(name.includes('tom patterson'))building='<path d="M10 72V43Q44 18 105 34v38Z" fill="#d2ddd6"/><path d="M10 43Q50 28 105 34M20 40v32m14-37v37m15-40v40m15-41v41m15-42v42m15-41v41M10 59h95"/>';
  else if(name.includes('royal george'))building='<path d="M25 77V32L60 10l35 22v45Z" fill="#cad4bd"/><path d="m18 34 42-26 42 26M30 29h60M30 48h60M38 31v14m15-14v14m15-14v14m15-14v14M35 77V55h50v22M45 55v22m15-22v22m15-22v22"/><path d="M51 22h18"/>';
  else if(name.includes('court'))building='<path d="M20 77V35h80v42Z" fill="#eadfc5"/><path d="m14 35 46-23 46 23ZM24 42h72M29 44v29m20-29v29m22-29v29m20-29v29M14 78h92M53 12V5h14v7"/>';
  else if(name.includes('festival')&&festival==='stratford')building='<path d="M10 76V43L32 18l28 25 28-25 22 25v33Z" fill="#d2ddd0"/><path d="m6 44 26-29 28 28 28-28 26 29M18 49v27m18-39v39m16-28v28m16-28v28m16-39v39m18-27v27M10 61h100M32 15V6m56 9V6"/>';
  else if(name.includes('festival'))building='<path d="M10 76V44l28-21 27 21 22-14 23 14v32Z" fill="#e3d2cf"/><path d="m6 45 32-25 27 24 22-17 27 18M15 52h90M20 52v24m16-24v24m16-24v24m16-24v24m16-24v24m16-24v24"/>';
  else if(name.includes('annex'))building='<path d="M22 76V45l34-21 40 21v31Z" fill="#d9d5c4"/><path d="m16 46 40-26 46 26M32 51h18v17H32zm31 25V50h22v26M8 80h104"/>';
  else if(name.includes('studio'))building='<path d="M14 76V39l92-9v46Z" fill="#d1d9d8"/><path d="m8 39 103-10M20 46h80M24 53h26v23H24zm38 0h30v16H62zM75 53v16"/>';
  else building='<path d="M20 76V35L60 18l40 17v41Z" fill="#e2d8bf"/><path d="m15 36 45-21 45 21M30 45h16v17H30zm44 0h16v17H74zM51 76V49h18v27"/>';
  return `<svg viewBox="0 0 120 88" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><g stroke="#3b5558" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" fill="none">${building}<path d="M6 80h108"/></g></svg>`;
}

export function renderFestivalMap(container,venues,festival,href) {
  container.replaceChildren();container.classList.add('festival-fixed-map');
  const base=document.createElement('div');base.className='festival-map-base';container.append(base);
  const map=L.map(base,{dragging:false,touchZoom:false,scrollWheelZoom:false,doubleClickZoom:false,boxZoom:false,keyboard:false,zoomControl:false,zoomSnap:0,attributionControl:true});
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
  const bounds=L.latLngBounds(venues.map(v=>[v.lat,v.lon]));
  const lines=document.createElementNS('http://www.w3.org/2000/svg','svg');lines.classList.add('festival-map-leaders');lines.setAttribute('aria-hidden','true');container.append(lines);
  const ordered=[...venues].sort((a,b)=>b.lat-a.lat||a.lon-b.lon);
  const pins=ordered.map(venue=>{
    const a=document.createElement(venue.count?'a':'div');a.className='festival-map-theatre';
    if(venue.count)a.href=href(venue);else a.classList.add('no-articles');
    a.innerHTML=theatreIllustration(festival,venue.label);
    const count=document.createElement('span');count.className='festival-map-count';count.textContent=venue.count;
    const title=document.createElement('span');title.className='festival-map-name';title.textContent=venue.label+(venue.precision==='city'?' ≈':'');
    a.append(count,title);a.setAttribute('aria-label',`${venue.label}, ${venue.count} ${venue.count===1?'article':'articles'}${venue.precision==='city'?', approximate location':''}`);container.append(a);return {a,venue};
  });
  const layout=()=>{
    const width=container.clientWidth,height=container.clientHeight;
    if(!width||!height)return;
    map.invalidateSize({pan:false});map.fitBounds(bounds,{padding:[65,65],maxZoom:15,animate:false});
    lines.setAttribute('viewBox',`0 0 ${width} ${height}`);lines.replaceChildren();
    // Separate illustrated callouts from exact location dots, including co-located stages.
    const columns=width<550?2:3,rows=Math.ceil(pins.length/columns);
    const slots=pins.map((_,i)=>({x:(i%columns+.5)*width/columns,y:55+Math.floor(i/columns)*(height-135)/Math.max(1,rows-1)}));
    const available=new Set(slots.map((_,i)=>i)),placements=new Map();
    const pairs=pins.flatMap((pin,i)=>{const p=map.latLngToContainerPoint([pin.venue.lat,pin.venue.lon]);return slots.map((s,j)=>({i,j,d:(s.x-p.x)**2+(s.y-p.y)**2}));}).sort((a,b)=>a.d-b.d);
    for(const pair of pairs)if(!placements.has(pair.i)&&available.has(pair.j)){placements.set(pair.i,slots[pair.j]);available.delete(pair.j);}
    pins.forEach(({a,venue},i)=>{
      const {x,y}=placements.get(i);
      a.style.left=x+'px';a.style.top=y+'px';
      const point=map.latLngToContainerPoint([venue.lat,venue.lon]);
      const line=document.createElementNS(lines.namespaceURI,'line');
      for(const [key,value] of Object.entries({x1:x,y1:y+20,x2:point.x,y2:point.y}))line.setAttribute(key,value);
      if(venue.precision==='city')line.setAttribute('stroke-dasharray','3 4');
      const dot=document.createElementNS(lines.namespaceURI,'circle');dot.setAttribute('cx',point.x);dot.setAttribute('cy',point.y);dot.setAttribute('r',4);lines.append(line,dot);
    });
  };
  const observer=new ResizeObserver(layout);observer.observe(container);layout();
  return {remove(){observer.disconnect();map.remove();}};
}
