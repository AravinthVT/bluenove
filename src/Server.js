const express = require("express");
const cors = require("cors");
const app=express();
const port = 3001;
const MongoClient = require("mongodb").MongoClient;

app.use(cors());

const url="mongodb://aravinth_vt:alphaalpha123@aravinthvt15-shard-00-00-qjmab.gcp.mongodb.net:27017,aravinthvt15-shard-00-01-qjmab.gcp.mongodb.net:27017,aravinthvt15-shard-00-02-qjmab.gcp.mongodb.net:27017/bluenove?ssl=true&replicaSet=aravinthvt15-shard-0&authSource=admin&retryWrites=true";

MongoClient.connect(url, (err, client)=>{
	console.log("db connected");
	console.log("err:"+err);
	let db = client.db("bluenove");
	let cursor = db.collection("test").find()
	console.log("\ncursor:"+ cursor);
	cursor.forEach((value)=>{
		console.log("value:"+ value.x);	
	})
	client.close();
	console.log("db closed");
})

async function fetchHomePageDescription11(){
	
	let promise = new Promise((resolve, reject)=>{
		MongoClient.connect(url, (err, client)=>{
			console.log("\ndb connected");
			console.log(err);
			if(err) {
				console.log("TODO: error accessing to me notified");
				return;
			}
			let db = client.db("bluenove");
			let cursor = db.collection("test").find()
			let descriptions = cursor.toArray().then((value)=>{
				console.log("array value array value");
				console.log(value)
				return value;
			});
			cursor.forEach((value)=>{
				console.log("-- printing values ---");
				console.log(value);	
				descriptions.push(value);
			})
			client.close();
			console.log("db closed");
			console.log(descriptions);
			resolve(descriptions);
		})
	})

	let result=await promise;
	console.log("return result");
	return result
}

async function fetchHomePageDescription(res){
	
	let promise = new Promise((resolve, reject)=>{
		MongoClient.connect(url, (err, client)=>{
			console.log("\ndb connected");
			console.log(err);
			if(err) {
				console.log("TODO: error accessing to me notified");
				return;
			}
			let db = client.db("bluenove");
			let cursor = db.collection("test").find()
			/*let descriptions = cursor.toArray().then((value)=>{
				console.log("array value array value");
				console.log(value)
			});
			console.log("desciptions after to array");
			console.log(descriptions);

			cursor.forEach((value)=>{
				console.log("-- printing values ---");
				console.log(value);	
				descriptions.push(value);
			})*/
			//client.close();
			
			//console.log(descriptions);
			//resolve(descriptions);
			resolve({cursor:cursor,client:client, res:res});
		})
	}).then((resolvedObj)=>{
		let client1= resolvedObj.client
		let resp = resolvedObj.res
		resolvedObj.cursor.toArray().then((value)=>{
				console.log("array value array value");
				console.log(value)
				client1.close();
				resp.json({discussions:value})
		});
		//console.log("db closed");
		//resolvedObj.client.close();
	})

	let result=await promise;
	console.log("return result");
	return result
}

app.get("/test",(req,res)=>{
	res.send("hi there");
})

app.get("/discussions",(req,res)=>{
	//res.send("will return home page discussions in json format");
	let discussion = {
		userName:"user123",
		about:"music",
		createdDate:"somedate",
		title:"title title title title title",
		creatorId:"create id 123",
		description:"description description description",
		visibility:"public"

	}
	//let obj={discussions:[discussion,discussion]}
	let obj={discussions:null}
	obj = fetchHomePageDescription(res);
	//console.log("return from the method");
	//res.json(obj);
})

app.listen(port,()=>{
	console.log("server working connected");
})