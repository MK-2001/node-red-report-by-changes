node-red-contrib-rbc (report-by-changes)
=================

A <a href="http://nodered.org" target="_new">Node-RED</a> node that provides
a function to report-by-change (RBC) capability.

The node blocks unless the incoming value changes in a defined mode.

Install
-------

Run the following command in your Node-RED user directory - typically `~/.node-red`

    npm i node-red-contrib-rbc


Usage
-----

A simple node to provide report-by-change (RBC) - only passes on data if it has changed in defined way.

This works on a per `msg.topic` basis. This means that a single rbc node can
handle multiple topics at the same time.

### Greater Than mode

The node doesn't send any output until the `msg.payload` is greater to the previous one.
Works only on numbers.

### Less Than mode

The node doesn't send any output until the `msg.payload` is lesser to the previous one.
Works only on numbers.

### Output modes

You can choose, if you want to send the current msg-Object, the previos one or the first of this check one.
