const { Storage, EMULATOR_CONNECTION } = require('./storage');
const { RestError } = require('@azure/storage-blob');

describe('ConnectionString', () => {
    it('uses supplied', () => {
        const actual = new Storage('DUMMY_VALUE').ConnectionString;
        expect(actual).toBe('DUMMY_VALUE');
    });

    it('uses local default when not supplied', () => {
        const actual = new Storage().ConnectionString;
        expect(process.env.AZURE_STORAGE_CONNECTION_STRING).toBeFalsy();
        expect(actual).toBe(EMULATOR_CONNECTION);
    });
})

describe('ContainerName', () => {
    it('Gets container name', () => {
        const actual = Storage.ContainerName;

        expect(actual).toEqual('blink-once');
    });
})

describe('createId', ()=>{
    it('has hex only',()=>{
        expect(Storage.createId()).toMatch(/^[a-f0-9]+$/)
    })
})
describe('initialize', () => {
    it('runs', async () => {
        const actual = await (new Storage()).createContainer();
        expect(actual).toBeTruthy();
    })
})

describe('write', () => {
    it('returns blob id', async () => {
        const actual = await (new Storage().write('Hello Blink Once!'));
        expect(actual.length).toEqual(64);
    })
})

describe('round-trip', () => {
    it('reads blob that was written', async () => {
        const instance = new Storage();
        const id = await instance.write('Hello Blink Once!');
        const actual = await instance.read(id);

        expect(actual).toBe('Hello Blink Once!');
    });

    it('throws when not found', async () => {
        const instance = new Storage();
        expect(async () => {
            await instance.read('dummy-id');
        }).rejects.toThrow(RestError);
    });
})

