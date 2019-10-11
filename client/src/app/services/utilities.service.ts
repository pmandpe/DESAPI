import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UtilService {

    getBrokenDate(dateValue: string) {
        var year = parseInt(dateValue.substr(0, 4), 10);
        var month = parseInt(dateValue.substr(5, 2), 10);
        var day = parseInt(dateValue.substr(8, 2), 10);
        return { "year": year, "month": month, "day": day };
    }

    getJoinedDate(dateValue: any) {
        if (!dateValue || dateValue == {}){
            return "" ;
        }
        return dateValue.year + "-" + this.padLeft(dateValue.month,'0', 2) + "-" + this.padLeft(dateValue.day,'0', 2)   ;
    }

    filterByString(data, s) {
        return data.filter(e => e.id.includes(s) || e.taskname.includes(s))
            .sort((a, b) => a.id.includes(s) && !b.id.includes(s) ? -1 : b.id.includes(s) && !a.id.includes(s) ? 1 : 0);
    }

    //--get the maximum value of a property in json array
    getMax(arr, prop) {
        var max;
        if (!arr || arr.length == 0){
            return 0 ;
        }
        for (var i = 0; i < arr.length; i++) {
            if (!max || parseInt(arr[i][prop]) > parseInt(max[prop]))
                max = arr[i];
        }
        return max[prop];
    }

    getTopMenus(page) {
        var menus = [];
        switch (page) {
            case "SUBJECTS":
                menus.push({ "label": "Subject List", "link": "/admin/subject" });
                menus.push({ "label": "Add New Subject", "link": "/admin/edit-subject/NEW/0" });
                break;
            case "EXAMS":
                menus.push({ "label": "Exam List", "link": "/admin/exams" });
                menus.push({ "label": "Add New Exams", "link": "/admin/edit-exam/NEW/0" });
                break;


        }
        return menus ; 



    }
    padLeft(text:string, padChar:string, size:number): string {
        return (String(padChar).repeat(size) + text).substr( (size * -1), size) ;
    }

    getNumbericValue(input){

        var returnValue = 0 ;
        if (!input){
            return 0 ;
        }

        try{
            returnValue = parseInt(input) ;
        }
        catch(ex){
            console.log("error in parsing value") ;
        }

        return returnValue ; 
        
    }
}