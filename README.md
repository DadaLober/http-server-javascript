# HTTP/1.1 Server
A lightweight, custom HTTP/1.1 server built from scratch in Node.js using raw TCP sockets. This server demonstrates fundamental web protocol implementation without relying on high-level HTTP frameworks.

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
├── utput                 
└── README.md             # This file
```

## Key Features

- **Raw TCP Implementation** - Built from scratch using Node.js TCP sockets without HTTP frameworks
- **HTTP/1.1 Compliance** - Proper request parsing, header handling, and response generation
- **File Operations** - GET/POST file serving and uploads with directory-based storage
- **GZIP Compression** - Content encoding support with proper headers
- **Modular Architecture** - Clean separation with dedicated routing and handler modules
- **Multi-client Support** - Concurrent connection handling with graceful error management

## Technologies Used

- **Node.js** (TCP server implementation, file system operations)
- **JavaScript ES6+** (modern syntax, import/export modules)
- **HTTP/1.1 Protocol** (custom implementation without frameworks)
- **TCP Sockets** (raw network communication)
- **GZIP Compression** (data compression for responses)

## Credits

This project was built as part of the [CodeCrafters "Build Your Own HTTP Server" Challenge](https://app.codecrafters.io/courses/http-server/overview). CodeCrafters provides hands-on programming challenges that help developers understand how popular technologies work under the hood.
