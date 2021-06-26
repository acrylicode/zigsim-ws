## **What is zigsim-ws ?**

It is a easy to use and install npm package that allows you to have a websocket server that streams the data comming from the ZIG SIM APP. 

## **Why zigsim-ws ?**

Well, the ZIG SIM APP allows you to send UDP and TCP packages to other applications. Sadly this is not possible to use with a browser-based application, because most browsers don't support raw UDP or raw TCP communication. The idea of this package is that within a few commands you can use the ZIG SIM data in a web browser application, like a p5.js sketch or a Three.js app. 

## **How does it work ?**

The implementation is very simple. An UDP socket is opened in the port you specify (or default 50000) and a websocket is created in the port you specify (or default 8080). When a client connects to the websocketServer, it gets addded to the websocketServer.clients array. Once a UDP package arrives from the ZIG SIM app, this message gets broadcasted to all websocketServer.clients. Check out the code in github. This is meant for you to use, but it would be great if you can learn something by reading the code, don't get scared, they are only around 30 lines of code.

## **Installation for developers**

`npm i zigsim-ws` 

## **Usage**

``` 
const zigsimWs = require("zigsim-ws")

zigsimWs.init() // using default udpPort 50000 and default websocketPort 8080
// optionally you can use custom ports zigsimWs.init(50001,8081)

```

Then you can implement client that consume the websocket data at ws://${SERVER_IP}:8080 .But later a more detailed example.

## **Guide for p5 artists**

If someone is reading this, first of all welcome to the awesome world of programming. I supose that you already have some basic understanding of programming in Javascript with p5 , but you want to spicy up your scripts with the ZIS SIM App. If the guide above sounded like chinese to you, dont worry, I am going to do my best to briefly explain whats going on and how you can get it up and running in your PC. 

**First a little theory, to demistify it**

The 3 most popular workflows for developing p5 are:
-  Using the p5 web editor
-  Using VS-Code and the live server extention
-  Using other text editor and just opening the html file in a browser

All of this workflows are meant for "client" side development. What that means is the p5 sketch code get executed entirely on the browser. That means that if for instance you buy a domain and use a hosting service like firebase or any other free hosting alternative, you could store your p5 sketch on something like www.yourdomain.com and when someone, lets say Bob opens Firefox and types www.yourdomain.com , what happens is that Bob's Firefox communicate to www.yourdomain.com and asks "Hey give me what you got" and the www.yourdomain.com responds with some javascript and html. Luckily Bob's Firefox is able to understand the javascript and html it recieved and executes it, so Bob can see this on his screen. Keypoint to take, the p5 sketch was sent by www.yourdomain.com but it was EXECUTED on Bob's computer more specifically, Bob's Firefox. Now this whole story was meant to explain the Request/Response protocol (also known as Server/Client). This is the core principle.

Now but what how does this whole crap relates to ZIG SIM ? Well as describe in the "Why zigsim-ws?" section. ZIG SIM cannot send the data directly to the browser. So we need an intermediary to achieve this, and thats a server. Luckily for you , this npm package is an implementation of a server! Servers are useful because they can speak a lot of protocols, like Request/Response (like Bobs example) but also websockets. Websockets are similar to Request/Response but there are two main key differences. 1. A websocket is a continous connection between a server and a client. 2. There is bidirectional communication between client and server without asking. (That means the server can send data to the client without the client having to ask for the data). The second difference is very important for this package, because when you connect the ZIG SIM App to your p5 sketch, you dont want to ask the server all the time to give you the current data. You want the data to be there, real time, without any effort. So enough talking, lets started doing!

## Fully installation

So for our server to work we need Node.js. So go to https://nodejs.org/en/download/ 
That allows us to install this package.

First time usage:

- Step 1: Install node.js
- Step 2: Create somewhere in your computer a directory "zig-sim-server"
- Step 3: Open a Terminal and navigate to the directory you just created (or in Mac right click and "Open folder in Terminal" if you dont see this option activate the developer mode in Mac Settings)
- Step 4: Type in the terminal `npm init -y` (This will create an empty project)
- Step 5: Type `npm i zigsim-ws`
- Step 6: Type (copy-paste it on your terminal) 
``` 
echo "const zigsimWs = require('zigsim-ws');
zigsimWs.init()" > index.js 
```
This will create an index.js with the needed code to setup everything
- Step 7: Execute the code by typing `node index.js`

That`s it you should see a log in the terminal that says:

websocket server listening on port:  8080
udp server listening 0.0.0.0:50000

Your good to go and start implementing some p5 code. Last thing , keep this terminal open, if you close it the server will stop. If you want to start the server again the only steps you need to do are: 

- Opening the terminal in the directory where the server code is "zig-sim-server" (Step 2)
- Type `node index.js`

Thats it. 

## **P5 client example**

For this your server has to be up and running (from the steps before). You should have the ZIG SIM App installed and in the ZIG SIM App in the Sensor tab the 2D Touch should be selected. Once you understand this example, you can use any sensor data you want.

Create a folder for the p5 project. Open visual studio code in that folder.

Create a index.html with folowing content.
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Basic p5 example</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.3.1/p5.min.js" integrity="sha512-gQVBYBvfC+uyor5Teonjr9nmY1bN+DlOCezkhzg4ShpC5q81ogvFsr5IV4xXAj6HEtG7M1Pb2JCha97tVFItYQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="sketch.js"></script>
</head>
<body>
</body>
</html>
```

You should be familiar with this. We are importing p5 from a cdn and importing a sketch.js .
Lets create the sketch.js with the following content 
```
let touchX = 0;
let touchY = 0;

// Connect to our websocket server , this server was created when you typed `node index.js`
const ws = new WebSocket("ws://localhost:8080")

ws.onmessage = (event) => {
    const dataAsString = event.data;
    const dataAsObject = JSON.parse(dataAsString)
    const sensorData = dataAsObject.sensordata;
    // You might want to see how the data is recieved, uncomment this line
    //console.log(sensorData)
    if(sensorData.touch.length > 0){
        const firstFingerTouch = sensorData.touch[0];
        // set the global variables touchX, touchY
        // firstFingerTouch.x goes from -1 to 1 (also the y), so we map it to out canvas coordinates
        touchX = map(firstFingerTouch.x, -1, 1, 0, 400);
        touchY = map(firstFingerTouch.y, -1, 1, 0, 400);
    }
}

function setup(){
    createCanvas(400,400)
}

function draw(){
    background(0);
    fill(255)
    ellipse(touchX, touchY, 100,100)
}
```















