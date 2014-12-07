var origCollection = Meteor.Collection,
    activeCollections = [];

Meteor.Collection = function (name, options) {
    var instance = new origCollection(name, options);
    activeCollections.push({
        name: name,
        instance: instance
    });
    return instance
};

if (Meteor.isClient) {

    Template.body.helpers({
        MongoInspector_enabled: function() {

            var url       = Meteor.absoluteUrl(),
                localhost = url.indexOf("http://localhost"),
                cordova   = Meteor.isCordova;

            if (localhost === -1) {
                return false;
            } else if (cordova === true) {
                return false;
            } else {
                return true;
            }

        },
        MongoInspector_collections: function () {
            return activeCollections;

        }
    });

    Template.body.events({
        'click .MongoInspector_row': function () {
            var collectionName = this.name;
            var thisCollection = this.instance;
            console.log(thisCollection.find().fetch());
        },
        'click .MongoInspector_header': function () {
            $("#MongoInspector").hide();
        },
    });

    Template.MongoInspector_collection.helpers({
        collectionCount: function () {
            var collectionName = this.name;
            var thisCollection = this.instance;
            return thisCollection.find().count();
        }
    });

}