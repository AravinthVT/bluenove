class QueryLifeCycle{
}

export const QUERY_LIFECYCLE_IDLE="_QUERY_LIFECYCLE_IDLE"
export const QUERY_LIFECYCLE_SENT="_QUERY_LIFECYCLE_SENT"
export const QUERY_LIFECYCLE_SUCCESS="_QUERY_LIFECYCLE_SUCCESS"
export const QUERY_LIFECYCLE_FAILED="_QUERY_LIFECYCLE_FAILED"

QueryLifeCycle.__all__=[QUERY_LIFECYCLE_IDLE, QUERY_LIFECYCLE_SENT, QUERY_LIFECYCLE_SUCCESS, QUERY_LIFECYCLE_FAILED]
QueryLifeCycle.has=(value)=>{
	return QueryLifeCycle.__all__.indexOf(value)>=0;
}
export default QueryLifeCycle