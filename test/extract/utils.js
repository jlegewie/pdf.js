// http://stackoverflow.com/a/1099670
function getQueryParams(qs) {
    if(qs==='')
        return {}; 
    qs = qs.split('?')[1].split("+").join(" ");
    var params = {}, 
    tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;
    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }
    return params;
}
// http://stackoverflow.com/a/4673436/2503795
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}
//http://stackoverflow.com/a/9050354/2503795
if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};
Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

/**
* Calculates the Levenshtein distance between two strings
*/
var levenshtein = function (a, b) {
    var aLen = a.length;
    var bLen = b.length;

    var arr = new Array(aLen+1);
    var i, j, cost;

    for (i = 0; i <= aLen; i++) {
        arr[i] = new Array(bLen);
        arr[i][0] = i;
    }

    for (j = 0; j <= bLen; j++) {
        arr[0][j] = j;
    }

    for (i = 1; i <= aLen; i++) {
        for (j = 1; j <= bLen; j++) {
            cost = (a[i-1] == b[j-1]) ? 0 : 1;
            arr[i][j] = Math.min(arr[i-1][j] + 1, Math.min(arr[i][j-1] + 1, arr[i-1][j-1] + cost));
        }
    }

    return arr[aLen][bLen];
};
var strDistance = function (s1, s2) {
    // s1=Zotero.Utilities.trimInternal(s1).replace(/ /g,"");
    // s2=Zotero.Utilities.trimInternal(s2).replace(/ /g,"");
    var l = (s1.length > s2.length) ? s1.length : s2.length;
    return levenshtein(s1,s2)/l;
};