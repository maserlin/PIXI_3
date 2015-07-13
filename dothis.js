function Test(){
    
    this.d1 = 0;
    
    var dothis = function(){
        // --
        console.log(this.d1)
    }
}

Test.prototype.doSomething = function(){
    console.log(this);
}



function that(){ 
    var t = new Test();
    t.doSomething();
}
