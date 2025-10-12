# CPV Mapping System Documentation

## Overview

The CPV (Common Procurement Vocabulary) mapping system automatically maps CPV codes to obligation modules (GPP, Ecodesign, Energy Label, etc.) for use in the EED Tool application.

## Architecture

### Data Sources

1. **CSV Files** (Internal - `data/sources/`)
   - `cpv-gpp-mapping.csv` - 4,239 GPP mappings (9,453 total rows)
   - `cpv-ecodesign-mapping.csv` - 97 Ecodesign mappings
   - `cpv-services-mapping.csv` - 56 Services mappings
   - `cpv-tires-mapping.csv` - 6 Tyres mappings
   - `cpv-buildings-mapping.csv` - 5 Buildings mappings
   - **Note**: Kept in `data/sources/` (not `public/`) to prevent web scraping

2. **Manual Mappings** (`scripts/generate-cpv-mapping.py`)
   - Hardcoded special cases (algemene_eed, etc.)
   - Complementary to CSV mappings
   - Automatically merged with CSV data

3. **Generated JSON** (`src/data/cpv-mapping-from-csv.json`)
   - Auto-generated from 5 CSV files + manual mappings
   - 4,245 CPV codes → module mappings
   - Single source of truth for the application
   - Should not be edited manually

### Mapping Flow

```
┌─────────────────────────────────┐
│ data/sources/*.csv              │  (5 CSV source files)
│ • cpv-gpp-mapping.csv           │  (Internal - not web accessible)
│ • cpv-ecodesign-mapping.csv     │
│ • cpv-services-mapping.csv      │
│ • cpv-tires-mapping.csv         │
│ • cpv-buildings-mapping.csv     │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│ scripts/generate-cpv-mapping.py │  (Python script)
│ • Reads all 5 CSV files         │
│ • Merges manual mappings        │
│ • Handles overlaps intelligently│
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│ src/data/cpv-mapping-from-csv.  │  (Generated JSON - 4,245 codes)
│ json                            │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│ src/data/obligations/index.ts   │  (TypeScript)
│                                 │
│ • Imports merged JSON           │
│ • Exports cpvToObligationMap    │
└─────────────────────────────────┘
```

## Module Types

### GPP Modules (14 types)
- `gpp-food-catering` - Food Catering services and vending machines (755 CPV codes)
- `gpp-office-buildings` - Office Building Design, Construction and Management (1,126 CPV codes)
- `gpp-furniture` - Furniture (329 CPV codes)
- `gpp-road-transport` - Road transport (314 CPV codes)
- `gpp-computers` - Computers, monitors, tablets and smartphones (306 CPV codes)
- `gpp-public-space` - Public Space Maintenance (278 CPV codes)
- `gpp-road-design` - Road Design, Construction and Maintenance (255 CPV codes)
- `gpp-textiles` - Textiles (243 CPV codes)
- `gpp-imaging-equipment` - Imaging Equipment, consumables, and print services (236 CPV codes)
- `gpp-data-centres` - Data centres, server rooms and cloud services (184 CPV codes)
- `gpp-road-lighting` - Road lighting and traffic signals (73 CPV codes)
- `gpp-cleaning` - Cleaning products and services (60 CPV codes)
- `gpp-paints` - Paints, varnishes and road markings (44 CPV codes)
- `gpp-electricity` - Electricity (36 CPV codes)

### Non-GPP Modules
- `tyres` - Tire obligations
- `ecodesign_products` - Ecodesign requirements
- `energy_label_products` - Energy labeling requirements
- `services_new_products` - Services involving new products
- `algemene_eed` - General EED obligations
- `buildings` - Building-specific obligations
- `standard_obligations` - Auto-appended to all results

## Multiple Modules per CPV

A single CPV code can map to **multiple obligation modules**. This is crucial for products that need to comply with multiple regulations.

### Example: Personal Computers (CPV 30213000-5)

```typescript
'30213000-5': ['gpp-computers', 'ecodesign_products']
```

This CPV code maps to:
1. **GPP Computers** - Green procurement criteria
2. **Ecodesign Products** - Energy efficiency requirements

### Merge Logic

When a CPV code exists in both CSV and manual mappings:

```typescript
// CSV mapping
'30213000-5': ['gpp-computers']

// Manual mapping
'30213000-5': ['ecodesign_products']

// Result: Combined (not overwritten!)
'30213000-5': ['gpp-computers', 'ecodesign_products']
```

The system automatically:
1. Starts with CSV mappings
2. For each manual mapping:
   - If CPV exists in CSV: **Merge arrays** and remove duplicates
   - If CPV only in manual: **Add to map**

## Updating Mappings

### Option 1: Update CSV (Recommended for GPP mappings)

1. Edit `public/cpv-gpp-mapping.csv`
2. Run the generation script:
   ```bash
   python3 scripts/generate-cpv-mapping.py
   ```
3. Rebuild the application:
   ```bash
   npm run build:dev
   ```

### Option 2: Add Manual Mappings (For non-GPP or special cases)

1. Edit `src/data/obligations/index.ts`
2. Add to `manualCpvMappings`:
   ```typescript
   const manualCpvMappings: Record<string, string[]> = {
     // ... existing mappings
     '12345678-9': ['new-module'],
   };
   ```
3. Rebuild the application

### Option 3: Multiple Modules for One CPV

If you need a CPV to have multiple modules:

**If one is in CSV and one is manual:** Just add the manual one - they'll merge automatically.

**If both need to be manual:**
```typescript
'12345678-9': ['module-one', 'module-two']
```

**If both are in CSV:** You'll need to create a manual mapping or update the CSV.

