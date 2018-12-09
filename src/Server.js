const express = require("express");
const cors = require("cors");
const app=express();
const port = 3001;
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require('mongodb').ObjectID;

const ObjectCache = require("./ObjectCache");

const CONN_ID_POST="_CONN_ID_POST"
const CON_ID_DISCUSSION="_CON_ID_DISCUSSION"
const CON_ID_USER="_CON_ID_USER"

app.use(cors());

const url="mongodb://aravinth_vt:alphaalpha123@aravinthvt15-shard-00-00-qjmab.gcp.mongodb.net:27017,aravinthvt15-shard-00-01-qjmab.gcp.mongodb.net:27017,aravinthvt15-shard-00-02-qjmab.gcp.mongodb.net:27017/bluenove?ssl=true&replicaSet=aravinthvt15-shard-0&authSource=admin&retryWrites=true";

let __connectionCloseTimerIdx=null;

class Logger{
	constructor(aDepth=0){
		this.depth = 0;
	}
	tabs(aDepth){
		let tabSpaces = ""
		let cDepth = aDepth||this.depth;
		for(var i=0;i<cDepth; i++){
			tabSpaces+=" "
		}
		return tabSpaces
	}
	logIn(){
		let newDepth = this.depth+1;
		if(comment)

			console.log(this.tabs()+comment);
		let newLogger =  new Logger(newDepth);
		return newLogger;
	}
	log(comment){
		console.log(this.tabs()+comment);
	}
	/*logOut(comment){
		if(comment)
			console.log(this.tabs()+comment);

		this.depth-=0;
	}*/
}
Logger.logIn=()=>{

}

//----------
const log = new Logger();

const __objCache = new ObjectCache();
__objCache.setMaxLimit(50);

/*log.log("top level")
log.logIn("enterting a method")
log.log("inside a method")
log.logOut("exiting a method")
log.log("now outside the method")*/

//*
async function asyncFetchHomePageDescription(res){
	console.log("_____________asyncFetchHomePageDescription");
	var startMilli =Date.now();
	let __allPromoses = [];
	let __allDiscussions=[];
	let __result = {discussions:null}
	await promiseOpenConnectionsByIds(CON_ID_DISCUSSION, CON_ID_USER);
	__allDiscussions = await getDiscussions().find().toArray();
	let len = __allDiscussions.length;
	for(let i=0; i<len; i++){
		let discussion = __allDiscussions[i];
		var promiseUserNameAddition = new Promise((resolve,reject)=>{
			__getUserById(discussion.creatorId).then((userDoc)=>{
				discussion.userName = userDoc.userName;
				//console.log("user.userName "+userDoc.userName);
				resolve(true);
			})
		})
		__allPromoses.push(promiseUserNameAddition);
	}
	await Promise.all(__allPromoses);
	//setTimeout(()=>closeAllConnections(), 50000);
	closeAllConnections();
	__result.discussions = __allDiscussions;

	__result.pref= Date.now()-startMilli;
	res.json(__result);
}
//*/


function promiseGetUserById(userId){
	console.log("promiseGetUserById entry userId:"+userId);
	let __user 	= null;
	let __client = null;
	let promise = new Promise((resolve, reject)=>{
		getUsers().findOne({_id:ObjectId(userId)}).then((value)=>{
			console.log("getUserById user:"+value.userName);
			//console.log(value);
			__user = value;
			resolve(value);
		}).catch((err)=>{
			console.log("cannot connect to the db or user does not exits");
			console.log(err);
			reject(err);
		})
	})
	return promise;
}


