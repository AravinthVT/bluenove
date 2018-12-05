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
							__discussion.userName=user.userName;
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
	console.log("--------------------------------- createNewDiscussion()");
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
		childIds:[]
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
			//console.log(newDoc);
			let doc = db.collection("test").insertOne(newDoc);
			console.log("inserted reply");
			//console.log(newDoc);
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
	console.log("--------------------------------- createNewDiscussion() end");
	return result
};


async function deleteDiscussion(req, res){
	let deleteResult = await __deleteDiscussion(req.params.discussionId);
	res.json(deleteResult);
}

async function __deleteDiscussion(aDiscussionId){
	const __responseJson = {deleteStatus:"init"}
	let promise = new Promise((resolve, reject)=>{
		let connectObj = MongoClient.connect(url, (err, client)=>{
			console.log("\nMongoClient connected "+ aDiscussionId);
			if(err) {
				console.log("TODO: deleteDiscussion: error accessing to me notified");
				resolve(__responseJson);
				return;
			}
			let db = client.db("bluenove");
			console.log("About to delete Post document id:"+aDiscussionId);
			db.collection("test").deleteOne({_id:ObjectId(aDiscussionId)}).then((discussionDeleteResult)=>{
				console.log("Success inserting the POST document");
				console.log(discussionDeleteResult);
				__responseJson.deleteStatus = "failed";
				if(discussionDeleteResult.deletedCount==1){
					//__responseJson.insertId = discussionDeleteResult.insertedId;
					__responseJson.deleteStatus = "success";
				}
				resolve(__responseJson);
			}).catch((err)=>{
				console.log("Failed to inserting the POST document");
				console.log(err)
				//reject(__responseJson);
			})
			client.close();
		})//MongoClient
	})
	return promise;
}

async function __insertNewPost(creatorId, parentId, content, parentType){
	console.log("__insertNewPost: ");
	let __newPostDoc = {
		content:content,
		parentType:parentType,
		parentId:parentId,
		creatorId:creatorId,
		createdDate:Date.now(),
		childIds:[]
	}

	const __responseJson={
		insertId:-1,
		insertStatus:"failure"
	}

	let promise = new Promise((resolve, reject)=>{
		let connectObj = MongoClient.connect(url, (err, client)=>{
			console.log("\ndb connected");
			if(err) {
				console.log("TODO: error accessing to me notified");
				resolve(__responseJson);
				return;
			}
			let db = client.db("bluenove");
			console.log("About to insertOne Post document");
			db.collection("posts").insertOne(__newPostDoc).then((postInsertResult)=>{
				console.log("Success inserting the POST document");
				__responseJson.insertId = postInsertResult.insertedId;
				__responseJson.insertStatus = "success";
				resolve(__responseJson);
			}).catch((err)=>{
				console.log("Failed to inserting the POST document");
				console.log(err)
				//reject(__responseJson);
			})
			client.close();
		})//MongoClient
	})
	return promise;
}


async function __appendPostIdToDoc(aParentDocId, aPostId, aDocType){
	return ( new Promise((resolve, reject)=>{
		MongoClient.connect(url, (err, client)=>{
			let collectionName = "test";
			let addObj = {discussionIds:aPostId}
			switch(aDocType){
				case "post":
					collectionName = "posts"
					addObj = {childIds:aPostId}
					break;
				case "discussion":
					collectionName = "test"
					addObj = {childIds:aPostId}
					break;
				default:
					throw new Error("__appendPostIdToDoc unknow aDocType:"+aDocType);
			}
			client.db("bluenove").collection(collectionName).updateOne({_id:ObjectId(aParentDocId)}, {$addToSet:addObj}).then((discussionUpdateValue)=>{
				console.log("\tSuccess updated the DISCUSSION document");
				resolve(discussionUpdateValue);
				client.close();
			}).catch((err)=>{
				console.log("\tFailed updated the DISCUSSION document id:"+__discussionDocID);
				console.log(err);
				reject("TODO __appendPostIdToDoc yet to handle");
				client.close();
			})
		})
	}))
}


