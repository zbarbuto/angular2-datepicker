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
var index_1 = require('../my-date-picker/index');
var styles = require('./sample-date-app.component.scss');
var template = require('./sample-date-app.component.html');
var SampleDateApp = (function () {
    function SampleDateApp() {
        this.selectedDate1 = '';
        this.myDatePickerOptions1 = {
            todayBtnTxt: 'Today',
            dateFormat: 'dd.mm.yyyy',
            firstDayOfWeek: 'mo',
            sunHighlight: true,
            height: '34px',
            width: '260px',
            disableUntil: { year: 0, month: 0, day: 0 },
        };
        this.myDatePickerOptions2 = {
            todayBtnTxt: 'Today',
            dateFormat: 'yyyy-mm-dd',
            firstDayOfWeek: 'mo',
            sunHighlight: true,
            height: '34px',
            width: '260px',
            inline: true
        };
        this.selectedDate2 = '2015-04-24';
        var date = new Date();
        this.selectedDate1 = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '.' + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '.' + date.getFullYear();
        date.setDate(date.getDate() - 5);
        this.myDatePickerOptions1.disableUntil = { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
    }
    SampleDateApp.prototype.ngOnInit = function () {
        console.log('onInit(): SampleDatePicker');
    };
    SampleDateApp.prototype.onDateChanged1 = function (event) {
        console.log('onDateChanged1(): ', event.date, ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
    };
    SampleDateApp.prototype.onDateChanged2 = function (event) {
        console.log('onDateChanged2(): ', event.date, ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
    };
    SampleDateApp = __decorate([
        core_1.Component({
            selector: 'sample-date-picker',
            directives: [index_1.MyDatePicker],
            styles: [styles],
            template: template
        }), 
        __metadata('design:paramtypes', [])
    ], SampleDateApp);
    return SampleDateApp;
}());
exports.SampleDateApp = SampleDateApp;
//# sourceMappingURL=sample-date-app.component.js.map