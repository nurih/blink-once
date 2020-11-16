const API_URL = `${window.location.protocol}//${window.location.host}/api`;
const blinkData = new BlinkOnceData(API_URL);
const app = Vue.createApp({
    data: function () {
        return {
            newBlinkyText: '',
            newBlinkyUrl: '',
            idFromUrl: getIdFromUrl(),
            idFromForm: getIdFromUrl(),
            consumedData: {},
            isBusy: false
        }
    },
    methods:
    {
        async createBlinky() {
            try {
                this.$data.isBusy = true;

                const response = await blinkData.memorize(this.newBlinkyText);
                this.newBlinkyUrl = `${window.location.href}?id=${response.id}`;
                this.newBlinkyText = '';

            } catch (error) {
                console.log(error);
            }
            finally {
                this.$data.isBusy = false;
            }
        },

        async consumeBlinky() {
            try {
                this.$data.isBusy = true;

                this.newBlinkyUrl = '';
                const id = this.idFromForm || this.idFromUrl;

                console.log('Trying to get', id)
                this.consumedData = await blinkData.consume(id);

            } catch (error) {
                console.log(error);
            }
            finally {
                this.$data.isBusy = false;
            }

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
