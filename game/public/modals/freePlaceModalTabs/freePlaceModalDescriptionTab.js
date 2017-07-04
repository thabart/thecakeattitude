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
    self.tab = $("<form class='container'>"+
      "<div>"+
        "<section class='col-6'>"+
          "<div>"+
            "<label>"+name+"</label>"+
            "<span class='error-message'></span>"+
            "<input type='text' name='name' class='input-control' required />"+
          "</div>"+
          "<div>"+
            "<label>"+description+"</label>"+
            "<span class='error-message'></span>"+
            "<textarea name='description' class='input-control' required />"+
          "</div>"+
          "<div>"+
            "<label>"+tags+"</label>"+
            "<input type='text' name='tags' class='input-control tags' />"+
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
    "</form>");
    var uploadImage = function(e, callback) {
      e.preventDefault();
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result);
      };
      reader.readAsDataURL(file);
    };
    self.tags = $(self.tab).find('.tags').selectize({
      create: true,
      persist: false,
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
    self.tab.validate({
      rules: {
        name: {
          required: true,
          minlength: 1,
          maxlength: 15
        },
        description: {
          required: true,
          minlength: 1,
          maxlength: 255
        }
      },
      errorPlacement: function(error, elt) {
        error.appendTo(elt.prev());
      }
    });
    $(self.tab).find('.banner-image-up').change(function(e) {
      uploadImage(e, function(b64Img) {
        $(self.tab).find('.banner-image').html("<img src='"+b64Img+"' />");
      });
    });
    $(self.tab).find('.profile-picture-up').change(function(e) {
      uploadImage(e, function(b64Img) {
        $(self.tab).find('.profile-picture').html("<img src='"+b64Img+"' />");
      });
    });
    $(self.tab).submit(function(e) {
      e.preventDefault();
      self.tab.form();
      if (!self.tab.valid()) {
        return;
      }

      var bannerImage = $(self.tab).find(".banner-image img").attr('src'),
        profileImage = $(self.tab).find(".profile-picture img").attr('src');
      var json = {
        name: $(self.tab).find("input[name='name']").val(),
        description: $(self.tab).find("textarea[name='description']").val(),
        tags: self.tags[0].selectize.items
      };
      if (bannerImage) {
        json['banner_image'] = bannerImage;
      }

      if (profileImage) {
        json['profile_image'] = profileImage;
      }

      $(self).trigger('next', [json]);
    });
    return self.tab;
  },
  clean: function() {
    var self = this;
    $(self.tab).find("input[name='name']").val('');
    $(self.tab).find("textarea[name='description']").val('');
    $(self.tab).find("input[name='tags']").val('');
    $(self.tab).find(".banner-image").empty();
    $(self.tab).find(".profile-picture").empty();
  }
};
