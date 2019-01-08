var Globalize = require( "globalize" );

// We are outside Webpack so we need to load CLDR content
Globalize.load(
    require( "cldr-data/main/en/ca-gregorian" ),
//    require( "cldr-data/main/en/currencies" ),
    require( "cldr-data/main/en/dateFields" ),
    require( "cldr-data/main/en/numbers" ),
//    require( "cldr-data/main/en/timeZoneNames" ),
//    require( "cldr-data/main/en/units" ),
//    require( "cldr-data/supplemental/currencyData" ),
    require( "cldr-data/supplemental/likelySubtags" ),
//    require( "cldr-data/supplemental/metaZones" ),
    require( "cldr-data/supplemental/plurals" ),
//    require( "cldr-data/supplemental/timeData" ),
//    require( "cldr-data/supplemental/weekData" )
);
// This would be our own messages
Globalize.loadMessages( require( "../messages/en" ) );

// Globalize.loadTimeZone( require( "iana-tz-data" ) );

Globalize.locale( "en" );


test('Number formatting', () => {
    const numberFormatter = Globalize.numberFormatter({maximumFractionDigits: 2});
    expect(numberFormatter(12345.6789)).toEqual('12,345.68');
});

test('Simple message translation', () => {
    expect(Globalize.formatMessage("intro-1"))
        .toEqual('Use Globalize to internationalize your application.');
});

test('Parameterized message', () => {
    const message = Globalize.formatMessage( "message-1", {
        currency: 'an amount of money',
        date: 'a date',
        number: 'a number',
        relativeTime: 'a number of seconds',
        unit: 'a unit'
    });
    expect(message).toEqual("An example of a message using mixed number \"a number\", currency \"an amount of money\", date \"a date\", relative time \"a number of seconds\", and unit \"a unit\".");
});

test('Message with pluralization', () => {
    expect(
        Globalize.formatMessage( "message-2", {
            count: 3
        })
    )
        .toEqual('An example of a message with pluralization support: You have 3 remaining tasks.');
});
