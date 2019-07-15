const mainLocaleFiles = [
    "ca-generic.json",
    "ca-gregorian.json",
    "numbers.json",
    "currencies.json",
    "dateFields.json",
    "timeZoneNames.json",
    "units.json"];

import Globalize from "globalize";

Globalize.load(
//    require( "cldr-data/supplemental/aliases.json" ),
//    require( "cldr-data/supplemental/calendarData.json" ),
//    require( "cldr-data/supplemental/calendarPreferenceData.json" ),
//    require( "cldr-data/supplemental/characterFallbacks.json" ),
//    require( "cldr-data/supplemental/codeMappings.json" ),
require( "cldr-data/supplemental/currencyData.json" ),
//    require( "cldr-data/supplemental/dayPeriods.json" ),
//    require( "cldr-data/supplemental/gender.json" ),
//    require( "cldr-data/supplemental/languageData.json" ),
//    require( "cldr-data/supplemental/languageGroups.json" ),
//    require( "cldr-data/supplemental/languageMatching.json" ),
    require( "cldr-data/supplemental/likelySubtags.json" ),
//    require( "cldr-data/supplemental/measurementData.json" ),
//    require( "cldr-data/supplemental/metaZones.json" ),
    require( "cldr-data/supplemental/numberingSystems.json" ),
//    require( "cldr-data/supplemental/ordinals.json" ),
//    require( "cldr-data/supplemental/parentLocales.json" ),
    require( "cldr-data/supplemental/plurals.json" ),
//    require( "cldr-data/supplemental/primaryZones.json" ),
//    require( "cldr-data/supplemental/references.json" ),
//    require( "cldr-data/supplemental/territoryContainment.json" ),
//    require( "cldr-data/supplemental/territoryInfo.json" ),
    require( "cldr-data/supplemental/timeData.json" ),
//    require( "cldr-data/supplemental/weekData.json" ),
    //    require( "cldr-data/supplemental/windowsZones.json" ),
);

class LocaleDataLoader {

    /**
     * @param function onChunkLoaded To be called when a chunk has been loaded
     */
    constructor(onDataLoaded) {
        this.onDataLoaded = onDataLoaded;
    }

    mainPaths(locale) {
        const basePath = 'node_modules/cldr-data/main/';
        const result = [];
        for (let file of mainLocaleFiles) {
            result.push(basePath + locale + '/' + file);
        }
        return result;
    }

    loadDataFor(locale) {
        // We could keep track of the chunks that are already loaded and not reload them,
        // but the typical user only selects his locale once.

        const that = this;
        let loadCount = 0;

        const fetchHeaders = new Headers({"accept": "application/json", 'X-Requested-With': 'XMLHttpRequest'});

        fetch("messages/" + locale + ".json", { headers: fetchHeaders }).then(response => {
            return response.json();
        })
        .then(
            json => {
                Globalize.loadMessages(json);
                loadCount++;
                that.ifAllLoadedCallLoaded(loadCount, locale);
            });

        for (let url of that.mainPaths(locale)) {
            fetch(url, { headers: fetchHeaders }).then(response => {
                return response.json();
            })
            .then(
                json => {
                    Globalize.load(json);
                    loadCount++;
                    that.ifAllLoadedCallLoaded(loadCount, locale);
                });
        }
    }

    ifAllLoadedCallLoaded(loadCount, locale) {
        if (loadCount > mainLocaleFiles.length + 1) {
            alert('loaded too many');
        }
        if (loadCount > mainLocaleFiles.length) {
            this.onDataLoaded(locale);
        }
    }
}

export default LocaleDataLoader