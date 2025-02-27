(function() { 
    //iife - this wraps the code in a function so it isn't accidentally exposed 
    //to other javascript in other files. It is not required.
    
        var width=800, height=600
    
        //read in our csv file 
        d3.csv("./cars.csv").then((data) => {
            // Your code goes here!
        });
    
    })();
    