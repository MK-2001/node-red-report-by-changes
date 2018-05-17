module.exports = function(RED) {
  "use strict";
  function RbcNode(n) {
    RED.nodes.createNode(this,n);
    // Initial values settings
    this.func = n.func || "gt"; // default function
    // functions: gt:greater Than; lt:less than
    this.out = n.out || "this";
    // functions: this: Send this message; prev: sends the last message befor the change; first: sends the first message;
    this.gap = n.gap || "0";
    this.inout = n.inout || "out";
    this.property = n.property||"payload";


    var node = this;
    node.previous = {};
    node.previousObj = {};
    node.firstObj = {};

    this.on("input",function(msg) {
      // Initional values
      var t = msg.topic || "_nothing_set";

      // Function Reset to forget all previos messages
      if (msg.hasOwnProperty("reset")) {
        delete node.previous[t];
	node.info("Deleted prv topic: " + t.toString());
      }

      // Start to save the messages
      var v = RED.util.getMessageProperty(msg,node.property); // Get value of property
      if (v !== undefined) {
        var n = parseFloat(v);
        if (!isNaN(n)) {
          // for the first messages
          if(node.previous[t] === undefined) {
            node.previous[t] = v;
            node.previousObj[t] = msg;
            node.firstObj[t] = msg;
          }
          // get last value
          var p = node.previous[t];
          // Select functions
          if((node.func == "lt")) {
	    // node.info("entered function lt");
            if(v < p) {
	      // node.info("Value is smaller than prev");
              if(node.out == "first") {
                node.send(node.firstObj[t]);
                // delete object to set new "firstObj"
                delete node.previous[t];
              } else if(node.out == "this") {
                node.send(msg);
              } else if(node.out == "prev") {
                node.send(node.previousObj[t]);
              }
              node.status({
                fill:"green",
                shape:"dot",
                text:v.toString() + " " + node.func + " " + p.toString()
              });
            } else if(v > p) {
	      // node.info("Value is bigger than prev");
              node.status({
                fill:"red",
                shape:"ring",
                text:v.toString() + " " + node.func + " " + p.toString()
              });
            } else {
              node.status({
                fill:"yellow",
                shape:"ring",
                text:v.toString() + " " + node.func + " " + p.toString()
              });
            }
          } else if ((node.func == "gt")) {
            if(v > p) {
              if(node.out == "first") {
                node.send(node.firstObj);
                // delete object to set new "firstObj"
                delete node.previous[t];
              } else if(node.out == "this") {
                node.send(msg);
              } else if(node.out == "prev") {
                node.send(node.previousObj);
              }
              node.status({
                fill:"green",
                shape:"dot",
                text:v.toString() + " " + node.func + " " + p.toString()
              });
            } else if(v < p) {
              node.status({
                fill:"red",
                shape:"ring",
                text:v.toString() + " " + node.func + " " + p.toString()
              });
            } else {
              node.status({
                fill:"yellow",
                shape:"ring",
                text:v.toString() + " " + node.func + " " + p.toString()
              });
            }
          }
          // Last of all, save previos msg-Object & values
          node.previousObj[t] = msg;
          node.previous[t] = v;
        } else {
          node.warn(RED._("rbc.warn.nonumber"));
        }
      } // There is no payload
    });
  }
  RED.nodes.registerType("rbc",RbcNode);
}
