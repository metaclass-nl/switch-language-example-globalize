

import React from "react";
import ReactDOM from "react-dom";
import Globalize from "globalize";

// Formatters
var numberFormatter = Globalize.numberFormatter({ maximumFractionDigits: 2 });
var numberCompactFormatter = Globalize.numberFormatter({
    compact: "short",
    minimumSignificantDigits: 1,
    maximumSignificantDigits: 3
});
var currencyFormatter = Globalize.currencyFormatter( "USD" );
var dateFormatter = Globalize.dateFormatter({ datetime: "medium" });
var dateWithTimeZoneFormatter = Globalize.dateFormatter({
    datetime: "full",
    timeZone: "America/Sao_Paulo"
});
var _dateToPartsFormatter = Globalize.dateToPartsFormatter({ datetime: "medium" });
var dateToPartsFormatter = function( value ) {
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
var relativeTimeFormatter = Globalize.relativeTimeFormatter( "second" );
var unitFormatter = Globalize.unitFormatter( "mile/hour", { form: "short" } );

var startTime = new Date();

const Index = () => {

    var elapsedTime = +( ( startTime - new Date() ) / 1000 ).toFixed( 0 );

    // Messages.
    const message1 = Globalize.formatMessage( "message-1", {
        currency: currencyFormatter( 69900 ),
        date: dateFormatter( new Date() ),
        number: numberFormatter( 12345.6789 ),
        relativeTime: relativeTimeFormatter( elapsedTime ),
        unit: unitFormatter( 60 )
    });

    return <div id="demo">
        <h1>Globalize App example using Webpack (and React)</h1>

        <p id="intro-1">{Globalize.formatMessage( "intro-1" )}</p>
        <table border="1" style={{marginBottom: "1em"}}>
            <tbody>
            <tr>
                <td><span id="number-label">{Globalize.formatMessage( "number-label" )}</span></td>
                <td>"<span id="number">{numberFormatter( 12345.6789 )}</span>"</td>
            </tr>
            <tr>
                <td><span id="number-compact-label">{Globalize.formatMessage( "number-compact-label" )}</span></td>
                <td>"<span id="number-compact">{numberCompactFormatter( 12345.6789 )}</span>"</td>
            </tr>
            <tr>
                <td><span id="currency-label">{Globalize.formatMessage( "currency-label" )}</span></td>
                <td>"<span id="currency">{currencyFormatter( 69900 )}</span>"</td>
            </tr>
            <tr>
                <td><span id="date-label">{Globalize.formatMessage( "date-label" )}</span></td>
                <td>"<span id="date">{dateFormatter( new Date() )}</span>"</td>
            </tr>
            <tr>
                <td><span id="date-time-zone-label">{Globalize.formatMessage( "date-time-zone-label" )}</span></td>
                <td>"<span id="date-time-zone">{dateWithTimeZoneFormatter( new Date() )}</span>"</td>
            </tr>
            <tr>
                <td><span id="date-to-parts-label">{Globalize.formatMessage( "date-to-parts-label" )}</span></td>
                <td>"<span id="date-to-parts">{dateToPartsFormatter( new Date() )}</span>"</td>
            </tr>
            <tr>
                <td><span id="relative-time-label">{Globalize.formatMessage( "relative-time-label" )}</span></td>
                <td>"<span id="relative-time">{relativeTimeFormatter( elapsedTime )}</span>"</td>
            </tr>
            <tr>
                <td><span id="unit-label">{Globalize.formatMessage( "unit-label" )}</span></td>
                <td>"<span id="unit">{unitFormatter( 60 )}</span>"</td>
            </tr>
            </tbody>
        </table>
        <p id="message-1">
            {message1}
        </p>
        <p id="message-2">
            {Globalize.formatMessage( "message-2", {
                count: 3
            })}
        </p>
    </div>;
};

ReactDOM.render(<Index />, document.getElementById("root"));

// Refresh elapsed time
setInterval(function() {
    var elapsedTime = +( ( startTime - new Date() ) / 1000 ).toFixed( 0 );
    ReactDOM.render(<Index />, document.getElementById("root"));
}, 1000);

const fetchHeaders = new Headers({"accept": "application/json", 'X-Requested-With': 'XMLHttpRequest'});
fetch('manifest.json', { headers: fetchHeaders }).then(response => {
        return response.json();
    })
    .then(
        json => {
//            alert(JSON.stringify(json));
        });

// require('i18n/de.js');
// Globalize.setLocale('de');
