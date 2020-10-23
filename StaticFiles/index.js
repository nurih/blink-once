const fs = require('fs');

module.exports = async function (context, req) {


    const relativePath = (req.query.path);
    const filePath = `UI/${relativePath}`
    const buffer = await fs.readFile(filePath);
    
    const html = buffer.toString();    

    context.res = {
        body: html,
        headers: {
            'Content-Type': 'text/html'
        }
    };

};

