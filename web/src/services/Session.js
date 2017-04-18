var sessionName = "magicook_website";
module.exports = {
  getSession: function() {
    return sessionStorage.getItem(sessionName);
  },
  setSession: function(value) {
    sessionStorage.setItem(sessionName, value);
  },
  remove: function() {
    sessionStorage.removeItem(sessionName);
  }
};
