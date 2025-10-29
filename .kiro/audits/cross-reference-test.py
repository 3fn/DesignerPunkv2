#!/usr/bin/env python3
"""
Cross-Reference Integrity Test Script
Tests all markdown links in Phase 1 documentation
"""

import os
import re
from pathlib import Path
from typing import List, Tuple, Set, Dict

# Phase 1 specs to check
PHASE1_SPECS = [
    "mathematical-token-system",
    "cross-platform-build-system",
    "semantic-token-generation",
    "opacity-tokens",
    "blend-tokens",
    "border-width-tokens",
    "shadow-glow-token-system",
    "layering-token-system",
    "typography-token-expansion",
    "primitive-token-formula-standardization",
]

# Counters
total_links = 0
broken_links = 0
valid_links = 0

# Results storage
broken_link_details: List[str] = []
orphaned_files: List[str] = []

def extract_links(file_path: Path) -> List[str]:
    """Extract markdown links from a file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Match markdown links: [text](path) or [text](path#anchor)
        pattern = r'\[([^\]]+)\]\(([^)]+)\)'
        matches = re.findall(pattern, content)
        return [match[1] for match in matches]
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return []

def resolve_path(source_file: Path, link: str) -> Tuple[bool, str]:
    """
    Resolve a relative path from source file.
    Returns (is_valid, resolved_path)
    """
    # Remove anchor if present
    path_without_anchor = link.split('#')[0]
    
    # Skip external links
    if path_without_anchor.startswith(('http://', 'https://')):
        return (True, 'EXTERNAL')
    
    # Skip empty links
    if not path_without_anchor:
        return (True, 'ANCHOR_ONLY')
    
    try:
        # Resolve relative path
        source_dir = source_file.parent
        resolved = (source_dir / path_without_anchor).resolve()
        return (True, str(resolved))
    except Exception:
        return (False, 'INVALID')

def check_link(source_file: Path, link: str) -> bool:
    """Check if a link is valid."""
    global total_links, broken_links, valid_links
    
    total_links += 1
    
    # Skip external links
    if link.startswith(('http://', 'https://')):
        valid_links += 1
        return True
    
    # Resolve the path
    is_valid, resolved = resolve_path(source_file, link)
    
    if not is_valid or resolved == 'INVALID':
        broken_links += 1
        broken_link_details.append(f"{source_file} -> {link} (INVALID PATH)")
        return False
    
    if resolved in ('EXTERNAL', 'ANCHOR_ONLY'):
        valid_links += 1
        return True
    
    # Check if target file exists
    if not Path(resolved).exists():
        broken_links += 1
        broken_link_details.append(f"{source_file} -> {link} (TARGET NOT FOUND: {resolved})")
        return False
    
    valid_links += 1
    return True

def main():
    print("🔍 Testing Cross-Reference Integrity for Phase 1 Documentation")
    print("=" * 70)
    print()
    
    # Test links in all Phase 1 specs
    print("📝 Testing links in Phase 1 specs...")
    print()
    
    for spec in PHASE1_SPECS:
        spec_dir = Path(f".kiro/specs/{spec}")
        
        if not spec_dir.exists():
            print(f"⚠️  Spec directory not found: {spec_dir}")
            continue
        
        print(f"Checking spec: {spec}")
        
        # Find all markdown files in spec
        for md_file in spec_dir.rglob("*.md"):
            links = extract_links(md_file)
            for link in links:
                check_link(md_file, link)
    
    print()
    print("📊 Cross-Reference Test Results")
    print("=" * 40)
    print(f"Total links tested: {total_links}")
    print(f"✅ Valid links: {valid_links}")
    print(f"❌ Broken links: {broken_links}")
    print()
    
    if broken_links > 0:
        print("❌ Broken Links Found:")
        print("=" * 40)
        for detail in broken_link_details:
            print(f"  - {detail}")
        print()
    
    # Check for orphaned files
    print("🔍 Checking for orphaned files...")
    print()
    
    all_files: Set[Path] = set()
    referenced_files: Set[Path] = set()
    
    # Collect all markdown files
    for spec in PHASE1_SPECS:
        spec_dir = Path(f".kiro/specs/{spec}")
        if not spec_dir.exists():
            continue
        
        for md_file in spec_dir.rglob("*.md"):
            all_files.add(md_file)
    
    # Mark files that are referenced
    for spec in PHASE1_SPECS:
        spec_dir = Path(f".kiro/specs/{spec}")
        if not spec_dir.exists():
            continue
        
        for source_file in spec_dir.rglob("*.md"):
            links = extract_links(source_file)
            for link in links:
                if not link.startswith(('http://', 'https://')):
                    is_valid, resolved = resolve_path(source_file, link)
                    if is_valid and resolved not in ('EXTERNAL', 'ANCHOR_ONLY', 'INVALID'):
                        resolved_path = Path(resolved)
                        if resolved_path.exists():
                            referenced_files.add(resolved_path)
    
    # Find orphaned files (exclude entry points)
    entry_point_names = {'requirements.md', 'design.md', 'tasks.md'}
    for file in all_files:
        if file not in referenced_files and file.name not in entry_point_names:
            orphaned_files.append(str(file))
    
    if orphaned_files:
        print("⚠️  Orphaned Files (no incoming references):")
        print("=" * 40)
        for file in sorted(orphaned_files):
            print(f"  - {file}")
        print()
    else:
        print("✅ No orphaned files found")
        print()
    
    # Summary
    print("📋 Summary")
    print("=" * 40)
    if broken_links == 0 and len(orphaned_files) == 0:
        print("✅ All cross-references are valid and no orphaned files found")
        return 0
    else:
        print("❌ Issues found:")
        if broken_links > 0:
            print(f"  - {broken_links} broken links")
        if orphaned_files:
            print(f"  - {len(orphaned_files)} orphaned files")
        return 1

if __name__ == "__main__":
    exit(main())
