/** In order to simplify removing this demo code this
 * class has not been refactored into SOLID components.
 */

const localeSettings = require("../localeSettings.json");

import Globalize from "globalize";
// supplementals are loaded by LocaleDataLoader

// remove this if you do not need timezones, it's 2,9 Mb!
Globalize.loadTimeZone(
    require( 'iana-tz-data' )
);

// Stacially load data for initial locale,
// hardcoded locale, to be adapted to actual initial locale
Globalize.loadMessages(
    require( "../messages/en.json" ),
);
Globalize.load(
    require( "cldr-data/main/en/ca-generic.json" ),
    require( "cldr-data/main/en/ca-gregorian.json" ),
    require( "cldr-data/main/en/numbers.json" ),
    require( "cldr-data/main/en/currencies.json" ),
    require( "cldr-data/main/en/dateFields.json" ),
    require( "cldr-data/main/en/timeZoneNames.json" ),
    require( "cldr-data/main/en/units.json" ),
);
Globalize.locale(localeSettings.initialLocale);

import LocaleDataLoader, {globalizeChunkPrefix} from './globalize/LocaleDataLoader.js'

function App(props) {
    this.props = props;
    this.availableLocales = localeSettings.supportedLocales;
    this.startTime = new Date();
    this.elapsedTime = 0;
    this.locale = localeSettings.initialLocale;
    this.formatters = {};
    this.initFormatters();
    this.localeDataLoader = new LocaleDataLoader(localeSettings, this.localeDataLoaded.bind(this))
}

App.prototype.componentDidMount = function() {
    this.timerId = setInterval(
        () => this.tick(),
        1000
    );
    this.renderSelectLocale();
    document.getElementById( "selectLocale" ).onchange = this.changeLocale.bind(this);
}

App.prototype.componentWillUnmount = function() {
        clearInterval(this.timerId);
    }

App.prototype.tick = function() {
        this.elapsedTime =  +( ( this.startTime - new Date() ) / 1000 ).toFixed( 0 );
        this.render();
    }

App.prototype.initFormatters = function() {
    // LIMITATION of Globalize Webpack Plugin: formatters must be configured with
    // literal expressions. Using constants or variables will not work!
    this.formatters.number = Globalize.numberFormatter({ maximumFractionDigits: 2 });
    this.formatters.numberCompact = Globalize.numberFormatter({
        compact: "short",
        minimumSignificantDigits: 1,
        maximumSignificantDigits: 3
    });
    this.formatters.currency = Globalize.currencyFormatter( "USD" );
    this.formatters.date = Globalize.dateFormatter({ datetime: "medium" });
    this.formatters.dateWithTimeZone = Globalize.dateFormatter({
        datetime: "full",
        timeZone: "America/Sao_Paulo"
    });
    const _dateToPartsFormatter = Globalize.dateToPartsFormatter({ datetime: "medium" });
    this.formatters.dateToParts = function( value ) {
        return _dateToPartsFormatter( value, {
            datetime: "medium"
        }).map(function( part ) {
            switch(part.type) {
                case "month": return "<strong>" + part.value + "</strong>";
                default: return part.value;
            }
        }).reduce(function( memo, value ) {
            return memo + value;
        });
    };
    this.formatters.relativeTime = Globalize.relativeTimeFormatter( "second" );
    this.formatters.unit = Globalize.unitFormatter( "mile/hour", { form: "short" } );
}

App.prototype.render = function() {
    // Messages.
    const message1 = Globalize.formatMessage( "message-1", {
        currency: this.formatters.currency( 69900 ),
        date: this.formatters.date( new Date() ),
        number: this.formatters.number( 12345.6789 ),
        relativeTime: this.formatters.relativeTime( this.elapsedTime ),
        unit: this.formatters.unit( 60 )
    });

    // Standalone table.
    document.getElementById( "number" ).textContent = this.formatters.number( 12345.6789 );
    document.getElementById( "number-compact" ).textContent = this.formatters.numberCompact( 12345.6789 );
    document.getElementById( "currency" ).textContent = this.formatters.currency( 69900 );
    document.getElementById( "date" ).textContent = this.formatters.date( new Date() );
    document.getElementById( "date-time-zone" ).textContent = this.formatters.dateWithTimeZone( new Date() );
    document.getElementById( "date-to-parts" ).innerHTML = this.formatters.dateToParts( new Date() );
    document.getElementById( "relative-time" ).textContent = this.formatters.relativeTime( this.elapsedTime );
    document.getElementById( "unit" ).textContent = this.formatters.unit( 60 );

// Messages.
    document.getElementById( "intro-1" ).textContent = Globalize.formatMessage( "intro-1" );
    document.getElementById( "number-label" ).textContent = Globalize.formatMessage( "number-label" );
    document.getElementById( "number-compact-label" ).textContent = Globalize.formatMessage( "number-compact-label" );
    document.getElementById( "currency-label" ).textContent = Globalize.formatMessage( "currency-label" );
    document.getElementById( "date-label" ).textContent = Globalize.formatMessage( "date-label" );
    document.getElementById( "date-time-zone-label" ).textContent = Globalize.formatMessage( "date-time-zone-label" );
    document.getElementById( "date-to-parts-label" ).textContent = Globalize.formatMessage( "date-to-parts-label" );
    document.getElementById( "relative-time-label" ).textContent = Globalize.formatMessage( "relative-time-label" );
    document.getElementById( "unit-label" ).textContent = Globalize.formatMessage( "unit-label" );
    document.getElementById( "message-1" ).textContent = message1;

    document.getElementById( "message-2" ).textContent = Globalize.formatMessage( "message-2", {
        count: 3
    });
}

App.prototype.renderSelectLocale = function() {
    const links = [];
    for (let locale of this.availableLocales) {
        const selected = locale == this.locale ? 'SELECTED ' : '';
        links.push('<option ' + selected + ' value="' + locale + '">' + locale + '</option>');
    };
    document.getElementById( "selectLocale" ).innerHTML = links.join("\n");
}

App.prototype.changeLocale = function(e) {
    this.localeDataLoader.loadDataFor(e.target.value);
}

App.prototype.localeDataLoaded = function(locale) {
    Globalize.locale(locale);
    this.initFormatters();
    this.locale = locale;
    this.render();
}

export default App;
