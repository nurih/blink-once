const API_URL = 'http://localhost:7071/api';
const blinkData = new BlinkOnceData(API_URL);
const app = Vue.createApp({
    data: function () {
        return {
            newBlinkyText: '',
            newBlinkyUrl: '',
            idFromUrl: getIdFromUrl(),
            idFromForm: getIdFromUrl(),
            consumedData: {}
        }
    },
    methods:
    {
        async createBlinky() {
            try {
                const response = await blinkData.memorize(this.newBlinkyText);
                this.newBlinkyUrl = `${window.location.href}?id=${response.id}`;
                this.newBlinkyText = '';
            } catch (error) {
                console.log(error);
            }
        },

        async consumeBlinky() {
            this.newBlinkyUrl = '';
            const id = this.idFromForm || this.idFromUrl;

            console.log('Trying to get', id)
            this.consumedData = await blinkData.consume(id);
        },
        copyToClipboard(elementId) {
            var sourceElement = document.getElementById(elementId);
            sourceElement.select();
            sourceElement.setSelectionRange(0, 99999)
            document.execCommand("copy");

        },
        reset() {
            newBlinkyText = '';
            newBlinkyUrl = '';
            consumeId = '';
            consumedData = {};
        }
    },
    created: async function () {
        if (this.idFromForm || this.idFromUrl) { this.consumeBlinky(); };
    }
}).mount('#app');

function getIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}
