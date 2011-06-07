## jQuery plugin to the forrst.com API

 Allows for retrieval of user info, post info and soon authentication. Also
 supports AES encryption for client storage and more...

 Fork me @ https://www.github.com/jas-/jQuery.forrst

# REQUIREMENTS:
 * jQuery libraries (required - http://www.jquery.com)
 * pidCrypt RSA & AES libraries (required - https://www.pidder.com/pidcrypt/)
 * jQuery cookie plugin (optional - http://plugins.jquery.com/files/jquery.cookie.js.txt)

# FEATURES:
 1. Interface for authentication
 2. Interface for user information
 3. Interface for post information
 4. Caching support for response
  * HTML5 localStorage support
  * HTML5 sessionStorage support
  * Cookie support
  * Optional AES encryption support for client storage

# OPTIONS:
 * storage:  HTML5 localStorage, sessionStorage and cookies supported
 * aes:      Options Gibberish-AES encryption support
 * callback: Optional function used once server recieves encrypted data

# EXAMPLES:
 * Authentication example (for use on a form)
  ```$('#formID').forrst('authenticate');```

 * Get user information (for use on a form)
  ```$('#formID').forrst('userinfo');```

 * Get user information (with name specified)
  ```$('#formID').forrst('userinfo',{id:'username'});```

 * Get user information (with name specified)
   using encryption to store results (requires GibberishAES library)
  ```$('#formID').forrst('userinfo',{id:'username',aes:true});```

 * Get user information (with name specified)
   using sessionStorage
  ```$('#formID').forrst('userinfo',{id:'username',storage:'sessionStorage'});```

 * Get user information (with name specified)
   using cookies (requires cookie plugin)
  ```$('#formID').forrst('userinfo',{id:'username',storage:'cookie'});```

 Author: Jason Gerfen <jason.gerfen@gmail.com>
 License: GPL
