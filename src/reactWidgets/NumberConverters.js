/**
 * Object with functions returning Globalize functions required by
 * ReactWidgets globalizeLocalizer() if you use NumberPicker or NumberInput
 * without setting functions on format or parse properties.
 * Should be the same formats as in react-widgets-globalize/index.js
 *
 * If you use webpack GlobalizePlugin all formats must be literals
 * to export precompiled functions.
 * For example: the following causes compile time ReferenceError: myNumberFormat is not defined
 * var myNumberFormat = {maximumFractionDigits: 2};
 * const maNumberFormatter = Globalize.numberFormatter(myNumberFormat);
 *
 * Here an object is returned with functions returning the actual converters.
 * You can export the actual converter functions directly but then they will remain
 * the same when the user changes the locale.
 */

import Globalize from "globalize";

class NumberConverters {

    // Used for formatting and parsing of the actual number
    static defaultNumberFormatter() {
        return Globalize.numberFormatter({maximumFractionDigits: 0})
    }

    static defaultNumberParser()  {
        return Globalize.numberParser({maximumFractionDigits: 0})
    }

    // Used by number.decimalChar in react-widgets-globalize/index.js
    // to extract the decimal separator.
    // Allways required if NumberPicker or NumberInput not readOnly
    static decimalCharFormatter() {
        return Globalize.numberFormatter({raw: "0.0"})
    }
}

export default NumberConverters;