"use strict";module.define("ytilitu.other.rhymes",function(){var i=document.getElementById("word"),e=document.getElementById("get"),u=document.getElementById("result");function n(){u.innerHTML="";var e,t,n,r=i.value;if(r)return r&&r.length<30&&/^[a-zA-Z]+$/.test(r)?(e=r,t=function(e){return"object"==typeof e?setTimeout(function(){return u.innerHTML=e.join(", ")},100):u.innerHTML=e},(n=new XMLHttpRequest).open("get",encodeURI("/dynamic/ytilitu/json/other/rhymes/suggest/"+e)),n.onload=function(){if(200===n.status)return t(JSON.parse(n.responseText))},n.send()):u.innerHTML="invalid word"}return i.addEventListener("keypress",function(e,t){if(e&&"Enter"===e.key)return n()}),e.addEventListener("click",n)});
