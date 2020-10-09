const { Storage } = require('../common/storage');


module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const payload = req.body;
    if (!payload) {
        return missingBodyErrorResponse();
    }

    const id = await new Storage().write(payload);

    return itemCreatedResponse(id);
}

function itemCreatedResponse(id) {
    return {
        status: 201,
        headers: {
            'Content-Type': 'application/json'
        },
        body: { id: id }
    };
}

function missingBodyErrorResponse() {
    return {
        status : 400,
        headers: {
            'Content-Type': 'application/json'
        },
        body: { details: 'No payload' }
    };
}
