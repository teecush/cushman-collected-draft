// Visible contours in the 1774 × 887 group illustration. Each line follows one
// person's actual hair, shoulders and clothing, stopping where another figure
// stands in front. Keeping these in image coordinates lets the stage scale down
// to a phone without substituting a generic silhouette.
const figureContours = [
  'M244 216 C210 216 214 247 218 259 C205 261 207 279 224 292 L229 307 L204 312 Q168 330 155 372 L146 414 Q144 441 170 454 L160 486 L144 565 Q153 582 191 594 L188 671 L178 763 Q170 786 150 794 L135 806 Q129 819 154 823 L211 820 Q226 814 217 802 L219 718 L235 608 L251 611 L258 759 L252 795 Q248 811 262 820 L302 825 Q314 817 306 805 L297 778 L304 699 L310 583 L292 516 L324 435 L346 390 Q350 360 322 335 L290 313 L287 289 Q322 280 326 252 Q321 219 291 218 Q268 205 244 216 Z',
  'M470 280 Q468 248 490 223 Q509 207 531 205 L528 188 Q511 174 516 151 L507 142 Q510 112 541 109 Q561 103 579 113 Q601 126 596 151 Q601 173 588 191 L598 208 Q634 211 659 238 L678 273',
  'M624 266 Q628 237 650 222 L672 215 L667 204 Q651 185 657 170 Q647 161 653 153 Q657 132 686 133 Q692 126 707 134 Q728 138 726 154 Q735 186 719 204 L725 215 Q759 225 777 255 L791 279',
  'M770 273 Q775 240 795 225 L813 213 L810 193 Q798 177 794 158 L800 131 Q808 105 834 111 Q861 101 878 121 Q890 145 884 176 Q883 194 871 208 L876 221 Q923 223 942 262',
  'M945 277 Q954 240 979 223 L1010 214 L1003 193 Q988 174 993 156 Q995 129 1021 125 Q1047 117 1063 132 Q1078 151 1070 180 Q1070 200 1054 212 L1064 225 Q1126 226 1152 279',
  'M380 230 Q349 229 344 249 Q332 251 337 273 Q342 291 354 300 L355 315 Q323 317 301 338 L272 402 L274 439 L289 468 L276 540 L267 684 L259 780 Q251 799 264 826 Q278 846 309 843 L358 834 Q369 826 356 814 L354 766 L378 653 L394 541 L404 589 L400 727 L389 790 Q377 803 388 817 Q401 827 431 824 L460 813 Q469 804 453 795 L452 715 L468 560 L494 449 Q513 407 503 373 Q489 343 462 329 L433 318 L431 296 Q449 279 439 257 Q426 227 401 233 Q392 223 380 230 Z',
  'M836 272 Q807 269 799 289 Q790 307 803 327 L807 344 Q778 355 764 381 L767 424 L784 456 L780 569 L787 735 L790 801 Q786 816 803 824 L844 835 Q868 835 870 819 L866 767 L871 630 L888 773 L879 810 Q877 829 898 837 L931 832 Q947 825 938 813 L922 780 L929 682 L933 550 L943 420 Q942 378 913 355 L875 339 L875 321 Q887 300 875 282 Q861 268 836 272 Z',
  'M961 276 Q938 274 929 294 Q921 314 931 332 L935 347 Q906 357 894 388 L891 453 L909 480 L904 575 L908 718 L910 797 Q901 812 917 826 Q935 837 957 833 L974 824 Q981 814 970 806 L963 749 L966 611 L980 630 L989 793 Q984 807 1003 821 L1027 831 Q1046 828 1044 816 L1029 789 L1030 700 L1032 573 L1046 472 Q1056 425 1046 385 Q1036 361 1004 348 L1000 330 Q1014 315 1003 292 Q991 274 961 276 Z',
  'M1123 278 Q1129 250 1150 230 L1197 218 L1191 201 Q1175 184 1184 163 Q1177 151 1183 141 Q1188 119 1219 126 Q1236 125 1259 126 Q1270 141 1263 150 Q1270 184 1256 203 L1260 221 Q1300 226 1328 270',
  'M1205 267 Q1175 261 1168 288 Q1160 308 1171 329 L1174 346 Q1144 360 1138 394 L1145 447 L1156 485 L1151 584 L1164 724 L1173 799 Q1166 816 1182 826 L1218 830 Q1238 824 1233 813 L1225 781 L1231 639 L1251 777 L1246 811 Q1242 829 1261 839 L1294 837 Q1308 829 1296 813 L1283 783 L1289 632 L1305 490 Q1320 440 1310 393 Q1300 360 1261 348 L1252 329 Q1264 310 1254 289 Q1239 264 1205 267 Z',
  'M1083 270 Q1051 266 1042 288 Q1022 286 1023 310 Q1011 314 1021 335 Q1009 349 1022 367 Q1017 381 1033 394 L1024 412 Q1007 430 1018 470 L1022 532 L1014 631 L1009 734 Q1007 760 1033 770 L1063 746 L1077 690 L1080 774 L1087 824 Q1074 836 1090 849 L1117 853 Q1135 848 1123 831 L1123 789 L1139 682 L1149 746 L1159 807 Q1154 824 1171 832 L1196 824 Q1208 813 1192 804 L1183 778 L1177 687 L1194 579 L1178 493 L1167 437 L1149 399 Q1160 381 1148 371 Q1162 348 1146 337 Q1153 317 1137 307 Q1128 284 1109 286 Q1104 273 1083 270 Z',
  'M1329 269 Q1299 262 1290 287 Q1283 306 1294 328 L1296 348 Q1268 359 1258 393 L1266 453 L1282 477 L1273 585 L1280 727 L1295 798 Q1286 816 1304 829 L1337 837 Q1355 835 1353 821 L1343 795 L1343 650 L1360 785 L1361 812 Q1355 828 1374 836 L1408 837 Q1428 831 1415 813 L1408 780 L1415 630 L1444 489 Q1457 445 1448 391 Q1438 356 1393 345 L1387 326 Q1399 307 1389 285 Q1372 264 1329 269 Z',
  'M469 289 Q440 288 431 313 Q427 331 442 347 L438 362 Q410 368 394 402 L392 466 L398 507 L382 617 L369 743 L373 762 L400 773 L421 762 L427 817 Q417 828 432 837 L455 839 Q474 836 466 821 L469 781 L489 779 L498 823 Q491 838 510 844 L541 846 Q552 836 539 824 L537 774 L555 762 L546 620 L546 491 L550 440 Q552 398 527 374 L505 360 L503 342 Q518 326 507 307 Q496 289 469 289 Z',
  'M584 273 Q552 270 543 296 Q536 318 548 336 L551 352 Q524 362 516 398 L519 461 L537 490 L536 601 L543 727 L547 801 Q539 818 555 831 L579 837 Q595 833 590 821 L580 790 L582 634 L598 648 L611 795 Q608 813 624 827 L651 831 Q668 825 657 811 L648 781 L655 657 L676 485 L676 419 Q670 376 639 356 L621 344 L624 325 Q637 310 624 290 Q608 271 584 273 Z',
  'M705 283 Q677 281 667 307 Q660 327 672 346 L669 363 Q647 371 637 406 L643 469 L658 497 L654 613 L666 745 L671 804 Q664 821 683 834 L707 837 Q726 833 717 818 L709 786 L712 646 L731 780 L733 812 Q731 829 748 836 L780 835 Q797 830 785 812 L776 780 L783 635 L799 480 L800 424 Q794 384 762 365 L745 350 L749 328 Q757 310 742 292 Q729 279 705 283 Z'
];
const stageCrop = {left: 20, width: 1550, height: 887};

