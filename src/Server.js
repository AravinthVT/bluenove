const express = require("express");
const cors = require("cors");
const app=express();
const port = 3001;
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require('mongodb').ObjectID;

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


async function fetchHomePageDescription(res){
	console.log("------------- fetchHomePageDescription");
	let allPromise=[];
	let __discussions=null;
	let __client=null;
	let promise = new Promise((resolve, reject)=>{
		MongoClient.connect(url, (err, client)=>{
			console.log("\ndb connected");
			console.log(err);
			if(err) {
				console.log("TODO: error accessing to me notified");
				return;
			}
			__client = client;
			let db = client.db("bluenove");
			let cursor = db.collection("test").find()
			resolve({cursor:cursor,client:client, res:res});
		})
	}).then((resolvedObj)=>{
		let client1= resolvedObj.client
		let resp = resolvedObj.res
		resolvedObj.cursor.toArray().then((value)=>{
				//console.log("array value array value");
				//console.log(value)
				value = value.reverse();
				value.forEach((discussion)=>{
					let __discussion = discussion
					
					let userFetchPromise = new Promise((userResolve, userReject)=>{
						getUserById(discussion.creatorId).then((user)=>{
							//console.log("----- setting user name ")
							__discussion.userName=user.user_name;
							userResolve(__discussion);
						})
					})
					allPromise.push(userFetchPromise);
				})
				Promise.all(allPromise).then((values)=>{
						console.log("----> returning this:");
						console.log({discussions:__discussions});
						res.json({discussions:__discussions})
				})
				//console.log(value)
				__discussions = value
				//client1.close();
				//resp.json({discussions:value})
		}).catch((err)=>{
			console.log("Error: fetchHomePageDescription could get the 'discussions'")	
		});
		//console.log("db closed");
		//resolvedObj.client.close();
	}).catch((err)=>{
		console.log("Error: fetchHomePageDescription could not get the client object")
	})

	allPromise.push(promise);
	let result=await promise
	//Promise.all(allPromise).then((values)=>{
		//console.log("this should come last---------------------")
		//res.json({discussions:__discussions})
		//__client.close();
	//});
	console.log("return result");
	return result
}

async function getUserById(userId){
	console.log("\n--------- getUserById:"+userId);
	let __user 	= null;
	let __client = null;
	let promise = new Promise((resolve, reject)=>{
		MongoClient.connect(url, (err, client)=>{
			console.log("\ndb connected");
			__client = client
			if(err) {
				console.log("TODO: error accessing to me notified");
				return;
			}
			client.db("bluenove").collection("users").findOne({_id:ObjectId(userId)}).then((value)=>{
				console.log("getUserById user:");
				console.log(value);
				__user = value;
				resolve(value);
				__client.close()
			}).catch((err)=>{
				console.log("cannot connect to the db or user does not exits");
				console.log(err);
				resolve(null);
				__client.close()
			})
		})
	})
	return (await promise);
}

async function createNewDiscussion(req, res){
	console.log("----------- createNewDiscussion()");
	const __req = req;
	const __res = res;
	let __client = null;

	console.log("req.params");
	console.log(req.params);

	//insert_status => success, requires_login
	const __returnObj={
		doc:null,
		insert_status:""
	}

	//authenticate user
	const __user = await getUserById(req.params.creatorId);
	if(__user==null) {
		console.log("user is not valid")
		__returnObj.insert_status = "requires_login";
		__res.json(__returnObj);
	}else{
		console.log("user is valid see bleow")
		console.log(__user)
		console.log("TODO need to add the discussions list to the user")
	}

	//new post template
	const newDoc={
		creatorId:req.params.creatorId,
		tags:req.params.tags,
		title:req.params.title,
		description:req.params.description,
		createdDate:Date.now(),
		visibility:"public",
		postIds:[]
	}

	let promise = new Promise((resolve, reject)=>{
		MongoClient.connect(url, (err, client)=>{
			console.log("\ndb connected");
			if(err) {
				console.log("TODO: error accessing to me notified");
				return;
			}
			let db = client.db("bluenove");
			console.log("About to insertOne document")
			console.log(newDoc);
			let doc = db.collection("test").insertOne(newDoc);
			console.log("inserted reply");
			console.log(newDoc);
			//resolve({doc:doc,client:client, res:res});
			resolve(newDoc);
		})
	}).then((resolvedObj)=>{
		console.log("inside then statement")
		//let client1= resolvedObj.client
		//let resp = resolvedObj.res
		__returnObj.doc = resolvedObj;
		__returnObj.insert_status = "success";
		console.log(__returnObj);
		__res.json(__returnObj);
		return __returnObj;
	}).finally(()=>{
		__client.close();
	})

	let result=await promise;
	console.log("return result");
	return result
};

