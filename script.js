var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
const CVS_WIDTH = window.innerWidth;
const CVS_HEIGHT = window.innerHeight;
/*
const CVS_WIDTH = document.body.clientWidth/2;
const CVS_HEIGHT = document.body.clientHeight/2;
*/

console.log("CVS_WIDTH = " + CVS_WIDTH + " CVS_HEIGHT = " + CVS_HEIGHT);
ctx.canvas.width = CVS_WIDTH;
ctx.canvas.height = CVS_HEIGHT;


/*
ctx.fillStyle = "rgb(255, 0, 0)";
ctx.fillRect(5, 0, 5, 5);
*/

ctx.beginPath();
ctx.moveTo(100,50);
ctx.lineTo(300, 150);
ctx.stroke();

let frmwrkBubble= document.querySelector(".bubble");
frmwrkBubble.addEventListener('click', backBoxClick);
let frmwrkBoxList= document.querySelectorAll(".bubble-box");
//querySelectorAll returns a NodeList of all elements with class 'bubble-box'

let nodeList = [{x: 300, y: 50, text: 'hi Im box1'}, {x: 300, y:150, text: 'hey Im box2'}];
//let nodeList = [{x: 300, y: 50, text: 'hi Im box1'}];

let edgeList = [];
//format for edge object is {sInd: 0, eInd: 3}

let backBoxOffset = frmwrkBubble.getBoundingClientRect();

const body = document.querySelector("body");
var n = frmwrkBoxList.length; //length of frmwrkBoxList
var nodeClicked = false;
var nodePressed = false;
var nodePressedId = '';

for (let i=0; i<n; i++) {
	const frmwrkBox = frmwrkBoxList[i];
	//frmwrkBox.setAttribute("tabindex", 0);
	//frmwrkBox.focus();
	let frmwrkBoxStyle=window.getComputedStyle(frmwrkBox);

	console.log("current ind in frmwrkBoxList = " + i);
	console.log("current id = " + frmwrkBox.id);
	console.log("left,top="+frmwrkBoxStyle.getPropertyValue("left")+" "+frmwrkBoxStyle.getPropertyValue("top"));
	frmwrkBox.addEventListener('dragstart', dragStart);
	//why is dragstart not being activated?
	frmwrkBox.addEventListener('dragenter', function(e) { e.preventDefault();});
	frmwrkBox.addEventListener('dragover', function(e) { console.log("node dragover"); e.preventDefault();});
	//frmwrkBox.addEventListener('keydown', nodeKey);	
	//frmwrkBox.addEventListener('keydown', (ev) => handleKey(ev));
	
	frmwrkBox.addEventListener('mouseenter', boxEnter);
	frmwrkBox.addEventListener('mouseleave', boxLeave);
	frmwrkBox.addEventListener('keydown', handleKey);

}

document.addEventListener('keydown', handleKey);

//frmwrkBubble.addEventListener('dragend', dragEnd);
// frmwrkBubble.addEventListener('drop', function(event) {
// 	console.log('drop');
// 	console.log('mousex='+event.clientX+' mousey='+event.clientY);
// });

// document.addEventListener('drop', function(e){
// 	e.preventDefault();
// 	console.log('dropx');
// });
document.body.focus();

frmwrkBubble.addEventListener('dragover', dragover);
frmwrkBubble.addEventListener('drop', drop);
body.addEventListener('dragover', dragover);
body.addEventListener('drop', bodyDrop);

/*
for (const e of document.querySelectorAll("*")) {
e.setAttribute("tabindex", 1);
e.addEventListener('keydown', (ev) => handleKey(ev));
//bubbles up
//default is false
}
*/


const test = document.querySelector("#backbox");
//test.focus();

//document.getElementById("box1").focus();

//test.addEventListener('keydown', (ev) => handleKey(ev));
//window.addEventListener('keydown', (ev) => handleKey(ev), true);

console.log("script js running");

//document.querySelector("#backbox #box2 textarea").focus();

init();

function init() {
	console.log("init() run");

	//Using initial value for nodeList, create node elements class .bubble-box with set h5 elements as child
	n=0;
	generateNodes(nodeList);
}

