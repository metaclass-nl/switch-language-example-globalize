const mainLocaleFiles = [
    "ca-generic.json",
    "ca-gregorian.json",
    "numbers.json",
    "currencies.json",
    "dateFields.json",
    "timeZoneNames.json",
    "units.json"];

import Globalize from "globalize";

// You may have to activate more loading of supplemental data depending
// of the Globalize functions you use in your application.
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

/**
 * Loads aditional localization data dynamically at run time from the web server.
 */
class LocaleDataLoader {

    /**
     * @param function onChunkLoaded To be called when a chunk has been loaded
     */
    constructor(localeSettings, onDataLoaded) {
        this.localeSettings = localeSettings;
        this.loaded = { };
        this.loaded[localeSettings.initialLocale] = true; // Data of initial locale is supposed to be loaded statically by App
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
        if (this.localeSettings.supportedLocales.indexOf(locale) == -1) {
            // eslint-disable-next-line no-console
            console.log('Locale not supported: ' + locale);
            return;
        }
        if (this.loaded[locale]) {
            return this.onDataLoaded(locale);
        }

        const that = this;
        let loadCount = 0;

        const fetchHeaders = new Headers({"accept": "application/json", 'X-Requested-With': 'XMLHttpRequest'});

        fetch(this.localeSettings.messages + "/" + locale + ".json", { headers: fetchHeaders }).then(response => {
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
         if (loadCount > mainLocaleFiles.length) {
            this.loaded[locale] = true;
            this.onDataLoaded(locale);
        }
    }
}

export default LocaleDataLoader