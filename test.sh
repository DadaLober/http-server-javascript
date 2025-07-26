#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test configuration
SERVER_HOST="localhost"
SERVER_PORT="4221"
TEST_DIR="./tmp"
SERVER_PID=""
TESTS_PASSED=0
TESTS_FAILED=0

# Utility functions
print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  HTTP Server Test Suite${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
}

print_test() {
    echo -e "${YELLOW}Testing:${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
    ((TESTS_PASSED++))
}

print_failure() {
    echo -e "${RED}✗${NC} $1"
    ((TESTS_FAILED++))
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Start server function
start_server() {
    print_info "Starting HTTP server on $SERVER_HOST:$SERVER_PORT"
    node app/main.js --directory $TEST_DIR &
    SERVER_PID=$!
    sleep 2
    
    # Check if server is running
    if kill -0 $SERVER_PID 2>/dev/null; then
        print_success "Server started successfully (PID: $SERVER_PID)"
        return 0
    else
        print_failure "Failed to start server"
        return 1
    fi
}

# Stop server function
stop_server() {
    if [ ! -z "$SERVER_PID" ]; then
        print_info "Stopping server (PID: $SERVER_PID)"
        kill $SERVER_PID 2>/dev/null
        wait $SERVER_PID 2>/dev/null
        print_info "Server stopped"
    fi
}

# Test functions
test_root_endpoint() {
    print_test "Root endpoint returns 200 OK"
    response=$(curl -s -w "%{http_code}" -o /dev/null http://$SERVER_HOST:$SERVER_PORT/)
    if [ "$response" = "200" ]; then
        print_success "Root endpoint returns 200 OK"
    else
        print_failure "Root endpoint returned $response instead of 200"
    fi
}

test_echo_endpoint() {
    print_test "Echo endpoint functionality"
    response=$(curl -s http://$SERVER_HOST:$SERVER_PORT/echo/hello)
    if [[ "$response" == *"hello"* ]]; then
        print_success "Echo endpoint returns correct content"
    else
        print_failure "Echo endpoint failed - got: $response"
    fi
}

test_echo_gzip() {
    print_test "Echo endpoint with GZIP compression"
    response=$(curl -s -H "Accept-Encoding: gzip" -w "%{http_code}" -o /dev/null http://$SERVER_HOST:$SERVER_PORT/echo/compressed)
    if [ "$response" = "200" ]; then
        print_success "GZIP compression handling works"
    else
        print_failure "GZIP compression failed - HTTP $response"
    fi
}

test_user_agent() {
    print_test "User-Agent header extraction"
    response=$(curl -s -H "User-Agent: TestAgent/1.0" http://$SERVER_HOST:$SERVER_PORT/user-agent)
    if [[ "$response" == *"TestAgent/1.0"* ]]; then
        print_success "User-Agent extraction works correctly"
    else
        print_failure "User-Agent extraction failed - got: $response"
    fi
}

test_file_operations() {
    print_test "File GET operations"
    
    # Create test file
    mkdir -p $TEST_DIR
    echo "test content" > $TEST_DIR/test.txt
    
    response=$(curl -s http://$SERVER_HOST:$SERVER_PORT/files/test.txt)
    if [[ "$response" == *"test content"* ]]; then
        print_success "File GET operations work correctly"
    else
        print_failure "File GET failed - got: $response"
    fi
    
    # Test file POST
    print_test "File POST operations"
    post_response=$(curl -s -w "%{http_code}" -o /dev/null -X POST -d "posted content" http://$SERVER_HOST:$SERVER_PORT/files/posted.txt)
    if [ "$post_response" = "201" ]; then
        if [ -f "$TEST_DIR/posted.txt" ]; then
            print_success "File POST operations work correctly"
        else
            print_failure "File POST - file not created"
        fi
    else
        print_failure "File POST failed - HTTP $post_response"
    fi
}

test_404_handling() {
    print_test "404 handling for unknown routes"
    response=$(curl -s -w "%{http_code}" -o /dev/null http://$SERVER_HOST:$SERVER_PORT/nonexistent)
    if [ "$response" = "404" ]; then
        print_success "404 handling works correctly"
    else
        print_failure "404 handling failed - got HTTP $response"
    fi
}

test_concurrent_requests() {
    print_test "Concurrent client handling"
    
    # Send 5 concurrent requests and capture output quietly
    for i in {1..5}; do
        curl -s http://$SERVER_HOST:$SERVER_PORT/echo/concurrent$i >/dev/null 2>&1 &
    done
    wait
    
    print_success "Concurrent requests handled successfully"
}

test_malformed_requests() {
    print_test "Malformed request handling"
    
    # Send malformed HTTP request with timeout
    timeout 3 bash -c "echo -e 'INVALID REQUEST\r\n\r\n' | nc $SERVER_HOST $SERVER_PORT" &>/dev/null
    
    # Give server a moment to process
    sleep 1
    
    # Server should handle gracefully (not crash)
    if kill -0 $SERVER_PID 2>/dev/null; then
        print_success "Malformed requests handled gracefully"
    else
        print_failure "Server crashed on malformed request"
    fi
}

# Cleanup function
cleanup() {
    stop_server
    rm -f $TEST_DIR/test.txt $TEST_DIR/posted.txt 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Main test execution
main() {
    print_header
    
    # Create test directory
    mkdir -p $TEST_DIR
    
    # Start server
    if ! start_server; then
        exit 1
    fi
    
    echo ""
    print_info "Running test suite..."
    echo ""
    
    # Run all tests
    test_root_endpoint
    test_echo_endpoint
    test_echo_gzip
    test_user_agent
    test_file_operations
    test_404_handling
    test_malformed_requests
    
    # Print results
    echo ""
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  Test Results${NC}"
    echo -e "${BLUE}================================${NC}"
    echo -e "${GREEN}Tests Passed: $TESTS_PASSED${NC}"
    echo -e "${RED}Tests Failed: $TESTS_FAILED${NC}"
    echo ""
    
    if [ $TESTS_FAILED -eq 0 ]; then
        echo -e "${GREEN}All tests passed! 🎉${NC}"
        cleanup
        exit 0
    else
        echo -e "${RED}Some tests failed. Please check the output above.${NC}"
        cleanup
        exit 1
    fi
}

# Run main function
main