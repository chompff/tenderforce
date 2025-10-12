# CPV Mapping Source Files

This directory contains CSV files that define which CPV codes map to which obligation modules. These files are **internal only** and are not served by the web application (they are not in `public/`) to prevent scraping.

## Files

### cpv-gpp-mapping.csv
- **Module Type**: GPP (Green Public Procurement)
- **Total Rows**: 9,453 CPV codes
- **Mappings**: 4,239 CPV codes (5,214 marked as "Not applicable")
- **Format**: `CPV CODE, Omschrijving, Mapped GPP`
- **Module Mapping**: Maps GPP names (e.g., "GPP: Furniture") to module IDs (e.g., "gpp-furniture")

### cpv-ecodesign-mapping.csv
- **Module Type**: Ecodesign Products
- **Total Rows**: 97 CPV codes
- **Mappings**: All 97 marked as TRUE
- **Format**: `CPV CODE, Omschrijving, Producten onder ecodesign`
- **Module ID**: `ecodesign_products`

### cpv-services-mapping.csv
- **Module Type**: Services (that may involve purchasing new products)
- **Total Rows**: 56 CPV codes
- **Mappings**: All 56 marked as TRUE
- **Format**: `CPV CODE, Omschrijving, Diensten`
- **Module ID**: `services_new_products`

### cpv-tires-mapping.csv
- **Module Type**: Tyres
- **Total Rows**: 6 CPV codes
- **Mappings**: All 6 marked as TRUE
- **Format**: `CPV CODE, Omschrijving, Banden`
- **Module ID**: `tyres`

### cpv-buildings-mapping.csv
- **Module Type**: Buildings
- **Total Rows**: 5 CPV codes
- **Mappings**: All 5 marked as TRUE
- **Format**: `CPV CODE, Omschrijving, Gebouwen`
- **Module ID**: `buildings`

## Usage

These CSV files are processed by `scripts/generate-cpv-mapping.py` to generate the consolidated mapping JSON file:

```bash
# Regenerate mappings from all CSV files
python3 scripts/generate-cpv-mapping.py
```

The script will:
1. Read all 5 CSV files from this directory
2. Merge overlapping CPV codes (e.g., computers appear in both GPP and Ecodesign)
3. Generate `src/data/cpv-mapping-from-csv.json` with 4,245 CPV mappings

## Editing

To update mappings:

1. **Edit the appropriate CSV file** in this directory
2. **Run the generation script**: `python3 scripts/generate-cpv-mapping.py`
3. **Rebuild the application**: `npm run build:dev`
4. **Commit both** the CSV and generated JSON file

## Format Requirements

### GPP CSV Format
```
CPV CODE,Omschrijving,Mapped GPP
03000000-1,"Agriculture products","GPP: Food Catering services and vending machines"
34350000-5,"Vehicle tyres","GPP: Not applicable"
```

### Other CSV Formats (Ecodesign, Services, Tyres, Buildings)
```
CPV CODE,Omschrijving,<Column Name>
30213000-5,"Personal computers","TRUE"
```

**Notes**:
- Column names must match those defined in `scripts/generate-cpv-mapping.py`
- GPP CSV uses value mapping (GPP name → module ID)
- Other CSVs use TRUE/FALSE (TRUE → module ID)
- UTF-8 encoding with BOM is supported

## Security

**Why are these files in `data/sources/` and not `public/`?**

- Files in `public/` are served by the web server and can be accessed directly via URL
- These CSV files contain internal business logic and mappings
- Moving them to `data/sources/` prevents external scraping/downloading
- The generated JSON (`src/data/cpv-mapping-from-csv.json`) is bundled into the application and is the only data exposed to users

## Statistics

**Current Coverage** (as of last generation):

| Source | CPV Codes | New | Merged |
|--------|-----------|-----|--------|
| GPP | 4,239 | 4,195 | 0 |
| Ecodesign | 97 | 36 | 61 |
| Services | 56 | 13 | 43 |
| Tyres | 6 | 0 | 6 |
| Buildings | 5 | 1 | 4 |
| **Total** | **4,245** | **4,245** | **114** |

**Multiple Modules**: 116 CPV codes have multiple obligation modules (e.g., computers need both GPP + Ecodesign compliance)
