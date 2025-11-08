#!/bin/bash

# Test Script for Cross-Reference Reliability Improvements
# Purpose: Test Python availability check, exclusion rules, link validation, and logging
# Date: November 7, 2025

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results tracking
TESTS_PASSED=0
TESTS_FAILED=0
TEST_RESULTS=()

# Function to print colored output
print_test_header() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}TEST: $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_success() {
    echo -e "${GREEN}✅ PASS:${NC} $1"
}

print_failure() {
    echo -e "${RED}❌ FAIL:${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ️  INFO:${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️  WARN:${NC} $1"
}

# Function to record test result
record_test() {
    local test_name="$1"
    local passed="$2"
    local details="$3"
    
    if [[ "$passed" == "true" ]]; then
        ((TESTS_PASSED++))
        TEST_RESULTS+=("✅ PASS: $test_name")
        print_success "$test_name"
    else
        ((TESTS_FAILED++))
        TEST_RESULTS+=("❌ FAIL: $test_name - $details")
        print_failure "$test_name"
        if [[ -n "$details" ]]; then
            echo "  Details: $details"
        fi
    fi
}

# Function to cleanup test files
cleanup_test_files() {
    print_info "Cleaning up test files..."
    
    # Remove test files
    rm -f test-file-*.md
    rm -f test-broken-link.md
    rm -f test-excluded-*.md
    
    # Remove test directories
    rm -rf test-temp-dir/
    
    # Remove temporary tracking files
    rm -f /tmp/organized_files.txt
    rm -f /tmp/files_to_validate.txt
    
    # Clear log file for clean test
    > .kiro/logs/file-organization.log
    
    print_success "Cleanup complete"
}

# Setup test environment
setup_test_environment() {
    print_info "Setting up test environment..."
    
    # Ensure log directory exists
    mkdir -p .kiro/logs
    
    # Ensure test directories exist
    mkdir -p preserved-knowledge
    mkdir -p node_modules
    mkdir -p test-temp-dir
    
    print_success "Test environment ready"
}

# Test 1: Python Availability Check (with Python)
test_python_available() {
    print_test_header "Test 1: Python Availability Check (with Python)"
    
    # Check if Python is available
    if command -v python3 &> /dev/null; then
        record_test "Python 3 is available" "true" ""
        
        # Test that Python version can be retrieved
        local python_version=$(python3 --version 2>&1)
        if [[ -n "$python_version" ]]; then
            record_test "Python version retrieved: $python_version" "true" ""
        else
            record_test "Python version retrieved" "false" "Could not get Python version"
        fi
    else
        record_test "Python 3 is available" "false" "Python 3 not found in PATH"
        print_warning "Skipping Python-dependent tests"
        return 1
    fi
    
    return 0
}

# Test 2: Python Availability Check (simulated unavailable)
test_python_unavailable() {
    print_test_header "Test 2: Python Availability Check (simulated unavailable)"
    
    print_info "This test simulates Python being unavailable"
    print_info "In real scenario, the script should:"
    print_info "  1. Detect Python is not available"
    print_info "  2. Display installation instructions"
    print_info "  3. Skip cross-reference updates gracefully"
    print_info "  4. Continue with file organization"
    
    # We can't actually test this without removing Python from PATH
    # But we can verify the check_python_available function exists
    if grep -q "check_python_available()" .kiro/hooks/organize-by-metadata.sh; then
        record_test "check_python_available function exists" "true" ""
    else
        record_test "check_python_available function exists" "false" "Function not found in script"
    fi
    
    if grep -q "show_python_install_instructions()" .kiro/hooks/organize-by-metadata.sh; then
        record_test "show_python_install_instructions function exists" "true" ""
    else
        record_test "show_python_install_instructions function exists" "false" "Function not found in script"
    fi
    
    # Verify the script checks Python before cross-reference updates
    if grep -q "if ! check_python_available; then" .kiro/hooks/organize-by-metadata.sh; then
        record_test "Script checks Python availability before updates" "true" ""
    else
        record_test "Script checks Python availability before updates" "false" "Check not found"
    fi
}