function generateNodes(nodeList) {
	//Given a general list of nodes (each node has the properties x, y, text, and others)
	//add the nodes at those positions with those properties to the DOM.

	nodeList.forEach((node) => {
console.log(node.x+" "+node.y);

		var box = document.createElement("div");
		box.className = "bubble-box";
		n++;
		
		box.id = "box"+n;

		const backBox = document.querySelector("#backbox");

		const newLeft = node.x-backBoxOffset.left;
		const newTop = node.y-backBoxOffset.top;
		//newLeft and newTop are defined differently here than they are in the other function

		box.style.left = (newLeft)+"px";
		box.style.top = (newTop)+"px";
		box.setAttribute("tabindex", "1");

		var boxInside = document.createElement("h5");
		boxInside.innerHTML = node.text;
		boxInside.setAttribute("draggable", "true");
		boxInside.setAttribute("ondrop", "drop(ev)");
		boxInside.setAttribute("onclick", "nodeClick()");
		boxInside.className = "noselect";

		box.appendChild(boxInside);

		backBox.appendChild(box);

		//nodeList.push({x: node.x, y: node.y, text: boxInside.innerHTML});

	});

	/*
	for (const node in nodeList) {
		
	}
	*/

	update();
}

function update() {
	console.log("update() run");

	console.log(nodeList);

	frmwrkBubble= document.querySelector(".bubble");
	backBoxOffset = frmwrkBubble.getBoundingClientRect();

	frmwrkBoxList = document.querySelectorAll(".bubble-box");
	n = frmwrkBoxList.length;
	console.log("frmwrkBoxList.length n = " +n);

	const edgeLen = edgeList.length;

	for (let i=0; i<n; i++) {
	const frmwrkBox = frmwrkBoxList[i];
	let frmwrkBoxStyle=window.getComputedStyle(frmwrkBox);
	console.log("current ind in frmwrkBoxList = " + i);
	console.log("left,top="+frmwrkBoxStyle.getPropertyValue("left")+" "+frmwrkBoxStyle.getPropertyValue("top"));
	frmwrkBox.addEventListener('dragstart', dragStart);
	frmwrkBox.addEventListener('dragenter', function(e) { e.preventDefault();});
	frmwrkBox.addEventListener('dragover', function(e) { e.preventDefault();});
	//frmwrkBox.addEventListener('keydown', nodeKey);
	frmwrkBox.addEventListener('mouseenter', boxEnter);
	frmwrkBox.addEventListener('mouseleave', boxLeave);
	frmwrkBox.addEventListener('keydown', handleKey);
	}

	document.addEventListener('keydown', handleKey);
	document.body.focus();

	ctx.clearRect(0, 0, CVS_WIDTH, CVS_HEIGHT);

	for (let i=0; i<edgeLen; i++) {
		const edge = edgeList[i];
		const sPos = nodeList[edge.sInd];
		const ePos = nodeList[edge.eInd];
		console.log("sPos, ePos: "+sPos+","+ePos);

		ctx.beginPath();
		ctx.moveTo(sPos.x, sPos.y);
		ctx.lineTo(ePos.x, ePos.y);
		ctx.stroke();

	}

}

function boxEnter(ev) {
	console.log("boxEnter()");
	console.log(ev.target.id);

	ev.target.focus();
}

function boxLeave(ev) {
	console.log("boxLeave()");
	console.log(ev.target.id);

	ev.target.blur();
}

/*
ERROR

When I set #box1 to .focus() at start, this error shows up:
script.js:142 Uncaught TypeError: Failed to execute 'getComputedStyle' on 'Window': parameter 1 is not of type 'Element'.
    at HTMLDocument.handleKey (script.js:142)
*/

