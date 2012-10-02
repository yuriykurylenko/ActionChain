/**
 * Implementation
 */
var actions = [{
    name: "a",
    handler: function() {
        this.setData("a", true, "Hi!");
	console.log("a performed!");
    }
},{
    name: "b",
    //dependencies: ["a"],
    handler: function() {
        this.setData("b", true, "This is an action chain.");
	console.log("b performed!");
    }
},{
    name: "c",
    dependencies: ["b"],
    handler: function() {
	console.log("c performed!");
        this.setData("c", true, "It works!");
    }
},{
    name: "d",
    dependencies: ["c"],
    handler: function() {
	console.log("d performed!");
        this.setData("d", true, this.getData("a") + " " + this.getData("b") + " "  + this.getData("c").toUpperCase());
    }
}];

var actionChainConfig = {
    "actions": actions,
    success: function() {
        console.log("********************************** Result of the operation **********************************");
        console.log("A: ", this.getData("a"));
        console.log("B: ", this.getData("b"));
        console.log("C: ", this.getData("c"));
        console.log("D: ", this.getData("d"));
    },
    failure: function() {
        console.log("Error: ", this.getData("error"));
    }
}

var ac = new ActionChain(actionChainConfig);
ac.run();