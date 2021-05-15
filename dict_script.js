const FRAME_RATE=2;
let lastTime=0;
function hashStringToInt(str, tableSize) {
	let hash = 17;//start as prime number
	for (let i =0; i<str.length; i++){
		hash = (13 * hash * (str.charCodeAt(i))) % tableSize;
	}
	return hash;
}
class HashTable {
	table = new Array(211);//size for table just needs to be big enough
	numItems = 0;
	loadFactor= this.numItems/this.table.length;
	setItemUtil = (key, value, table) => {
		const idx= hashStringToInt(key, this.table.length);

		if (table[idx]){
			let subIdx=-1;
			for (let i=0; i<table[idx].length; i++){
				if (table[idx][i][0]==key){
					subIdx=i;
					break;
				}
			}

			if (subIdx==-1){
				table[idx].push([key,value]);
			} else {
				table[idx][subIdx][1]=value;
			}
		} else {
			table[idx]= [[key,value]];
		}

	}
	resize = () => {
		const newTable=new Array(2*this.table.length);
		console.log("testing");
		this.table.forEach(item => {
			console.log("item="+item);
			if (item){
				item.forEach(([key, value]) => {
					this.setItemUtil(key, value, newTable);
				})
			}
		})
		this.table = newTable;
	}
	setItem = (key, value) => {
		this.numItems++;//number of key value pairs, not number of different hash idx's
		//with key value pairs
		this.loadFactor = this.numItems/this.table.length;
		if (this.loadFactor>0.80){
			this.resize();
		}

		this.setItemUtil(key, value, this.table);
	}

	getItem = (key) => {
		const idx= hashStringToInt(key, this.table.length);
		if (!this.table[idx]) return null;
		let subIdx= -1;
		for (let i=0; i<this.table[idx].length; i++){
			if (this.table[idx][i][0]==key){
				subIdx=i;
				break;
			}
		}
		if (subIdx==-1){
			//means other keys with the same hash have been set
			//but the current key has not been set with a value
			return null;
		}
		return this.table[idx][subIdx][1];
	}

	removeItem = (key) => {
		const value=this.getItem(key);
		this.numItems--;
		const idx= hashStringToInt(key, this.table.length);

		if (this.table[idx]){
			let subIdx=-1;
			for (let i=0; i<this.table[idx].length; i++){
				if (this.table[idx][i][0]==key){
					subIdx=i;
					break;
				}
			}

			if (subIdx==-1){
				return null;
			} else {
				//table[idx][subIdx][1]=value;
				return this.table[idx].splice(subIdx,1);
			}
		} else {
			//table[idx]= [[key,value]];
			return null;
		}
	}

	print = () => {

		for (let i =0; i<this.table.length; i++){
			console.log(this.table[i]+" ",end="");
		}
	}

}
const myTable = new HashTable()
myTable.setItem("firstName", "bob");
console.log(myTable.table.length);
myTable.getItem("firstName");
myTable.setItem("lastName", "tim");
console.log(myTable.table.length);
myTable.setItem("age", 5);
console.log(myTable.table.length);
myTable.setItem("dob", "1/2/3");
console.log(myTable.table.length);
console.log(myTable.getItem("firstName"));
console.log(myTable.getItem("lastName"));
console.log(myTable.getItem("age"));
console.log(myTable.getItem("dob"));
let dict= document.querySelector("#dict");
const dictChildren = dict.rows;
console.log("dicChildren.length="+dictChildren.length);
console.log("body[0]"+document.body.children[0]);
//console.log("dictChildren="+dictChildren[0]);
//dictChildren[0] is a table row containing the headers. Not useful.
const dictHashTable= new HashTable();
for (let i=1; i<dictChildren.length; i++){
	console.log("i="+i+" dictChildren[i]="+dictChildren[i]);
	const curCells= dictChildren[i].cells;
	console.log(curCells[0].innerHTML+" "+curCells[1].innerHTML);
	dictHashTable.setItem(curCells[0].innerHTML, curCells[1].innerHTML);
}
console.log(dictHashTable.getItem("SV"));
function addPair(){
	const keyInput = document.querySelector("#key");
	const valueInput = document.querySelector("#value");
	if (keyInput.value!="" && valueInput.value!=""){
		if (dictHashTable.getItem(keyInput.value)!=null){
			return;
		}
		dictHashTable.setItem(keyInput.value, valueInput.value);
		const tr=document.createElement("tr");
		const tdKey=document.createElement("td");
		const tdValue=document.createElement("td");
		tdKey.innerHTML=keyInput.value;
		tdValue.innerHTML=valueInput.value;
		tr.appendChild(tdKey);
		tr.appendChild(tdValue);

		dict.childNodes[1].appendChild(tr);
	}
	//dict= document.querySelector("#dict");
	console.log("dict childNodes"+dict.childNodes[1].childNodes);
	for (let i=0; i<dict.childNodes[1].childNodes.length; i++){
		console.log(dict.childNodes[1].childNodes[i]);
	}
}
function removePair(){
	const keyInput = document.querySelector("#keyRemove");
	//const valueInput = document.querySelector("#valueRemove");
	//console.log("keyInput,valueInput="+keyInput.value+" "+valueInput.value);
	let dictChildrentoArray=[];
	console.log("dict.childNodes[1].childNodes");
	if (keyInput.value!=""){
		dictHashTable.removeItem(keyInput.value);
		/*for (row in dictChildren){
			dictChildrentoArray.push(row);
		}*/
		dictChildrentoArray= Array.from(dictChildren);
		console.log("dictChildrentoArray="+dictChildrentoArray);
		const trArray=dictChildrentoArray.filter((tr) => {
			const tdKey=tr.cells[0].innerHTML;
			const tdValue=tr.cells[1].innerHTML;
			console.log("dictChildrentoArray tdKey,tdValue="+tdKey+" "+tdValue);
			return (tdKey==keyInput.value);
		});
		console.log("trArray.length="+trArray.length);
		for (let i=0; i<trArray.length; i++){
			console.log("remove trArray[i]"+trArray[i]);
			//dict.removeChild(trArray[i]);
			dict.childNodes[1].removeChild(trArray[i]);
		}
		//dict.childNodes[1].removeChild(dict.childNodes[1].childNodes[1]);
		
	}

	console.log("dict childNodes"+dict.childNodes[1].childNodes);
	for (let i=0; i<dict.childNodes[1].childNodes.length; i++){
		console.log(dict.childNodes[1].childNodes[i]);
	}
}
function main(currentTime) {
	window.requestAnimationFrame(main);

	if (currentTime-lastTime>1000.0/FRAME_RATE){
		console.log("testing");

		lastTime=currentTime;
	}
}
window.requestAnimationFrame(main);
console.log("dict childNodes"+dict.childNodes[1].childNodes);
for (let i=0; i<dict.childNodes[1].childNodes.length; i++){
	console.log(dict.childNodes[1].childNodes[i]);
}