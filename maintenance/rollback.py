#!/usr/bin/env python3
"""Prepare a reversible site rollback. Never pushes or rewrites Git history."""
import argparse, re, subprocess
from pathlib import Path
SITE=Path(__file__).resolve().parents[1]
FEATURES=('simplifiedNavigation','compactResults','collapsedMetadata','redesignedHome')
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--feature',choices=FEATURES)
p.add_argument('--value',choices=('on','off'))
p.add_argument('--restore',choices=('pre-redesign','previous-public'))
a=p.parse_args()
if a.feature:
    if not a.value:p.error('--feature requires --value on or off')
    path=SITE/'website/features.js';text=path.read_text()
    text,count=re.subn(r'('+re.escape(a.feature)+r':\s*)(true|false)',lambda m:m[1]+('true' if a.value=='on' else 'false'),text)
    if count!=1:raise SystemExit('Feature configuration did not match; no changes written.')
    path.write_text(text)
    print(f'{a.feature}: {a.value}. Review locally, then commit and push to publish.')
elif a.restore:
    status=subprocess.check_output(['git','status','--porcelain'],cwd=SITE,text=True)
    if status.strip():raise SystemExit('Save or commit current local changes before restoring. Nothing changed.')
    tag='site-audit-baseline-20260909' if a.restore=='pre-redesign' else 'public-before-site-audit-20260909'
    subprocess.run(['git','restore','--source',tag,'--staged','--worktree','.'],cwd=SITE,check=True)
    print(f'Restored the tracked site files from {tag}. Inspect git diff --cached, then commit and push. History is preserved.')
else:
    print('Presentation switches: '+', '.join(FEATURES))
    print('Example: python3 maintenance/rollback.py --feature compactResults --value off')
    print('Full restore: --restore pre-redesign (includes saved unpublished work) or --restore previous-public')
    print('This script never pushes or rewrites history.')