async function __appendPostIdToUser(aUserId, aPostId, aDocType){
	//console.log("__appendPostIdToUser: aUserId"+aUserId+" aPostId:"+aPostId+" aDocType:"+aDocType);
	return (new Promise((resolve, reject)=>{
		MongoClient.connect(url, (err, client)=>{
			let addObj = {discussionIds:aPostId}
			switch(aDocType){
				case "post":
					addObj = {postIds:aPostId}
					break;
				case "discussion":
					addObj = {discussionIds:aPostId}
					break;
				default:
					throw new Error("__appendPostIdToUser unknow aDocType:"+aDocType);
			}
			client.db("bluenove").collection("users").updateOne({_id:ObjectId(aUserId)}, {$addToSet:addObj}).then((discussionUpdateValue)=>{
				console.log("\t__appendPostIdToUser: Success updated the User document");
				resolve(discussionUpdateValue);
				client.close();
			}).catch((err)=>{
				console.log("\t__appendPostIdToUser: Failed updated the user document id:"+aUserId);
				console.log(err);
				reject("TODO __appendPostIdToDoc: yet to handle");
				client.close();
			})
		})
	}))
}


async function createNewPost(req, res){
	console.log("---- createNewPost ---");
	let insertRes 	= await __insertNewPost(req.params.creatorId, req.params.parentId, req.params.content, req.params.parentType);
	let docRes 		= await __appendPostIdToDoc(req.params.parentId, insertRes.insertId, req.params.parentType);
	let userRes 	= await __appendPostIdToUser(req.params.creatorId, insertRes.insertId, req.params.parentType);
	console.log("############# you should see this at the end -- all done #################");
	res.json(insertRes);
}

/*async function createNewPost1(req, res){
	console.log("createNewPost")

	res.json(res.params);

	let __allPromises=[]
	let __creatorID = req.params.creatorId;
	let __discussionDocID = req.params.parentId;
	let __newPostDoc = {
		content:req.params.content,
		parentType:req.params.parentType,
		parentId:__discussionDocID,
		creatorId:__creatorID,
		createdDate:Date.now(),
		childIds:[]
	}
	const __responseJson={
		insertId:-1,
		insertStatus:"failure"
	}

	let promise = new Promise((resolve, reject)=>{
		let connectObj = MongoClient.connect(url, (err, client)=>{
			console.log("\ndb connected");
			if(err) {
				console.log("TODO: error accessing to me notified");
				return;
			}
			let db = client.db("bluenove");
			console.log("About to insertOne Post document");
			//db.collection("post").updateOne({_id:ObjectId(__discussionDocID)}, {$addToSet:{childIds:[]}})
			let doc = db.collection("posts").insertOne(__newPostDoc).then((postInsertResult)=>{
				console.log("Success inserting the POST document");
				//console.log(postInsertResult);
				__responseJson.insertId = postInsertResult.insertedId;
				__responseJson.insertStatus = "success";
				MongoClient.connect(url, (err, client)=>{
					let db = client.db("bluenove");
					db.collection("test").updateOne({_id:ObjectId(__discussionDocID)}, {$addToSet:{childIds:[postInsertResult.insertedId]}}).then((discussionUpdateValue)=>{
						console.log("Success updated the DISCUSSION document");
						console.log(discussionUpdateValue);

						/*db.collection("users").updateOne({_id:ObjectId(__creatorID)}, {$addToSet:{childIds:[postInsertResult.insertedId]}}).then((userUpdateValue)=>{
							console.log("Success updated the USER document");
							console.log(userUpdateValue);
							//resolve(__responseJson);
						}).catch((err)=>{
							console.log("Failed updated the USER document id:"+__creatorID);
							console.log(err);
							//reject(__responseJson);
						})* /

					}).catch((err)=>{
						console.log("Failed updated the DISCUSSION document id:"+__discussionDocID);
						console.log(err);
						//reject(__responseJson);
					})
				})
			}).catch((err)=>{
				console.log("Failed to inserting the POST document");
				console.log(err)
				//reject(__responseJson);
			})
			client.close();
			//console.log("inserted reply");
		})
		console.log("connectObjconnectObjconnectObjconnectObjconnectObj");
		console.log(connectObj);
	})

	return promise;
}*/


