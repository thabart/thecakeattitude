'use strict';
var Comment = function() { };
Comment.prototype = {
  render: function() {
    var self = this;
    self.component = $("<div class='rating'></div>");
    return self.component;
  },
  display: function(score, commentsObj) {// Display comments
    var comments = commentsObj['_embedded'],
      average = null,
      scores = null,
      nbComments = 0,
      self = this;
    var rating = $("<div></div>"); // Display the rating.
    rating.rateYo({
      rating: score,
      numStars: 5,
      readOnly: true,
      starWidth: "20px"
    });
    $(self.component).append(rating);
    if(comments) { // Display the comments.
      if (!(comments instanceof Array)) {
        comments = [comments];
      }

      var total = 0;
      scores = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0
      };
      comments.forEach(function (comment) {
        total += comment.score;
        scores["" + comment.score + ""] += 1;
      });

      var average = Math.round((total / comments.length) * 1000) / 1000;
      nbComments = comments.length;
    }

    $(this.component).tooltip({
      items: '.rating > div',
      content: function() {
        var result = $("<div>"+
          "<div class='progressbar-5 progress-bar'></div>"+
          "<div class='progressbar-4 progress-bar'></div>"+
          "<div class='progressbar-3 progress-bar'></div>"+
          "<div class='progressbar-2 progress-bar'></div>"+
          "<div class='progressbar-1 progress-bar'></div>"+
        "</div>");
        for(var score in scores) {
          var progressBar = result.find('.progressbar-'+score);
          var nbComments = scores[score];
          var progressBarContent = $("<div class='progress-bar-label'><span class='title'>"+$.i18n('nbComments')+" : <i>"+nbComments+"</i></span><div class='rating'></div></div>");
          $(progressBarContent).find('.rating').rateYo({
            rating: score,
            numStars: 5,
            readOnly: true,
            starWidth: "20px"
          });
          progressBar.append(progressBarContent);
          progressBar.progressbar({
            value: scores[score],
            max: 5
          });
        }
        return result;
      }
    });
  }
};
