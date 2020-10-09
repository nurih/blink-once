const { BlobServiceClient, RestError } = require('@azure/storage-blob');
const { v4: uuid4 } = require('uuid');

const EMULATOR_CONNECTION = 'DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;'

class Storage {
    async initialize() {
        try {
            const containerClient = Storage.getContainerClient();

            const createContainerResponse = await containerClient.createIfNotExists();

            console.log(`"Container ${this.ContainerName} was created successfully. requestId: ${createContainerResponse.requestId}`);

            return createContainerResponse.requestId;
        }
        catch (error) {
            throw error;
        }
    }

    static getContainerClient() {
        const blobServiceClient = BlobServiceClient.fromConnectionString(Storage.getConnectionString());

        const containerClient = blobServiceClient.getContainerClient(Storage.ContainerName);
        return containerClient;
    }

    async write(payload) {
        const id = Storage.createId();
        const blobName = Storage.getBlobName(id);

        try {
            const containerClient = Storage.getContainerClient();
            const blobClient = containerClient.getBlockBlobClient(blobName);

            const uploadBlobResponse = await blobClient.upload(payload, payload.length);
            console.log("Blob was uploaded successfully. requestId: ", uploadBlobResponse.requestId);

            return id;

        } catch (error) {
            throw error;
        }
    }

    static createId() {
        return (uuid4() + uuid4()).replace(/-/g,'');
    }

    async read(id) {
        try {
            const containerClient = Storage.getContainerClient();
            const blobName = Storage.getBlobName(id);
            const blobClient = containerClient.getBlockBlobClient(blobName);
            const response = await blobClient.download(0);

            const result = await streamToString(response.readableStreamBody);

            const deleteResponse = await blobClient.deleteIfExists(blobName, { deleteSnapshots: 'include' });
            console.info(`Delete blob ${blobName} after read response ${deleteResponse.succeeded}`);

            return result;
        } catch (error) {
            // if(error instanceof RestError){
            //     console.debug(`RestError ${error.statusCode} for request ${error.request.method} on ${error.request.url}`)
            // }
            // else{
            //     console.debug(error);
            // }

            throw error;
        }
    }

    static getConnectionString() {
        return process.env.AZURE_STORAGE_CONNECTION_STRING || EMULATOR_CONNECTION;
    }

    static get ContainerName() {
        return `blink-once`;
    }

    static getBlobName(id) {
        return `${id}.txt`;
    }
}

async function streamToString(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", (data) => {
            chunks.push(data.toString());
        });
        readableStream.on("end", () => {
            resolve(chunks.join(""));
        });
        readableStream.on("error", reject);
    });
}

module.exports = { Storage, EMULATOR_CONNECTION };
