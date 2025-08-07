# HTTP/1.1 Server

A lightweight, custom HTTP/1.1 server built from scratch in Node.js using raw TCP sockets, demonstrates fundamental web protocol implementation without relying on high-level HTTP frameworks.

### Quick Setup

```bash
git clone https://github.com/DadaLober/http-server-javascript.git && cd http-server && chmod +x setup.sh && ./setup.sh
```

## Project Structure

```
http-server/
├── app/
│   ├── main.js           # Entry point
│   ├── utils.js          # HTTP parsing and route handling
│   ├── router.js         # Route definitions
│   └── routerHandler.js  # Route handlers
├── tmp/
│   ├── foo
│   └── readme.txt
├── .gitattributes
├── .gitignore
├── codecrafters.yml
├── package.json          # Dependencies and scripts
├── package-lock.json
├── your_server.sh        # Server startup script
├── setup.sh              # Setup script
├── test.sh               # Test script
└── README.md             # This file
```

## Features

- Built with raw TCP sockets (no frameworks)
- HTTP/1.1 request/response handling
- File serving and uploads
- GZIP compression support
- Clean modular structure

## Technologies Used

-   Node.js
-   JavaScript
-   HTTP/1.1 Protocol
-   TCP Sockets
-   GZIP Compression

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

## Testing

Includes tests for:
- TCP connections
- HTTP parsing
- Route functionality
- File operations
- GZIP compression
- Error handling

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

All tests passed! 🎉
```

The server will start on `localhost:4221` and be ready to handle HTTP requests.

## Credits

This project was built as part of the [CodeCrafters "Build Your Own HTTP Server" Challenge](https://app.codecrafters.io/courses/http-server/overview). CodeCrafters provides hands-on programming challenges that help developers understand how popular technologies work under the hood.
