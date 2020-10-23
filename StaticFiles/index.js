const fs = require('fs').promises;

module.exports = async function (context, req) {


    const relativePath = req.query.path || 'index.html';
    const filePath = `UI/${relativePath}`
    const buffer = await fs.readFile(filePath);
    
    const html = buffer.toString();    

    context.res = {
        body: html,
        headers: {
            'Content-Type': getMime(filePath)
        }
    };

};

function getMime(path){
    if(path.match(/\.js$/)) return 'text/javascript';
    if(path.match(/\.html$/)) return 'text/html';
    throw new Error(`${path} content type not supported.`);
}
