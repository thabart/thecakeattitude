var sessionName = "magicook_website";
module.exports = {
  getSession: function() {
    var value =  sessionStorage.getItem(sessionName);
    if (!value || value == null) {
      return null;
    }

    return JSON.parse(value);
  },
  setSession: function(value) {
    sessionStorage.setItem(sessionName, JSON.stringify(value));
  },
  remove: function() {
    sessionStorage.removeItem(sessionName);
  },
  isLoggedIn: function() {
    return this.getSession() !== null && this.getSession();
  }
};
