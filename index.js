'use strict';
const http = require('http');
const pug = require('pug');
const { URLSearchParams } = require('url');
const Todo = require('./lib/db-access');

const server = http.createServer((req, res) => {
    switch (req.method) {
        case 'GET':
            getHandle(req, res);
            break;
        case 'POST':
            switch(req.url){
                case '/':
                    postHandle(req, res);
                    break;
                case '/delete':
                    deleteHandle(req, res);
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
});

/**
 * GETに対しての処理
 * @param {*} req 
 * @param {*} res 
 */
async function getHandle(req, res) {
    // awaitがないと表示されない
    const todos = await Todo.findAll({order:[['id', 'DESC']]});
  
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
    });
    res.end(pug.renderFile('./views/index.pug', { todos }));
};

/**
 * POSTに対しての処理
 * @param {*} req 
 * @param {*} res 
 */
async function postHandle(req, res) {
    let rawData = '';

    req
    .on('data', chunk => {
        rawData += chunk;
    })
    .on('end', async () => {
        // デコード
        //const decoded = decodeURIComponent(rawData);
        const decoded = new URLSearchParams(rawData);
        console.log(decoded.get('todo'));

        // レコード生成
        await Todo.create({content: decoded.get('todo')});

        // リダイレクト
        handleRedirect(req, res);
    });
};

/**
 * 削除に対しての処理
 * @param {*} req 
 * @param {*} res 
 */
function deleteHandle(req, res) {
    let body = '';
    req
    .on('data', chunk => {
        body += chunk;
    })
    .on('end', async () => {
        const params = new URLSearchParams(body);
        const id = params.get('id');
        const todo = await Todo.findByPk(id);
        await todo.destroy();
        console.log('delete');

        handleRedirect(req, res);
    });
};

/**
 * リダイレクト処理
 */
function handleRedirect(req, res) {
    res.writeHead(303, {
        'Location': '/'
    });
    res.end();
};

const port = process.env.PORT || 8000;
server.listen(port, () => {
    console.log(`Listening on ${port}`);
});