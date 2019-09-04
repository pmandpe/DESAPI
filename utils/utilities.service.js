const cc = require('coupon-code') ;


module.exports = {
    generateUniqueCode
};


function generateUniqueCode(){
    return cc.generate({ parts : 3 });
    
}