function handleKey(ev) {
	//ev.preventDefault();
	ev.stopPropagation();
	const keyCode = ev.keyCode;
	console.log("handleKey run()");
	console.log("keyCode = " + keyCode);
	//ev.target.style.visibility = 'hidden';
	const classStr = ev.target.className;
	console.log("ev.target = " + ev.target);
	console.log("typeStr = " + ev.target.tagName);
	console.log("classStr = " + classStr);
	console.log("idStr = " + ev.target.id);

	if (keyCode == 32) {
		ev.preventDefault();
		console.log("ev.target.className === 'bubble-box' = " + (ev.target.className === 'bubble-box'));
		if (ev.target.className === 'bubble-box') {
			if (!nodePressed) {
			console.log("BUBBLE-BOX ITEM nodePressed = true");
			nodePressed = true;
			nodePressedId = ev.target.id;

			const thisStyle = window.getComputedStyle(this);
			const left = thisStyle.getPropertyValue("left");
			const top = thisStyle.getPropertyValue("top");

			console.log("THIS= left:"+left+" top:"+top);
			this.blur();

			return;
			}

			if (nodePressed) {
				//Assume that if nodePressed true then nodePressedId are set
				addEdge(nodePressedId, ev.target.id);
				nodePressed = false;
				nodePressedId = '';
			}
		}
		/*
		if (!nodePressed)
			spawnBox(ev);
		*/

		//nodePresed = false;
	}
}

function nodeKey(ev) {
	const keyCode = ev.keyCode;
	console.log("nodeKey run()");
	if (keyCode == 32) {
		ev.preventDefault();
		nodePressed = true;
	}
}

function indCheck(checkInd, len) {

	if (checkInd < 0 || checkInd > len-1) {
		return false;
	}

	return true;
}

function addEdge(sIdStr, eIdStr) {
	const sId = parseInt(sIdStr.substring(3), 10);
	const eId = parseInt(eIdStr.substring(3), 10);

	console.log("addEdge(" + sId + ","+ eId + ")");

	//sId = starting bubble-box node's ID
	//eId = ending ID

	//later add in boolean variable to determine if the edge will be directional or bidirectional
	//rely on nodeList array to get left and top position of the 2 elements based on their IDs
	//we can also maybe find their positions through other ways such as window.getComputedStyle(ele)

	const nodeListLen = nodeList.length;

	const poss = indCheck(sId-1, nodeListLen) && indCheck(eId-1, nodeListLen);

	if (!poss) {
		console.log("FAILED to addEdge(" + sId + "," + eId + "). One or more indices were out of bounds of the node pos array.");
		return;
	}

	console.log("nodeList= " + nodeList);

	const sPos = nodeList[sId-1];
	const ePos = nodeList[eId-1];

	console.log("sPos x:"+ sPos.x + " y:" + sPos.y + " ePos x: " + ePos.x + " y:" + ePos.y);
	ctx.beginPath();
	ctx.moveTo(sPos.x, sPos.y);
	ctx.lineTo(ePos.x, ePos.y);
	ctx.stroke();

	/*
	ctx.fillStyle = "rgb(255, 0, 0)";
	ctx.fillRect(sPos.x, sPos.y-300, ePos.x-sPos.x, ePos.y-sPos.y);
	*/

	edgeList.push({sInd: sId-1, eInd: eId-1});
	console.log(edgeList[edgeList.length-1]);
}

//let prevClassName;
function dragStart(event) {
	//event.preventDefault();
	console.log('start');
	const thisStyle = window.getComputedStyle(this);
	//prevClassName = this.className;
	this.className += ' hold';
	setTimeout(() => this.className += ' invisible', 0);
	const thisLeft=thisStyle.getPropertyValue("left");
	const thisTop=thisStyle.getPropertyValue("top");
	const leftTop=(( parseInt(thisLeft.substring(0,thisLeft.length-2),10) - event.clientX) + ',' + (parseInt(thisTop.substring(0,thisTop.length-2),10) - event.clientY));
	console.log("thisLeft="+thisLeft+" thisTop="+thisTop+"leftTop="+leftTop);
	event.dataTransfer.effectAllowed = "move";
	event.dataTransfer.dropEffect = "move";

	const dataSet=event.dataTransfer.setData("text/plain",
    this.id+","+leftTop);
    console.log("dataSet="+dataSet);
}

function dragEnd(event) {
	event.preventDefault();
	console.log('end');
	this.className = this.className.replace(/invisible/g, '');
	this.className = this.className.replace(/hold/g, '');
	this.className = this.className.trim();
	console.log("e.dataTransfer.getData"+event.dataTransfer.getData("text"));
	console.log("e.clientX,e.clientY="+event.clientX+" "+event.clientY);
}

