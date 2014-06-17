Function.prototype.inherits = function(superClass) {
  var Surrogate = function() {};
  Surrogate.prototype = superClass.prototype;
  this.prototype = new Surrogate();
  this.prototype.constructor = superClass;
};