function getPrettyVoteValue(aNum){
	if(Math.abs(aNum)>=1000000)
		return Math.round(aNum/100000)/10+"m"
	if(Math.abs(aNum)>=1000)
		return Math.round(aNum/100)/10+"k"
	return aNum
}

export default {getPrettyVoteValue}