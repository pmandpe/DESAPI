import { Injectable } from '@angular/core';





@Injectable({ providedIn: 'root' })
export class UtilService {
    
    getBrokenDate(dateValue : string) {
        var year = parseInt(dateValue.substr(0,4),10) ;
        var month = parseInt(dateValue.substr(5,2) , 10);
        var day = parseInt(dateValue.substr(8,2), 10) ;
        return {"year":year, "month": month, "day" : day} ;
    }

    filterByString(data, s) {
        return data.filter(e => e.id.includes(s) || e.taskname.includes(s))
            .sort((a,b) => a.id.includes(s) && !b.id.includes(s) ? -1 : b.id.includes(s) && !a.id.includes(s) ? 1 :0);
     }
}