## Script Usage

### Basic Generation

```bash
python3 scripts/generate-cpv-mapping.py
```

### Script Output

The script provides detailed statistics:
- Total CPV codes mapped
- Codes skipped ("Not applicable")
- Breakdown by module type
- Warnings for unmapped GPP values

### Example Output

```
======================================================================
MAPPING GENERATION COMPLETE
======================================================================
Total CPV codes mapped: 4239
Skipped (Not applicable): 5214
Unmapped GPP values: 0

Module breakdown:
----------------------------------------------------------------------
  gpp-office-buildings                                1126 CPV codes
  gpp-food-catering                                    755 CPV codes
  gpp-furniture                                        329 CPV codes
  ...
```

## CPV Codes with Multiple Modules

Currently, 6 CPV codes have mappings from both CSV and manual sources:

| CPV Code | CSV Module | Manual Module | Result |
|----------|-----------|---------------|--------|
| 90510000-5 | gpp-public-space | algemene_eed | Both |
| 45000000-7 | gpp-office-buildings | buildings | Both |
| 30213000-5 | gpp-computers | ecodesign_products | Both |
| 30231300-0 | gpp-computers | energy_label_products | Both |
| 55522000-5 | gpp-food-catering | algemene_eed | Both |
| 39130000-2 | gpp-furniture | gpp-furniture | Deduplicated |

This is **intentional and correct** - these products require compliance with multiple regulations.

## Parent Code Fallback

If a CPV code is not found, the system automatically tries parent codes:

```typescript
// Search for: 30213100-6 (Draagbare computers)
// Not found directly, tries:
//   30213100-0
//   30213100
//   30213000-6
//   30213000-0
//   30213000  ← Found! (gpp-computers, ecodesign_products)
```

This ensures more specific CPV codes inherit obligations from their parent categories.

## File Structure

```
tenderforce/
├── data/
│   └── sources/                         # Internal CSV files (not web accessible)
│       ├── cpv-gpp-mapping.csv          # GPP mappings (4,239 codes)
│       ├── cpv-ecodesign-mapping.csv    # Ecodesign mappings (97 codes)
│       ├── cpv-services-mapping.csv     # Services mappings (56 codes)
│       ├── cpv-tires-mapping.csv        # Tyres mappings (6 codes)
│       └── cpv-buildings-mapping.csv    # Buildings mappings (5 codes)
│
├── scripts/
│   └── generate-cpv-mapping.py          # Generation script (processes all 5 CSVs)
│
├── src/
│   └── data/
│       ├── cpv-mapping-from-csv.json    # Generated (4,245 mappings total)
│       └── obligations/
│           ├── index.ts                 # Imports merged JSON
│           ├── gpp-*.json               # GPP module definitions
│           ├── tyres.json               # Other module definitions
│           └── ...
│
└── docs/
    └── cpv-mapping-system.md            # This file
```

## Extending the System

### Adding a New Module Type

1. **Create module JSON file:**
   ```bash
   src/data/obligations/new-module.json
   ```

2. **Import in index.ts:**
   ```typescript
   import newModuleData from './new-module.json';
   const newModule: Obligation = newModuleData as Obligation;
   ```

3. **Add to obligations map:**
   ```typescript
   export const obligations: Record<string, Obligation> = {
     // ... existing
     'new-module': newModule,
   };
   ```

4. **Add CPV mappings** (manual or CSV)

### Adding a New CSV Source

To add mappings from a new CSV (e.g., for Ecodesign products):

1. **Update script** to accept multiple CSVs
2. **Merge multiple sources** into single JSON
3. **Handle conflicts** (which source takes precedence?)

Future enhancement example:
```bash
python scripts/generate-cpv-mapping.py \
  --gpp public/cpv-gpp-mapping.csv \
  --ecodesign public/cpv-ecodesign-mapping.csv
```

## Performance Considerations

- **Bundle size increase:** ~146 KB (4,239 mappings)
- **Load time:** Negligible (JSON parsing is fast)
- **Lookup time:** O(1) for exact matches, O(log n) for parent lookups
- **Memory:** ~200 KB in browser memory

## Troubleshooting

### Build fails with TypeScript errors

- Ensure JSON is valid (run script again)
- Check import paths are correct
- Verify module IDs in CSV match actual module files

### CPV code not resolving

1. Check if in CSV: `grep "12345678-9" public/cpv-gpp-mapping.csv`
2. Check if in JSON: `grep "12345678-9" src/data/cpv-mapping-from-csv.json`
3. Check manual mappings in `index.ts`
4. Try parent code (remove last digit)

### Wrong module returned

- Check merge logic - might need to adjust manual mapping
- Verify CSV has correct GPP value
- Check CSV_TO_MODULE_MAP in Python script

### Script shows "Unmapped GPP values"

- CSV contains a new GPP category
- Add mapping to `CSV_TO_MODULE_MAP` in script
- Re-run script

## Maintenance

### Regular Updates

1. **When CSV changes:**
   - Re-run generation script
   - Review conflicts in output
   - Test sample CPV codes
   - Commit both CSV and JSON

2. **When adding modules:**
   - Create module JSON
   - Update imports
   - Add to obligations map
   - Update CSV_TO_MODULE_MAP if needed

3. **Monthly check:**
   - Review CPV codes with multiple modules
   - Verify parent code fallbacks work
   - Check for new EU GPP criteria

## Future Enhancements

- [ ] CLI tool with validation and testing
- [ ] Support for multiple CSV sources
- [ ] Automated conflict resolution rules
- [ ] CPV hierarchy visualization
- [ ] Module coverage reports
- [ ] Automated tests for mappings
