
const manifestUrl = 'manifest.json';
export const globalizeChunkPrefix = 'globalize-compiled-data-';

class LocaleChunkLoader {

    /**
     * @param function onChunkLoaded To be called when a chunk has been loaded
     * @param function|undefined onManifestLoaded To be called when the manifest has been loaded
     */
    constructor(onChunkLoaded, onManifestLoaded) {
        this.onChunkLoaded = onChunkLoaded;
        this.onManifestLoaded = onManifestLoaded;
    }

    loadManifest() {
        const that = this;
        const fetchHeaders = new Headers({"accept": "application/json", 'X-Requested-With': 'XMLHttpRequest'});
        fetch(manifestUrl, { headers: fetchHeaders }).then(response => {
            return response.json();
        })
            .then(
                json => {
                    if (this.onManifestLoaded !== undefined) {
                        that.manifest = json;
                        that.onManifestLoaded(json);
                    }
                });

    }

    loadChunkFor(locale) {
        // We could keep track of the chunks that are already loaded and not reload them,
        // but the typical user only selects his locale once.
        // Setting a locale cookie and auto select the locale from the cookie would make more sense.

        const chunk = globalizeChunkPrefix + locale + '.js';
        const that = this;
        const onLoaded = () => {
            that.onChunkLoaded(locale);
        }

        // Is there really no better way to dynamically load these chunks?
        const el = document.createElement('script');
        el.onload = onLoaded;
        el.onreadystatechange = onLoaded;
        el.src = this.manifest[chunk];
        document.body.appendChild(el);
    }

}

export default LocaleChunkLoader