/**
 * @author jonghun Yoon(https://github.com/ok0)
 * @
 */
var Pagination = function() {
	var config = {
		"outerElement" : "div"
		, "outerClass" : "outerClass"
		
		, "parentElement" : "ul"
		, "parentClass" : "parentClass"
		
		, "buttonElement" : "li"
		, "buttonClass" : "buttonClass"
		
		, "prevButtonElement" : "li"
		, "prevButtonClass" : "prevButtonClass"
		, "prevButtonText" : "&lt;"
		
		, "nextButtonElement" : "li"
		, "nextButtonClass" : "nextButtonClass"
		, "nextButtonText" : "&gt;"
	
		, "firstButtonElement" : "li"
		, "firstButtonClass" : "firstButtonClass"
		, "firstButtonText" : "&lt;&lt;"
		
		, "lastButtonElement" : "li"
		, "lastButtonClass" : "lastButtonClass"
		, "lastButtonText" : "&gt;&gt;"
		
		, "currentButtonClass" : "currentButtonClass"
		
		, "perPage" : 40
		, "totalCount" : null
		, "currentCount" : 0
		, "pageBlockSize" : 10
	};
	
	var lastPageNumber = null;
	var currentPageNumber = null;
	var next = null;
	
	this.init = function(paramConfig, nextEvent) {
		Object.keys(paramConfig).map(function(key) {
			if( typeof config[key] !== undefined ) {
				config[key] = paramConfig[key];
			}
		});
		
		next = nextEvent;
		setPageNumber();
	}
	
	// next에는 click 이후 실행 될 function object.
	this.get = function(next) {
		var result = "";
		
		if( lastPageNumber > 1 ) {
			if( lastPageNumber > config["pageBlockSize"] ) {
				if( currentPageNumber < config["pageBlockSize"] ) {
					// 페이지 초반
					result = getMiddleButton(1, (config["pageBlockSize"]-1));
					result =
						result
						+ getSideButton("next")
						+ getSideButton("last");
				} else if( currentPageNumber > (lastPageNumber - config["pageBlockSize"]) ) {
					// 마지막 페이지.
					result = getMiddleButton((lastPageNumber-config["pageBlockSize"]+1), lastPageNumber);
					result =
						getSideButton("first")
						+ getSideButton("prev")
						+ result;
				} else {
					// 나머지
					var dvBlockSize = Math.floor(config["pageBlockSize"] / 2);
					var blockStart = currentPageNumber - dvBlockSize;
					if( blockStart < 2 ) {
						var blockStart = 2;
					}
					
					var blockEnd = currentPageNumber + dvBlockSize;
					if( blockEnd > lastPageNumber ) {
						blockEnd = lastPageNumber;
					}
					
					result = getMiddleButton(blockStart, blockEnd);
					result =
						getSideButton("first")
						+ getSideButton("prev")
						+ result
						+ getSideButton("next")
						+ getSideButton("last");
				}
			} else {
				result += getMiddleButton(1, lastPageNumber);
			}
		}
		
		return "<"+config["outerElement"]+">"
			+ "<"+config["parentElement"]+">"
			+ result
			+ "</"+config["parentElement"]+">"
			+ "</"+config["outerElement"]+">";
	}
	
	var getSideButton = function(buttonKey) {
		var purposeCount = null;
		if( buttonKey == "next" ) {
			purposeCount = config["currentCount"] + (config["perPage"]*config["pageBlockSize"]);
			var ableLastCount = config["totalCount"] - config["perPage"];
			if( purposeCount > ableLastCount ) {
				purposeCount = ableLastCount;
			}
		} else if( buttonKey == "prev" ) {
			purposeCount = config["currentCount"] - (config["perPage"]*config["pageBlockSize"]);
			if( purposeCount < 0 ) {
				purposeCount = 0;
			}
		} else if( buttonKey == "first" ) {
			purposeCount = 0;
		} else if( buttonKey == "last" ) {
			purposeCount = (config["totalCount"] - config["perPage"])
		}
		
		return "<"+config[buttonKey+"ButtonElement"]
			+ getInnerClass(buttonKey)
			+ " onClick='"+next+"("+config["perPage"]+", "+config["totalCount"]+", "+purposeCount+")'"+">"
			+ config[buttonKey+"ButtonText"]
			+ "</"+config[buttonKey+"ButtonElement"]+">";
	}
	
	var isCurrent = function(target) {
		if( currentPageNumber === target ) {
			return true;
		} else {
			return false;
		}
	}
	
	var getMiddleButton = function(start, end) {
		var result = "";
		var middleButtonClass = getInnerClass("");
		for( ; start <= end ; start++ ) {
			
			result += "<"+config["buttonElement"];
			
			if( isCurrent(start) ) {
				result += getInnerClass("current");
			} else {
				result += middleButtonClass;
			}
			
			result += " onClick='"+next+"("+config["perPage"]+", "+config["totalCount"]+", "+((start-1) * config["perPage"])+")'"+">"
				+ start
				+ "</"+config["buttonElement"]+">";
		}
		
		return result;
	}
	
	var setPageNumber = function() {
		if( config["perpage"] == 0 ) {
			currentPageNumber = 1;
		} else {
			currentPageNumber = Math.ceil(config["currentCount"] / config["perPage"]) + 1;
		}
		
		lastPageNumber = Math.ceil(config["totalCount"] / config["perPage"]);
	}
	
	var getInnerClass = function(configKey) {
		if( configKey === "" ) {
			if( isset(config["buttonClass"]) && config["buttonClass"] != "" ) {
				return " class='"+config["buttonClass"]+"'";
			} else {
				return "";
			}
		} else if( isset(config[configKey+"ButtonClass"]) && config[configKey+"ButtonClass"] != "" ) {
			return " class='"+config[configKey+"ButtonClass"]+"'";
		} else {
			return "";
		}
	}
	
	this.getConfig = function() {
		return config;
	}
	
	var isset = function() {
		if( typeof chk !== undefined && typeof chk !== null ) {
			return true;
		} else {
			return false;
		}
	}
}