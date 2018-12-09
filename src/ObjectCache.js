class ObjectCache
{

	constructor(){
		this.__priority=[];
		this.__children={}
		this.__maxLimit = 100;
	}

	setMaxLimit(aLimit)
	{
		this.__maxLimit = aLimit;
		return this;
	}

	add(aId, aObj){
		let __idx = this.__priority.indexOf(aId);
		if(__idx>=0){
			this.__priority.splice(__idx, 1);
			this.__priority.unshift(aId);
			this.__children[aId].setValue(aObj);
		}else{
			this.__priority.unshift(aId);
			this.__children[aId] = new ObjCacheItem(aId, aObj);

		}
		if(this.__priority.length > this.__maxLimit){
			let removedItem = this.__priority.pop();
			delete this.__children[removedItem];
		}
		return this
	}

	__indexOf(aId){
		let len = this.__priority.length;
		for(let i=0;i<len;i++){}
	}

	getValueById(aId){
		let __idx = this.__priority.indexOf(aId);
		if(__idx>=0){
			this.__priority.splice(__idx, 1);
			this.__priority.unshift(aId);
		}
		if(this.__children[aId]==null) return null;
		return this.__children[aId].value;
	}

	getLength(){
		return this.__priority.length;
	}

	remove(aId){
		let __idx = this.__priority.indexOf(aId);
		if(__idx>=0){
			this.__priority.splice(__idx, 1);

		}
		this.__children[aId].dispose();
		delete this.__children[aId];
		return this;
	}
	show(){
		let len = this.__priority.length;
		for(let i=0;i<len;i++){
			console.log(this.__priority[i]);
		}
	}
}


class ObjCacheItem{
	constructor(aId, aValue){
		this._id = aId;
		this.value = aValue;
	}
	getValue(){
		return this.value;
	}
	setValue(aObj){
		this.value = aObj;
	}
	getLastUsed(aObj){
		return this.lastUsed;
	}
	dispose(){

	}
}

module.exports = ObjectCache