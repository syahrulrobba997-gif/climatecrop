import json, re

# 1. Validate JSON
with open('data/productivity.json', encoding='utf-8') as f:
    data = json.load(f)
print(f'[OK] productivity.json: {len(data)} provinces')

# 2. Check all required keys
required = ['id','name','temp','rain','humid','risk','cat','padi','jagung','kedelai']
errors = []
for p in data:
    missing = [k for k in required if k not in p]
    if missing:
        errors.append(f"  {p['name']} missing: {missing}")
if errors:
    print('[ERR] Missing keys:\n' + '\n'.join(errors))
else:
    print('[OK] All JSON province keys validated')

# 3. Check app.js for stale key names
with open('js/app.js', encoding='utf-8') as f:
    app = f.read()
bad_keys = ['drought_risk', 'temperature', 'rainfall', 'humidity', 'climate_category']
for b in bad_keys:
    status = '[ERR]' if b in app else '[OK]'
    print(f'{status} stale key "{b}" in app.js: {"FOUND" if b in app else "not found"}')

# 4. Check required IDs exist in HTML
with open('index.html', encoding='utf-8') as f:
    html = f.read()
critical_ids = [
    'navbar', 'hamburger', 'nav-links',
    'svg-map-target', 'map-tooltip',
    'province-select', 'land-area', 'planting-month',
    'analysis-mode', 'cond-crop', 'specific-crop-select',
    'analysis-form',
    'ci-temp', 'ci-rain', 'ci-humid', 'ci-risk', 'ci-cat',
    'res-placeholder', 'res-skeleton', 'res-output',
    'results-panel', 'res-crop-name', 'res-score-val',
    'res-yield-ha', 'res-yield-total', 'res-risk', 'res-time', 'res-advice',
    'radar-chart',
    'bar-climate-fill', 'bar-climate-val',
    'bar-water-fill', 'bar-water-val',
    'bar-land-fill', 'bar-land-val',
    'bar-prod-fill', 'bar-prod-val',
    'hist-search', 'hist-filter', 'hist-body',
    'btn-export-csv', 'btn-export-pdf', 'btn-clear-hist',
]
html_ids = set(re.findall(r'id="([^"]+)"', html))
missing_ids = [i for i in critical_ids if i not in html_ids]
if missing_ids:
    print(f'[ERR] Missing HTML IDs: {missing_ids}')
else:
    print(f'[OK] All {len(critical_ids)} critical IDs found in HTML')

print('\nValidation complete.')