async function fetchDiscussionByID(req, res){
	console.log("----------- fetchDiscussionByID()");
	const __req = req;
	const __res = res;
	let __client = null;
	const __discussionID = req.params.discussionsID
	let __curDoc = null;

	console.log("req.params");
	console.log(req.params);
	openPostConnection();
	openUsersConnection();
	__curDoc  = await __getDiscussionByID(__discussionID);
	if(__curDoc == null) throw new Error("doc not found");
	__userDoc = await getUserById(__curDoc.creatorId);
	console.log("__userDoc");
	console.log(__userDoc);
	__curDoc = {
		...__curDoc,
		userName:__userDoc.userName,
		childPosts:[]
	}
	if(__curDoc.childIds && __curDoc.childIds.length>=0){
			let len = __curDoc.childIds.length;
			for(let i=0; i<len;i++){
				__curDoc.childPosts.push(await fetchPostTreeById(__curDoc.childIds[i]));
			}
	}
	closePostConnection();
	closeUsersConnection();
	console.log(__curDoc);
	res.json(__curDoc);
	return __curDoc
}
//-------------------------------------------------------------------

async function __getDiscussionByID(aId){
	console.log("----------- __getDiscussionByID()");
	let __client = null;
	let __discussionID = aId;
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
				//console.log(foundDoc);
				__client.close()
				resolve(foundDoc);
			}).catch((err)=>{
				console.log("!! Couldnt found a match for __discussionID:"+__discussionID);
				__client.close()
				reject(err);
			})
		})
	})
	return promise
}

async function __getPostById(aId, depth){
	let promise = new Promise((resolve,reject)=>{
		getPosts().findOne({_id:ObjectId(aId)}).then((postDoc)=>{
			console.log("\t__getPostById: ==================== aId:"+aId);
			resolve(postDoc);
		}).catch((err)=>{
			reject(null);
		})
	})
	return promise;
}
//----------------------------------------------------------------------------------

let __discussionsClient =null;
let __discussionsDb     =null;
let __discussionsColl   =null;
function openDiscussionsConnection(){
		let promise = new Promise((resolve, reject)=>{
			MongoClient.connect(url, (err, client)=>{
				console.log("\ndb connected");
				if(err) {
					console.log("TODO: error accessing to me notified");
					resolve(false);
				}
				__discussionsClient = client;
				__discussionsDb     = client.db("bluenove");
				__discussionsColl   = __discussionsDb.collection("test");
				let size = __discussionsColl.find().count();
				console.log("size::"+size);
				resolve(true);
			})
		})
	return promise
}

function getDiscussions(){
	return __discussionsColl;
}

async function closeDiscussionsConnection(){
	if(__discussionsClient) __discussionsClient.close();
		__discussionsClient = null;
		__discussionsDb     = null;
		__discussionsColl   = null;
}

//--------------------------------------------------------------------------------
let __postClient =null;
let __postDb     =null;
let __postColl   =null;
async function openPostConnection(){
		let promise = new Promise((resolve, reject)=>{
			MongoClient.connect(url, (err, client)=>{
				console.log("\ndb connected");
				if(err) {
					console.log("TODO: error accessing to me notified");
					resolve(false);
				}
				__postClient = client;
				__postDb     = client.db("bluenove");
				__postColl   = __postDb.collection("posts");
				resolve(true);
			})
		})
	return promise
}

function getPosts(){
	return __postColl;
}

async function closePostConnection(){
	if(__postClient) __postClient.close();
		__postClient = null;
		__postDb     = null;
		__postColl   = null;
}

//----------------------------------------------------------------------------------

let __userClient =null;
let __userDb     =null;
let __userColl   =null;
async function openUsersConnection(){
		let promise = new Promise((resolve, reject)=>{
			MongoClient.connect(url, (err, client)=>{
				console.log("\ndb connected");
				if(err) {
					console.log("TODO: error accessing to me notified");
					resolve(false);
				}
				__userClient = client;
				__userDb     = client.db("bluenove");
				__userColl   = __userDb.collection("users");
				resolve(true);
			})
		})
	return promise
}

function getUsers(){
	return __userColl;
}

async function closeUsersConnection(){
	if(__userClient) __userClient.close();
		__userClient = null;
		__userDb     = null;
		__userColl   = null;
}

async function openAllConnections(){
	await openDiscussionsConnection();
	await openUsersConnection();
	await openPostConnection();
	return true;
}

function closeAllConnections(){
	closeDiscussionsConnection();
	closePostConnection();
	closeUsersConnection();
}

