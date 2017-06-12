var FreePlaceModalDescriptionTab = function() {};
FreePlaceModalDescriptionTab.prototype = {
  render: function() {
    var name = $.i18n('name'),
      description = $.i18n('description'),
      tags = $.i18n('tags'),
      bannerImage = $.i18n('bannerImage'),
      profilePicture = $.i18n('profilePicture'),
      next = $.i18n('next'),
      self = this;
    var result = $("<div class='container'>"+
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
        "<section class='col-6 images'>"+
          "<div>"+
            "<label>"+bannerImage+"</label>"+
            "<input type='file' accept='image/*' class='input-control banner-image-up' />"+
            "<div class='banner-image'></div>"+
          "</div>"+
          "<div>"+
            "<label>"+profilePicture+"</label>"+
            "<input type='file' accept='image/*' class='input-control profile-picture-up' />"+
            "<div class='profile-picture'></div>"+
          "</div>"+
        "</section>"+
      "</div>"+
      "<div class='footer'>"+
        "<button class='action-btn next'>"+next+"</button>"+
      "</div>"+
    "</div>");
    var uploadImage = function(e, callback) {
      e.preventDefault();
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result);
      };
      reader.readAsDataURL(file);
    };
    $(result).find('.tags').selectize({
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
    $(result).find('.banner-image-up').change(function(e) {
      uploadImage(e, function(b64Img) {
        $(result).find('.banner-image').html("<img src='"+b64Img+"' />");
      });
    });
    $(result).find('.profile-picture-up').change(function(e) {
      uploadImage(e, function(b64Img) {
        $(result).find('.profile-picture').html("<img src='"+b64Img+"' />");
      });
    });
    $(result).find('.next').click(function() {
      $(self).trigger('next');
    });
    return result;
  }
};
