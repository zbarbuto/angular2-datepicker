"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var MyDatePicker = (function () {
    function MyDatePicker(elem) {
        var _this = this;
        this.elem = elem;
        this.dateChanged = new core_1.EventEmitter();
        this.showSelector = false;
        this.visibleMonth = { monthTxt: '', monthNbr: 0, year: 0 };
        this.defaultDate = { year: 0, month: 0, day: 0 };
        this.selectedDate = { year: 0, month: 0, day: 0 };
        this.weekDays = [];
        this.dates = [];
        this.selectionDayTxt = '';
        this.dayIdx = 0;
        this.today = null;
        this.PREV_MONTH = 1;
        this.CURR_MONTH = 2;
        this.NEXT_MONTH = 3;
        this.dayLabels = { su: 'Sun', mo: 'Mon', tu: 'Tue', we: 'Wed', th: 'Thu', fr: 'Fri', sa: 'Sat' };
        this.monthLabels = { 1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec' };
        this.dateFormat = 'yyyy-mm-dd';
        this.todayBtnTxt = 'Today';
        this.firstDayOfWeek = 'mo';
        this.sunHighlight = true;
        this.height = '34px';
        this.width = '100%';
        this.disableUntil = { year: 0, month: 0, day: 0 };
        this.disableSince = { year: 0, month: 0, day: 0 };
        this.disableWeekends = false;
        this.inline = false;
        this._locales = {
            'ja': {
                dayLabels: { su: '日', mo: '月', tu: '火', we: '水', th: '木', fr: '金', sa: '土' },
                monthLabels: { 1: '１月', 2: '２月', 3: '３月', 4: '４月', 5: '５月', 6: '６月', 7: '７月', 8: '８月', 9: '９月', 10: '１０月', 11: '１１月', 12: '１２月' },
                dateFormat: "yyyy.mm.dd",
                todayBtnTxt: '今日',
                sunHighlight: false
            },
            'fr': {
                dayLabels: { su: 'Dim', mo: 'Lun', tu: 'Mar', we: 'Mer', th: 'Jeu', fr: 'Ven', sa: 'Sam' },
                monthLabels: { 1: 'Jan', 2: 'Fév', 3: 'Mar', 4: 'Avr', 5: 'Mai', 6: 'Juin', 7: 'Juil', 8: 'Aoû', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Déc' },
                dateFormat: "dd/mm/yyyy",
                todayBtnTxt: 'Aujourd\'hui'
            }
        };
        this.today = new Date();
        var doc = document.getElementsByTagName('html')[0];
        doc.addEventListener('click', function (event) {
            if (_this.showSelector && event.target && _this.elem.nativeElement !== event.target && !_this.elem.nativeElement.contains(event.target)) {
                _this.showSelector = false;
            }
        }, false);
    }
    MyDatePicker.prototype.ngOnInit = function () {
        var localeOptions = {};
        if (this.locale && this._locales.hasOwnProperty(this.locale)) {
            localeOptions = this._locales[this.locale];
        }
        var optionprops = ['dayLabels', 'monthLabels', 'dateFormat', 'todayBtnTxt', 'firstDayOfWeek', 'sunHighlight', 'disableUntil', 'disableSince', 'disableWeekends', 'height', 'width', 'inline'];
        var noptionprops = optionprops.length;
        for (var i_1 = 0; i_1 < noptionprops; i_1++) {
            var propname = optionprops[i_1];
            if (this.options && this.options[propname] !== undefined) {
                this[propname] = this.options[propname];
            }
            else {
                if (localeOptions.hasOwnProperty(propname)) {
                    this[propname] = localeOptions[propname];
                }
            }
        }
        var days = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
        this.dayIdx = days.indexOf(this.firstDayOfWeek);
        if (this.dayIdx !== -1) {
            var idx = this.dayIdx;
            for (var i = 0; i < days.length; i++) {
                this.weekDays.push(this.dayLabels[days[idx]]);
                idx = days[idx] === 'sa' ? 0 : idx + 1;
            }
        }
        if (this.inline) {
            this.openBtnClicked();
        }
    };
    MyDatePicker.prototype.ngOnChanges = function (changes) {
        if (changes.hasOwnProperty('selDate')) {
            this.selectionDayTxt = changes['selDate'].currentValue;
            this.selectedDate = this._parseDate(this.selectionDayTxt);
        }
        if (changes.hasOwnProperty('defaultMonth')) {
            this.defaultDate = this._parseDate(changes['defaultMonth'].currentValue);
        }
    };
    MyDatePicker.prototype.removeBtnClicked = function () {
        this.selectionDayTxt = '';
        this.selectedDate = { year: 0, month: 0, day: 0 };
        this.dateChanged.emit({ date: {}, formatted: this.selectionDayTxt, epoc: 0 });
    };
    MyDatePicker.prototype.openBtnClicked = function () {
        this.showSelector = !this.showSelector;
        if (this.showSelector) {
            var y = 0, m = 0;
            if (this.selectedDate.year === 0 && this.selectedDate.month === 0 && this.selectedDate.day === 0) {
                if (this.defaultDate.year === 0 && this.defaultDate.month === 0) {
                    y = this.today.getFullYear();
                    m = this.today.getMonth() + 1;
                }
                else {
                    y = this.defaultDate.year;
                    m = this.defaultDate.month;
                }
            }
            else {
                y = this.selectedDate.year;
                m = this.selectedDate.month;
            }
            this.visibleMonth = { monthTxt: this.monthLabels[m], monthNbr: m, year: y };
            this.createMonth(m, y);
        }
    };
    MyDatePicker.prototype.prevMonth = function () {
        var m = this.visibleMonth.monthNbr;
        var y = this.visibleMonth.year;
        if (m === 1) {
            m = 12;
            y--;
        }
        else {
            m--;
        }
        this.visibleMonth = { monthTxt: this.monthText(m), monthNbr: m, year: y };
        this.createMonth(m, y);
    };
    MyDatePicker.prototype.nextMonth = function () {
        var m = this.visibleMonth.monthNbr;
        var y = this.visibleMonth.year;
        if (m === 12) {
            m = 1;
            y++;
        }
        else {
            m++;
        }
        this.visibleMonth = { monthTxt: this.monthText(m), monthNbr: m, year: y };
        this.createMonth(m, y);
    };
    MyDatePicker.prototype.prevYear = function () {
        this.visibleMonth.year--;
        this.createMonth(this.visibleMonth.monthNbr, this.visibleMonth.year);
    };
    MyDatePicker.prototype.nextYear = function () {
        this.visibleMonth.year++;
        this.createMonth(this.visibleMonth.monthNbr, this.visibleMonth.year);
    };
    MyDatePicker.prototype.todayClicked = function () {
        var m = this.today.getMonth() + 1;
        var y = this.today.getFullYear();
        this.selectDate({ day: this.today.getDate(), month: m, year: y });
        if (this.inline) {
            this.visibleMonth = { monthTxt: this.monthLabels[m], monthNbr: m, year: y };
            this.createMonth(m, y);
        }
    };
    MyDatePicker.prototype.cellClicked = function (cell) {
        if (cell.cmo === this.PREV_MONTH) {
            this.prevMonth();
        }
        else if (cell.cmo === this.CURR_MONTH) {
            this.selectDate(cell.dateObj);
        }
        else if (cell.cmo === this.NEXT_MONTH) {
            this.nextMonth();
        }
    };
    MyDatePicker.prototype.selectDate = function (date) {
        this.selectedDate = { day: date.day, month: date.month, year: date.year };
        this.selectionDayTxt = this.formatDate(this.selectedDate);
        this.showSelector = false;
        var epoc = new Date(this.selectedDate.year, this.selectedDate.month, this.selectedDate.day, 0, 0, 0, 0).getTime() / 1000.0;
        this.dateChanged.emit({ date: this.selectedDate, formatted: this.selectionDayTxt, epoc: epoc });
    };
    MyDatePicker.prototype.preZero = function (val) {
        return parseInt(val) < 10 ? '0' + val : val;
    };
    MyDatePicker.prototype.formatDate = function (val) {
        return this.dateFormat.replace('yyyy', val.year)
            .replace('mm', this.preZero(val.month))
            .replace('dd', this.preZero(val.day));
    };
    MyDatePicker.prototype.monthText = function (m) {
        return this.monthLabels[m];
    };
    MyDatePicker.prototype.monthStartIdx = function (y, m) {
        var d = new Date();
        d.setDate(1);
        d.setMonth(m - 1);
        d.setFullYear(y);
        var idx = d.getDay() + this.sundayIdx();
        return idx >= 7 ? idx - 7 : idx;
    };
    MyDatePicker.prototype.daysInMonth = function (m, y) {
        return new Date(y, m, 0).getDate();
    };
    MyDatePicker.prototype.daysInPrevMonth = function (m, y) {
        if (m === 1) {
            m = 12;
            y--;
        }
        else {
            m--;
        }
        return this.daysInMonth(m, y);
    };
    MyDatePicker.prototype.isCurrDay = function (d, m, y, cmo) {
        return d === this.today.getDate() && m === this.today.getMonth() + 1 && y === this.today.getFullYear() && cmo === 2;
    };
    MyDatePicker.prototype.isDisabledDay = function (date) {
        var givenDate = this.getTimeInMilliseconds(date);
        if (this.disableUntil.year !== 0 && this.disableUntil.month !== 0 && this.disableUntil.day !== 0 && givenDate <= this.getTimeInMilliseconds(this.disableUntil)) {
            return true;
        }
        if (this.disableSince.year !== 0 && this.disableSince.month !== 0 && this.disableSince.day !== 0 && givenDate >= this.getTimeInMilliseconds(this.disableSince)) {
            return true;
        }
        if (this.disableWeekends) {
            var dayNbr = this.getDayNumber(date);
            if (dayNbr === 0 || dayNbr === 6) {
                return true;
            }
        }
        return false;
    };
    MyDatePicker.prototype.getTimeInMilliseconds = function (date) {
        return new Date(date.year, date.month, date.day, 0, 0, 0, 0).getTime();
    };
    MyDatePicker.prototype.getDayNumber = function (date) {
        var d = new Date(date.year, date.month - 1, date.day, 0, 0, 0, 0);
        return d.getDay();
    };
    MyDatePicker.prototype.sundayIdx = function () {
        return this.dayIdx > 0 ? 7 - this.dayIdx : 0;
    };
    MyDatePicker.prototype.createMonth = function (m, y) {
        this.dates.length = 0;
        var monthStart = this.monthStartIdx(y, m);
        var dInThisM = this.daysInMonth(m, y);
        var dInPrevM = this.daysInPrevMonth(m, y);
        var dayNbr = 1;
        var cmo = this.PREV_MONTH;
        for (var i = 1; i < 7; i++) {
            var week = [];
            if (i === 1) {
                var pm = dInPrevM - monthStart + 1;
                for (var j = pm; j <= dInPrevM; j++) {
                    var date = { year: y, month: m - 1, day: j };
                    week.push({ dateObj: date, cmo: cmo, currDay: this.isCurrDay(j, m, y, cmo), dayNbr: this.getDayNumber(date), disabled: this.isDisabledDay(date) });
                }
                cmo = this.CURR_MONTH;
                var daysLeft = 7 - week.length;
                for (var j = 0; j < daysLeft; j++) {
                    var date = { year: y, month: m, day: dayNbr };
                    week.push({ dateObj: date, cmo: cmo, currDay: this.isCurrDay(dayNbr, m, y, cmo), dayNbr: this.getDayNumber(date), disabled: this.isDisabledDay(date) });
                    dayNbr++;
                }
            }
            else {
                for (var j = 1; j < 8; j++) {
                    if (dayNbr > dInThisM) {
                        dayNbr = 1;
                        cmo = this.NEXT_MONTH;
                    }
                    var date = { year: y, month: cmo === this.CURR_MONTH ? m : m + 1, day: dayNbr };
                    week.push({ dateObj: date, cmo: cmo, currDay: this.isCurrDay(dayNbr, m, y, cmo), dayNbr: this.getDayNumber(date), disabled: this.isDisabledDay(date) });
                    dayNbr++;
                }
            }
            this.dates.push(week);
        }
    };
    MyDatePicker.prototype._parseDate = function (ds) {
        var rv = { day: 0, month: 0, year: 0 };
        if (ds !== '') {
            var fmt = this.options && this.options.dateFormat !== undefined ? this.options.dateFormat : this.dateFormat;
            var dpos = fmt.indexOf('dd');
            if (dpos >= 0) {
                rv.day = parseInt(ds.substring(dpos, dpos + 2));
            }
            var mpos = fmt.indexOf('mm');
            if (mpos >= 0) {
                rv.month = parseInt(ds.substring(mpos, mpos + 2));
            }
            var ypos = fmt.indexOf('yyyy');
            if (ypos >= 0) {
                rv.year = parseInt(ds.substring(ypos, ypos + 4));
            }
        }
        return rv;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MyDatePicker.prototype, "options", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MyDatePicker.prototype, "locale", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MyDatePicker.prototype, "defaultMonth", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MyDatePicker.prototype, "selDate", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], MyDatePicker.prototype, "dateChanged", void 0);
    MyDatePicker = __decorate([
        core_1.Component({
            selector: 'my-date-picker',
            directives: [common_1.NgIf, common_1.NgFor, common_1.NgClass, common_1.NgStyle],
            styles: [".mydp { min-width: 100px; border-radius: 2px; line-height: 1.1; display: inline-block; } .mydp * { -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; font-family: Arial, Helvetica, sans-serif; font-weight: 300; padding: 0; margin: 0; } .mydp .selector { margin-top: 2px; margin-left: -1px; position: absolute; max-width: 262px; padding: 3px; z-index: 100; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.25); } .mydp .inlinedp { position: relative; margin-top: -2px; } .mydp .selectiongroup { position: relative; display: table; border: none; background-color: #FFF; } .mydp .selection { background-color: #FFF; display: table-cell; position: absolute; width: 100%; text-align: left; font-size: 18px; font-weight: bold; padding: 0 64px 0 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: center; } .mydp .selbtngroup { position: relative; vertical-align: middle; white-space: nowrap; width: 1%; display: table-cell; text-align: right; font-size: 0; } .mydp .btnpicker, .mydp .btnclear { height: 100%; width: 30px; border: none; border-left: 1px solid #AAA; background: #f1f1f1 !important; padding: 0px; cursor: pointer; outline: 0; font: inherit; -moz-user-select: none; } .mydp .btnpicker, .mydp .btnclear, .mydp .headertodaybtn, .mydp .footerbtn { background: #FAFAFA; background-image: -webkit-linear-gradient(#F0F0F0 30%, #AEC2E1 100%); background-image: -moz-linear-gradient(#F0F0F0 30%, #AEC2E1 100%); background-image: -o-linear-gradient(#F0F0F0 30%, #AEC2E1 100%); background-image: -ms-linear-gradient(#F0F0F0 30%, #AEC2E1 100%); background-image: linear-gradient(#F0F0F0 30%, #AEC2E1 100%); } .mydp .header { width: 100%; height: 36px; margin-bottom: 1px; background-color: #FAFAFA; } .mydp .header td { vertical-align: middle; border: none; } .mydp .header td:nth-child(1) { font-size: 16px; padding-left: 4px; } .mydp .header td:nth-child(2) { text-align: center; } .mydp .header td:nth-child(3) { font-size: 16px; padding-right: 4px; } .mydp .caltable { table-layout: fixed; width: 100%; background-color: #FFF; font-size: 14px; border-collapse: collapse; color: rgba(0, 0, 0, 0.87); line-height: 1.1; } .mydp .caltable thead { padding: 5px 2px; } .mydp .caltable th, .mydp .caltable td { border-collapse: collapse; line-height: 1.8; } .mydp .caltable th, .mydp .caltable td { padding: 5px; text-align: center; } .mydp .caltable th { background-color: #DDD; font-size: 12px; vertical-align: middle; } .mydp .caltable td { cursor: pointer; font-weight: bold; height: 28px; } .mydp .prevmonth, .mydp .nextmonth { color: #CCC; } .mydp .currmonth { background-color: #F6F6F6; } .mydp .currday div { font-weight: 600; border-radius: 50%; } .mydp .selectedday div { background-color: #106cc8 !important; color: #f1f1f1; border-radius: 100%; } .mydp .caltable tbody .currmonth:hover { background-color: #e0e0e0; border-radius: 100%; } .mydp .disabled { cursor: default !important; color: #CCC !important; background: #FFF0F0 !important; } .mydp .selectmenu { height: 24px; width: 60px; } .mydp .headerbtn { background-color: #FAFAFA; cursor: pointer; display: table-cell; } .mydp .btnpicker, .mydp .btnclear, .mydp .headerbtn, .mydp .headermonthtxt, .mydp .headeryeartxt, .mydp .headertodaybtn, .mydp .selection { color: #000; } .mydp .headertodaybtn { padding: 8px 12px; border-radius: 2px; background: #106cc8; color: #f1f1f1; border: none; cursor: pointer; font-size: 12px; box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.3); } .mydp button::-moz-focus-inner { border: 0; } .mydp .headermonthtxt, .mydp .headeryeartxt { width: 40px; text-align: center; display: table-cell; vertical-align: middle; } .mydp .btnclear:focus, .mydp .btnpicker:focus, .mydp .btnclear:hover, .mydp .btnpicker:hover { background: #ADD8E6; } .mydp .icon-calendar, .mydp .icon-cross { font-size: 16px; } .mydp .icon-left, .mydp .icon-right { font-size: 14px; } .mydp .icon-left:hover, .mydp .icon-right:hover { color: #63B2CC; } .mydp table { display: table; } .mydp table td { padding: 0; } .mydp .icon { font-family: 'mydatepicker'; speak: none; font-style: normal; font-weight: normal; font-variant: normal; text-transform: none; line-height: 1; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; } .mydp .icon-calendar:before { content: \"\e600\"; } .mydp .icon-cross:before { content: \"\e602\"; } .mydp .icon-left:before { content: \"\e605\"; } .mydp .icon-right:before { content: \"\e607\"; } @font-face { font-family: 'mydatepicker'; src: url(data:application/x-font-ttf;charset=utf-8;base64,AAEAAAALAIAAAwAwT1MvMg8SAssAAAC8AAAAYGNtYXDMUczTAAABHAAAAGxnYXNwAAAAEAAAAYgAAAAIZ2x5ZmFQ1q4AAAGQAAABbGhlYWQGZuTFAAAC/AAAADZoaGVhB4IDyQAAAzQAAAAkaG10eBYAAnAAAANYAAAAIGxvY2EBdAE0AAADeAAAABJtYXhwABUAPgAAA4wAAAAgbmFtZQ5R9RkAAAOsAAABnnBvc3QAAwAAAAAFTAAAACAAAwOaAZAABQAAApkCzAAAAI8CmQLMAAAB6wAzAQkAAAAAAAAAAAAAAAAAAAABEAAAAAAAAAAAAAAAAAAAAABAAADmBwPA/8AAQAPAAEAAAAABAAAAAAAAAAAAAAAgAAAAAAADAAAAAwAAABwAAQADAAAAHAADAAEAAAAcAAQAUAAAABAAEAADAAAAAQAg5gDmAuYF5gf//f//AAAAAAAg5gDmAuYF5gf//f//AAH/4xoEGgMaARoAAAMAAQAAAAAAAAAAAAAAAAAAAAAAAQAB//8ADwABAAAAAAAAAAAAAgAANzkBAAAAAAEAAAAAAAAAAAACAAA3OQEAAAAAAQAAAAAAAAAAAAIAADc5AQAAAAAMAEAAAAPAA4AABAAJAA4AEwAYAB0AIgAnACwAMQA2ADsAABMRMxEjFyE1IRUDITUhFQERMxEjJRUzNSMTFTM1IzMVMzUjMxUzNSMBFTM1IzMVMzUjMxUzNSMTFTM1I0Bzc0ADAP0AQAOA/IADDXNz/ZOAgCCAgMCAgMCAgP6AgIDAgIDAgIAggIADAP1AAsBzc3P9c3NzAwD9QALAgMDA/sCAgICAgID/AICAgICAgAJAwMAAAAAAAgBwADADkANQAAQACQAANwEnARcDATcBB+kCp3n9WXl5Aqd5/Vl5MAKnef1ZeQKn/Vl5Aqd5AAABAOAAAAMgA4AAAwAAAQMBJQMgA/3DASADgPyAAcPfAAEA4AAAAyADgAADAAA3EwEF4AMCPf7gAAOA/j3fAAAAAQAAAAEAAF0/BsNfDzz1AAsEAAAAAADRxFAkAAAAANHEUCQAAAAAA8ADgAAAAAgAAgAAAAAAAAABAAADwP/AAAAEAAAAAAADwAABAAAAAAAAAAAAAAAAAAAACAQAAAAAAAAAAAAAAAIAAAAEAABABAAAcAQAAOAEAADgAAAAAAAKABQAHgB6AJYApgC2AAAAAQAAAAgAPAAMAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAA4ArgABAAAAAAABAAkAAAABAAAAAAACAAcAcgABAAAAAAADAAkAPAABAAAAAAAEAAkAhwABAAAAAAAFAAsAGwABAAAAAAAGAAkAVwABAAAAAAAKABoAogADAAEECQABABIACQADAAEECQACAA4AeQADAAEECQADABIARQADAAEECQAEABIAkAADAAEECQAFABYAJgADAAEECQAGABIAYAADAAEECQAKADQAvHZzZHBpY2tlcgB2AHMAZABwAGkAYwBrAGUAclZlcnNpb24gMS4wAFYAZQByAHMAaQBvAG4AIAAxAC4AMHZzZHBpY2tlcgB2AHMAZABwAGkAYwBrAGUAcnZzZHBpY2tlcgB2AHMAZABwAGkAYwBrAGUAclJlZ3VsYXIAUgBlAGcAdQBsAGEAcnZzZHBpY2tlcgB2AHMAZABwAGkAYwBrAGUAckZvbnQgZ2VuZXJhdGVkIGJ5IEljb01vb24uAEYAbwBuAHQAIABnAGUAbgBlAHIAYQB0AGUAZAAgAGIAeQAgAEkAYwBvAE0AbwBvAG4ALgAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=) format(\"truetype\"); font-weight: normal; font-style: normal; } "],
            template: "<div class=\"mydp\" [ngStyle]=\"{'height': height, 'width': width, 'border': inline ? 'none' : '1px solid #AAA'}\"> <div class=\"selectiongroup\" *ngIf=\"!inline\"> <span class=\"selection\" [ngStyle]=\"{'height': height, 'line-height': height}\" (click)=\"openBtnClicked()\">{{selectionDayTxt}}</span> <span class=\"selbtngroup\" [style.height]=\"height\"> <button type=\"button\" class=\"btnclear\" *ngIf=\"selectionDayTxt.length>0\" (click)=\"removeBtnClicked()\"><span class=\"icon icon-cross\"></span></button> <button type=\"button\" class=\"btnpicker\" (click)=\"openBtnClicked()\"><span class=\"icon icon-calendar\"></span></button> </span> </div> <div class=\"selector\" *ngIf=\"showSelector||inline\" [ngClass]=\"{'inlinedp': inline}\"> <table class=\"header\"> <tr> <td> <div style=\"float:left\"> <div class=\"headerbtn\" (click)=\"prevMonth()\"><span class=\"icon icon-left\"></span></div> <div class=\"headermonthtxt\">{{visibleMonth.monthTxt}}</div> <div class=\"headerbtn\" (click)=\"nextMonth()\"><span class=\"icon icon-right\"></span></div> </div> </td> <td> <button type=\"button\" class=\"headertodaybtn\" (click)=\"todayClicked()\">{{todayBtnTxt}}</button> </td> <td> <div style=\"float:right\"> <div class=\"headerbtn\" (click)=\"prevYear()\"><span class=\"icon icon-left\"></span></div> <div class=\"headeryeartxt\">{{visibleMonth.year}}</div> <div class=\"headerbtn\" (click)=\"nextYear()\"><span class=\"icon icon-right\"></span></div> </div> </td> </tr> </table> <table class=\"caltable\"> <thead><tr><th *ngFor=\"let d of weekDays\">{{d}}</th></tr></thead> <tbody> <tr *ngFor=\"let w of dates\"> <td *ngFor=\"let d of w\" [ngClass]=\"{'currmonth':d.cmo===CURR_MONTH&&!d.disabled, 'currday':d.currDay, 'selectedday':selectedDate.day===d.dateObj.day && selectedDate.month===d.dateObj.month && selectedDate.year===d.dateObj.year && d.cmo===CURR_MONTH, 'disabled': d.disabled}\" (click)=\"$event.stopPropagation();!d.disabled && cellClicked(d)\"> <div style=\"background-color:inherit\" [ngClass]=\"{'prevmonth':d.cmo===PREV_MONTH,'currmonth':d.cmo===CURR_MONTH,'nextmonth':d.cmo===NEXT_MONTH,'sunday':d.dayNbr === 0 && sunHighlight}\">{{d.dateObj.day}}</div> </td> </tr> </tbody> </table> </div> </div> "
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], MyDatePicker);
    return MyDatePicker;
}());
exports.MyDatePicker = MyDatePicker;
//# sourceMappingURL=my-date-picker.component.js.map