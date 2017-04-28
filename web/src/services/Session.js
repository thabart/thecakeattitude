var sessionName = "magicook_website";
module.exports = {
  getSession: function() {
    var value =  localStorage.getItem(sessionName);
    if (!value || value == null) {
      return null;
    }

    return JSON.parse(value);
  },
  setSession: function(value) {
    localStorage.setItem(sessionName, JSON.stringify(value));
  },
  remove: function() {
    localStorage.removeItem(sessionName);
  },
  isLoggedIn: function() {
    var session = this.getSession();
    return this.getSession() !== null && this.getSession();
  }
};
