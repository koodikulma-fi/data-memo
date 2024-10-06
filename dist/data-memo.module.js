function cleanIndex(index,newCount){return newCount?'number'==typeof index?index<0?Math.max(0,index+newCount):Math.min(index,newCount-1):newCount-1:-1}function orderedIndex(order,orderBy,orderProp){return null!=orderProp?null==order?orderBy.findIndex((o=>o[orderProp]<0)):order<0?orderBy.findIndex((o=>null!=o[orderProp]&&o[orderProp]<0&&o[orderProp]>order)):orderBy.findIndex((o=>null==o[orderProp]||o[orderProp]<0||o[orderProp]>order)):null==order?orderBy.findIndex((o=>o<0)):order<0?orderBy.findIndex((o=>null!=o&&o<0&&o>order)):orderBy.findIndex((o=>null==o||o<0||o>order))}function orderArray(arr,orderOrPropIndex){const handled=[],isProp=!Array.isArray(orderOrPropIndex);for(let i=0,count=arr.length;i<count;i++){const oMe=isProp?arr[i][orderOrPropIndex]:orderOrPropIndex[i],iInsert=orderedIndex(oMe,handled,0);-1===iInsert?handled.push([oMe,arr[i]]):handled.splice(iInsert,0,[oMe,arr[i]])}return handled.map((h=>h[1]))}function numberRange(startOrEnd,end,stepSize,includeEnd){const flip=stepSize<0;let[i,e]=null==end?[0,startOrEnd]:[startOrEnd,end];const forwards=i<e;stepSize=stepSize?forwards!==flip?stepSize:-stepSize:forwards?1:-1;const range=[];if(includeEnd)for(;forwards?i<=e:i>=e;)range.push(i),i+=stepSize;else for(;forwards?i<e:i>e;)range.push(i),i+=stepSize;return flip&&range.reverse(),range}var CompareDepthEnum;function areEqual(a,b,nDepth=-1){if(a===b)return!0;if(a&&nDepth&&'object'==typeof a){if(!b||'object'!=typeof b)return!1;const constr=a.constructor;if(constr!==b.constructor)return!1;nDepth--;let isArr=!1;switch(constr){case Object:break;case Array:isArr=!0;break;case Set:if(isArr=!0,a.size!==b.size)return!1;a=[...a],b=[...b];break;case Map:if(a.size!==b.size)return!1;for(const[k,v]of a){if(!b.has(k))return!1;if(nDepth?!areEqual(b.get(k),v,nDepth):b.get(k)!==v)return!1}return!0;default:const subType=a.toString();'[object NodeList]'!==subType&&'[object HTMLCollection]'!==subType||(isArr=!0)}if(isArr){const count=a.length;if(count!==b.length)return!1;for(let i=0;i<count;i++)if(nDepth?!areEqual(a[i],b[i],nDepth):a[i]!==b[i])return!1}else{for(const p in b){if(!a.hasOwnProperty(p))return!1;if(nDepth?!areEqual(a[p],b[p],nDepth):a[p]!==b[p])return!1}for(const p in a)if(!b.hasOwnProperty(p))return!1}return!0}return!1}function deepCopy(obj,nDepth=-1){if(!obj||!nDepth||'object'!=typeof obj)return obj;nDepth--;let arr=null;switch(obj.constructor){case Object:break;case Array:arr=obj;break;case Set:return new Set(nDepth?[...obj].map((item=>deepCopy(item,nDepth))):obj);case Map:return new Map(nDepth?[...obj].map((([key,item])=>[deepCopy(key,nDepth),deepCopy(item,nDepth)])):obj);default:const subType=obj.toString();'[object NodeList]'!==subType&&'[object HTMLCollection]'!==subType||(arr=[...obj])}if(arr)return nDepth?arr.map((item=>deepCopy(item,nDepth))):[...arr];if(!nDepth)return Object.assign({},obj);const newObj=new obj.constructor;for(const prop in obj)newObj[prop]=deepCopy(obj[prop],nDepth);return newObj}function areEqualBy(from,to,compareBy){var _a;const eitherEmpty=!from||!to;for(const prop in compareBy){const mode=compareBy[prop],nMode='number'==typeof mode?mode:null!==(_a=CompareDepthEnum[mode])&&void 0!==_a?_a:0;if(nMode<-1){if(-2===nMode)return!1}else{if(eitherEmpty)return!from&&!to;if(0===nMode){if(from[prop]!==to[prop])return!1}else if(!areEqual(from[prop],to[prop],nMode))return!1}}return!0}function createDataTrigger(onMount,memory,depth=1){const d='string'==typeof depth?CompareDepthEnum[depth]:depth;let onUnmount;return(newMemory,forceRun=!1,newOnMountIfChanged)=>{const memWas=memory;if(d<-1){if(-2!==d)return!1}else if(!forceRun&&areEqual(memWas,newMemory,d))return!1;return void 0!==newOnMountIfChanged&&(onUnmount&&onUnmount(memWas,newMemory),onUnmount=void 0,onMount=newOnMountIfChanged||void 0),memory=newMemory,onMount&&(onUnmount=onMount(newMemory,memWas)||void 0),!1}}function createDataMemo(producer,depth=0){let data,memoryArgs;const d='string'==typeof depth?CompareDepthEnum[depth]:depth;return(...memory)=>{if(memoryArgs)if(d<-1){if(-2!==d)return data}else if(areEqual(memoryArgs,memory,d>=0?d+1:d))return data;return memoryArgs=memory,data=producer(...memory),data}}function createDataSource(extractor,producer,depth=0){let extracted,data;const d=(depth='string'==typeof depth?CompareDepthEnum[depth]:depth)>=0?depth+1:depth;return(...args)=>{const newExtracted=extractor(...args);if(extracted)if(d<-1){if(-2!==d)return data}else if(areEqual(newExtracted,extracted,d))return data;return extracted=newExtracted,data=producer(...extracted),data}}function createCachedSource(extractor,producer,cacher,depth=0){const cached={};return(...args)=>{const cachedKey=cacher(...args,cached);return cached[cachedKey]||(cached[cachedKey]=createDataSource(extractor,producer,depth)),cached[cachedKey](...args)}}!function(CompareDepthEnum){CompareDepthEnum[CompareDepthEnum.never=-3]='never',CompareDepthEnum[CompareDepthEnum.always=-2]='always',CompareDepthEnum[CompareDepthEnum.deep=-1]='deep',CompareDepthEnum[CompareDepthEnum.changed=0]='changed',CompareDepthEnum[CompareDepthEnum.shallow=1]='shallow',CompareDepthEnum[CompareDepthEnum.double=2]='double'}(CompareDepthEnum||(CompareDepthEnum={}));export{CompareDepthEnum,areEqual,areEqualBy,cleanIndex,createCachedSource,createDataMemo,createDataSource,createDataTrigger,deepCopy,numberRange,orderArray,orderedIndex};