async function fetchDiscussionByID(req, res){
	console.log("----------- fetchDiscussionByID()");
	const __req = req;
	const __res = res;
	let __client = null;
	const __discussionID = req.params.discussionsID
	let __curDoc = null;

	console.log("req.params");
	console.log(req.params);
	let __allPromises = [];

	//insert_status => success, requires_login
	/*let __returnObj={
		user_name:null
	}*/


	let promise = new Promise((resolve, reject)=>{
		MongoClient.connect(url, (err, client)=>{
			console.log("\ndb connected");
			if(err) {
				console.log("TODO: error accessing to me notified");
				return;
			}
			__client =client;
			let db = client.db("bluenove");
			console.log("About to findOne document for id:"+__discussionID);
			db.collection("test").findOne({_id:ObjectId(__discussionID)}).then((foundDoc)=>{
				console.log("** found a match for __discussionID:"+__discussionID);
				console.log(foundDoc);
				__curDoc = foundDoc;
				foundDoc.childPosts=[];
				if(foundDoc.childIds && foundDoc.childIds.length>0){
					let count=0;
					foundDoc.childIds.forEach((childPostId)=>{
						console.log("############# child post id"+childPostId);
						let postPromise = fetchPostById(childPostId, db, __curDoc.childPosts, count++);
						__allPromises.push(postPromise);
					})
				}
				getUserById(foundDoc.creatorId).then((user)=>{
					__curDoc = {
						...__curDoc,
						user_name:user.user_name
					}
					resolve(__curDoc)
				}).catch((err)=>{
					console.log("TODO fetchDiscussionByID handle user failure case:"+err);
				})
			}).catch((err)=>{
				console.log("!! Couldnt found a match for __discussionID:"+__discussionID);
			})
		})
	})
	__allPromises.push(promise);
	let result = await Promise.all(__allPromises);
	//const __user = await getUserById(__curDoc.creatorId);
	/*result = {
		...result,
		user_name:__user.user_name
	}
	*/
	__res.json(__curDoc);
	__client.close();
	console.log("return result");
	return result
}

async function fetchPostById(aId, db, aParentList, aIndex=0, depth){
	let __allPromises=[];
	let promise = new Promise((resolve,reject)=>{
		db.collection("posts").findOne({_id:ObjectId(aId)}).then((postDoc)=>{
			console.log("fetchPostById: ==================== ")
			aParentList[aIndex]=postDoc;
			let __curPostDoc = postDoc;
			if(postDoc.childIds && postDoc.childIds.length>0){
				console.log("fetchPostById:  ############# has a child");
				__curPostDoc.childPosts = [];
				let count=0;
				postDoc.childIds.forEach((childPostId)=>{
					console.log("fetchPostById:  ############# child post id"+childPostId);
					let postPromise = fetchPostById(childPostId, db, __curPostDoc.childPosts, count++);
					__allPromises.push(postPromise);
				})
			}
			resolve(postDoc);
		})
	})
	__allPromises.push(promise);
	return Promise.all(__allPromises);
}

async function login(req, res){
	console.log("inside login method")
	let __res = res
	let promise = new Promise((resolve, reject)=>{
		MongoClient.connect(url, (err, client)=>{
			console.log("\ndb connected");
			if(err) {
				console.log("TODO: error accessing to me notified");
				return;
			}
			let db = client.db("bluenove");

			let cursor = null;
			//5bfdd2141c9d440000681a3e
			db.collection("users").findOne({user_name:req.params.username, password:req.params.password}).then((value)=>{
				console.log("dont know the value");
				console.log(value);
				if(value){
					__res.json({...value,login_status:"valid"});
				}else{
					__res.json({login_status:"invalid"});
				}
				return value;
			}).catch((err)=>{
				console.log("cannot connect to the db or user does not exits");
				console.log(err);
				return null;
			})

			console.log("assuming cursor but")
			console.log(cursor);
			resolve({cursor:cursor, client:client, res:res});
		})
	})

	let result=await promise;
	console.log("return result");
	return result
}

//------------------------------- routes -------------------------

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
	let obj={discussions:null}
	obj = fetchHomePageDescription(res);
})

app.get("/login/username/:username/password/:password/",(req,res)=>{
	console.log(req.params)
	//res.send("TODO to handle create new discussion on server");
	login(req, res);
})

//user-id/${aUserId}/create-new-post/title/${aTitle}/description/${aDescription}
//http://localhost:3001/create-new-post/user-id/5bff02541c9d440000c0732b/title/title%20111/description/content%20111/tags/TODO-tag
app.get("/create-new-discussion/userid/:creatorId/title/:title/description/:description/tags/:tags",(req,res)=>{
	console.log(req.params)
	//res.send("TODO creating new discussions "+ req.params);
	createNewDiscussion(req, res);
})

app.get("/discussions/:discussionsID/userid/:currentUserID",(req,res)=>{
	console.log(req.params)
	//res.send("TODO creating new discussions "+ req.params);
	fetchDiscussionByID(req, res);
})


app.get("/post/:postID}", (req,res)=>{
	console.log("TODO yet to handle post by id");
	console.log(req.params)
	//res.send("TODO creating new discussions "+ req.params);
	//fetchDiscussionByID(req, res);
})

//`http://localhost:3001/discussions/${aID}/userid/${aLoginInfoObj._id}`


app.listen(port,()=>{
	console.log("server working connected");
})