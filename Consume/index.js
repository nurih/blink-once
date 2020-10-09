const { Storage } = require('../lib/storage');

module.exports = async function (context, req) {

    const id = req.query.id;
    if (!id) {
        return missingIdErrorResponse()
    }

    try {
        const payload = await new Storage().read(id);
        return payloadResponse(id, payload);
    } catch (error) {
        return missingContentErrorResponse(id);
    }
}


function payloadResponse(id, payload) {
    return {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        },
        body: { id: id, text: payload }
    };
}

function missingIdErrorResponse() {
    return {
        status: 400,
        headers: {
            'Content-Type': 'application/json'
        },
        body: { details: 'No id' }
    };
}

function missingContentErrorResponse(id) {
    return {
        status: 410,
        headers: {
            'Content-Type': 'application/json'
        },
        body: { details: `${id} is gone.` }
    };
}
