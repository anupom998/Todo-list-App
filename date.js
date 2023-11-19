
exports.getDate = function(){
    const currentDate = new Date();
    const options = { 
        weekday: 'long', 
        month: 'long',
        day: 'numeric' 
    };

    return currentDate.toLocaleDateString('en-US', options);
    
}

exports.getDay = function(){
    const currentDate = new Date();
    const options = { 
        weekday: 'long', 
        
    };

    return currentDate.toLocaleDateString('en-US', options);
   
}