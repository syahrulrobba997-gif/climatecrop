import urllib.request
import xml.etree.ElementTree as ET
import os

url = 'https://raw.githubusercontent.com/junwatu/indonesia-map/master/indonesia.svg'
print("Downloading SVG from:", url)

try:
    response = urllib.request.urlopen(url)
    svg_data = response.read()
    print("Download successful. Size:", len(svg_data))
except Exception as e:
    print("Error downloading SVG:", e)
    exit(1)

# Register namespaces to preserve them
ET.register_namespace('', 'http://www.w3.org/2000/svg')
ET.register_namespace('xlink', 'http://www.w3.org/1999/xlink')

# Parse the SVG XML
root = ET.fromstring(svg_data)
ns = {'svg': 'http://www.w3.org/2000/svg'}

# Map SVG group IDs to our standardized province IDs
# We map regional islands and groups to our 38 provinces
mapping = {
    'Aceh': 'aceh',
    'Sumatera-Utara': 'sumatera-utara',
    'Pulau-Nias': 'sumatera-utara',
    'Sumatera-Barat': 'sumatera-barat',
    'Pulau-Siberut': 'sumatera-barat',
    'Riau': 'riau',
    'Kepulauan-Riau': 'kepulauan-riau',
    'Jambi': 'jambi',
    'Bengkulu': 'bengkulu',
    'Sumatera-Selatan': 'sumatera-selatan',
    'Pulau-Bangka': 'kepulauan-bangka-belitung',
    'Pulau-Belitung': 'kepulauan-bangka-belitung',
    'Lampung': 'lampung',
    'Banten': 'banten',
    'Jawa-Barat': 'jawa-barat',
    'Jawa-Tengah': 'jawa-tengah',
    'Daerah-Istimewa-Yogyakarta': 'di-yogyakarta',
    'Jawa-Timur': 'jawa-timur',
    'Pulau-Madura': 'jawa-timur',
    'Bali': 'bali',
    'Nusa-Tenggara-Barat': 'nusa-tenggara-barat',
    'Pulau-Lombok': 'nusa-tenggara-barat',
    'Nusa-Tenggara-Timur': 'nusa-tenggara-timur',
    'Pu-au-Sumba': 'nusa-tenggara-timur',
    'Pulau-Timor': 'nusa-tenggara-timur',
    'Pulau-Wetar': 'nusa-tenggara-timur',
    'Kalimantan-Barat': 'kalimantan-barat',
    'Kalimantan-Tengah': 'kalimantan-tengah',
    'Kalimantan-Selatan': 'kalimantan-selatan',
    'Kalimantan-Utara---Kalimantan-Timur': 'kalimantan-timur', # maps to east kalimantan by default, can select north
    'Sulawesi-Utara': 'sulawesi-utara',
    'Gorontalo': 'gorontalo',
    'Sulawesi-Tengah': 'sulawesi-tengah',
    'Sulawesi-Barat': 'sulawesi-barat',
    'Sulawesi-Selatan': 'sulawesi-selatan',
    'Sulawesi-Tenggara': 'sulawesi-tenggara',
    'Pulau-Buton': 'sulawesi-tenggara',
    'Pulau-Muna': 'sulawesi-tenggara',
    'Maluku': 'maluku',
    'Pulau-Buru': 'maluku',
    'Maluku-Utara': 'maluku-utara',
    'Papua-Barat': 'papua-barat',
    'Papua': 'papua'
}

# Go through the groups and tag them
groups = root.findall('.//svg:g', ns)
processed_count = 0

for g in groups:
    g_id = g.attrib.get('id')
    if g_id in mapping:
        prov_id = mapping[g_id]
        # Set attributes
        g.set('class', 'province-group')
        g.set('data-province-id', prov_id)
        g.set('cursor', 'pointer')
        processed_count += 1

# Clean up outer wrapper attributes if necessary, e.g. set dynamic responsiveness
root.set('width', '100%')
root.set('height', '100%')
if 'viewBox' not in root.attrib:
    # Set default viewbox based on bounds or standard dimensions if missing, but typical map has it
    root.set('viewBox', '0 0 2000 900')

os.makedirs('data', exist_ok=True)
output_path = 'data/indonesia.svg'
with open(output_path, 'wb') as f:
    f.write(ET.tostring(root, encoding='utf-8'))

print(f"Processed {processed_count} groups. Saved cleaned map to {output_path}")
