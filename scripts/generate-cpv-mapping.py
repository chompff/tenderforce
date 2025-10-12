#!/usr/bin/env python3
"""
Generate CPV to obligation mappings from multiple CSV files.

This script reads multiple CSV files (GPP, Ecodesign, Services, Tyres, Buildings)
and generates a single JSON file that maps CPV codes to obligation module IDs.
The JSON can then be imported into TypeScript for use in the application.

Usage:
    python scripts/generate-cpv-mapping.py
"""

import csv
import json
import os
from pathlib import Path
from collections import defaultdict

# Mapping from CSV GPP names to module IDs
GPP_TO_MODULE_MAP = {
    'GPP: Food Catering services and vending machines': 'gpp-food-catering',
    'GPP: Office Building Design, Construction and Management': 'gpp-office-buildings',
    'GPP: Furniture': 'gpp-furniture',
    'GPP: Road transport': 'gpp-road-transport',
    'GPP: Computers, monitors, tablets and smartphones': 'gpp-computers',
    'GPP: Public Space Maintenance': 'gpp-public-space',
    'GPP: Road Design, Construction and Maintenance': 'gpp-road-design',
    'GPP: Textiles': 'gpp-textiles',
    'GPP: Imaging Equipment, consumables, and print services': 'gpp-imaging-equipment',
    'GPP: Data centres, server rooms and cloud services': 'gpp-data-centres',
    'GPP: Road lighting and traffic signals': 'gpp-road-lighting',
    'GPP: Cleaning products and services': 'gpp-cleaning',
    'GPP: Paints, varnishes and road markings': 'gpp-paints',
    'GPP: Electricity': 'gpp-electricity',
}

# Manual mappings for special cases
# These are CPV codes that don't appear in any CSV but need to be included
MANUAL_MAPPINGS = {
    # General EED obligations
    '90510000-5': ['algemene_eed'],
    '45000000-7': ['buildings'],
    '55522000-5': ['algemene_eed'],
    '39130000-2': ['gpp-furniture'],
}

# CSV sources to process
# These files are kept in data/sources/ (not public/) to prevent web scraping
CSV_SOURCES = [
    {
        'file': 'data/sources/cpv-gpp-mapping.csv',
        'name': 'GPP',
        'cpv_column': 'CPV CODE',
        'value_column': 'Mapped GPP',
        'value_map': GPP_TO_MODULE_MAP,
        'skip_values': ['GPP: Not applicable'],
    },
    {
        'file': 'data/sources/cpv-ecodesign-mapping.csv',
        'name': 'Ecodesign',
        'cpv_column': 'CPV CODE',
        'value_column': 'Producten onder ecodesign',
        'module_id': 'ecodesign_products',
        'include_when': 'TRUE',
    },
    {
        'file': 'data/sources/cpv-services-mapping.csv',
        'name': 'Services',
        'cpv_column': 'CPV CODE',
        'value_column': 'Diensten',
        'module_id': 'services_new_products',
        'include_when': 'TRUE',
    },
    {
        'file': 'data/sources/cpv-tires-mapping.csv',
        'name': 'Tyres',
        'cpv_column': 'CPV CODE',
        'value_column': 'Banden',
        'module_id': 'tyres',
        'include_when': 'TRUE',
    },
    {
        'file': 'data/sources/cpv-buildings-mapping.csv',
        'name': 'Buildings',
        'cpv_column': 'CPV CODE',
        'value_column': 'Gebouwen',
        'module_id': 'buildings',
        'include_when': 'TRUE',
    },
]


