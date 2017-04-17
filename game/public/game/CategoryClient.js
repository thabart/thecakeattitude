var CategoryClient = {
	getCategory: function(id) {
		return $.get(Constants.apiUrl + '/categories/' +id);
	}	
};