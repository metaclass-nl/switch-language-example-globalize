/** In order to simplify removing this demo code this
 * class has not been refactored into SOLID components.
 */

import React, { Component } from 'react';

import Globalize from "globalize";
const globalizeChunkPrefix = 'globalize-compiled-data-';

// Formatters - usually placed in a seperate file and exported from there so
// that they can be imported anywhere in the application
//
// LIMITATION of Globalize Webpack Plugin: formatters must be configured with
// literal expressions. Using constants or variables will not work!

const numberFormatter = Globalize.numberFormatter({ maximumFractionDigits: 2 });
const numberCompactFormatter = Globalize.numberFormatter({
    compact: "short",
    minimumSignificantDigits: 1,
    maximumSignificantDigits: 3
});
const currencyFormatter = Globalize.currencyFormatter( "USD" );
const dateFormatter = Globalize.dateFormatter({ datetime: "medium" });
const dateWithTimeZoneFormatter = Globalize.dateFormatter({
    datetime: "full",
    timeZone: "America/Sao_Paulo"
});
const _dateToPartsFormatter = Globalize.dateToPartsFormatter({ datetime: "medium" });
const dateToPartsFormatter = function( value ) {
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
const relativeTimeFormatter = Globalize.relativeTimeFormatter( "second" );
const unitFormatter = Globalize.unitFormatter( "mile/hour", { form: "short" } );


class App extends Component {
    constructor(props) {
        super(props);
        this.startTime = new Date();
        this.state = {elapsedTime: 0, locale: 'en'};
        this.loadManifest();
    }

    componentDidMount() {
        this.timerId = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    tick() {
        this.setState({
            elapsedTime: +( ( this.startTime - new Date() ) / 1000 ).toFixed( 0 )
        });
    }

    render() {
        // Messages.
        const message1 = Globalize.formatMessage( "message-1", {
            currency: currencyFormatter( 69900 ),
            date: dateFormatter( new Date() ),
            number: numberFormatter( 12345.6789 ),
            relativeTime: relativeTimeFormatter( this.state.elapsedTime ),
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
                    <td>"<span id="relative-time">{relativeTimeFormatter( this.state.elapsedTime )}</span>"</td>
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
            <p>
                { Globalize.formatMessage( "message-current-locale", {locale: this.state.locale}) }.
            </p>
            {this.renderSelectLocale()}
        </div>;
    }

    // Normally the following would be in a seperate SelectLocale component

    renderSelectLocale() {
        if (this.state.manifest === undefined) {
            return;
        }
        const links = [];
        var chunk;
        let comma = '';
        for (chunk in this.state.manifest) {
            if (chunk.startsWith(globalizeChunkPrefix)) {
                let locale = chunk.substr(globalizeChunkPrefix.length, chunk.length - globalizeChunkPrefix.length - 3);
                if (locale != this.state.locale) {
                    links.push(<span key={locale}>{comma}<a href="#" onClick={this.changeLocale.bind(this)} id={locale}>{locale}</a></span>)
                    let comma = ', ';
                }
            }
        };
        return <p>
            { Globalize.formatMessage( "message-change-locale") }&nbsp;
            {links}.
        </p>
    }

    loadManifest() {
        const that = this;
        const fetchHeaders = new Headers({"accept": "application/json", 'X-Requested-With': 'XMLHttpRequest'});
        fetch('manifest.json', { headers: fetchHeaders }).then(response => {
            return response.json();
        })
            .then(
                json => {
                    that.setState({manifest: json});
                });

    }

    changeLocale(e) {
        // We could keep track of the chunks that are already loaded and not reload them,
        // but the typical user only selects his locale once.
        // Setting a locale cookie and auto select the locale from the cookie would make more sense.

        e.preventDefault();
        const chunk = globalizeChunkPrefix + e.target.id + '.js';

        // Is there really no better way to dynamically load these chunks?
        const el = document.createElement('script');
        const onLoaded = this.chunkLoaded.bind(this, e.target.id);
        el.onload = onLoaded;
        el.onreadystatechange = onLoaded;
        el.src = this.state.manifest[chunk];
        document.body.appendChild(el);
    }

    chunkLoaded(locale) {
        Globalize.locale(locale);
        this.setState({locale: locale});
    }
}

export default App;
