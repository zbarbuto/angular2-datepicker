import { OnInit } from '@angular/core';
export declare class SampleDateApp implements OnInit {
    selectedDate1: string;
    private myDatePickerOptions1;
    private myDatePickerOptions2;
    selectedDate2: string;
    constructor();
    ngOnInit(): void;
    onDateChanged1(event: any): void;
    onDateChanged2(event: any): void;
}