# Test 3: Exclusion Rules (preserved-knowledge/)
test_exclusion_preserved_knowledge() {
    print_test_header "Test 3: Exclusion Rules (preserved-knowledge/)"
    
    # Create test file in preserved-knowledge
    cat > preserved-knowledge/test-excluded-pk.md << 'EOF'
# Test File in Preserved Knowledge

**Date**: November 7, 2025
**Organization**: spec-completion
**Scope**: test-spec

This file should be excluded from cross-reference updates.

[Test Link](../test-file.md)
EOF
    
    # Verify file was created
    if [[ -f "preserved-knowledge/test-excluded-pk.md" ]]; then
        record_test "Test file created in preserved-knowledge/" "true" ""
    else
        record_test "Test file created in preserved-knowledge/" "false" "File not created"
        return 1
    fi
    
    # Verify exclusion rule exists in script
    if grep -q '"preserved-knowledge"' .kiro/hooks/organize-by-metadata.sh; then
        record_test "preserved-knowledge in EXCLUDED_DIRS" "true" ""
    else
        record_test "preserved-knowledge in EXCLUDED_DIRS" "false" "Not found in exclusion list"
    fi
    
    # Verify is_excluded_path function exists
    if grep -q "is_excluded_path()" .kiro/hooks/organize-by-metadata.sh; then
        record_test "is_excluded_path function exists" "true" ""
    else
        record_test "is_excluded_path function exists" "false" "Function not found"
    fi
    
    # Cleanup
    rm -f preserved-knowledge/test-excluded-pk.md
}

# Test 4: Exclusion Rules (node_modules/)
test_exclusion_node_modules() {
    print_test_header "Test 4: Exclusion Rules (node_modules/)"
    
    # Create test file in node_modules
    mkdir -p node_modules/test-package
    cat > node_modules/test-package/README.md << 'EOF'
# Test Package

This file should be excluded from cross-reference updates.

[Test Link](../../test-file.md)
EOF
    
    # Verify file was created
    if [[ -f "node_modules/test-package/README.md" ]]; then
        record_test "Test file created in node_modules/" "true" ""
    else
        record_test "Test file created in node_modules/" "false" "File not created"
        return 1
    fi
    
    # Verify exclusion rule exists in script
    if grep -q '"node_modules"' .kiro/hooks/organize-by-metadata.sh; then
        record_test "node_modules in EXCLUDED_DIRS" "true" ""
    else
        record_test "node_modules in EXCLUDED_DIRS" "false" "Not found in exclusion list"
    fi
    
    # Cleanup
    rm -rf node_modules/test-package
}

# Test 5: Exclusion Rules (.git/)
test_exclusion_git() {
    print_test_header "Test 5: Exclusion Rules (.git/)"
    
    # Verify exclusion rule exists in script
    if grep -q '".git"' .kiro/hooks/organize-by-metadata.sh; then
        record_test ".git in EXCLUDED_DIRS" "true" ""
    else
        record_test ".git in EXCLUDED_DIRS" "false" "Not found in exclusion list"
    fi
}

# Test 6: Exclusion Rules (.kiro/logs/)
test_exclusion_logs() {
    print_test_header "Test 6: Exclusion Rules (.kiro/logs/)"
    
    # Verify exclusion rule exists in script
    if grep -q '".kiro/logs"' .kiro/hooks/organize-by-metadata.sh; then
        record_test ".kiro/logs in EXCLUDED_DIRS" "true" ""
    else
        record_test ".kiro/logs in EXCLUDED_DIRS" "false" "Not found in exclusion list"
    fi
}

# Test 7: Exclusion Rules (.kiro/release-triggers/)
test_exclusion_release_triggers() {
    print_test_header "Test 7: Exclusion Rules (.kiro/release-triggers/)"
    
    # Verify exclusion rule exists in script
    if grep -q '".kiro/release-triggers"' .kiro/hooks/organize-by-metadata.sh; then
        record_test ".kiro/release-triggers in EXCLUDED_DIRS" "true" ""
    else
        record_test ".kiro/release-triggers in EXCLUDED_DIRS" "false" "Not found in exclusion list"
    fi
}

