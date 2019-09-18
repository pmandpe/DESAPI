const cc = require('coupon-code') ;


module.exports = {
    generateUniqueCode,
    getMax
};


function generateUniqueCode(){
    return cc.generate({ parts : 3 });
    
}
//--get the maximum value of a property in json array
function getMax(arr, prop) {
    var max;
    for (var i=0 ; i<arr.length ; i++) {
        if (!max || parseInt(arr[i][prop]) > parseInt(max[prop]))
            max = arr[i];
    }
    return max;
}