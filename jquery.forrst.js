/**
 *
 * jQuery plugin to impliment forrst API.
 *
 * Simple interface to the forrst.com API with support
 * for authentication, retrieving user details and
 * retrieving post details
 *
 * Fork me @ https://www.github.com/jas-/jQuery.forrst
 *
 * REQUIREMENTS:
 * - jQuery libraries (required - http://www.jquery.com)
 * - jQuery cookie plugin (optional - http://plugins.jquery.com/files/jquery.cookie.js.txt)
 * - Gibberish-AES libraries (optional - https://github.com/mdp/gibberish-aes)
 *
 * FEATURES:
 * - HTML5 client storage options
 * - Optional cookie storage support
 * - Optional AES encryption support for client storage items
 *
 * METHODS:
 * - authenticate: Use forrst.com API for authentication
 * - userinfo:     Obtain details on forrst user's
 * - postinfo:     Obtain details on forrst posts
 * - postcomments: Obtain post comments
 *
 * USAGE:
 *
 * Author: Jason Gerfen <jason.gerfen@gmail.com>
 * License: GPL
 *
 */

(function($){

 /* jQuery.forrst plug-in */
 $.fn.forrst = function(method){

  /* default options */
  var defaults = {
   storage:  'localStorage',          // HTML5 storage option (localStorage, sessionStorage)
   agent:    'jQuery.forrst',         // This is the unique (mandatory) API usage agent
   email:    '',                      // Username/email of forrst user
   passwd:   '',                      // Password of forrst user
   userid:   '',                      // User id
   ptype:    '',                      // Post type (code, snap, link, question)
   limit:    3,                       // Number of posts to return per page
   after:    '',                      // Returns only posts after id
   form:     $(this).attr('id'),      // Place holder for form ID
   proxy:    $(this).attr('action'),  // Place holder for form action
   type:     $(this).attr('method'),  // Place holder for form method
   data:     {},                      // Place holder for serialized form data
   aes:      false,                   // Use Gibberis-AES for client storage
   uuid:     '',                      // Place holder for key
   token:    '',                      // Place holder for authentication token
   callback: function() {}            // Optional callback once form processed
  };

  /* define our methods */
  var methods = {

   /* Authentication */
   authenticate: function(options){
    var cmd = 'users/auth';
    options = __setup(options, cmd);
    $('#'+options.form).live('submit', function(e){
     e.preventDefault();
     __do(options);
    });
   },

   /* User info */
   userinfo: function(options){
    var cmd = 'users/info';
    options = __setup(options, cmd);
    $('#'+options.form).live('submit', function(e){
     e.preventDefault();
     __do(options);
    });
   },

   /* post info */
   postinfo: function(options){
    var cmd = 'posts/show';
    options = __setup(options, cmd);
    $('#'+options.form).live('submit', function(e){
     e.preventDefault();
     __do(options);
    });
   },

   /* posts comments */
   postcomments: function(options){
    var cmd = 'post/comments';
    options = __setup(options, cmd);
    $('#'+options.form).live('submit', function(e){
     e.preventDefault();
     __do(options);
    });
   }
  };

  /* send it off to the server */
  var __do = function(options){
   $.ajax({
    data: options.data,
    dataType:'json',
    type: options.type,
    action: options.proxy,
    url: options.proxy,
    success: function(x){
     ((options.callback)&&($.isFunction(options.callback))) ?
      options.callback.call(x) : false;
    }
   });
   return false;
  }

  /* setup everything */
  var __setup = function(options, cmd){
   options = $.extend({}, defaults, options);
   options.proxy = options.proxy+cmd;
   options.data = getElements(options);
   if (__dependencies(options)){
    _setOptions(options);
    handleKey(options);
    _getOptions(options);
    return options;
   } else {
    return false;
   }
  }

  /* get form elements */
  var getElements = function(opts){
   var obj={}; obj['agent'] = opts.agent;
   $.each($('#'+opts.form+' :text, :password, :file, input:hidden,'+
            'input:checkbox:checked, input:radio:checked, textarea'),
          function(k, v){
    if (validateString(v.value)){
     obj[v.name] = (parseInt(v.value.length)>80) ? strSplit(v.value) : v.value;
    }
   });
   return obj;
  }

  /* set options (decrypting if specified) */
  var _getOptions = function(options){
   options.token = (getItem(options.storage, 'token')) ?
    ((options.aes)&&(options.key)) ?
     GibberishAES.dec(getItem(options.storage, 'token'), options.uuid) :
     getItem(options.storage, 'token') : '';

   options.email = (getItem(options.storage, 'email')) ?
    ((options.aes)&&(options.key)) ?
     GibberishAES.dec(getItem(options.storage, 'email'), options.uuid) :
     getItem(options.storage, 'email') : '';

   options.passwd = (getItem(options.storage, 'passwd')) ?
    ((options.aes)&&(options.key)) ?
     GibberishAES.dec(getItem(options.storage, 'passwd'), options.uuid) :
     getItem(options.storage, 'passwd') : '';

   options.userid = (getItem(options.storage, 'userid')) ?
    ((options.aes)&&(options.key)) ?
     GibberishAES.dec(getItem(options.storage, 'userid'), options.uuid) :
     getItem(options.storage, 'userid') : '';

   options.ptype = (getItem(options.storage, 'ptype')) ?
    ((options.aes)&&(options.key)) ?
     GibberishAES.dec(getItem(options.storage, 'ptype'), options.uuid) :
     getItem(options.storage, 'ptype') : '';
   return true;
  }

  /* get cached options (encrypting if specified) */
  var _setOptions = function(options){
   if (validateString(options.token)){
    ((options.aes)&&(options.key)) ?
     setItem(options.storage, 'token', GibberishAES.enc(options.token,
                                                        options.uuid),
             options.uuid) : setItem(options.storage, 'token', options.token);
   }

   if (validateString(options.email)){
    ((options.aes)&&(options.key)) ?
     setItem(options.storage, 'email', GibberishAES.enc(options.email,
                                                        options.uuid),
             options.uuid) : setItem(options.storage, 'email', options.email);
   }

   if (validateString(options.passwd)){
    ((options.aes)&&(options.key)) ?
     setItem(options.storage, 'passwd', GibberishAES.enc(options.passwd,
                                                         options.uuid),
             options.uuid) : setItem(options.storage, 'token', options.passwd);
   }

   if (validateString(options.userid)){
    ((options.aes)&&(options.key)) ?
     setItem(options.storage, 'userid', GibberishAES.enc(options.userid,
                                                         options.uuid),
             options.uuid) : setItem(options.storage, 'userid', options.userid);
   }

   if (validateString(options.ptype)){
    ((options.aes)&&(options.key)) ?
     setItem(options.storage, 'ptype', GibberishAES.enc(options.ptype,
                                                        options.uuid),
             options.uuid) : setItem(options.storage, 'ptype', options.ptype);
   }
   return true;
  }

  /* generate or use existing uuid key */
  var handleKey = function(options) {
   if (options.aes) {
    options.key = (getItem(options.storage, 'uuid')) ?
     getItem(options.storage, 'uuid') : $.genUUID(null);
    setItem(options.storage, 'uuid', options.key);
   }
  }

  /* generate a uuid (RFC-4122) */
  var genUUID = function(len){
   var chars = '0123456789abcdef'.split('');
   var uuid = [], rnd = Math.random, r;
   uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
   uuid[14] = '4';
   for (var i = 0; i < 36; i++){
    if (!uuid[i]){
     r = 0 | rnd()*16;
     uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r & 0xf];
    }
   }
   return (len!==null) ? uuid.join('').replace(/-/g,'').split('',len).join('') :
                         uuid.join('');
  }

  /* use storage options to save form data */
  var setItem = function(type, k, v){
   var x = false;
   type = (validateStorage(type)) ? type : 'cookie';
   switch(type) {
    case 'localStorage':
     x = setLocal(k, v);
     break;
    case 'sessionStorage':
     x = setSession(k, v);
     break;
    case 'cookie':
     x = setCookie(k, v);
     break;
    default:
     x = setLocal(k, v);
     break;
   }
   return x;
  }

  /* use storage option to get data */
  var getItem = function(type, k){
   var x = false;
   type = (validateStorage(type)) ? type : 'cookie';
   switch(type) {
    case 'localStorage':
     x = getLocal(k);
     break;
    case 'sessionStorage':
     x = getSession(k);
     break;
    case 'cookie':
     x = getCookie(k);
     break;
    default:
     x = getLocal(k);
     break;
   }
   return x;
  }

  /* localStorage setter */
  var setLocal = function(k, v){
   return (localStorage.setItem(k, v)) ? false : true;
  }

  /* localSession setter */
  var setSession = function(k, v){
   return (sessionStorage.setItem(k, v)) ? false : true;
  }

  /* cookie setter */
  var setCookie = function(k, v){
   if (typeof $.cookie === 'function') {
    return ($.cookie(k, v, {expires: 7})) ? true : false;
   } else {
    return false;
   }
  }

  /* localStorage getter */
  var getLocal = function(k){
   return (localStorage.getItem(k)) ? localStorage.getItem(k) : false;
  }

  /* sessionStorage getter */
  var getSession = function(k){
   return (sessionStorage.getItem(k)) ? sessionStorage.getItem(k) : false;
  }

  /* cookie getter */
  var getCookie = function(name){
   if (typeof $.cookie === 'function') {
    return ($.cookie(name)) ? $.cookie(name) : false;
   } else {
    return false;
   }
  }

  /* validate string integrity */
  var validateString = function(x){
   return ((x===false)||(x.length===0)||(!x)||(x===null)||
           (x==='')||(typeof x==='undefined')) ? false : true;
  }

  /* validate HTML5 storage functionality (a better way to do this?) */
  var validateStorage = function(type){
   try {
    return ((type in window)&&(window[type])) ? true : false;
   } catch (e) {
    return false;
   }
  }

  /* dependencies? */
  var __dependencies = function(opts){
   var ret = true;
   if (opts.aes){
    if (typeof GibberishAES.enc!=='function'){
     console.log('Gibberish-AES use specified but required libraries not'+
                 'available. Please include the Gibberish-AES libs...');
     ret = false;
    }
   }
   if (opts.storage==='cookie'){
    if (!$.isFunction($.cookie)){
     console.log('Cookie use specified but required libraries not available.'+
                 'Please include the jQuery cookie plugin...');
     console.log('Download it from https://github.com/carhartl/jquery-cookie');
     ret = false;
    }
   }
   return ret;
  }

  /* object inspector for debugging */
  var __recurse = function(obj){
   $.each(obj, function(x,y){
    if (typeof y==='object'){
     __recurse(y);
    } else {
     console.log(x+' => '+y);
    }
   });
  }

  /* robot, do something */
  if (methods[method]){
   return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
  } else if ((typeof method==='object')||(!method)){
   return methods.init.apply(this, arguments);
  } else {
   console.log('Method '+method+' does not exist');
  }
 };
})(jQuery);