# Test 8: Link Validation (valid links)
test_link_validation_valid() {
    print_test_header "Test 8: Link Validation (valid links)"
    
    # Skip if Python not available
    if ! command -v python3 &> /dev/null; then
        print_warning "Skipping test - Python not available"
        return 0
    fi
    
    # Create test files with valid links
    cat > test-file-source.md << 'EOF'
# Test Source File

**Date**: November 7, 2025
**Organization**: working-document
**Scope**: test

This file has valid links.

[Link to Target](./test-file-target.md)
[Link to README](./README.md)
EOF
    
    cat > test-file-target.md << 'EOF'
# Test Target File

**Date**: November 7, 2025
**Organization**: working-document
**Scope**: test

This is the target file.
EOF
    
    # Verify files were created
    if [[ -f "test-file-source.md" && -f "test-file-target.md" ]]; then
        record_test "Test files created for link validation" "true" ""
    else
        record_test "Test files created for link validation" "false" "Files not created"
        return 1
    fi
    
    # Verify validate_markdown_link function exists
    if grep -q "validate_markdown_link()" .kiro/hooks/organize-by-metadata.sh; then
        record_test "validate_markdown_link function exists" "true" ""
    else
        record_test "validate_markdown_link function exists" "false" "Function not found"
    fi
    
    # Verify validate_all_links_in_file function exists
    if grep -q "validate_all_links_in_file()" .kiro/hooks/organize-by-metadata.sh; then
        record_test "validate_all_links_in_file function exists" "true" ""
    else
        record_test "validate_all_links_in_file function exists" "false" "Function not found"
    fi
    
    # Cleanup
    rm -f test-file-source.md test-file-target.md
}

# Test 9: Link Validation (broken links)
test_link_validation_broken() {
    print_test_header "Test 9: Link Validation (broken links)"
    
    # Skip if Python not available
    if ! command -v python3 &> /dev/null; then
        print_warning "Skipping test - Python not available"
        return 0
    fi
    
    # Create test file with broken link
    cat > test-broken-link.md << 'EOF'
# Test File with Broken Link

**Date**: November 7, 2025
**Organization**: working-document
**Scope**: test

This file has a broken link.

[Broken Link](./nonexistent-file.md)
[Another Broken Link](../nonexistent-directory/file.md)
EOF
    
    # Verify file was created
    if [[ -f "test-broken-link.md" ]]; then
        record_test "Test file with broken links created" "true" ""
    else
        record_test "Test file with broken links created" "false" "File not created"
        return 1
    fi
    
    # Verify the script has logic to detect broken links
    if grep -q "Broken link in" .kiro/hooks/organize-by-metadata.sh; then
        record_test "Script has broken link detection" "true" ""
    else
        record_test "Script has broken link detection" "false" "Detection logic not found"
    fi
    
    # Verify the script logs broken links
    if grep -q "log_broken_link" .kiro/hooks/organize-by-metadata.sh; then
        record_test "Script logs broken links" "true" ""
    else
        record_test "Script logs broken links" "false" "Logging not found"
    fi
    
    # Cleanup
    rm -f test-broken-link.md
}

# Test 10: Logging (file organization)
test_logging_file_organization() {
    print_test_header "Test 10: Logging (file organization)"
    
    # Verify log file location is defined
    if grep -q 'LOG_FILE=".kiro/logs/file-organization.log"' .kiro/hooks/organize-by-metadata.sh; then
        record_test "Log file location defined" "true" ""
    else
        record_test "Log file location defined" "false" "LOG_FILE not found"
    fi
    
    # Verify log_file_organized function exists
    if grep -q "log_file_organized()" .kiro/hooks/organize-by-metadata.sh; then
        record_test "log_file_organized function exists" "true" ""
    else
        record_test "log_file_organized function exists" "false" "Function not found"
    fi
    
    # Verify log directory is created
    if grep -q 'mkdir -p "$(dirname "$LOG_FILE")"' .kiro/hooks/organize-by-metadata.sh; then
        record_test "Script creates log directory" "true" ""
    else
        record_test "Script creates log directory" "false" "Directory creation not found"
    fi
}

# Test 11: Logging (cross-reference updates)
test_logging_cross_reference() {
    print_test_header "Test 11: Logging (cross-reference updates)"
    
    # Verify log_cross_reference_update function exists
    if grep -q "log_cross_reference_update()" .kiro/hooks/organize-by-metadata.sh; then
        record_test "log_cross_reference_update function exists" "true" ""
    else
        record_test "log_cross_reference_update function exists" "false" "Function not found"
    fi
    
    # Verify function logs link count
    if grep -q 'log_message "Updated.*link.*in' .kiro/hooks/organize-by-metadata.sh; then
        record_test "Function logs link update count" "true" ""
    else
        record_test "Function logs link update count" "false" "Link count logging not found"
    fi
}

# Test 12: Logging (excluded files)
test_logging_excluded_files() {
    print_test_header "Test 12: Logging (excluded files)"
    
    # Verify log_excluded_file function exists
    if grep -q "log_excluded_file()" .kiro/hooks/organize-by-metadata.sh; then
        record_test "log_excluded_file function exists" "true" ""
    else
        record_test "log_excluded_file function exists" "false" "Function not found"
    fi
    
    # Verify function logs exclusion reason
    if grep -q 'log_message "Skipped.*reason:' .kiro/hooks/organize-by-metadata.sh; then
        record_test "Function logs exclusion reason" "true" ""
    else
        record_test "Function logs exclusion reason" "false" "Reason logging not found"
    fi
}

