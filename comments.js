// Create web server

// Load modules
const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

// Load comments
const comments = require('./comments.json');

// Create web server
http.createServer((req, res) => {
    // Get URL
    const urlParsed = url.parse(req.url);
    // Get query
    const query = qs.parse(urlParsed.query);

    // Get pathname
    let pathname = urlParsed.pathname;
    if (pathname === '/') {
        pathname = '/index.html';
    }

    // Get method
    if (req.method === 'GET') {
        // GET method
        if (pathname === '/comments') {
            // Send comments
            res.end(JSON.stringify(comments));
        } else {
            // Read file
            fs.readFile(`.${pathname}`, (err, data) => {
                if (err) {
                    // Error
                    res.statusCode = 404;
                    res.end('Not found');
                } else {
                    // Send data
                    res.end(data);
                }
            });
        }
    } else if (req.method === 'POST') {
        // POST method
        if (pathname === '/comments') {
            // Get data
            let body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('end', () => {
                // Parse
                const newComment = qs.parse(body);
                // Add comment
                comments.push(newComment);
                // Save
                fs.writeFile('./comments.json', JSON.stringify(comments), (err) => {
                    if (err) {
                        // Error
                        res.statusCode = 500;
                        res.end('Internal Server Error');
                    } else {
                        // Send data
                        res.end(JSON.stringify(comments));
                    }
                });
            });
        } else {
            // Error
            res.statusCode = 404;
            res.end('Not found');
        }
    }
}).listen(3000, () => {
    console.log('Server is running');
});