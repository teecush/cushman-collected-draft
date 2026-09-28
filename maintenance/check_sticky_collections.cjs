const {chromium,devices}=require('playwright');
const fs=require('fs');
const path=require('path');
const siteBase=process.env.SITE_BASE||'http://127.0.0.1:8788/website/';
const screenshots=path.resolve(__dirname,'../../reports/collection_sticky_2026-09-28');
const routes=[
  ['#collection:musicals','Musicals'],
  ['#collection:profiles','Artist Profiles'],
  ['#collection:sondheim','Sondheim'],
  ['#collection:stoppard','Stoppard'],
  ['#collection:playwright-george-bernard-shaw','Shaw playwright'],
  ['#collection:stratford','Stratford'],
  ['#collection:shaw','Shaw Festival'],
  ['#collection:recent','Recent'],
  ['#section:shakespeare','Shakespeare'],
  ['#section:collections','Collections directory'],
];

(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
  fs.mkdirSync(screenshots,{recursive:true});
  try{
    for(const [device,options] of [['desktop',{viewport:{width:1440,height:900}}],['phone',devices['iPhone 13']]]){
      const page=await browser.newPage(options);
      for(const [hash,label] of routes){
        await page.goto(siteBase+hash,{waitUntil:'domcontentloaded'});
        await page.locator('#indexView.collection-page .catalog-tabs').waitFor();
        await page.waitForTimeout(150);
        await page.evaluate(()=>window.scrollTo(0,Math.min(450,document.documentElement.scrollHeight-window.innerHeight-90)));
        await page.waitForTimeout(150);
        const result=await page.evaluate(()=>{
          const header=document.querySelector('.site-header').getBoundingClientRect();
          const root=document.querySelector('#indexView');
          const title=(root.querySelector('.festival-title-group')||root.querySelector('#indexContent>h1')).getBoundingClientRect();
          const nav=root.querySelector('.catalog-tabs').getBoundingClientRect();
          const alphabet=root.querySelector('.profiles-alphabet')?.getBoundingClientRect();
          const yearElement=root.querySelector('.festival-year');
          const year=yearElement?.getBoundingClientRect();
          return {scrollY:window.scrollY,headerBottom:header.bottom,titleTop:title.top,titleBottom:title.bottom,navTop:nav.top,navBottom:nav.bottom,alphabetTop:alphabet?.top,yearTop:getComputedStyle(yearElement||root).position==='sticky'?year?.top:null,viewport:document.documentElement.clientWidth,documentWidth:document.documentElement.scrollWidth};
        });
        if(result.scrollY<200)throw Error(`${device} ${label}: page did not scroll far enough: ${JSON.stringify(result)}`);
        if(Math.abs(result.titleTop-result.headerBottom)>4)throw Error(`${device} ${label}: title is not below header: ${JSON.stringify(result)}`);
        if(Math.abs(result.navTop-result.titleBottom)>5)throw Error(`${device} ${label}: tabs are not below title: ${JSON.stringify(result)}`);
        if(result.alphabetTop!=null&&result.alphabetTop<result.navBottom-4)throw Error(`${device} ${label}: alphabet overlaps tabs: ${JSON.stringify(result)}`);
        if(result.yearTop!=null&&result.yearTop<result.navBottom-4)throw Error(`${device} ${label}: year selector overlaps tabs: ${JSON.stringify(result)}`);
        if(result.documentWidth>result.viewport+1)throw Error(`${device} ${label}: horizontal overflow: ${JSON.stringify(result)}`);
        if((device==='phone'&&['Musicals','Stratford'].includes(label))||(device==='desktop'&&label==='Shaw playwright')){
          await page.screenshot({path:path.join(screenshots,`${device}-${label.toLowerCase().replace(/\s+/g,'-')}.png`)});
        }
      }
      await page.close();
    }
    console.log(`PASS: sticky collection titles, tabs and controls on desktop and phone across ${routes.length} collection routes.`);
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
