/*! @license DOMPurify 3.1.7 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.1.7/LICENSE */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).DOMPurify=t()}(this,function(){"use strict";let{entries:e,setPrototypeOf:t,isFrozen:n,getPrototypeOf:o,getOwnPropertyDescriptor:r}=Object,{freeze:i,seal:a,create:l}=Object,{apply:c,construct:s}="undefined"!=typeof Reflect&&Reflect;i||(i=function e(t){return t}),a||(a=function e(t){return t}),c||(c=function e(t,n,o){return t.apply(n,o)}),s||(s=function e(t,n){return new t(...n)});let u=b(Array.prototype.forEach),m=b(Array.prototype.pop),p=b(Array.prototype.push),f=b(String.prototype.toLowerCase),d=b(String.prototype.toString),h=b(String.prototype.match),g=b(String.prototype.replace),T=b(String.prototype.indexOf),y=b(String.prototype.trim),E=b(Object.prototype.hasOwnProperty),A=b(RegExp.prototype.test),N=(X=TypeError,function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return s(X,t)});function b(e){return function(t){for(var n=arguments.length,o=Array(n>1?n-1:0),r=1;r<n;r++)o[r-1]=arguments[r];return c(e,t,o)}}function S(e,o){let r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:f;t&&t(e,null);let i=o.length;for(;i--;){let a=o[i];if("string"==typeof a){let l=r(a);l!==a&&(n(o)||(o[i]=l),a=l)}e[a]=!0}return e}function v(e){for(let t=0;t<e.length;t++){let n=E(e,t);n||(e[t]=null)}return e}function w(t){let n=l(null);for(let[o,r]of e(t)){let i=E(t,o);i&&(Array.isArray(r)?n[o]=v(r):r&&"object"==typeof r&&r.constructor===Object?n[o]=w(r):n[o]=r)}return n}function L(e,t){for(;null!==e;){let n=r(e,t);if(n){if(n.get)return b(n.get);if("function"==typeof n.value)return b(n.value)}e=o(e)}return function e(){return null}}let C=i(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","section","select","shadow","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),R=i(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","filter","font","g","glyph","glyphref","hkern","image","line","lineargradient","marker","mask","metadata","mpath","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),D=i(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),k=i(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),O=i(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),x=i(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),$=i(["#text"]),I=i(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","face","for","headers","height","hidden","high","href","hreflang","id","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),M=i(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),_=i(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),U=i(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),P=a(/\{\{[\w\W]*|[\w\W]*\}\}/gm),H=a(/<%[\w\W]*|[\w\W]*%>/gm),z=a(/\${[\w\W]*}/gm),F=a(/^data-[\-\w.\u00B7-\uFFFF]/),W=a(/^aria-[\-\w]+$/),G=a(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),B=a(/^(?:\w+script|data):/i),Y=a(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),j=a(/^html$/i),q=a(/^[a-z][.\w]*(-[.\w]+)+$/i);var X,K=Object.freeze({__proto__:null,ARIA_ATTR:W,ATTR_WHITESPACE:Y,CUSTOM_ELEMENT:q,DATA_ATTR:F,DOCTYPE_NAME:j,ERB_EXPR:H,IS_ALLOWED_URI:G,IS_SCRIPT_OR_DATA:B,MUSTACHE_EXPR:P,TMPLIT_EXPR:z});let V={element:1,attribute:2,text:3,cdataSection:4,entityReference:5,entityNode:6,progressingInstruction:7,comment:8,document:9,documentType:10,documentFragment:11,notation:12},Z=function e(t,n){if("object"!=typeof t||"function"!=typeof t.createPolicy)return null;let o=null,r="data-tt-policy-suffix";n&&n.hasAttribute(r)&&(o=n.getAttribute(r));let i="dompurify"+(o?"#"+o:"");try{return t.createPolicy(i,{createHTML:e=>e,createScriptURL:e=>e})}catch(a){return console.warn("TrustedTypes policy "+i+" could not be created."),null}};return function t(){let n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"undefined"==typeof window?null:window,o=e=>t(e);if(o.version="3.1.7",o.removed=[],!n||!n.document||n.document.nodeType!==V.document)return o.isSupported=!1,o;let{document:r}=n,a=r,c=a.currentScript,{DocumentFragment:s,HTMLTemplateElement:b,Node:v,Element:P,NodeFilter:H,NamedNodeMap:z=n.NamedNodeMap||n.MozNamedAttrMap,HTMLFormElement:F,DOMParser:W,trustedTypes:B}=n,Y=P.prototype,q=L(Y,"cloneNode"),X=L(Y,"remove"),J=L(Y,"nextSibling"),Q=L(Y,"childNodes"),ee=L(Y,"parentNode");if("function"==typeof b){let et=r.createElement("template");et.content&&et.content.ownerDocument&&(r=et.content.ownerDocument)}let en,eo="",{implementation:er,createNodeIterator:ei,createDocumentFragment:ea,getElementsByTagName:el}=r,{importNode:ec}=a,es={};o.isSupported="function"==typeof e&&"function"==typeof ee&&er&&void 0!==er.createHTMLDocument;let{MUSTACHE_EXPR:eu,ERB_EXPR:em,TMPLIT_EXPR:ep,DATA_ATTR:ef,ARIA_ATTR:ed,IS_SCRIPT_OR_DATA:eh,ATTR_WHITESPACE:eg,CUSTOM_ELEMENT:eT}=K,{IS_ALLOWED_URI:ey}=K,eE=null,e8=S({},[...C,...R,...D,...O,...$]),eA=null,eN=S({},[...I,...M,..._,...U]),eb=Object.seal(l(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),eS=null,ev=null,ew=!0,eL=!0,eC=!1,eR=!0,eD=!1,ek=!0,eO=!1,ex=!1,e$=!1,eI=!1,eM=!1,e_=!1,eU=!0,eP=!1,eH=!0,ez=!1,eF={},eW=null,eG=S({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]),eB=null,eY=S({},["audio","video","img","source","image","track"]),e0=null,ej=S({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),e7="http://www.w3.org/1998/Math/MathML",e1="http://www.w3.org/2000/svg",eq="http://www.w3.org/1999/xhtml",eX=eq,eK=!1,e9=null,eV=S({},[e7,e1,eq],d),e6=S({},["mi","mo","mn","ms","mtext"]),e2=S({},["annotation-xml"]),e3=S({},["title","style","font","a","script"]),e4=null,e5=["application/xhtml+xml","text/html"],eZ=null,eJ=null,eQ=r.createElement("form"),te=function e(t){return t instanceof RegExp||t instanceof Function},tt=function e(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if(!eJ||eJ!==t){if(t&&"object"==typeof t||(t={}),t=w(t),eZ="application/xhtml+xml"===(e4=-1===e5.indexOf(t.PARSER_MEDIA_TYPE)?"text/html":t.PARSER_MEDIA_TYPE)?d:f,eE=E(t,"ALLOWED_TAGS")?S({},t.ALLOWED_TAGS,eZ):e8,eA=E(t,"ALLOWED_ATTR")?S({},t.ALLOWED_ATTR,eZ):eN,e9=E(t,"ALLOWED_NAMESPACES")?S({},t.ALLOWED_NAMESPACES,d):eV,e0=E(t,"ADD_URI_SAFE_ATTR")?S(w(ej),t.ADD_URI_SAFE_ATTR,eZ):ej,eB=E(t,"ADD_DATA_URI_TAGS")?S(w(eY),t.ADD_DATA_URI_TAGS,eZ):eY,eW=E(t,"FORBID_CONTENTS")?S({},t.FORBID_CONTENTS,eZ):eG,eS=E(t,"FORBID_TAGS")?S({},t.FORBID_TAGS,eZ):{},ev=E(t,"FORBID_ATTR")?S({},t.FORBID_ATTR,eZ):{},eF=!!E(t,"USE_PROFILES")&&t.USE_PROFILES,ew=!1!==t.ALLOW_ARIA_ATTR,eL=!1!==t.ALLOW_DATA_ATTR,eC=t.ALLOW_UNKNOWN_PROTOCOLS||!1,eR=!1!==t.ALLOW_SELF_CLOSE_IN_ATTR,eD=t.SAFE_FOR_TEMPLATES||!1,ek=!1!==t.SAFE_FOR_XML,eO=t.WHOLE_DOCUMENT||!1,eI=t.RETURN_DOM||!1,eM=t.RETURN_DOM_FRAGMENT||!1,e_=t.RETURN_TRUSTED_TYPE||!1,e$=t.FORCE_BODY||!1,eU=!1!==t.SANITIZE_DOM,eP=t.SANITIZE_NAMED_PROPS||!1,eH=!1!==t.KEEP_CONTENT,ez=t.IN_PLACE||!1,ey=t.ALLOWED_URI_REGEXP||G,eX=t.NAMESPACE||eq,e6=t.MATHML_TEXT_INTEGRATION_POINTS||e6,e2=t.HTML_INTEGRATION_POINTS||e2,eb=t.CUSTOM_ELEMENT_HANDLING||{},t.CUSTOM_ELEMENT_HANDLING&&te(t.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(eb.tagNameCheck=t.CUSTOM_ELEMENT_HANDLING.tagNameCheck),t.CUSTOM_ELEMENT_HANDLING&&te(t.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(eb.attributeNameCheck=t.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),t.CUSTOM_ELEMENT_HANDLING&&"boolean"==typeof t.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements&&(eb.allowCustomizedBuiltInElements=t.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),eD&&(eL=!1),eM&&(eI=!0),eF&&(eE=S({},$),eA=[],!0===eF.html&&(S(eE,C),S(eA,I)),!0===eF.svg&&(S(eE,R),S(eA,M),S(eA,U)),!0===eF.svgFilters&&(S(eE,D),S(eA,M),S(eA,U)),!0===eF.mathMl&&(S(eE,O),S(eA,_),S(eA,U))),t.ADD_TAGS&&(eE===e8&&(eE=w(eE)),S(eE,t.ADD_TAGS,eZ)),t.ADD_ATTR&&(eA===eN&&(eA=w(eA)),S(eA,t.ADD_ATTR,eZ)),t.ADD_URI_SAFE_ATTR&&S(e0,t.ADD_URI_SAFE_ATTR,eZ),t.FORBID_CONTENTS&&(eW===eG&&(eW=w(eW)),S(eW,t.FORBID_CONTENTS,eZ)),eH&&(eE["#text"]=!0),eO&&S(eE,["html","head","body"]),eE.table&&(S(eE,["tbody"]),delete eS.tbody),t.TRUSTED_TYPES_POLICY){if("function"!=typeof t.TRUSTED_TYPES_POLICY.createHTML)throw N('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if("function"!=typeof t.TRUSTED_TYPES_POLICY.createScriptURL)throw N('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');eo=(en=t.TRUSTED_TYPES_POLICY).createHTML("")}else void 0===en&&(en=Z(B,c)),null!==en&&"string"==typeof eo&&(eo=en.createHTML(""));i&&i(t),eJ=t}},tn=S({},[...R,...D,...k]),to=S({},[...O,...x]),tr=function e(t){let n=ee(t);n&&n.tagName||(n={namespaceURI:eX,tagName:"template"});let o=f(t.tagName),r=f(n.tagName);return!!e9[t.namespaceURI]&&(t.namespaceURI===e1?n.namespaceURI===eq?"svg"===o:n.namespaceURI===e7?"svg"===o&&("annotation-xml"===r||e6[r]):Boolean(tn[o]):t.namespaceURI===e7?n.namespaceURI===eq?"math"===o:n.namespaceURI===e1?"math"===o&&e2[r]:Boolean(to[o]):t.namespaceURI===eq?(n.namespaceURI!==e1||!!e2[r])&&(n.namespaceURI!==e7||!!e6[r])&&!to[o]&&(e3[o]||!tn[o]):"application/xhtml+xml"===e4&&!!e9[t.namespaceURI])},ti=function e(t){p(o.removed,{element:t});try{ee(t).removeChild(t)}catch(n){X(t)}},ta=function e(t,n){try{p(o.removed,{attribute:n.getAttributeNode(t),from:n})}catch(r){p(o.removed,{attribute:null,from:n})}if(n.removeAttribute(t),"is"===t&&!eA[t]){if(eI||eM)try{ti(n)}catch(i){}else try{n.setAttribute(t,"")}catch(a){}}},tl=function e(t){let n=null,o=null;if(e$)t="<remove></remove>"+t;else{let i=h(t,/^[\r\n\t ]+/);o=i&&i[0]}"application/xhtml+xml"===e4&&eX===eq&&(t='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+t+"</body></html>");let a=en?en.createHTML(t):t;if(eX===eq)try{n=new W().parseFromString(a,e4)}catch(l){}if(!n||!n.documentElement){n=er.createDocument(eX,"template",null);try{n.documentElement.innerHTML=eK?eo:a}catch(c){}}let s=n.body||n.documentElement;return(t&&o&&s.insertBefore(r.createTextNode(o),s.childNodes[0]||null),eX===eq)?el.call(n,eO?"html":"body")[0]:eO?n.documentElement:s},tc=function e(t){return ei.call(t.ownerDocument||t,t,H.SHOW_ELEMENT|H.SHOW_COMMENT|H.SHOW_TEXT|H.SHOW_PROCESSING_INSTRUCTION|H.SHOW_CDATA_SECTION,null)},ts=function e(t){return t instanceof F&&("string"!=typeof t.nodeName||"string"!=typeof t.textContent||"function"!=typeof t.removeChild||!(t.attributes instanceof z)||"function"!=typeof t.removeAttribute||"function"!=typeof t.setAttribute||"string"!=typeof t.namespaceURI||"function"!=typeof t.insertBefore||"function"!=typeof t.hasChildNodes)},tu=function e(t){return"function"==typeof v&&t instanceof v};function tm(e,t,n){es[e]&&u(es[e],e=>{e.call(o,t,n,eJ)})}let tp=function e(t){let n=null;if(tm("beforeSanitizeElements",t,null),ts(t))return ti(t),!0;let r=eZ(t.nodeName);if(tm("uponSanitizeElement",t,{tagName:r,allowedTags:eE}),t.hasChildNodes()&&!tu(t.firstElementChild)&&A(/<[/\w]/g,t.innerHTML)&&A(/<[/\w]/g,t.textContent)||t.nodeType===V.progressingInstruction||ek&&t.nodeType===V.comment&&A(/<[/\w]/g,t.data))return ti(t),!0;if(!eE[r]||eS[r]){if(!eS[r]&&td(r)&&(eb.tagNameCheck instanceof RegExp&&A(eb.tagNameCheck,r)||eb.tagNameCheck instanceof Function&&eb.tagNameCheck(r)))return!1;if(eH&&!eW[r]){let i=ee(t)||t.parentNode,a=Q(t)||t.childNodes;if(a&&i){let l=a.length;for(let c=l-1;c>=0;--c){let s=q(a[c],!0);s.__removalCount=(t.__removalCount||0)+1,i.insertBefore(s,J(t))}}}return ti(t),!0}return t instanceof P&&!tr(t)||("noscript"===r||"noembed"===r||"noframes"===r)&&A(/<\/no(script|embed|frames)/i,t.innerHTML)?(ti(t),!0):(eD&&t.nodeType===V.text&&(n=t.textContent,u([eu,em,ep],e=>{n=g(n,e," ")}),t.textContent!==n&&(p(o.removed,{element:t.cloneNode()}),t.textContent=n)),tm("afterSanitizeElements",t,null),!1)},tf=function e(t,n,o){if(eU&&("id"===n||"name"===n)&&(o in r||o in eQ))return!1;if(eL&&!ev[n]&&A(ef,n));else if(ew&&A(ed,n));else if(!eA[n]||ev[n]){if(!(td(t)&&(eb.tagNameCheck instanceof RegExp&&A(eb.tagNameCheck,t)||eb.tagNameCheck instanceof Function&&eb.tagNameCheck(t))&&(eb.attributeNameCheck instanceof RegExp&&A(eb.attributeNameCheck,n)||eb.attributeNameCheck instanceof Function&&eb.attributeNameCheck(n))||"is"===n&&eb.allowCustomizedBuiltInElements&&(eb.tagNameCheck instanceof RegExp&&A(eb.tagNameCheck,o)||eb.tagNameCheck instanceof Function&&eb.tagNameCheck(o))))return!1}else if(e0[n]);else if(A(ey,g(o,eg,"")));else if(("src"===n||"xlink:href"===n||"href"===n)&&"script"!==t&&0===T(o,"data:")&&eB[t]);else if(eC&&!A(eh,g(o,eg,"")));else if(o)return!1;return!0},td=function e(t){return"annotation-xml"!==t&&h(t,eT)},th=function e(t){tm("beforeSanitizeAttributes",t,null);let{attributes:n}=t;if(!n)return;let r={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:eA,forceKeepAttr:void 0},i=n.length;for(;i--;){let a=n[i],{name:l,namespaceURI:c,value:s}=a,p=eZ(l),f="value"===l?s:y(s);if(r.attrName=p,r.attrValue=f,r.keepAttr=!0,r.forceKeepAttr=void 0,tm("uponSanitizeAttribute",t,r),f=r.attrValue,eP&&("id"===p||"name"===p)&&(ta(l,t),f="user-content-"+f),ek&&A(/((--!?|])>)|<\/(style|title)/i,f)){ta(l,t);continue}if(r.forceKeepAttr||(ta(l,t),!r.keepAttr))continue;if(!eR&&A(/\/>/i,f)){ta(l,t);continue}eD&&u([eu,em,ep],e=>{f=g(f,e," ")});let d=eZ(t.nodeName);if(tf(d,p,f)){if(en&&"object"==typeof B&&"function"==typeof B.getAttributeType){if(c);else switch(B.getAttributeType(d,p)){case"TrustedHTML":f=en.createHTML(f);break;case"TrustedScriptURL":f=en.createScriptURL(f)}}try{c?t.setAttributeNS(c,l,f):t.setAttribute(l,f),ts(t)?ti(t):m(o.removed)}catch(h){}}}tm("afterSanitizeAttributes",t,null)},tg=function e(t){let n=null,o=tc(t);for(tm("beforeSanitizeShadowDOM",t,null);n=o.nextNode();)tm("uponSanitizeShadowNode",n,null),!tp(n)&&(n.content instanceof s&&e(n.content),th(n));tm("afterSanitizeShadowDOM",t,null)};return o.sanitize=function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=null,r=null,i=null,l=null;if((eK=!e)&&(e="<!-->"),"string"!=typeof e&&!tu(e)){if("function"==typeof e.toString){if("string"!=typeof(e=e.toString()))throw N("dirty is not a string, aborting")}else throw N("toString is not a function")}if(!o.isSupported)return e;if(ex||tt(t),o.removed=[],"string"==typeof e&&(ez=!1),ez){if(e.nodeName){let c=eZ(e.nodeName);if(!eE[c]||eS[c])throw N("root node is forbidden and cannot be sanitized in-place")}}else if(e instanceof v)(r=(n=tl("<!---->")).ownerDocument.importNode(e,!0)).nodeType===V.element&&"BODY"===r.nodeName?n=r:"HTML"===r.nodeName?n=r:n.appendChild(r);else{if(!eI&&!eD&&!eO&&-1===e.indexOf("<"))return en&&e_?en.createHTML(e):e;if(!(n=tl(e)))return eI?null:e_?eo:""}n&&e$&&ti(n.firstChild);let m=tc(ez?e:n);for(;i=m.nextNode();)!tp(i)&&(i.content instanceof s&&tg(i.content),th(i));if(ez)return e;if(eI){if(eM)for(l=ea.call(n.ownerDocument);n.firstChild;)l.appendChild(n.firstChild);else l=n;return(eA.shadowroot||eA.shadowrootmode)&&(l=ec.call(a,l,!0)),l}let p=eO?n.outerHTML:n.innerHTML;return eO&&eE["!doctype"]&&n.ownerDocument&&n.ownerDocument.doctype&&n.ownerDocument.doctype.name&&A(j,n.ownerDocument.doctype.name)&&(p="<!DOCTYPE "+n.ownerDocument.doctype.name+">\n"+p),eD&&u([eu,em,ep],e=>{p=g(p,e," ")}),en&&e_?en.createHTML(p):p},o.setConfig=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};tt(e),ex=!0},o.clearConfig=function(){eJ=null,ex=!1},o.isValidAttribute=function(e,t,n){eJ||tt({});let o=eZ(e),r=eZ(t);return tf(o,r,n)},o.addHook=function(e,t){"function"==typeof t&&(es[e]=es[e]||[],p(es[e],t))},o.removeHook=function(e){if(es[e])return m(es[e])},o.removeHooks=function(e){es[e]&&(es[e]=[])},o.removeAllHooks=function(){es={}},o}()});