function dragover(e){
	e.preventDefault();
	console.log('dragover');
}

function drop(e) {
	e.preventDefault();
	const data=e.dataTransfer.getData("text").split(",");
	console.log("drop data="+data);
	const droppedEle = document.querySelector("#"+data[0]);
	droppedEle.className = droppedEle.className.replace(/invisible/g, '');
	droppedEle.className = droppedEle.className.replace(/hold/g, '');
	droppedEle.className = droppedEle.className.trim();
	//console.log('drop');
	//console.log("drop e.dataTransfer.getData"+e.dataTransfer.getData("text"));

	const newLeft=parseInt(data[1], 10)+e.clientX;
	const newTop=parseInt(data[2], 10)+e.clientY;
	console.log("drop newLeft="+newLeft+" newTop="+newTop);
	
	droppedEle.style.left=newLeft+"px";
	droppedEle.style.top=newTop+"px";

	let thisIdStr = data[0];
	let thisId = parseInt(thisIdStr.substring(3), 10);
	console.log("BOX with ID=" + thisIdStr + " changed position to left:"+newLeft+", top:"+newTop);
	nodeList[thisId-1].x = e.clientX;
	nodeList[thisId-1].y = e.clientY;

	//change the dropped box element's position

	update();
}

function bodyDrop(e) {
	e.preventDefault();
	//bodyDrop is drop event listener for the body element
	//in this case, when dragging a bubble-box node element, the bodyDrop is called
	//with info and id of the dragged node element.
	//but I am not sure what meaning the x and y data here convey?
	//the x and y data are usually around x,y = -10,-150 no matter where the node is dropped.

	const data=e.dataTransfer.getData("text").split(",");
	console.log("bodyDrop data="+data);
	const droppedEle=document.querySelector("#"+data[0]);
	droppedEle.className = droppedEle.className.replace(/invisible/g, '');
	droppedEle.className = droppedEle.className.replace(/hold/g, '');
	droppedEle.className = droppedEle.className.trim();
	//console.log('drop');
	//console.log("drop e.dataTransfer.getData"+e.dataTransfer.getData("text"));

	const newLeft=parseInt(data[1], 10);
	const newTop=parseInt(data[2],10);
	console.log("bodyDrop newLeft="+newLeft+" newTop="+newTop);
	
	//droppedEle.style.left=newLeft+"px";
	//droppedEle.style.top=newTop+"px";
}

function backBoxClick(ev) {
	console.log("backBoxClick() run");
	console.log("x, y: " + ev.clientX + " , " + ev.clientY);
	//notice that when a node is dragged, the backbox is not clicked

	//when a node is clicked, the backbox backBoxClick() is run since the backbox serves as a container for the nodes
	//however, we want that when a node is clicked, the backBoxClick() function
	//doesn't generate a new node.

	if (nodeClicked) {

	} else {
		spawnBox(ev);
	}
	nodeClicked = false;
}

function spawnBox(ev) {
	console.log("spawnBox clicked");
	var box = document.createElement("div");
	box.className = "bubble-box";
	n++;
	box.id = "box"+n;

	const backBox = document.querySelector("#backbox");

	const newLeft = ev.clientX-backBoxOffset.left;
	const newTop = ev.clientY-backBoxOffset.top;
	//newLeft and newTop are defined differently here than they are in the other function

	box.style.left = (newLeft)+"px";
	box.style.top = (newTop)+"px";
	box.setAttribute("tabindex", "1");

	var boxInside = document.createElement("h5");
	boxInside.innerHTML = "my id is " + box.id;
	boxInside.setAttribute("draggable", "true");
	boxInside.setAttribute("ondrop", "drop(ev)");
	boxInside.setAttribute("onclick", "nodeClick()");
	boxInside.className = "noselect";

	box.appendChild(boxInside);

	backBox.appendChild(box);

	nodeList.push({x: ev.clientX, y: ev.clientY, text: boxInside.innerHTML});

	update();
}

function nodeClick() {
	console.log("nodeClick() run");
	//nodeClicked = true;
}