def process_csv_source(project_root, source_config, cpv_mappings, stats):
    """Process a single CSV source and merge into cpv_mappings."""
    csv_path = project_root / source_config['file']
    source_name = source_config['name']

    print(f"\nProcessing {source_name} CSV: {csv_path}")

    if not csv_path.exists():
        print(f"  WARNING: File not found, skipping")
        return

    source_stats = {'processed': 0, 'skipped': 0, 'new': 0, 'merged': 0}

    with open(csv_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)

        for row in reader:
            cpv_code = row[source_config['cpv_column']].strip()
            value = row[source_config['value_column']].strip()

            # Determine if we should include this row
            should_include = False
            module_id = None

            if 'value_map' in source_config:
                # GPP-style: map value to module ID
                skip_values = source_config.get('skip_values', [])
                if value in skip_values:
                    source_stats['skipped'] += 1
                    continue
                elif value in source_config['value_map']:
                    module_id = source_config['value_map'][value]
                    should_include = True
            elif 'module_id' in source_config:
                # Simple TRUE/FALSE style
                if value == source_config.get('include_when', 'TRUE'):
                    module_id = source_config['module_id']
                    should_include = True
                else:
                    source_stats['skipped'] += 1
                    continue

            if should_include and module_id:
                if cpv_code in cpv_mappings:
                    # Merge: add module if not already present
                    if module_id not in cpv_mappings[cpv_code]:
                        cpv_mappings[cpv_code].append(module_id)
                        cpv_mappings[cpv_code].sort()
                        source_stats['merged'] += 1
                else:
                    # New CPV code
                    cpv_mappings[cpv_code] = [module_id]
                    source_stats['new'] += 1

                source_stats['processed'] += 1
                stats[f'module_{module_id}'] += 1

    print(f"  Processed: {source_stats['processed']} CPV codes")
    print(f"  New: {source_stats['new']}")
    print(f"  Merged: {source_stats['merged']}")
    print(f"  Skipped: {source_stats['skipped']}")

    stats[f'{source_name}_processed'] = source_stats['processed']
    stats[f'{source_name}_new'] = source_stats['new']
    stats[f'{source_name}_merged'] = source_stats['merged']


def main():
    # Determine paths
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    output_path = project_root / 'src' / 'data' / 'cpv-mapping-from-csv.json'

    print("="*70)
    print("CPV MAPPING GENERATION")
    print("="*70)
    print(f"Output will be written to: {output_path}\n")

    # Initialize
    cpv_mappings = {}
    stats = defaultdict(int)

    # Process all CSV sources
    for source_config in CSV_SOURCES:
        process_csv_source(project_root, source_config, cpv_mappings, stats)

    # Merge manual mappings
    print("\nMerging manual mappings...")
    manual_stats = {'new': 0, 'merged': 0}

    for cpv, modules in MANUAL_MAPPINGS.items():
        if cpv in cpv_mappings:
            # Merge: add modules that aren't already present
            for module in modules:
                if module not in cpv_mappings[cpv]:
                    cpv_mappings[cpv].append(module)
                    manual_stats['merged'] += 1
            cpv_mappings[cpv].sort()
        else:
            # New CPV code
            cpv_mappings[cpv] = modules
            manual_stats['new'] += 1

    print(f"  Manual new: {manual_stats['new']}")
    print(f"  Manual merged: {manual_stats['merged']}")

    # Write JSON output (sorted by key for consistency)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(cpv_mappings, f, indent=2, ensure_ascii=False, sort_keys=True)

    # Print statistics
    print("\n" + "="*70)
    print("MAPPING GENERATION COMPLETE")
    print("="*70)
    print(f"TOTAL CPV codes in output: {len(cpv_mappings)}")
    print()

    # Source breakdown
    print("Source breakdown:")
    print("-" * 70)
    for source_config in CSV_SOURCES:
        name = source_config['name']
        processed = stats.get(f'{name}_processed', 0)
        new = stats.get(f'{name}_new', 0)
        merged = stats.get(f'{name}_merged', 0)
        print(f"  {name:20s} Processed: {processed:5d}  New: {new:4d}  Merged: {merged:4d}")

    print(f"  {'Manual':20s} Processed: {len(MANUAL_MAPPINGS):5d}  " +
          f"New: {manual_stats['new']:4d}  Merged: {manual_stats['merged']:4d}")

    # Module breakdown
    print("\nModule breakdown (total CPV codes per module):")
    print("-" * 70)

    # Count total per module
    module_counts = defaultdict(int)
    for cpv, modules in cpv_mappings.items():
        for module in modules:
            module_counts[module] += 1

    # Sort by count
    sorted_modules = sorted(module_counts.items(), key=lambda x: x[1], reverse=True)

    for module_id, count in sorted_modules:
        print(f"  {module_id:50s} {count:5d} CPV codes")

    # Multiple modules stat
    multi_module_codes = sum(1 for modules in cpv_mappings.values() if len(modules) > 1)
    print()
    print(f"CPV codes with multiple modules: {multi_module_codes}")

    print("\n" + "="*70)
    print(f"Output written to: {output_path}")
    print("="*70)


if __name__ == '__main__':
    main()
