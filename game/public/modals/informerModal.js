var InformerModal = function() { };
InformerModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function() {
    var self = this;
    var title = $.i18n('informerModalTitle');
    self.create("<div class='modal modal-lg md-effect-1'>"+
      "<div class='modal-content'>"+
        "<div class='modal-window'>"+
          "<div class='header'>"+
            "<span class='title'>"+title+"</span>"+
            "<div class='options'>"+
              "<button class='option close'><i class='fa fa-times'></i></button>"+
            "</div>"+
          "</div>"+
          "<div class='container'>"+
            "<div class='content'>"+
              "<div>"+
                "<div class='col-3'>"+
                  "<img src='/styles/images/default-store.png' style='width: 50px; max-height: 50px;' />"+
                "</div>"+
                "<div class='col-9'>"+
                  "<h3>Title</h3>"+
                  "<div>"+
                    "<span>Comments</span> <div class='rating'></div>"+
                  "</div>"+
                "</div>"+
              "</div>"+
              "<div>"+
                "<label>Description</label>"+
                "<p>Fieri, inquam, Triari, nullo pacto potest, ut non dicas, quid non probes eius, a quo dissentias. quid enim me prohiberet Epicureum esse, si probarem, quae ille diceret? cum praesertim illa perdiscere ludus esset. Quam ob rem dissentientium inter se reprehensiones non sunt vituperandae, maledicta, contumeliae, tum iracundiae, contentiones concertationesque in disputando pertinaces indignae philosophia mihi videri solent</p>"+
              "</div>"+
              "<div>"+
                "<label>Accepted payment methods</label>"+
              "</div>"+
              "<div>"+
                "<label></label>"+
                "<p>Address</p>"+
              "</div>"+
            "</div>"+
          "</div>"+
        "</div>"+
    "</div>");
    $(self.modal).find('.rating').rateYo({
      rating: 3.5,
      numStars: 5,
      readOnly: true,
      starWidth: "20px"
    });
  }
});
