/**
 * Quick and dirty mocker of Karere
 *
 * Note: requires sinon.js
 *
 * @param objectInstance
 * @constructor
 */
var KarereMocker = function(objectInstance) {
    var self = this;

    self.objectMocker = new ObjectMocker(
        objectInstance,
        {
            'connect': function(jid, password) {
                var $promise = new $.Deferred();
                $promise.resolve();

                if(jid == Strophe.getBareJidFromJid(jid)) {
                    var resource = this.options.clientName + "-" + this._generateNewResourceIdx();
                    jid = jid + "/" + resource;
                }
                this._jid = jid;
                this._password = password;

                this._connectionState = Karere.CONNECTION_STATE.CONNECTED;

                this._presenceCache[this.getJid()] = localStorage.megaChatPresence ? localStorage.megaChatPresence : "chat";
                this._presenceBareCache[this.getBareJid()] = localStorage.megaChatPresence ? localStorage.megaChatPresence : "chat";

                return $promise;
            },
            'disconnect': function() {
                var $promise = new $.Deferred();
                $promise.resolve();

                this._connectionState = Karere.CONNECTION_STATE.DISCONNECTED;
                this.clearMeta('rooms');

                return $promise;
            },
            'startChat': function(jidList, type, roomName, password) {
                var $promise = new $.Deferred();
                $promise.resolve(roomName ? roomName + "@" + this.options.mucDomain : "roomjid@conference.example.com");

                return $promise;
            },
            'waitForUserToJoin': function() {
                var $promise = new $.Deferred();
                $promise.resolve();

                return $promise;
            },
            'waitForUserToLeave': function() {
                var $promise = new $.Deferred();
                $promise.resolve();

                return $promise;
            },
            'addUserToChat': function(roomJid, userJid, password, type, meta) {
                var $promise = new $.Deferred();
                $promise.resolve();

                return $promise;
            },
            'leaveChat': function() {
                var $promise = new $.Deferred();

                $promise.resolve();

                return $promise;
            },
            'joinChat': function() {
                var $promise = new $.Deferred();
                $promise.resolve();

                return $promise;
            },
            'sendAction': function(toJid, action, meta) {
                return this.sendRawMessage(
                    toJid,
                    "action",
                    "",
                    $.extend(
                        true,
                        {},
                        meta,
                        {'action': action}
                    )
                );
            },
            "sendRawMessage": function(toJid, type, contents, meta) {
                var event = new $.Event("onOutgoingMessage");
                console.debug("Preparing to send message:", toJid, type, contents, meta);

                var outgoingMessage = new KarereEventObjects.OutgoingMessage(
                    toJid,
                    this.getJid(),
                    type,
                    "123",
                    contents,
                    meta,
                    unixtime()
                );

                this.trigger(
                    event,
                    [
                        outgoingMessage,
                        this
                    ]
                );
                if(event.isPropagationStopped()) {
                    if(localStorage.d) {
                        console.warn("Event propagation stopped sending of message: ", contents, meta, type, toJid)
                    }
                    return false;
                } else {
                    console.debug("Sending message: ", toJid, type, contents, meta);
                }


                return 123;
            },
            'setPresence': function(presence, status, delay) {
                var self = this;

                self._presenceCache[self.getJid()] = presence;
                self._presenceBareCache[self.getBareJid()] = presence;
                
                return;
            },
            'options': {
                'mucDomain': "conference.example.com"
            }
        });

    self.restore = function() {
        self.objectMocker.restore();
    }
};