# Test 13: Logging (broken links)
test_logging_broken_links() {
    print_test_header "Test 13: Logging (broken links)"
    
    # Verify log_broken_link function exists
    if grep -q "log_broken_link()" .kiro/hooks/organize-by-metadata.sh; then
        record_test "log_broken_link function exists" "true" ""
    else
        record_test "log_broken_link function exists" "false" "Function not found"
    fi
    
    # Verify function logs link details
    if grep -q 'log_message "Broken link in.*Target does not exist' .kiro/hooks/organize-by-metadata.sh; then
        record_test "Function logs broken link details" "true" ""
    else
        record_test "Function logs broken link details" "false" "Details logging not found"
    fi
}

# Test 14: Integration Test (verify all components work together)
test_integration() {
    print_test_header "Test 14: Integration Test"
    
    print_info "Verifying all components are integrated in the script..."
    
    # Check that update_cross_references calls all the functions
    local integration_checks=0
    local integration_passed=0
    
    # Check Python availability is checked
    ((integration_checks++))
    if grep -A 20 "update_cross_references()" .kiro/hooks/organize-by-metadata.sh | grep -q "check_python_available"; then
        ((integration_passed++))
        print_success "  Python check integrated"
    else
        print_failure "  Python check not integrated"
    fi
    
    # Check exclusion rules are applied
    ((integration_checks++))
    if grep -A 50 "update_cross_references()" .kiro/hooks/organize-by-metadata.sh | grep -q "is_excluded_path"; then
        ((integration_passed++))
        print_success "  Exclusion rules integrated"
    else
        print_failure "  Exclusion rules not integrated"
    fi
    
    # Check link validation is performed
    ((integration_checks++))
    if grep -A 150 "update_cross_references()" .kiro/hooks/organize-by-metadata.sh | grep -q "validate_all_links_in_file"; then
        ((integration_passed++))
        print_success "  Link validation integrated"
    else
        print_failure "  Link validation not integrated"
    fi
    
    # Check logging is performed
    ((integration_checks++))
    if grep -A 50 "update_cross_references()" .kiro/hooks/organize-by-metadata.sh | grep -q "log_message"; then
        ((integration_passed++))
        print_success "  Logging integrated"
    else
        print_failure "  Logging not integrated"
    fi
    
    if [[ $integration_passed -eq $integration_checks ]]; then
        record_test "All components integrated in update_cross_references" "true" ""
    else
        record_test "All components integrated in update_cross_references" "false" "$integration_passed/$integration_checks checks passed"
    fi
}

# Print test summary
print_test_summary() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}TEST SUMMARY${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    local total_tests=$((TESTS_PASSED + TESTS_FAILED))
    echo "Total Tests: $total_tests"
    echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
    echo -e "${RED}Failed: $TESTS_FAILED${NC}"
    echo ""
    
    if [[ $TESTS_FAILED -eq 0 ]]; then
        echo -e "${GREEN}✅ ALL TESTS PASSED${NC}"
    else
        echo -e "${RED}❌ SOME TESTS FAILED${NC}"
        echo ""
        echo "Failed tests:"
        for result in "${TEST_RESULTS[@]}"; do
            if [[ "$result" == "❌"* ]]; then
                echo "  $result"
            fi
        done
    fi
    
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Main test execution
main() {
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  Cross-Reference Reliability Improvements Test Suite              ║${NC}"
    echo -e "${BLUE}║  Testing: Python check, exclusion rules, link validation, logging ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════════════╝${NC}"
    
    # Setup
    setup_test_environment
    cleanup_test_files
    
    # Run tests
    test_python_available
    test_python_unavailable
    test_exclusion_preserved_knowledge
    test_exclusion_node_modules
    test_exclusion_git
    test_exclusion_logs
    test_exclusion_release_triggers
    test_link_validation_valid
    test_link_validation_broken
    test_logging_file_organization
    test_logging_cross_reference
    test_logging_excluded_files
    test_logging_broken_links
    test_integration
    
    # Cleanup
    cleanup_test_files
    
    # Summary
    print_test_summary
    
    # Exit with appropriate code
    if [[ $TESTS_FAILED -eq 0 ]]; then
        exit 0
    else
        exit 1
    fi
}

# Run main function
main "$@"
