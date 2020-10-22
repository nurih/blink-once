class BlinkOnceData {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    get memorizeUrl() { return this.baseUrl + '/Memorize'; }
    get consumeUrl() { return this.baseUrl + '/Consume'; }
    async memorize(rawData) {
        try {
            const response = await fetch(this.memorizeUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                    'Content-Length': rawData.length
                },
                body: rawData
            });

            const responseData = await response.json();
            return responseData;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async consume(id) {
        try {
            const getUrl = `${this.consumeUrl}?id=${id}`;
            const response = await fetch(getUrl, { method: 'GET' });
            const responseData = await response.json();
            return {ok: response.ok, status: response.status, ...responseData};
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
}
