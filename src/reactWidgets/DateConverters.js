/**
 * Object with functions returning Globalize functions required by
 * ReactWidgets globalizeLocalizer() if you use DateTimePicker or Calendar.
 * Should be the same formats as in react-widgets-globalize/index.js
 *
 * If you use webpack GlobalizePlugin all formats must be literals
 * to export precompiled functions.
 * For example: the following causes compile time ReferenceError: footerFormat is not defined
 * var footerFormat = { date: "full" };
 * const footerFn = Globalize.dateFormatter(footerFormat);
 *
 * Here an object is returned with functions returning the actual converters.
 * You can export the actual converter functions directly but then they will remain
 * the same when the user changes the locale.
 */

import Globalize from "globalize";

class DateConverters {

    // Used by Pickers
    static defaultDateFormatter() {
        return Globalize.dateFormatter({datetime: 'medium'});
    }
    static defaultDateParser() {
        return Globalize.dateParser({datetime: 'medium'});
    }

    // Also used by TimeList which is used by DateTimePicker
    static timeFormatter() {
        return Globalize.dateFormatter({time: "short"})
    }
    static timeParser() {
        return Globalize.dateParser({time: "short"})
    }
    static dateFormatter() {
        return Globalize.dateFormatter({date: "short"})
    }
    static dateParser() {
        return Globalize.dateParser({date: "short"})
    }

    // Used by Calendar which is used by DateTimePicker
    static headerFormatter() {
        return Globalize.dateFormatter({raw: "MMMM yyyy"})
    }
    static footerFormatter() {
        return Globalize.dateFormatter({date: "full"})
    }
    static weekdayFormatter() {
        return Globalize.dateFormatter({raw: 'eeeeee'})
    }
    static dayOfMonthFormatter() {
        return Globalize.dateFormatter({raw: 'd'})
    }
    static monthFormatter() {
        return Globalize.dateFormatter({raw: 'MMM'})
    }
    static yearFormatter() {
        return Globalize.dateFormatter({raw: 'yyyy'})
    }
    static firstOfWeekFormatter() {
        return Globalize.dateFormatter({raw: 'e'})
    }
};

export default DateConverters;