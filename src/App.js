/** In order to simplify removing this demo code this
 * class has not been refactored into SOLID components.
 */

import React, { Component } from 'react';

import Globalize from "globalize";
// make this LocaleDataLoader
import LocaleChunkLoader, {globalizeChunkPrefix} from './globalizeWebpackPlugin/LocaleChunkLoader.js'

import 'react-widgets/dist/css/react-widgets.css';
import NumberPicker from 'react-widgets/lib/NumberPicker';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import DateConverters from "./reactWidgets/DateConverters.js";
import NumberConverters from "./reactWidgets/NumberConverters.js";
import globalizeLocalizer from "react-widgets-globalize";
globalizeLocalizer();

const initialLocale = 'en';

class App extends Component {

    constructor(props) {
        super(props);
        this.startTime = new Date();
        this.state = {elapsedTime: 0, locale: initialLocale};
        this.formatters = {};
        this.initFormatters();
        this.localeChunkLoader = new LocaleChunkLoader(this.chunkLoaded.bind(this), this.manifestLoaded.bind(this))
    }

    componentDidMount() {
        this.localeChunkLoader.loadManifest();
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

    initFormatters() {
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

    render() {
        // Messages.
        const message1 = Globalize.formatMessage( "message-1", {
            currency: this.formatters.currency( 69900 ),
            date: this.formatters.date( new Date() ),
            number: this.formatters.number( 12345.6789 ),
            relativeTime: this.formatters.relativeTime( this.state.elapsedTime ),
            unit: this.formatters.unit( 60 )
        });

        return <div id="demo">
            <h1>Globalize App example using Webpack (and React)</h1>

            <p id="intro-1">{Globalize.formatMessage( "intro-1" )}</p>
            <table border="1" style={{marginBottom: "1em"}}>
                <tbody>
                <tr>
                    <td><span id="number-label">{Globalize.formatMessage( "number-label" )}</span></td>
                    <td>"<span id="number">{this.formatters.number( 12345.6789 )}</span>"</td>
                </tr>
                <tr>
                    <td><span id="number-compact-label">{Globalize.formatMessage( "number-compact-label" )}</span></td>
                    <td>"<span id="number-compact">{this.formatters.numberCompact( 12345.6789 )}</span>"</td>
                </tr>
                <tr>
                    <td><span id="currency-label">{Globalize.formatMessage( "currency-label" )}</span></td>
                    <td>"<span id="currency">{this.formatters.currency( 69900 )}</span>"</td>
                </tr>
                <tr>
                    <td><span id="date-label">{Globalize.formatMessage( "date-label" )}</span></td>
                    <td>"<span id="date">{this.formatters.date( new Date() )}</span>"</td>
                </tr>
                <tr>
                    <td><span id="date-time-zone-label">{Globalize.formatMessage( "date-time-zone-label" )}</span></td>
                    <td>"<span id="date-time-zone">{this.formatters.dateWithTimeZone( new Date() )}</span>"</td>
                </tr>
                <tr>
                    <td><span id="date-to-parts-label">{Globalize.formatMessage( "date-to-parts-label" )}</span></td>
                    <td>"<span id="date-to-parts">{this.formatters.dateToParts( new Date() )}</span>"</td>
                </tr>
                <tr>
                    <td><span id="relative-time-label">{Globalize.formatMessage( "relative-time-label" )}</span></td>
                    <td>"<span id="relative-time">{this.formatters.relativeTime( this.state.elapsedTime )}</span>"</td>
                </tr>
                <tr>
                    <td><span id="unit-label">{Globalize.formatMessage( "unit-label" )}</span></td>
                    <td>"<span id="unit">{this.formatters.unit( 60 )}</span>"</td>
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
            <table border="1" style={{marginBottom: "1em"}}>
                <tbody>
                    <tr>
                        <td>DateTimePicker</td>
                        <td><DateTimePicker
                                name="when"
                                format={DateConverters.defaultDateFormatter()}
                                parse={DateConverters.defaultDateParser()}
                                placeholder="When"
                                onChange={this.whenChanged.bind(this)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>NumberPicker</td>
                        <td><NumberPicker
                                name="score"
                                step={1}
                                format={NumberConverters.defaultNumberFormatter()}
                                parse={NumberConverters.defaultNumberParser()}
                                placeholder="Score"
                                onChange={this.scoreChanged.bind(this)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Current locale</td>
                        <td>"{this.state.locale}"</td>
                    </tr>
                    <tr>
                        <td>Click a link to change the locale</td>
                        <td>{this.renderSelectLocale()}</td>
                    </tr>

                </tbody>
            </table>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        </div>
    }

    whenChanged(value) {
        console.log('When has changed to '+ value);
    }

    scoreChanged(value) {
        console.log('Score has changed to '+ value);
    }

    manifestLoaded(manifest) {
        this.setState({manifest: manifest});
    }

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
        return links;
    }

    changeLocale(e) {
        this.localeChunkLoader.loadChunkFor(e.target.id);
    }

    chunkLoaded(locale) {
        Globalize.locale(locale);
        this.setState({locale: locale});
        this.initFormatters();
    }
}

export default App;