//----------------------------------------------------------------------------------



async function fetchPostTreeById(aId, depth){
	console.log("fetchPostTreeById: ==================== ")
	let postDoc = await __getPostById(aId, depth);
	let __userDoc = await getUserById(postDoc.creatorId);
	postDoc.userName = __userDoc.userName;
	console.log(postDoc);
	if(postDoc){
		if(postDoc.childIds && postDoc.childIds.length>0){
			postDoc.childPosts		= [];
			postDoc.depth 			= depth;
			for(let i=0; i<postDoc.childIds.length;i++){
				childPostDoc = await fetchPostTreeById(aId, postDoc.childPosts, i, depth+1);
				postDoc.childPosts.push(childPostDoc);
			}
		}
	}
	return postDoc;
}

/*async function fetchPostTreeById22(aId, db, aParentList, aIndex=0, depth){
	let __allPromises=[];
	let promise = new Promise((resolve,reject)=>{
		db.collection("posts").findOne({_id:ObjectId(aId)}).then((postDoc)=>{
			console.log("fetchPostTreeById: ==================== ")
			aParentList[aIndex]=postDoc;
			let __curPostDoc = postDoc;
			if(postDoc.childIds && postDoc.childIds.length>0){
				console.log("fetchPostTreeById:  ############# has a child");
				__curPostDoc.childPosts = [];
				let count=0;
				postDoc.childIds.forEach((childPostId)=>{
					console.log("fetchPostTreeById:  ############# child post id"+childPostId);
					let postPromise = fetchPostTreeById(childPostId, db, __curPostDoc.childPosts, count++);
					__allPromises.push(postPromise);
				})
			}
			resolve(postDoc);
		})
	})
	__allPromises.push(promise);
	return Promise.all(__allPromises);
}*/

//------------------------------------------------------------------

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
			db.collection("users").findOne({userName:req.params.username, password:req.params.password}).then((value)=>{
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

async function fetchStat(req, res){
	const result={
		totalDiscussions:null,
		totalPosts:null,
		totalUsers:null
	}
	await openAllConnections();
	console.log("getPosts()");
	result.totalDiscussions = await getDiscussions().find().count().then(data=>data),
	result.totalPosts = await getPosts().find().count().then(data=>data);
	result.totalUsers = await getUsers().find().count().then(data=>data);
	
	console.log(result);
	closeAllConnections();
	res.json(result);
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
	//console.log(req.params)
	//res.send("TODO creating new discussions "+ req.params);
	createNewDiscussion(req, res);
})

//delete a discussion
app.get("/delete-discussion/discussionId/:discussionId",(req,res)=>{
	//console.log(req.params)
	//res.send("TODO creating new discussions "+ req.params);
	deleteDiscussion(req, res);
})


//`http://localhost:3001/create-new-post/userid/${aLoginInfoObj._id}/content/${aContent}/parentId/${aParentDiscussionId}
//create-new-post/userid/${config.loginInfoObj._id}/content/${aContent}/parentId/${config.parentDiscussionId}
app.get("/create-new-post/userid/:creatorId/content/:content/parentId/:parentId/parentType/:parentType",(req,res)=>{
	console.log(req.params)
	//res.send("TODO creating new discussions "+ req.params);
	createNewPost(req, res);
	/*.then((insertStatus)=>{
		res.json(insertStatus);
	}).catch((err)=>{
		res.send(err);
	})*/
})

app.get("/discussions/:discussionsID/userid/:currentUserID",(req,res)=>{
	console.log(req.params)
	//res.send("TODO creating new discussions "+ req.params);
	fetchDiscussionByID(req, res);
})




app.get("/post/:postID", (req,res)=>{
	console.log("TODO yet to handle post by id");
	console.log(req.params)
	//res.send("TODO creating new discussions "+ req.params);
	//fetchDiscussionByID(req, res);
})


app.get("/stat", (req,res)=>{
	console.log("------------------- Requestion for stat --------------");
	console.log(req.params)
	//res.send("TODO creating new discussions "+ req.params);
	fetchStat(req, res);
})

//`http://localhost:3001/discussions/${aID}/userid/${aLoginInfoObj._id}`


app.listen(port,()=>{
	console.log("server working connected");
})