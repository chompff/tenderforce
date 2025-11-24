#!/usr/bin/env python3
"""
Generate CPV to obligation mappings from multiple CSV files.

This script reads multiple CSV files (Energy Label, Ecodesign, GPP, Services, Tyres, Buildings)
and generates a single JSON file that maps CPV codes to obligation module IDs.
The JSON can then be imported into TypeScript for use in the application.

Module ordering: energy-label, ecodesign, GPP modules, services, buildings

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

# Mapping from Dutch GPP names to module IDs
DUTCH_GPP_TO_MODULE_MAP = {
    'Levensmiddelen, cateringdiensten en verkoopautomaten': 'gpp-food-catering',
    'Onderhoud van de openbare ruimte': 'gpp-public-space',
    'Ondehoud van de openbare ruimte': 'gpp-public-space',  # Typo in CSV
    'Textielproducten en -diensten': 'gpp-textiles',
    'Textiles': 'gpp-textiles',  # English variant in CSV
    'Textile products and services': 'gpp-textiles',  # English variant in CSV
    'Computers, monitoren, tablets en smartphones': 'gpp-computers',
    'Datacentra, serverruimtes en cloudservices': 'gpp-data-centres',
    'Elektriciteit': 'gpp-electricity',
    'Grafische apparatuur, verbruiksartikelen en printdiensten': 'gpp-imaging-equipment',
    'Meubels': 'gpp-furniture',
    'Meubilair': 'gpp-furniture',
    'Ontwerp, bouw en beheer van kantoorgebouwen': 'gpp-office-buildings',
    'Ontwerp, bouw en onderhoud van wegen': 'gpp-road-design',
    'Straatverlichting en verkeerslichten': 'gpp-road-lighting',
    'Verven, vernissen en wegmarkeringen': 'gpp-paints',
    'Wegtransport': 'gpp-road-transport',
    'Wegvervoer': 'gpp-road-transport',
    'Binnenschoonmaakdiensten': 'gpp-cleaning',
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

# Module ordering for consistent output
# This defines the canonical order that modules should appear for each CPV code
MODULE_ORDER = [
    'energy_label',          # 1. Energy Label
    'ecodesign_products',    # 2. Ecodesign
    'tyres',                 # 2b. Tyres (also ecodesign-related)
    # GPP modules (alphabetically)
    'gpp-cleaning',
    'gpp-computers',
    'gpp-data-centres',
    'gpp-electricity',
    'gpp-food-catering',
    'gpp-furniture',
    'gpp-imaging-equipment',
    'gpp-office-buildings',
    'gpp-paints',
    'gpp-public-space',
    'gpp-road-design',
    'gpp-road-lighting',
    'gpp-road-transport',
    'gpp-textiles',
    'services_new_products', # 4. Services
    'buildings',             # 5. Buildings
    'algemene_eed',          # Last: general EED obligations
]

def get_module_sort_key(module_id):
    """Return sort key for a module ID based on MODULE_ORDER."""
    try:
        return MODULE_ORDER.index(module_id)
    except ValueError:
        # Unknown modules go at the end
        return len(MODULE_ORDER)

# CSV sources to process
# These files are kept in data/sources/ (not public/) to prevent web scraping
# IMPORTANT: Process in order: Energy Label, Ecodesign, GPP, Services, Buildings
CSV_SOURCES = [
    {
        'file': 'data/sources/cpv-energylabel-mapping.csv',
        'name': 'Energy Label',
        'cpv_column': 'CPV CODE',
        'value_column': 'Producten met energielabel',
        'module_id': 'energy_label',
        'include_when': 'TRUE',
    },
    {
        'file': 'data/sources/cpv-ecodesign-mapping.csv',
        'name': 'Ecodesign',
        'cpv_column': 'CPV CODE',
        'value_column': 'Producten onder ecodesign',
        'module_id': 'ecodesign_products',
        'include_when': 'TRUE',
    },
    # Comment out the old GPP mapping as we'll use the Dutch one instead
    # {
    #     'file': 'data/sources/cpv-gpp-mapping.csv',
    #     'name': 'GPP',
    #     'cpv_column': 'CPV CODE',
    #     'value_column': 'Mapped GPP',
    #     'value_map': GPP_TO_MODULE_MAP,
    #     'skip_values': ['GPP: Not applicable'],
    # },
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


def process_dutch_gpp_csv(project_root, cpv_mappings, stats):
    """Process the new Dutch GPP CSV with multiple module support."""
    csv_path = project_root / 'data' / 'sources' / 'cpv-gpp-mapping-2024-11-24.csv'
    source_name = 'Dutch GPP (2024-11-24)'

    print(f"\nProcessing {source_name} CSV: {csv_path}")

    if not csv_path.exists():
        print(f"  WARNING: File not found, skipping")
        return

    source_stats = {'processed': 0, 'skipped': 0, 'new': 0, 'merged': 0, 'multi_module': 0}

    with open(csv_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)

        for row in reader:
            cpv_code = row['CPV Code'].strip()
            modules_str = row['GPP Module(s)'].strip()

            if not modules_str:
                source_stats['skipped'] += 1
                continue

            # Split multiple modules by semicolon
            module_names = [m.strip() for m in modules_str.split(';')]
            module_ids = []

            for module_name in module_names:
                if module_name in DUTCH_GPP_TO_MODULE_MAP:
                    module_id = DUTCH_GPP_TO_MODULE_MAP[module_name]
                    if module_id not in module_ids:  # Avoid duplicates
                        module_ids.append(module_id)
                else:
                    print(f"  WARNING: Unknown Dutch module name: '{module_name}' for CPV {cpv_code}")

            if not module_ids:
                source_stats['skipped'] += 1
                continue

            if len(module_ids) > 1:
                source_stats['multi_module'] += 1

            # Add or merge the modules for this CPV code
            if cpv_code in cpv_mappings:
                # Merge: add modules that aren't already present
                for module_id in module_ids:
                    if module_id not in cpv_mappings[cpv_code]:
                        cpv_mappings[cpv_code].append(module_id)
                        source_stats['merged'] += 1
                # Sort using custom module order
                cpv_mappings[cpv_code].sort(key=get_module_sort_key)
            else:
                # New CPV code
                cpv_mappings[cpv_code] = module_ids
                # Sort using custom module order
                cpv_mappings[cpv_code].sort(key=get_module_sort_key)
                source_stats['new'] += 1

            source_stats['processed'] += 1

            # Update module stats
            for module_id in module_ids:
                stats[f'module_{module_id}'] += 1

    print(f"  Processed: {source_stats['processed']} CPV codes")
    print(f"  New: {source_stats['new']}")
    print(f"  Merged: {source_stats['merged']}")
    print(f"  Multi-module: {source_stats['multi_module']} CPV codes with multiple modules")
    print(f"  Skipped: {source_stats['skipped']}")

    stats[f'{source_name}_processed'] = source_stats['processed']
    stats[f'{source_name}_new'] = source_stats['new']
    stats[f'{source_name}_merged'] = source_stats['merged']
    stats[f'{source_name}_multi_module'] = source_stats['multi_module']


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
                        # Sort using custom module order
                        cpv_mappings[cpv_code].sort(key=get_module_sort_key)
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

    # Process the new Dutch GPP CSV with multiple module support
    process_dutch_gpp_csv(project_root, cpv_mappings, stats)

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
            # Sort using custom module order
            cpv_mappings[cpv].sort(key=get_module_sort_key)
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
