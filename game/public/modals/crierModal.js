'use strict';
var CrierModal = function() { };
CrierModal.prototype = $.extend({}, BaseModal.prototype, {
  init: function() {
    var self = this;
    var title = $.i18n('crierModalTitle'),
      addOffer = $.i18n('addOffer'),
      manageOffers = $.i18n('manageOffers'),
      searchOffers = $.i18n('searchOffers');
    self.addOfferModal = new AddOfferModal();
    self.manageOffersModal = new ManageOffersModal();
    self.searchOffersModal = new SearchOffersModal();
    self.addOfferModal.init();
    self.manageOffersModal.init();
    self.searchOffersModal.init();
    self.create("<div class='modal modal-lg md-effect-1'>"+
      "<div class='modal-content'>"+
        "<div class='modal-window modal-window-circle'>"+
          "<div class='header'>"+
            "<span class='title'>"+title+"</span>"+
            "<div class='options'>"+
              "<button class='option close'><i class='fa fa-times'></i></button>"+
            "</div>"+
          "</div>"+
          "<div class='content'>"+
            "<ul class='list no-border center-text'>"+
              "<li><button class='action-btn lg-action-btn add-offer'>"+addOffer+"</button></li>"+
              "<li><button class='action-btn lg-action-btn manage-offers'>"+manageOffers+"</button></li>"+
              "<li><button class='action-btn lg-action-btn search-offers'>"+searchOffers+"</button></li>"+
            "</ul>"+
          "</div>"+
        "</div>"+
      "</div>"+
    "</div>");
    $(self.modal).find('.add-offer').click(function() {
      self.toggle();
      self.addOfferModal.show();
    });
    $(self.modal).find('.manage-offers').click(function() {
      self.toggle();
      self.manageOffersModal.toggle();
    });
    $(self.modal).find('.search-offers').click(function() {
      self.toggle();
      self.searchOffersModal.toggle();
    });
  },
  remove() {
    this.addOfferModal.remove();
    this.manageOffersModal.remove();
    this.searchOffersModal.remove();
    $(this.modal).remove();
  }
});
