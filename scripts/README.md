# Scripts

This directory contains utility scripts for the Tenderforce EED Tool.

## generate-cpv-mapping.py

Generates CPV to obligation module mappings from multiple CSV source files.

### Purpose

Reads 5 CSV files from `data/sources/` and generates a single consolidated JSON file (`src/data/cpv-mapping-from-csv.json`) with mappings from CPV codes to obligation module IDs.

### CSV Sources

1. `data/sources/cpv-gpp-mapping.csv` - GPP criteria (4,239 mappings)
2. `data/sources/cpv-ecodesign-mapping.csv` - Ecodesign products (97 mappings)
3. `data/sources/cpv-services-mapping.csv` - Services (56 mappings)
4. `data/sources/cpv-tires-mapping.csv` - Tyres (6 mappings)
5. `data/sources/cpv-buildings-mapping.csv` - Buildings (5 mappings)

**Note**: CSV files are in `data/sources/` (not `public/`) to prevent web scraping.

### Usage

```bash
python3 scripts/generate-cpv-mapping.py
```

### What it does

1. Reads all 5 CSV files from `data/sources/`
2. Processes each CSV according to its format (GPP has value mapping, others use TRUE/FALSE)
3. Merges overlapping CPV codes (e.g., computers have both GPP + Ecodesign)
4. Adds hardcoded manual mappings for special cases
5. Generates consolidated JSON with format: `{ "cpv-code": ["module-id", ...] }`
6. Outputs detailed statistics for each source

### Output

- **File:** `src/data/cpv-mapping-from-csv.json`
- **Format:** JSON object with CPV codes as keys, arrays of module IDs as values
- **Total mappings:** 4,245 CPV codes
- **Multiple modules:** 116 CPV codes have multiple obligation modules

### Example Output

```
======================================================================
CPV MAPPING GENERATION
======================================================================

Processing GPP CSV: .../data/sources/cpv-gpp-mapping.csv
  Processed: 4239 CPV codes
  New: 4195
  Merged: 0
  Skipped: 5214

Processing Ecodesign CSV: .../data/sources/cpv-ecodesign-mapping.csv
  Processed: 97 CPV codes
  New: 36
  Merged: 61
  ...

======================================================================
MAPPING GENERATION COMPLETE
======================================================================
TOTAL CPV codes in output: 4245

Source breakdown:
  GPP                  Processed:  4239  New: 4195  Merged:    0
  Ecodesign            Processed:    97  New:   36  Merged:   61
  ...

Module breakdown:
  gpp-office-buildings                                1126 CPV codes
  ecodesign_products                                    97 CPV codes
  ...

CPV codes with multiple modules: 116
```

### When to Run

- After updating any CSV file in `data/sources/`
- When adding new module types or CSV sources
- Before committing CSV changes
- When you need to regenerate all mappings

### Requirements

- Python 3.6+
- Standard library only (no external dependencies)

### Troubleshooting

**"Unmapped GPP values" warning:**
- CSV contains a new GPP category not in `CSV_TO_MODULE_MAP`
- Add the mapping to the script and re-run

**File not found errors:**
- Ensure script is run from project root
- Check that CSV files exist in `data/sources/` directory
- Verify all 5 CSV files are present

**Output JSON has fewer entries than expected:**
- Check GPP CSV for "GPP: Not applicable" entries (these are skipped)
- Verify each CSV has correct format and column names
- Check script output for "Skipped" counts

**Merge issues:**
- If a CPV code appears in multiple CSVs, it will have multiple modules (this is correct)
- Check "CPV codes with multiple modules" count in output
- Verify specific CPV codes using: `grep "12345678-9" src/data/cpv-mapping-from-csv.json`

## Future Scripts

### Planned

- `validate-cpv-mappings.py` - Validate all CPV codes and module references
- `generate-coverage-report.py` - Report on CPV code coverage by module type
- `update-csv-sources.py` - Helper to update CSV files from external sources

### Contributing

When adding new scripts:
1. Add Python shebang: `#!/usr/bin/env python3`
2. Include docstring with purpose and usage
3. Add to this README
4. Make executable: `chmod +x script-name.py`
