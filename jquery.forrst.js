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
 *
 * FEATURES:
 *
 * OPTIONS:
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

  /* define our methods */
  var methods = {

   /* primary method of usage */
   init: function(options){

    /* chain it up */
    return this.each(function(){

     /* default options */
     var defaults = {
      storage:  'localStorage',          // HTML5 storage option (localStorage, sessionStorage)
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
      callback: function() {}            // Optional callback once form processed
     };

     /* merge defined with defaults */
     var opts = $.extend({}, defaults, options);

     /* make sure dependencies met */
     if (__dependencies(opts)){ 

     /* handle key setting/getting */
     handleKey(opts);

     /* cached options? */
     cachedOptions(opts);
    }

    return true;
    });
   },

   /* Authentication */
   authenticate: function(o){
    return this.each(function(){
     /* bind to submit event and do the do */
     $('#'+opts.form).live('submit', function(e){
      e.preventDefault();
      __do(opts);
     });
    });
   },

   /* User info */
   userinfo: function(o){
    return this.each(function(){
     /* bind to submit event and do the do */
     $('#'+opts.form).live('submit', function(e){
      e.preventDefault();
      __do(opts);
     });
    });
   },

   /* post info */
   postinfo: function(o){
    return this.each(function(){
     /* bind to submit event and do the do */
     $('#'+opts.form).live('submit', function(e){
      e.preventDefault();
      __do(opts);
     });
    });
   },

   /* posts comments */
   postcomments: function(o){
    return this.each(function(){
     /* bind to submit event and do the do */
     $('#'+opts.form).live('submit', function(e){
      e.preventDefault();
      __do(opts);
     });
    });
   }
  };

  /* send it off to the server */
  var __do = function(options){
   $.ajax({
    data: options.data,
    type: options.type,
    url: options.proxy,
    success: function(x){
     ((options.callback)&&($.isFunction(options.callback))) ? options.callback.call(x) : false;
    }
   });
   return false;
  }

  /* handle cached options */
  var cachedOptions = function(options){
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

  /* generate or use existing uuid key */
  var handleKey = function(options) {
   if (options.aes) {
    options.key = (getItem(options.storage, 'uuid')) ? getItem(options.storage, 'uuid') : $.genUUID(null);
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
   return (len!==null) ? uuid.join('').replace(/-/g, '').split('',len).join('') : uuid.join('');
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

  /* robot, do something */
  if (methods[method]){
   return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
  } else if (typeof method==='object' || ! method){
   return methods.init.apply(this, arguments);
  } else {
   console.log('Method '+method+' does not exist');
  }
 };
})(jQuery);