// The illustration is a visual doorway; the reviewed-work lists live in the collection data.
export function renderPlaywrightStage(root, data) {
  if (!root || !data?.people?.length) return;
  const el = (tag, cls, label) => {
    const item = document.createElement(tag);
    if (cls) item.className = cls;
    if (label) item.textContent = label;
    return item;
  };
  const heading = el('div', 'browse-heading playwright-stage-heading');
  const title = el('h2', '', 'Playwright Collections');
  title.id = 'playwrightCollectionsTitle';
  heading.append(title);
  const scroll = el('div', 'playwright-stage-scroll');
  const stage = el('div', 'playwright-stage-image');
  const image = el('img');
  image.src = data.image;
  image.alt = 'Illustrated group of fifteen playwrights standing together.';
  image.loading = 'lazy';
  stage.append(image);
  const contours = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  contours.classList.add('playwright-contours');
  contours.setAttribute('viewBox', `${stageCrop.left} 0 ${stageCrop.width} ${stageCrop.height}`);
  contours.setAttribute('aria-hidden', 'true');
  figureContours.forEach((path, index) => {
    const shape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    shape.setAttribute('d', path);
    shape.dataset.index = String(index);
    contours.append(shape);
  });
  stage.append(contours);
  let activeContour = null;
  const highlight = index => {
    activeContour?.classList.remove('is-active');
    activeContour = index == null ? null : contours.children[Number(index)];
    activeContour?.classList.add('is-active');
  };
  let selected = null;
  const pick = link => {
    if (selected && selected !== link) selected.classList.remove('is-selected');
    selected = link;
    link.classList.add('is-selected');
    highlight(link.dataset.index);
  };
  for (const [index, person] of data.people.entries()) {
    const [x, y, width, height] = person.box;
    const [labelX, labelY] = person.label;
    const link = el('a', 'playwright-figure');
    link.dataset.index = String(index);
    link.href = person.href;
    link.setAttribute('aria-label', `Open the ${person.person} collection`);
    link.style.left = `${(x - stageCrop.left) / stageCrop.width * 100}%`;
    link.style.top = `${y / stageCrop.height * 100}%`;
    link.style.width = `${width / stageCrop.width * 100}%`;
    link.style.height = `${height / stageCrop.height * 100}%`;
    const label = el('strong', 'playwright-figure-name', person.surname);
    label.style.left = `${(labelX - x) / width * 100}%`;
    label.style.top = `${(labelY - y) / height * 100}%`;
    link.append(label);
    link.addEventListener('pointerdown', event => { link.dataset.pointerType = event.pointerType; });
    link.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'touch') highlight(link.dataset.index);
    });
    link.addEventListener('pointerleave', () => {
      highlight(selected?.dataset.index);
    });
    link.addEventListener('focus', () => { highlight(link.dataset.index); });
    link.addEventListener('blur', () => { highlight(selected?.dataset.index); });
    link.addEventListener('click', event => {
      if (link.dataset.pointerType === 'touch' && selected !== link) {
        event.preventDefault();
        pick(link);
      }
    });
    stage.append(link);
  }
  scroll.append(stage);
  root.replaceChildren(heading, scroll);
}
