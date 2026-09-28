const {chromium,devices}=require('playwright');
const fs=require('fs');
const path=require('path');
const siteBase=process.env.SITE_BASE||'http://127.0.0.1:8788/website/';

(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
  const out=path.resolve(__dirname,'../../reports/playwright_mosaic_2026-09-27');
  const errors=[];
  try{
    const desktop=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
    desktop.on('pageerror',error=>errors.push(error.message));
    await desktop.goto(siteBase,{waitUntil:'domcontentloaded'});
    await desktop.locator('#homePlaywrights .playwright-figure').first().waitFor();
    if(await desktop.locator('#homePlaywrights .playwright-figure').count()!==15)throw Error('Expected fifteen playwright figures');
    if(await desktop.locator('#homePlaywrights .playwright-contours path').count()!==15)throw Error('Expected fifteen individual outlines');
    if(await desktop.locator('#homePlaywrights .playwright-stage-hint, #homePlaywrights .playwright-stage-credits').count())throw Error('Instructions or credits still visible below the group');
    await desktop.locator('#homePlaywrights').screenshot({path:path.join(out,'site-stage-desktop.png')});
    const headHits=await desktop.evaluate(()=>{
      const stage=document.querySelector('.playwright-stage-image');
      window.scrollTo(0,window.scrollY+stage.getBoundingClientRect().top-180);
      return [...stage.querySelectorAll('.playwright-figure')].map(link=>{
        const box=link.getBoundingClientRect();
        const hit=document.elementFromPoint(box.left+box.width*.5,box.top+box.height*.05);
        return {person:link.getAttribute('aria-label'),hit:hit?.closest('.playwright-figure')?.getAttribute('aria-label')};
      });
    });
    const missed=headHits.filter(entry=>entry.person!==entry.hit);
    if(missed.length)throw Error('Unreachable heads: '+JSON.stringify(missed));
    const shaw=desktop.locator('.playwright-figure[aria-label="Open the George Bernard Shaw collection"]');
    const shawBox=await shaw.boundingBox();
    const shawHead={x:shawBox.width*.45,y:shawBox.height*.12};
    await shaw.hover({position:shawHead});
    if(await desktop.locator('.playwright-contours path.is-active').getAttribute('data-index')!=='1')throw Error('Desktop hover did not highlight Shaw');
    await desktop.locator('#homePlaywrights').screenshot({path:path.join(out,'site-stage-hover.png')});
    if(await shaw.locator('.playwright-figure-name').textContent()!=='Shaw')throw Error('Shaw surname missing');
    await shaw.click({position:shawHead});
    await desktop.locator('.playwright-collection-hero').waitFor();
    if(!desktop.url().includes('#collection:playwright-george-bernard-shaw'))throw Error('Shaw route failed');
    const hero=desktop.locator('.playwright-collection-hero');
    if(await hero.locator('h2').textContent()!=='George Bernard Shaw')throw Error('Full playwright name missing from the portrait card');
    if(!/\d+ works · \d+ articles/.test(await hero.locator('.playwright-collection-count').textContent()))throw Error('Work and article counts missing');
    if(await hero.locator('.playwright-collection-intro,.playwright-collection-credit').count())throw Error('Intro or portrait credits still visible in the portrait card');
    if(await desktop.locator('.collection-gallery.playwright .collection-item').count()<15)throw Error('Shaw gallery incomplete');
    await desktop.locator('#indexView').screenshot({path:path.join(out,'site-shaw-collection-desktop.png')});
    await desktop.locator('.collection-item').filter({hasText:'Pygmalion'}).first().click();
    if(!desktop.url().includes('shelf=playwright-george-bernard-shaw')||!desktop.url().includes('item=pygmalion'))throw Error('Filtered work link failed');
    const mobile=await browser.newPage({...devices['iPhone 13'],browserName:undefined});
    mobile.on('pageerror',error=>errors.push(error.message));
    await mobile.goto(siteBase,{waitUntil:'domcontentloaded'});
    await mobile.locator('#homePlaywrights .playwright-figure').first().waitFor();
    const crop=await mobile.evaluate(()=>{
      const stage=document.querySelector('.playwright-stage-image');
      const sourceWidth=1774, sourceLeft=133, sourceRight=1454;
      const view=stage.querySelector('.playwright-contours').viewBox.baseVal;
      return {left:(sourceLeft-view.x)/view.width,right:(view.x+view.width-sourceRight)/view.width};
    });
    if(Math.abs(crop.left-crop.right)>.01)throw Error('The outer figures are not centred in the crop: '+JSON.stringify(crop));
    for(const width of [320,375,390]){
      await mobile.setViewportSize({width,height:844});
      const mobileWidth=await mobile.evaluate(()=>{
        const frame=document.querySelector('.playwright-stage-scroll');
        return {client:frame.clientWidth,content:frame.scrollWidth,viewport:document.documentElement.clientWidth};
      });
      if(mobileWidth.content>mobileWidth.client+1 || mobileWidth.client>mobileWidth.viewport)throw Error('Mobile group needs sideways scrolling at '+width+'px: '+JSON.stringify(mobileWidth));
    }
    await mobile.locator('#homePlaywrights').screenshot({path:path.join(out,'site-stage-mobile.png')});
    await mobile.evaluate(()=>window.scrollTo(0,window.scrollY+document.querySelector('#homePlaywrights').getBoundingClientRect().top-100));
    await mobile.screenshot({path:path.join(out,'site-stage-mobile-viewport.png')});
    const figure=mobile.locator('.playwright-figure[aria-label="Open the William Shakespeare collection"]');
    await figure.tap();
    if(!(await figure.getAttribute('class')).includes('is-selected'))throw Error('Mobile first tap did not reveal name');
    if(await mobile.locator('.playwright-contours path.is-active').getAttribute('data-index')!=='0')throw Error('Mobile first tap did not highlight Shakespeare');
    await mobile.waitForTimeout(220);
    await mobile.screenshot({path:path.join(out,'site-stage-mobile-selected.png')});
    await figure.tap();
    if(!mobile.url().includes('#section:shakespeare'))throw Error('Mobile second tap did not navigate');
    await mobile.setViewportSize({width:320,height:700});
    await mobile.goto(siteBase+'#collection:playwright-george-bernard-shaw',{waitUntil:'domcontentloaded'});
    await mobile.locator('.playwright-collection-hero').waitFor();
    await mobile.locator('.playwright-collection-hero').screenshot({path:path.join(out,'site-shaw-collection-mobile.png')});
    if(await mobile.locator('.playwright-collection-hero h2').textContent()!=='George Bernard Shaw')throw Error('Mobile portrait card lost the full name');
    if(errors.length)throw Error('Browser errors: '+errors.join(' | '));
    console.log('Browser checks passed: desktop hover, 15 links, Shaw page, mobile two-tap.');
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