async function __getUserById(userId, tabDepth=""){
	console.log(tabDepth+"getUserById entry userId:"+userId);
	let promise = new Promise((resolve, reject)=>{
		let __cachedUserDoc = __objCache.getValueById(userId);
		if(__cachedUserDoc){
			console.log("got user from cache userid:"+__cachedUserDoc._id);
			resolve(__cachedUserDoc);
			return __cachedUserDoc;
		}
		getUsers().findOne({_id:ObjectId(userId)}).then((userDoc)=>{
			if(userDoc){
				__objCache.add(userId, userDoc);
				console.log(tabDepth+"  getUserById entry userId:"+userId);
			}else{
				console.log(tabDepth+"  Something fishy getUserById entry userId:"+userId);
			}
			console.log(tabDepth+"  getUserById exit userId:"+userId);
			resolve(userDoc);
		}).catch((err)=>{
			console.log("  cannot connect to the db or user does not exits");
			console.log(err);
			console.log(tabDepth+"  getUserById entry userId:"+userId);
			resolve(null);
		})
	})
	return promise;
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
	const __user = await __getUserById(req.params.creatorId);
	if(__user==null) {
		console.log("user is not valid")
		__returnObj.insert_status = "requires_login";
		__res.json(__returnObj);
	}else{
		console.log("user is valid see bleow")
		//console.log(__user)
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
			let doc = db.collection("test").insertOne(newDoc);
			console.log("inserted reply");
			resolve(newDoc);
		})
	}).then((resolvedObj)=>{
		console.log("inside then statement")
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


async function deletePost(req, res){
	await promiseOpenPostConnection();
	let postDoc = await __deletePostTree(req.params.postId);
	res.json(deleteResult);
	closePostConnection();
}

async function __updateDiscussionChildIds(aId, aChildIds, aDiscussionDoc){

	let discussionDoc = aDiscussionDoc
	if(!discussionDoc)
		discussionDoc =  await __getDiscussionByID(aId);

	let promise = new Promise((resolve, reject)=>{
		if(discussionDoc){
			getDiscussions().updateOne({_id:ObjectId(aId)},{$set:{childIds:aChildIds}}).then((data)=>{
				console.log("CHK: Server.js: Successfully updatd one discussionDoc:"+aId);
				console.log(data)
				resolve(true);
			}).catch((err)=>{
				console.log("CHK: Server.js: Failed deleted post from discussionDoc:"+aId);
				//console.log(data)
				resolve(false);
			});
		}else{
			resolve(false);
		}
	})
	return promise;
}


//this will remove the nodes from user and discussion
async function __deletePostTree(aId){
	let __allPromises   = [];
	let postDoc 	 	= await __getPostById(aId);
	let discussionDoc 	= __getDiscussionByID(postDoc.parentId);
	let userDoc 		= __getUserById(postDoc.creatorId);
	await Promise.all([discussionDoc, userDoc]);

	let promise = new Promise((resolve,reject)=>{
		let __allPromises = []
		if(postDoc && postDoc.childIds){
			for (var i = 0; i < postDoc.childIds.length; i++) {
				let childId = postDoc.childIds[i]
				if(childId){
					__allPromises.push(__deletePostTree(aId));
				}
			}
		}
		
		
		if(postDoc)
			console.log("CHK: Server.js: postDoc._id: checking the parentId:"+postDoc.parentId);
		if(discussionDoc && discussionDoc.childIds && discussionDoc.childIds.indexOf(postDoc._id)>=0){
			console.log("CHK: Server.js: postDoc._id: removing postId from discussionDoc");
			console.log("CHK: Server.js: postDoc._id:"+postDoc._id);
			console.log("CHK: Server.js: discussionDoc.childIds:");
			console.log(discussionDoc.childIds);
			let idx = discussionDoc.childIds.indexOf(postDoc._id);
			let newArray = discussionDoc.childIds.splice(idx, idx+1);
			__allPromises.push(__updateDiscussionChildIds(postDoc.parentId, newArray, discussionDoc));
		}else{
			console.log("CHK: WARNING! Server.js: postDoc._id: postId not present in from discussionDoc");
		}
		if(userDoc)
			console.log("CHK: Server.js: postDoc._id: checking the parentId:"+userDoc._id);
		if(userDoc && userDoc.childIds && userDoc.childIds.indexOf(postDoc._id)>=0){
			console.log("CHK: Server.js: postDoc._id: removing postId from userDoc:"+userDoc.userName);
			let idx = userDoc.childIds.indexOf(postDoc._id)
			let newArray = userDoc.childIds.splice(idx, idx+1);
			getUsers().updateOne({_id:ObjectId(postDoc.creatorId)},{$set:{childIds:newArray}}).then((data)=>{
				console.log("CHK: Server.js: Successfully deleted post from userDoc");
				console.log(data)
			}).catch((err)=>{
				console.log("CHK: Server.js: Failed deleted post from userDoc");
				console.log(data)
			});
		}else{
			console.log("CHK: WARNING! Server.js: postDoc._id: postId not present in from userDoc");
		}
		__allPromises.push(__deletePost(aId));
	})
	__allPromises.push(promise);
	return  Promise.all(__allPromises);
}

async function __deletePost(aPostId){
	const __responseJson = {deleteStatus:"init", deleteMessage:""};
	__responseJson.deleteStatus="failed";
	//return __responseJson;

	let promise = new Promise((resolve, reject)=>{
		getPosts().deleteOne({_id:ObjectId(aPostId)}).then((postDeleteResult)=>{
			console.log("Success delete the POST document");
			//console.log(postDeleteResult);
			__responseJson.deleteStatus = "failed";
			if(postDeleteResult.deletedCount==1){
				__responseJson.deleteStatus = "success";
			}
			resolve(__responseJson);
		}).catch((err)=>{
			console.log("Failed to delete the POST document");
			//console.log(err)
			__responseJson.deleteStatus = "failed";
			__responseJson.deleteMessage ="Couldnt delete the post";
			resolve(__responseJson);
		})
	})
	return promise;
}


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
				console.log("Success deleted the DISCUSSION document");
				//console.log(discussionDeleteResult);
				__responseJson.deleteStatus = "failed";
				if(discussionDeleteResult.deletedCount==1){
					__responseJson.deleteStatus = "success";
				}
				resolve(__responseJson);
			}).catch((err)=>{
				console.log("Failed to inserting the POST document");
				console.log(err)
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
		getPosts().insertOne(__newPostDoc).then((postInsertResult)=>{
			console.log("Success inserting the POST document");
			__responseJson.insertId = postInsertResult.insertedId;
			__responseJson.insertStatus = "success";
			resolve(__responseJson);
		}).catch((err)=>{
			console.log("Failed to inserting the POST document");
			console.log(err)
			resolve(__responseJson);
		})
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
	await promiseOpenAllConnections();
	console.log("---- createNewPost ---");
	let insertRes 	= await __insertNewPost(req.params.creatorId, req.params.parentId, req.params.content, req.params.parentType);
	let docRes 		= __appendPostIdToDoc(req.params.parentId, insertRes.insertId, req.params.parentType);
	let userRes 	= __appendPostIdToUser(req.params.creatorId, insertRes.insertId, req.params.parentType);
	await Promise.all([docRes, userRes]);
	console.log("############# you should see this at the end -- all done #################");
	res.json(insertRes);
	closeAllConnections();
}

//
async function fetchDiscussionByID(req, res){
	console.log("fetcher fetcher ")
	console.log("----------- fetchDiscussionByID()------------ START");
	let startMilli = Date.now();
	const __req = req;
	const __res = res;
	let __client = null;
	const __discussionID = req.params.discussionsID
	let __curDoc = null;
	let __allPromises = [];

	//console.log("req.params");
	//console.log(req.params);
	//promiseOpenPostConnection();
	//promiseOpenUsersConnection();
	await promiseOpenAllConnections();
	__curDoc  = await __getDiscussionByID(__discussionID);
	if(__curDoc == null) throw new Error("doc not found");

	__curDoc = {
		...__curDoc,
		userName:null,
		childPosts:[]
	}
	console.log(__curDoc);
	console.log("__curDoc.creatorId::::"+__curDoc.creatorId);
	let userNameAdditionPromise = __getUserById(__curDoc.creatorId,"  ").then((userDoc)=>{
		console.log("\tFound a user - setting the username userDoc:"+userDoc.userName);
		__userDoc  = userDoc;
		__curDoc.userName = __userDoc.userName;
		return true;
	}).catch((error)=>{
		console.log("\tTODO: Couldnt a user - stop the whole process"); 
		return false;
	});

	__allPromises.push(userNameAdditionPromise);

	//if(!__userDoc) console.log("CHK: user not found");

	
	if(__curDoc.childIds && __curDoc.childIds.length>=0){
		console.log("has child posts fetching post tree"); 
		let len = __curDoc.childIds.length;
		for(let i=0; i<len;i++){
			let addingChildPostPromise = __fetchPostTreeById(__curDoc.childIds[i]).then((postDoc)=>{
				if(postDoc){
					__curDoc.childPosts.push(postDoc);
					return true;
				}
				return false;
			})
			__allPromises.push(addingChildPostPromise)
		}
	}else{
		console.log("CHK: Server.js: there are no childPosts to fetch");
	}
	//console.log(__curDoc);
	__curDoc.pref = Date.now() - startMilli;

	await Promise.all(__allPromises);
	res.json(__curDoc);

	closeAllConnections();
	console.log("----------- fetchDiscussionByID()------------END");
	return __curDoc
}
//-------------------------------------------------------------------

async function __getDiscussionByID(aId){
	console.log("__getDiscussionByID():entry");
	let __client = null;
	let __discussionID = aId;
	let promise = new Promise((resolve, reject)=>{
		let __cachedDiscussion = __objCache.getValueById(__discussionID);
		if(__cachedDiscussion){
			console.log("** found discussion in CACHE __discussionID:"+__discussionID);
			resolve(__cachedDiscussion)
			return __cachedDiscussion;
		}else{
			getDiscussions().findOne({_id:ObjectId(__discussionID)}).then((foundDoc)=>{
				console.log("then:");
				console.log("found a match for __discussionID:"+__discussionID);
				console.log("then: exit" );
				console.log("__getDiscussionByID():exit");
				__objCache.add(aId, foundDoc);
				resolve(foundDoc);
			}).catch((err)=>{
				console.log("!! Couldnt found a match for __discussionID:"+__discussionID);
				console.log("__getDiscussionByID():exit");
				reject(err);
			})
		}
	})

	return promise
}

async function __getPostById(aId, depth){
	let promise = new Promise((resolve,reject)=>{
		let __cachedPostDoc = __objCache.getValueById(aId);
		if(__cachedPostDoc){
			console.log("** found postDoc from CACHE postid:"+__cachedPostDoc._id);
			resolve(__cachedPostDoc);
			return __cachedPostDoc;
		}
		getPosts().findOne({_id:ObjectId(aId)}).then((postDoc)=>{
			console.log("\t__getPostById: ==================== aId:"+aId);
			resolve(postDoc);
			__objCache.add(aId, postDoc);
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
function promiseOpenDiscussionsConnection(){
	clearInterval(__connectionCloseTimerIdx);
	let promise = new Promise((resolve, reject)=>{
		let __startMilli = Date.now();
		if(__discussionsColl){
			let __endMilli = Date.now()-__startMilli;
			console.log("DISCUSSION collection connection time:"+__endMilli)
			resolve(__discussionsColl);
		}else{
			MongoClient.connect(url, (err, client)=>{
				console.log("\n**** discussions db connected");
				if(err) {
					console.log("TODO: error accessing to me notified");
					resolve(false);
				}
				__discussionsClient = client;
				__discussionsDb     = client.db("bluenove");
				__discussionsColl   = __discussionsDb.collection("test");
				//let size = __discussionsColl.find().count();
				//console.log("size::"+size);
				let __endMilli = Date.now()-__startMilli;
				console.log("DISCUSSION collection connection time:"+__endMilli)
				resolve(true);
			})
		}
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
async function promiseOpenPostConnection(){
	clearInterval(__connectionCloseTimerIdx);
	let promise = new Promise((resolve, reject)=>{
		let __startMilli = Date.now();
		if(__postColl){
			let __endMilli = Date.now()-__startMilli;
			console.log("POST collection connection time:"+__endMilli)
			resolve(__postColl);
		}else{
			MongoClient.connect(url, (err, client)=>{
				console.log("\n**** post db connected");
				if(err) {
					console.log("TODO: error accessing to me notified");
					resolve(false);
				}
				__postClient = client;
				__postDb     = client.db("bluenove");
				__postColl   = __postDb.collection("posts");
				let __endMilli = Date.now()-__startMilli;
				console.log("POST collection connection time:"+__endMilli)
				resolve(true);
			})
		}
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
async function promiseOpenUsersConnection(){
	clearInterval(__connectionCloseTimerIdx);
	let promise = new Promise((resolve, reject)=>{
		let __startMilli = Date.now();
		if(__userColl){
			let __endMilli = Date.now()-__startMilli;
			console.log("USER collection connection time:"+__endMilli)
		 	resolve(__userColl);
		}else{
			
			MongoClient.connect(url, (err, client)=>{
				console.log("\n**** users db connected");
				if(err) {
					console.log("TODO: error accessing to me notified");
					resolve(false);
				}
				__userClient = client;
				__userDb     = client.db("bluenove");
				__userColl   = __userDb.collection("users");
				let __endMilli = Date.now()-__startMilli;
				console.log("USER collection connection time:"+__endMilli)
				resolve(true);
			})
		}
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

async function promiseOpenAllConnections(){
	let __all=[];
	__all.push(promiseOpenDiscussionsConnection());
	__all.push(promiseOpenUsersConnection());
	__all.push(promiseOpenPostConnection());
	return Promise.all(__all);
}

async function promiseOpenConnectionsByIds(...ids){
	let __all=[];
	ids.forEach((connID)=>{
		switch(connID){
			case CONN_ID_POST:
				__all.push(promiseOpenPostConnection())
				break;
			case CON_ID_DISCUSSION:
				__all.push(promiseOpenDiscussionsConnection())
				break;
			case CON_ID_USER:
				__all.push(promiseOpenUsersConnection())
				break;
		}
	})
	return Promise.all(__all);
}

function closeAllConnections(){
	clearInterval(__connectionCloseTimerIdx);
	__connectionCloseTimerIdx = setInterval(()=>{
		closeDiscussionsConnection();
		closePostConnection();
		closeUsersConnection();
	}, 50000);
}

//----------------------------------------------------------------------------------



async function __fetchPostTreeById(aId, depth){
	console.log("__fetchPostTreeById: ==================== ")
	let promiseForPostTree = __getPostById(aId, depth).then((postDoc)=>{
		if(postDoc){
			__getUserById(postDoc.creatorId).then((userDoc)=>{
				if(userDoc){
					postDoc.userName = userDoc.userName;
					return true
				}else{
					//TODO - handle error
					postDoc.userName = "unknown";
					console.log("\t\tCHK: fileName: Couldnt find a userName:");
					console.log("\t\tCHK: fileName: push it to check list");
					return true;
				}
			}).catch((err)=>{
				//TODO - handle error
				return false;
			})
			
			if(postDoc.childIds && postDoc.childIds.length>0){
				postDoc.childPosts		= [];
				postDoc.depth 			= depth;
				for(let i=0; i<postDoc.childIds.length;i++){
					__fetchPostTreeById(aId, postDoc.childPosts, i, depth+1).then((childPostDoc)=>{
						if(childPostDoc){
							postDoc.childPosts.push(childPostDoc);
							return true;
						}else{
							//TODO - handle error
							return true;
						}
					}).catch((err)=>{
						//TODO - handl error
					});
					
				}
			}
			return postDoc;
		}else{
			console.log("WARNING: postDoc is null");
			return null;
		}
	});
	return promiseForPostTree;
}

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
				//console.log(value);
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

async function fetchStats(req, res){
	const result={
		totalDiscussions:null,
		totalPosts:null,
		totalUsers:null
	}
	let __allPromises = [];
	await promiseOpenAllConnections();
	var startMilli = Date.now();
	console.log("getPosts()");
	__allPromises.push(getDiscussions().find().count().then(data=>{ 
	 	result.totalDiscussions = data
	 	return data;
	 }));
	__allPromises.push(getPosts().find().count().then(data=>{ 
	 	result.totalPosts = data
	 	return data;
	 }));
	__allPromises.push(getUsers().find().count().then(data=>{
		result.totalUsers = data
		return data;
	}))
	console.log(result);
	await Promise.all(__allPromises);
	closeAllConnections();
	result.pref= Date.now() - startMilli;
	res.json(result);
}

//------------------------------- routes -------------------------

app.get("/test",(req,res)=>{
	res.send("hi there");
		promiseOpenAllConnections().then((data)=>{
			__updateDiscussionChildIds("5c09b9460f459743dc0d451a", [24,50])
		}).catch((err)=>{
			
		})
	/*promiseOpenAllConnections().then(()=>{
		__getDiscussionByID("5c09aeef78301c3a34437a56").then((discussionDoc)=>{
			console.log("found a doc");
			if(discussionDoc && discussionDoc.childIds){
				console.log("found a doc");
				console.log(discussionDoc.childIds);
				let idx = discussionDoc.childIds.indexOf("5c05d4eaa1fe8945e4815399");
				newArray = discussionDoc.childIds.slice(idx, idx+1);
				console.log(newArray);
				getDiscussions().updateOne({_id:discussionDoc._id},{$set:{childIds:newArray}}).then((result)=>{
					console.log(result);
				});
				
				closeAllConnections();
			}
		}).catch(()=>{

		})
	})*/
	
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
	obj = asyncFetchHomePageDescription(res);
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

//delete a discussion
app.get("/delete-post/postId/:postId",(req,res)=>{
	//console.log(req.params)
	//res.send("TODO creating new discussions "+ req.params);
	deletePost(req, res);
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
	console.log("starting here here here");
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
	fetchStats(req, res);
})

//`http://localhost:3001/discussions/${aID}/userid/${aLoginInfoObj._id}`


app.listen(port,()=>{
	console.log("server working connected");
})