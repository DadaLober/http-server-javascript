# HTTP/1.1 Server

A lightweight, custom HTTP/1.1 server built from scratch in Node.js using raw TCP sockets. This server demonstrates fundamental web protocol implementation without relying on high-level HTTP frameworks.

### Quick Setup

```bash
git clone https://github.com/DadaLober/http-server-javascript.git && cd http-server && chmod +x setup.sh && ./setup.sh
```

## Project Structure

```
http-server/
├── app/
│   ├── main.js           # entry point
│   ├── utils.js          # HTTP parsing utilities and route handling
│   ├── router.js         # Route definitions and mapping
│   └── routerHandler.js  # Individual route handler implementations
├── tmp/
│   ├── foo
│   └── readme.txt
├── .gitattributes
├── .gitignore
├── codecrafters.yml
├── package.json          # Node.js dependencies and scripts
├── package-lock.json
├── your_server.sh        # Server startup script
├── setup.sh              # Automated setup script
├── test.sh               # Automated test suite script
└── README.md             # This file
```

## Key Features

-   **Raw TCP Implementation** - Built from scratch using Node.js TCP sockets without HTTP frameworks
-   **HTTP/1.1 Compliance** - Proper request parsing, header handling, and response generation
-   **File Operations** - GET/POST file serving and uploads with directory-based storage
-   **GZIP Compression** - Content encoding support with proper headers
-   **Modular Architecture** - Clean separation with dedicated routing and handler modules

## Technologies Used

-   **Node.js** (TCP server implementation, file system operations)
-   **JavaScript ES6+** (modern syntax, import/export modules)
-   **HTTP/1.1 Protocol** (custom implementation without frameworks)
-   **TCP Sockets** (raw network communication)
-   **GZIP Compression** (data compression for responses)

## Getting Started

### Prerequisites

-   Node.js (version 14 or higher)
-   npm or yarn package manager

### Manual Installation & Setup

1. **Clone the repository**

    ```bash
    git clone https://github.com/DadaLober/http-server-javascript.git
    cd http-server
    ```

2. **Grant execute permission**

    ```bash
    chmod +x setup.sh && ./setup.sh
    ```

3. **Start the server**

    ```bash
    # Using the shell script
    ./your_server.sh

    # Or run directly with Node.js
    node app/main.js --directory ./tmp
    ```

4. **Test the server**

    ```bash
    # Run the automated test suite
    ./test.sh

    # Or test manually with curl
    curl http://localhost:4221
    curl http://localhost:4221/echo/hello
    curl -H "User-Agent: MyTestAgent" http://localhost:4221/user-agent
    curl http://localhost:4221/files/readme.txt
    ```

### Automated Test Suite

The project includes a comprehensive test suite that validates:

-   **Connection handling** - TCP socket connections and disconnections
-   **HTTP parsing** - Request headers, methods, and body parsing
-   **Route functionality** - All endpoints (/, /echo, /user-agent, /files)
-   **File operations** - GET/POST file handling with various file types
-   **Compression** - GZIP encoding with different Accept-Encoding headers
-   **Error handling** - 404 responses and malformed requests

**Sample test output:**

```
✓ Server starts on port 4221
✓ Root endpoint returns 200 OK
✓ Echo endpoint with simple text
✓ Echo endpoint with GZIP compression
✓ User-Agent header extraction
✓ File GET operations
✓ File POST operations
✓ 404 handling for unknown routes
✓ Malformed request handling

All tests passed! 🎉
```

The server will start on `localhost:4221` and be ready to handle HTTP requests.

## Credits

This project was built as part of the [CodeCrafters "Build Your Own HTTP Server" Challenge](https://app.codecrafters.io/courses/http-server/overview). CodeCrafters provides hands-on programming challenges that help developers understand how popular technologies work under the hood.
