
# Test Nodejs Grade 3

This project is a test environment designed to evaluate the performance of Node.js running in cluster mode. The focus is on:

- Node.js Clustering: Running the application in multiple instances to utilize multiple CPU cores.
- Logging: Using Winston for efficient logging to monitor application behavior.
- Load Testing: Utilizing Artillery to simulate high traffic and test the application's performance.

Key aspects of the project include:

- Node.js Cluster: The backend runs in cluster mode, allowing for better CPU utilization and higher throughput.
- Winston Logging: Integrated for detailed logging to help with debugging and monitoring.
- Artillery Load Testing: Employed to test and validate the application’s response to increased load and traffic.
## Installation
 
Dependencies

```bash
    cd Test-Nodejs-3
    npm install
```
Artillery

```bash
    npm install -g artillery
```
## Prerequisite


```bash
   Mongodb running on Port 27017
```

## Usage

Build the Application

```bash
   npm run build
```

Start the Application

```bash
   npm run start
```
Start load test

```bash
   npm run load
```

