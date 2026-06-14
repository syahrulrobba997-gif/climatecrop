import json
import os

provinces = [
    # Sumatra
    {"id": "aceh", "name": "Aceh", "svg_id": "Aceh", "temp": 27.2, "rain": 195, "humid": 82, "risk": "Sedang", "cat": "Tropis Basah (Am)", "rice": 5.4, "corn": 5.2, "soybean": 1.4},
    {"id": "sumatera-utara", "name": "Sumatera Utara", "svg_id": "Sumatera-Utara", "temp": 26.8, "rain": 220, "humid": 84, "risk": "Rendah", "cat": "Tropis Basah (Af)", "rice": 5.2, "corn": 6.1, "soybean": 1.3},
    {"id": "sumatera-barat", "name": "Sumatera Barat", "svg_id": "Sumatera-Barat", "temp": 26.5, "rain": 280, "humid": 86, "risk": "Rendah", "cat": "Tropis Basah (Af)", "rice": 4.9, "corn": 5.8, "soybean": 1.2},
    {"id": "riau", "name": "Riau", "svg_id": "Riau", "temp": 27.5, "rain": 210, "humid": 83, "risk": "Sedang", "cat": "Tropis Basah (Af)", "rice": 3.8, "corn": 4.1, "soybean": 1.0},
    {"id": "kepulauan-riau", "name": "Kepulauan Riau", "svg_id": "Kepulauan-Riau", "temp": 27.8, "rain": 190, "humid": 82, "risk": "Rendah", "cat": "Tropis Basah (Af)", "rice": 3.2, "corn": 3.5, "soybean": 0.9},
    {"id": "jambi", "name": "Jambi", "svg_id": "Jambi", "temp": 27.0, "rain": 200, "humid": 83, "risk": "Sedang", "cat": "Tropis Basah (Af)", "rice": 4.3, "corn": 4.8, "soybean": 1.1},
    {"id": "bengkulu", "name": "Bengkulu", "svg_id": "Bengkulu", "temp": 26.9, "rain": 240, "humid": 84, "risk": "Rendah", "cat": "Tropis Basah (Af)", "rice": 4.5, "corn": 4.7, "soybean": 1.1},
    {"id": "sumatera-selatan", "name": "Sumatera Selatan", "svg_id": "Sumatera-Selatan", "temp": 27.3, "rain": 180, "humid": 81, "risk": "Sedang", "cat": "Tropis Basah (Am)", "rice": 5.1, "corn": 5.5, "soybean": 1.3},
    {"id": "kepulauan-bangka-belitung", "name": "Kepulauan Bangka Belitung", "svg_id": "Pulau-Bangka", "temp": 27.1, "rain": 185, "humid": 82, "risk": "Sedang", "cat": "Tropis Basah (Am)", "rice": 3.5, "corn": 3.8, "soybean": 0.9},
    {"id": "lampung", "name": "Lampung", "svg_id": "Lampung", "temp": 27.0, "rain": 170, "humid": 80, "risk": "Sedang", "cat": "Tropis Basah (Am)", "rice": 5.3, "corn": 5.9, "soybean": 1.4},
    
    # Jawa
    {"id": "banten", "name": "Banten", "svg_id": "Banten", "temp": 27.4, "rain": 160, "humid": 79, "risk": "Sedang", "cat": "Tropis Muson (Am)", "rice": 5.5, "corn": 4.9, "soybean": 1.3},
    {"id": "dki-jakarta", "name": "DKI Jakarta", "svg_id": "Indonesia-Map", "temp": 28.2, "rain": 140, "humid": 76, "risk": "Tinggi", "cat": "Tropis Muson (Am)", "rice": 4.8, "corn": 3.0, "soybean": 0.8},
    {"id": "jawa-barat", "name": "Jawa Barat", "svg_id": "Jawa-Barat", "temp": 26.3, "rain": 210, "humid": 81, "risk": "Sedang", "cat": "Tropis Basah (Am)", "rice": 5.7, "corn": 5.4, "soybean": 1.5},
    {"id": "jawa-tengah", "name": "Jawa Tengah", "svg_id": "Jawa-Tengah", "temp": 26.8, "rain": 175, "humid": 80, "risk": "Sedang", "cat": "Tropis Muson (Am)", "rice": 5.8, "corn": 5.6, "soybean": 1.4},
    {"id": "di-yogyakarta", "name": "DI Yogyakarta", "svg_id": "Daerah-Istimewa-Yogyakarta", "temp": 26.7, "rain": 150, "humid": 79, "risk": "Tinggi", "cat": "Tropis Muson (Am)", "rice": 5.6, "corn": 5.0, "soybean": 1.3},
    {"id": "jawa-timur", "name": "Jawa Timur", "svg_id": "Jawa-Timur", "temp": 27.1, "rain": 145, "humid": 78, "risk": "Tinggi", "cat": "Tropis Muson (Am)", "rice": 5.9, "corn": 5.7, "soybean": 1.5},
    
    # Nusa Tenggara & Bali
    {"id": "bali", "name": "Bali", "svg_id": "Bali", "temp": 27.2, "rain": 130, "humid": 77, "risk": "Sedang", "cat": "Sabana Tropis (Aw)", "rice": 5.8, "corn": 4.5, "soybean": 1.2},
    {"id": "nusa-tenggara-barat", "name": "Nusa Tenggara Barat (NTB)", "svg_id": "Nusa-Tenggara-Barat", "temp": 27.5, "rain": 110, "humid": 75, "risk": "Tinggi", "cat": "Sabana Tropis (Aw)", "rice": 5.4, "corn": 5.3, "soybean": 1.3},
    {"id": "nusa-tenggara-timur", "name": "Nusa Tenggara Timur (NTT)", "svg_id": "Nusa-Tenggara-Timur", "temp": 27.8, "rain": 90, "humid": 72, "risk": "Tinggi", "cat": "Sabana Tropis (Aw)", "rice": 3.9, "corn": 4.2, "soybean": 1.1},
    
    # Kalimantan
    {"id": "kalimantan-barat", "name": "Kalimantan Barat", "svg_id": "Kalimantan-Barat", "temp": 27.0, "rain": 260, "humid": 85, "risk": "Rendah", "cat": "Tropis Basah (Af)", "rice": 3.2, "corn": 4.5, "soybean": 1.0},
    {"id": "kalimantan-tengah", "name": "Kalimantan Tengah", "svg_id": "Kalimantan-Tengah", "temp": 27.1, "rain": 240, "humid": 84, "risk": "Rendah", "cat": "Tropis Basah (Af)", "rice": 3.6, "corn": 4.8, "soybean": 1.1},
    {"id": "kalimantan-selatan", "name": "Kalimantan Selatan", "svg_id": "Kalimantan-Selatan", "temp": 27.2, "rain": 210, "humid": 82, "risk": "Sedang", "cat": "Tropis Basah (Am)", "rice": 4.2, "corn": 5.0, "soybean": 1.2},
    {"id": "kalimantan-timur", "name": "Kalimantan Timur", "svg_id": "Kalimantan-Utara---Kalimantan-Timur", "temp": 27.3, "rain": 200, "humid": 83, "risk": "Rendah", "cat": "Tropis Basah (Af)", "rice": 3.8, "corn": 4.6, "soybean": 1.0},
    {"id": "kalimantan-utara", "name": "Kalimantan Utara", "svg_id": "Kalimantan-Utara---Kalimantan-Timur", "temp": 27.0, "rain": 220, "humid": 84, "risk": "Rendah", "cat": "Tropis Basah (Af)", "rice": 3.7, "corn": 4.4, "soybean": 0.9},
    
    # Sulawesi
    {"id": "sulawesi-utara", "name": "Sulawesi Utara", "svg_id": "Sulawesi-Utara", "temp": 26.5, "rain": 190, "humid": 82, "risk": "Rendah", "cat": "Tropis Basah (Af)", "rice": 4.8, "corn": 5.1, "soybean": 1.2},
    {"id": "gorontalo", "name": "Gorontalo", "svg_id": "Gorontalo", "temp": 27.4, "rain": 140, "humid": 78, "risk": "Sedang", "cat": "Tropis Muson (Am)", "rice": 5.0, "corn": 5.6, "soybean": 1.3},
    {"id": "sulawesi-tengah", "name": "Sulawesi Tengah", "svg_id": "Sulawesi-Tengah", "temp": 26.8, "rain": 160, "humid": 81, "risk": "Sedang", "cat": "Tropis Muson (Am)", "rice": 4.7, "corn": 5.2, "soybean": 1.2},
    {"id": "sulawesi-barat", "name": "Sulawesi Barat", "svg_id": "Sulawesi-Barat", "temp": 26.9, "rain": 180, "humid": 82, "risk": "Rendah", "cat": "Tropis Basah (Am)", "rice": 4.9, "corn": 4.9, "soybean": 1.1},
    {"id": "sulawesi-selatan", "name": "Sulawesi Selatan", "svg_id": "Sulawesi-Selatan", "temp": 27.1, "rain": 170, "humid": 80, "risk": "Sedang", "cat": "Tropis Muson (Am)", "rice": 5.3, "corn": 5.5, "soybean": 1.4},
    {"id": "sulawesi-tenggara", "name": "Sulawesi Tenggara", "svg_id": "Sulawesi-Tenggara", "temp": 27.0, "rain": 180, "humid": 81, "risk": "Sedang", "cat": "Tropis Muson (Am)", "rice": 4.1, "corn": 4.6, "soybean": 1.1},
    
    # Maluku
    {"id": "maluku", "name": "Maluku", "svg_id": "Maluku", "temp": 27.2, "rain": 230, "humid": 84, "risk": "Rendah", "cat": "Tropis Basah (Af)", "rice": 4.2, "corn": 3.9, "soybean": 1.0},
    {"id": "maluku-utara", "name": "Maluku Utara", "svg_id": "Maluku-Utara", "temp": 27.3, "rain": 210, "humid": 83, "risk": "Rendah", "cat": "Tropis Basah (Af)", "rice": 3.9, "corn": 4.0, "soybean": 0.9},
    
    # Papua
    {"id": "papua-barat", "name": "Papua Barat", "svg_id": "Papua-Barat", "temp": 26.8, "rain": 250, "humid": 85, "risk": "Rendah", "cat": "Tropis Basah (Af)", "rice": 4.1, "corn": 4.2, "soybean": 1.1},
    {"id": "papua-barat-daya", "name": "Papua Barat Daya", "svg_id": "Papua-Barat", "temp": 26.9, "rain": 260, "humid": 86, "risk": "Rendah", "cat": "Tropis Basah (Af)", "rice": 4.0, "corn": 4.1, "soybean": 1.0},
    {"id": "papua", "name": "Papua", "svg_id": "Papua", "temp": 27.0, "rain": 240, "humid": 84, "risk": "Rendah", "cat": "Tropis Basah (Af)", "rice": 4.2, "corn": 4.3, "soybean": 1.1},
    {"id": "papua-selatan", "name": "Papua Selatan", "svg_id": "Papua", "temp": 27.1, "rain": 200, "humid": 82, "risk": "Sedang", "cat": "Tropis Basah (Am)", "rice": 4.4, "corn": 4.5, "soybean": 1.2},
    {"id": "papua-tengah", "name": "Papua Tengah", "svg_id": "Papua", "temp": 25.5, "rain": 280, "humid": 87, "risk": "Rendah", "cat": "Tropis Basah (Af)", "rice": 3.8, "corn": 4.0, "soybean": 0.9},
    {"id": "papua-pegunungan", "name": "Papua Pegunungan", "svg_id": "Papua", "temp": 19.5, "rain": 310, "humid": 89, "risk": "Rendah", "cat": "Tropis Basah Pegunungan (Cfb)", "rice": 3.0, "corn": 3.8, "soybean": 0.8}
]

os.makedirs('data', exist_ok=True)
with open('data/productivity.json', 'w') as f:
    json.dump(provinces, f, indent=2)

print("Saved 38 provinces data to data/productivity.json. Count:", len(provinces))
