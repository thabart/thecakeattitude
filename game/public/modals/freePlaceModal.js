var FreePlaceModal = function() {};
FreePlaceModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function() {
    var self = this;
    var title = $.i18n('freePlaceModalTitle'),
      name = $.i18n('name'),
      description = $.i18n('description'),
      tags = $.i18n('tags'),
      bannerImage = $.i18n('bannerImage'),
      profilePicture = $.i18n('profilePicture'),
      next = $.i18n('next'),
      address = $.i18n('address'),
      contactInformation = $.i18n('contactInformation'),
      payment = $.i18n('payment');
    self.create("<div class='modal modal-lg' id='free-place-modal' style='display:none;'>"+
      "<div class='modal-content'>"+
        "<div class='modal-window'>"+
          "<div class='header'>"+
            "<span class='title'>"+title+"</span>"+
            "<div class='options'>"+
              "<button class='option close'><i class='fa fa-times'></i></button>"+
            "</div>"+
          "</div>"+
          "<div class='container'>"+
            "<div>"+
              "<ul class='progressbar'>"+
                "<li class='col-3 active'>"+description+"</li>"+
                "<li class='col-3'>"+address+"</li>"+
                "<li class='col-3'>"+contactInformation+"</li>"+
                "<li class='col-3'>"+payment+"</li>"+
              "</ul>"+
            "</div>"+
            "<div>"+
              "<section class='col-6'>"+
                "<div>"+
                  "<label>"+name+"</label>"+
                  "<input type='text' class='input-control' />"+
                "</div>"+
                "<div>"+
                  "<label>"+description+"</label>"+
                  "<textarea class='input-control' />"+
                "</div>"+
                "<div>"+
                  "<label>"+tags+"</label>"+
                  "<input type='text' class='input-control tags' />"+
                "</div>"+
              "</section>"+
              "<section class='col-6'>"+
                "<div>"+
                  "<label>"+bannerImage+"</label>"+
                  "<input type='file' accept='image/*' class='input-control' />"+
                "</div>"+
                "<div>"+
                  "<label>"+profilePicture+"</label>"+
                  "<input type='file' accept='image/*' class='input-control' />"+
                "</div>"+
              "</section>"+
            "</div>"+
          "</div>"+
          "<div class='footer'>"+
            "<button class='action-btn'>"+next+"</button>"+
          "</div>"+
        "</div>"+
      "</div>"+
    "</div>");

    $(this.modal).find('.tags').selectize({
      create: false,
      labelField: 'name',
      searchField: 'name',
      valueField: 'name',
      render: {
        option: function(item, escape) {
          return "<div><span class='title'>"+item.name+"</span></div>";
        }
      },
      load: function(query, callback) {
        TagsClient.search({name: query}).then(function(tags) {
          var embedded = tags._embedded;
          if (!(embedded instanceof Array)) {
            embedded = [embedded];
          }

          callback(embedded);
        }).fail(function() {
          callback();
        });
      }
    });
  }
});
