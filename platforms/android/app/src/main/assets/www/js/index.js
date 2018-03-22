var app = {

    localStorage: window.localStorage, //HTML5
    contactInfo: null,
    //flagstr: ">",

    initialize: function() {
        this.initFastClick();
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);

        $(document).on("click", "#contactList li.contact_list_item", function(){
          //alert("zzz" + $(this).attr("id"));
          var selectedID = $(this).attr("id");
          app.getContactByID(selectedID);
        });

        $(document).bind("pagechange", this.onPageChange);
    },

    initFastClick : function() {
        window.addEventListener('load', function() {
            FastClick.attach(document.body);
        }, false);
    },

    onDeviceReady: function() {

        //alert("bem vindo");

        //alert(device.platform);

        if (device.platform === "iOS"){
          StatusBar.overlaysWebView(false);
        }

        app.getAllContacts();

    },

    getAllContacts: function() {

        var options = new ContactFindOptions();
        options.filter="";          // empty search string returns all contacts
        options.multiple=true;      // return multiple results
        var fields = [navigator.contacts.fieldType.name];

        // find contacts
        navigator.contacts.find(fields, this.onAllSuccess, this.onError, options);
    },

    onAllSuccess: function(contacts) {

        if (contacts.length) {

          var length = 30;
          if (contacts.length < 30) {
            length = contacts.length;
          }

          //contacts.sort(app.alphabeticalSort);

          var myContacts = [];
          for (var i=0; i<length; ++i) {
            if (contacts[i].name){
              var contact = {};
              contact.id = contacts[i].id;
              contact.name = contacts[i].name;
              contact.phoneNumbers = contacts[i].phoneNumbers;
              myContacts.push(contact);
            }
          }

          var appendList = "";
          for (var i=0; i<length; ++i) {

            var contact = myContacts[i];

            app.localStorage.setItem(contact.id, JSON.stringify(contact));

            appendList += "<li class='contact_list_item' id='" +
                          contact.id + "'><a href='#contact-info'>" +
                          contact.name.formatted + "(" + contact.id + ")</a></li>";


          }

          $("#contactList").append(appendList);

        }
        else {
          $("#contactList").append("<li>nada</li>");
        }


        $("#contactList").listview("refresh");

    },


    onError: function(error) {

        alert('erroooo ' + error.code);

    },

    onPageChange: function(evento, data) {

        var toPageId = data.toPage.attr("id");
        //alert("loading page ... " + toPageId);

        //app.flagstr += ".("+toPageId+")";

        switch (toPageId) {
          case "contact-info":
            //alert("123");
            app.clearValues();
            //alert("abc");
            //alert(JSON.stringify(app.contactInfo));
            $("#contact_header h1").html(app.contactInfo.name.formatted);
            $("#givenName").val(app.contactInfo.name.givenName);
            $("#familyName").val(app.contactInfo.name.familyName);
            $("#phone").val(app.contactInfo.phoneNumbers[0].value);
            //$("#phone").val(app.flagstr);
          break;
        }

    },

    clearValues: function() {

        $("input[type=text]").each(function(){
          $("#"+this.id+"").val("")
        });

    },

    getContactByID: function(contactID) {

        //alert(contactID);

        app.contactInfo = JSON.parse(app.localStorage.getItem(contactID));
        //$.mobile.changePage($("#contact-info"));

    }
};
