/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    config:{
        apiUrl: 'http://localhost/heartvibAPi',
        os:'Android'
    },
    // Application Constructor
    initialize: function() {
        // document.addEventListener('deviceready', function () {
            $('.page.active.no_header').css({
                height:'100vh',
                opacity: 1
            });
            app.bindEvents();

            if(app.verifyToken()){
                app.loadFriends();
                app.loadVibs();
                app.loadPage('#main');
                 app.getMessages();
            }
            cordova.plugins.notification.local.clearAll();
           
            // function statusChangeCallback(response) {
            //     console.log('statusChangeCallback');
            //     console.log(response);
            //     // The response object is returned with a status field that lets the
            //     // app know the current login status of the person.
            //     // Full docs on the response object can be found in the documentation
            //     // for FB.getLoginStatus().
            //     if (response.status === 'connected') {
            //       // Logged into your app and Facebook.
            //       console.log('LoggedIn');
            //     } else if (response.status === 'not_authorized') {
            //       // The person is logged into Facebook, but not your app.
            //       console.log('Please log ' +
            //         'into this app.');
            //     } else {
            //       // The person is not logged into Facebook, so we're not sure if
            //       // they are logged into this app or not.
            //       console.log('Please log ' +
            //         'into Facebook.');
            //     }
            //   }


            //   (function(d, s, id){
            //      var js, fjs = d.getElementsByTagName(s)[0];
            //      if (d.getElementById(id)) {return;}
            //      js = d.createElement(s); js.id = id;
            //      js.src = "http://connect.facebook.net/fr_FR/sdk.js";
            //      fjs.parentNode.insertBefore(js, fjs);
            //    }(document, 'script', 'facebook-jssdk'));

            //    function checkLoginState() {
            //         FB.getLoginStatus(function(response) {
            //             statusChangeCallback(response);
            //         });
            //     }
            //   window.fbAsyncInit = function() {
            //     FB.init({
            //       appId      : '1167320580000808',
            //       xfbml      : true,
            //       version    : 'v2.7'
            //     });

            //     FB.getLoginStatus(function(response) {
            //         statusChangeCallback(response);
            //       });

               
            //   };


        // });

    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        app.bindLoginEvents();
        app.bindRegisterEvents();
        app.bindMenuEvents();
        app.bindMessageEvents();
        app.bindFriendsEvents();
        app.bindVibListEvents();
        app.bindPauseEvents();
        app.bindResumeEvents();
       
       
        // localStorage.messagesInterval = setInterval(function(){
        //     app.getMessages();
        // },5000);
        

        $('.vib_link').on('tap',function(e){
            e.preventDefault();
            e.stopPropagation();
            var target =  $(this).attr('href');
            $('#menu .item a').parent().removeClass('active');
            $('#menu .item a[href="'+target+'"]').parent().addClass('active');
            if( $(target).hasClass('no_header')){
                 app.loadPage(target,{'hasHeader':false});
            }
            else{
                app.loadPage(target);
            }
            
        });
    },
    bindLoginEvents:function(){

        // Login events
        $('.form-group').on('tap',function(){
            var $this = $(this);
            var input = $this.find('input');
            var label = $this.find('label');
            if($this.hasClass('opened')){

                input.animate({
                    top: '10px',
                    },
                    400);
                label.animate({
                    top: '20px',
                    },
                    400);
                 $this.removeClass('opened');
                label.focusout();
            }
            else{

                $this.addClass('opened');
                input.animate({
                    top: '30px',
                    },
                    400);
                label.animate({
                    top: '5px',
                    },
                    400);
                label.focus();

            }   
        });
        $(document).on('focusout','.form-group.opened input',function(event) {
            var val = $(this).val();
           if(val.length == 0 ){
                $(this).animate({
                    top: '10px',
                    },
                    400);
                $(this).prev('label').animate({
                    top: '20px',
                    },
                    400);
                $(this).parent().removeClass('opened')
           }
        });

        $('#login form').on('submit',function(e){
            e.preventDefault();
            e.stopPropagation();

            var form = $(this);
            var formdata = new FormData(form[0]);
            formdata.append("request",'login');
           

            $.ajax({
                url:app.config.apiUrl,
                data: formdata,
                type:'POST',
                 processData: false, 
                contentType: false, 
                success:function(data){
                    console.log(data)
                }
            });
            
            localStorage.token = 'azerty';
            app.loadFriends();
            app.loadVibs();
            app.loadPage('#main'); 

            
            return false;
        });

        $(document).on('tap','.facebook_connect',function(){

          FB.login(function(response){
            statusChangeCallback(response);
          });

        });



        // Logout events
        // 
        
        $('#logout').on('tap',function(e){
            e.preventDefault();
            e.stopPropagation();
            localStorage.clear();
            $('#menuBtn').tap();
            $('#friendToSend form ul').empty();
            app.loadPage('#login');
        })
    },
    bindRegisterEvents:function(){
        // register events
        $('#register form').on('submit',function(e){
            e.preventDefault();
            e.stopPropagation();

            var form = $(this);
            var formdata = new FormData(form[0]);
            formdata.append("request",'register');
            
            $.ajax({
                url:app.config.apiUrl,
                data: formdata,
                type:'PUT',
                 processData: false, 
                contentType: false, 
                success:function(data){
                    console.log(data)
                }
            });
            
            localStorage.token = 'azerty';
            app.loadFriends();
             app.loadVibs();
            app.loadPage('#main'); 

            
            return false;
        });

        $('#toRegisterPart2').on('tap',function(){
            $('#registerPart1').animate({
                height: '0'
            },300);
            $('#registerPart2').animate({
                height: '74vh'
            },300);
            
        });
        $('#toRegisterPart1').on('tap',function(){
            $('#registerPart2').animate({
                height: '0'
            },300);
            $('#registerPart1').animate({
                height: '74vh'
            },300);
            
        });
    },
    bindMenuEvents:function(){
        // menu events
        $(document).on('tap','#menuBtn',function(){
            if($(this).hasClass('opened')){
                $(this).removeClass('opened');
                $('#app').animate({
                    left: '+=200'
                },400);
                $('#menu').animate({
                    left: '+=200',
                    width:'0'
                },400);
            }
            else{
                $(this).addClass('opened');
                $('#app').animate({
                    left: '-=200'
                },400);
                $('#menu').animate({
                    left: '-=200',
                    width:'200'
                },400);
            }
        });

        $(document).on('tap','#menu .item a',function(e){
            e.preventDefault();
            if($(this).parent().hasClass('active')){
                // Do nothing
            }
            else{
                if(app.verifyToken()){
                    $('#menu .item').removeClass('active');
                    $(this).parent().addClass('active');
                    var target = $(this).attr('href');
                    $('#menuBtn').tap();
                    app.loadPage(target);
                }
                else{
                    $('#menuBtn').tap();
                    app.loadPage('#login');
                }
            }
        });
    },
    bindMessageEvents:function(){
        // message events
        // $.event.special.tap.tapholdThreshold = 400;

        $('#vibrateContainer').on('swiperight',function(e){
            
            var selected = $('li.vib_btn.selected');
            var prev = selected.prev('li.vib_btn');
            if(selected.is('li.vib_btn:first-child')){
                
            }
            else{
                selected.animate({
                    left: '+=150px',
                },200).removeClass('selected');
                prev.animate({
                    left: '0px',
                },200).addClass('selected');
            }

        });
        $('#vibrateContainer').on('swipeleft',function(e){
            
            var selected = $('li.vib_btn.selected');
            var next = selected.next('li.vib_btn');
            if(selected.is('li.vib_btn:last-child')){
                
            }
            else{
                selected.animate({
                    left: '-=150px',
                },200).removeClass('selected');
                next.animate({
                    left: '0px',
                },200).addClass('selected');
            }
            
        });

        // chose friends to message events
        $(document).on('tap','#vibrateContainer li',function(e){
            var $this = $(this);
            if($('#friendToSend').hasClass('opened')){
                $('#friendToSend').animate({
                    top: '100vh',

                },500).fadeOut(400).removeClass('opened');
                $('#vibrateContainer').animate({
                    top: '30%'
                },500);
                $('#friendToSend form ul').empty();
            }
            else{
                app.loadFriends();
                 $('#friendToSend').fadeIn(400).animate({
                    top: '38vh',

                },500).addClass('opened');
                $('#vibrateContainer').animate({
                    top: '5vh'
                },500);
            }

           
        });

        $(document).on('tap','.close_friendtosend',function(){
           $('#vibrateContainer li.selected').tap();
           $('#friendToSend form ul').empty();
        });
     

        $(document).on('tap','#friendToSend label',function(){
            var label = $(this);

            var input= label.next('input[type="checkbox"]');

            var value = input.val();
            var otherInput = $('input[value="'+value+'"]');

            if(label.hasClass('label_checked')){
                // input.prop('checked',false);
                label.removeClass('label_checked');
                otherInput.prev('label').removeClass('label_checked');
                otherInput.attr('checked',false);

            }
            else{
                // input.prop('checked',true);
                label.addClass('label_checked');
                otherInput.prev('label').addClass('label_checked');
                otherInput.attr('checked',true);
            }
        });
        $(document).on('submit','#friendToSend form',function(e){
            e.preventDefault();
            e.stopPropagation();

            var form = $(this);
            var formdata = new FormData();
            formdata.append("request",'sendMessage');
            formdata.append("token",localStorage.token);

            var friends = Array();
            $('#friendToSend form li').each(function(){
                 if ($(this).find('input').is(":checked")){
                     friends.push($(this).find('input').val());
                 }
              
            });
            formdata.append("friends",friends);

            var message = $('#vibrateContainer li.vib_btn.selected').attr('data-type');
            formdata.append("message",message);
            $.ajax({
                url:app.config.apiUrl,
                data: formdata,
                type:'POST',
                processData: false, 
                contentType: false, 
                success:function(data){
                    console.log(data)
                }
            });


            return false;
        });
        

    },
    bindFriendsEvents:function(){

        $(document).on('tap','#friendsList .delete_btn',function(){
            var id = $(this).parent().attr('data-id');


            var formdata = new FormData();
            formdata.append("request",'removeFriendship');
            formdata.append("token",localStorage.token);
            formdata.append("id",id);
            $.ajax({
                url:app.config.apiUrl,
                data: formdata,
                type:'DELETE',
                processData: false, 
                contentType: false, 
                success:function(data){
                    if(data.content){
                        $('#friendsList .item[data-id="'+data.content.id+'"]').fadeOut(400,function(){

                        })
                    }
                    
                }
            });

            $('#friendsList .item[data-id="'+id+'"]').fadeOut(400,function(){
                 $(this).remove(); 
            })

        });
    },
    bindVibListEvents:function(){
        $(document).on('tap','#vibsList .modal_close',function(){
            var modal  =   $(this).closest('li.modal');
            var id = modal.attr('data-id');
            $('#vibsList').animate({
                top:'100vh',
                height:'0'
            },500,function(){
                modal.remove();
                var receivedMessages = JSON.parse(localStorage.receivedMessages);
                receivedMessages = receivedMessages.filter(function(el) {
                    return el.id !== parseInt(id);
                });
                localStorage.receivedMessages = JSON.stringify(receivedMessages);
            });
        });

        $(document).on('tap','#vibsList .modal_footer .next',function(){
            var modal  =   $(this).closest('li.modal');
            var id = modal.attr('data-id');
            if(modal.is(':last-child')){
                modal.find('.modal_close').tap();
            }else{
                modal.animate({
                    width:'0'
                },500,function(){
                    modal.remove();
                    var receivedMessages = JSON.parse(localStorage.receivedMessages);
                    receivedMessages = receivedMessages.filter(function(el) {
                        return el.id !== parseInt(id);
                    });
                    localStorage.receivedMessages = JSON.stringify(receivedMessages);
                });  
            }
            
        });
        $(document).on('swipeleft','#vibsList .modal',function(){
            $(this).find('.next').tap();
        });
    },
    bindPauseEvents:function(){
        $(document).on('pause',function(){
            clearInterval(localStorage.messagesInterval);
            localStorage.messagesInterval = setInterval(function(){
                app.getMessages();
            },10000);

            // hack
             setTimeout(function(){
                     app.displayNotification(JSON.parse(localStorage.receivedMessages))
                },3000)
        });
    },
    bindResumeEvents:function(){

        $(document).on('resume',function(){
            if(app.verifyToken()){
                app.loadFriends();
                app.loadVibs();
                app.loadPage('#main');
                clearInterval(localStorage.messagesInterval);
                localStorage.messagesInterval = setInterval(function(){
                    app.getMessages();
                },5000);

            }
            else{
                 app.loadPage('#login');
            }


       }); 
    },
    // verifyToken()
    // 
    // check if user already has a token and if its correct token
    // return boolean
    verifyToken:function(){
        if(localStorage.token && localStorage.token != ""){
            
            // Remove after api done
            return true;

            var formdata = new FormData();
            formdata.append("request",'verifyToken');
            formdata.append("token",localStorage.token);
            $.ajax({
                url:app.config.apiUrl,
                data: formdata,
                type:'POST',
                processData: false, 
                contentType: false, 
                success:function(data){
                    console.log(data);
                    if(data.tokenValid == true){
                        return true;
                    }
                    else{
                        return false;
                    }
                    

                },
                error:function(){
                    console.log("verifyToken error");
                    return false;
                }
            });

            // return true;
        }
        else{
             return false;
        }  
    },
    // loadPage(string pageId, object params)
    //  
    // make change of a page with optionnal params
    // 
    loadPage: function(pageID,params = false){

        if(!params){
            params = {
                'hasHeader': true,
            };
        }
        if(params.hasHeader){
            $('#header').removeClass('hidden');
        }
        else{
            $('#header').addClass('hidden');
        }

        $('.page.active').animate({
            height: '0px',
            opacity:0
        },50,function(){
            $('.page.active').removeClass('active');
            var deviceHeight = $(window).outerHeight();
            if($(pageID).hasClass('no_header')){
                var pageHeight = deviceHeight;
            }
            else{
                var pageHeight = deviceHeight - 70;
            }
            
            $(pageID).animate({
                height: pageHeight+'px',
                opacity:1
            },500,function(){
                $(pageID).addClass('active');
                $('#menu .item a[href="'+pageID+'"]').parent().addClass('active');

            });
        });
    },
    // loadVibs()
    // 
    // get available vibs types from server and display them
    // 
    loadVibs:function(){
        $('#vibrateContainer ul').empty();
        var formdata = new FormData();
        formdata.append("request",'loadVibs');
        formdata.append("token",localStorage.token);
        $.ajax({
            url:app.config.apiUrl,
            data: formdata,
            type:'POST',
            processData: false, 
            contentType: false, 
            success:function(data){
                console.log(data);

                localStorage.friends = JSON.stringify(data);

            },
            error:function(){
                console.log("loadVibs error");
            }
        })
        .fail(function() {
            console.log("loadVibs error");
        });
        

        // A replacer dans la requette ajax
        var vibs = [
            {
                "name":"heart",
                "img":"img/heart.svg",
                "imgHover":"/img/heart_hover.svg",
            },
            {
                "name":"smile",
                "img":"img/smile.svg",
                "imgHover":"img/smile_hover.svg",
            },
            {
                "name":"sad",
                "img":"img/sad.svg",
                "imgHover":"img/sad_hover.svg",
            },

        ];

        var html ="";
        
        $.each(vibs, function(index, val) {
            if(index == 0){
               html += '<li class="vib_btn btn selected" data-type="'+val['name']+'" style="background-image:url('+val['img']+');" data-hover="'+val['imgHover']+'"></li>'; 
            }
            else{
                html += '<li class="vib_btn btn " data-type="'+val['name']+'" style="background-image:url('+val['img']+');" data-hover="'+val['imgHover']+'"></li>'; 
            }
            
        });
        $('#vibrateContainer ul').append(html);
    },
    // loadFriends()
    // 
    // get all friends
    // 
    loadFriends:function(){
       
            var formdata = new FormData();
            formdata.append("request",'loadFriends');
            formdata.append("token",localStorage.token);

            $.ajax({
                url:app.config.apiUrl,
                data: formdata,
                type:'POST',
                processData: false, 
                contentType: false, 
                success:function(data){
                    console.log(data);

                    localStorage.friends = JSON.stringify(data);

                },
                error:function(){
                    console.log("loadFriends error");
                }
            })
            .fail(function() {
                console.log("loadFriends error");
            });

            // a replacer dans la requete ajax
            var data = { "friends":[
                {
                    "id":1,
                    "name": "Lisa",
                    "numberOfInteractions": 1000
                },
                {
                    "id":2,
                    "name": "Denis",
                    "numberOfInteractions": 5
                },
                {
                    "id":3,
                    "name": "Alex",
                    "numberOfInteractions": 3
                },
                {
                    "id":4,
                    "name": "David",
                    "numberOfInteractions": 12
                },
                {
                    "id":5,
                    "name": "JP",
                    "numberOfInteractions": 2
                },
                {
                    "id":6,
                    "name": "Arnaud",
                    "numberOfInteractions": 25
                },
            ]};
            localStorage.friends = JSON.stringify(data);
            app.displayHomeFriends();
            app.displayMenuFriends();
    },
    // displayHomeFriends()
    // 
    // display friends on the "home" page list of available friends
    // 
    displayHomeFriends:function(){
        $('#friendToSend form ul').empty();
        var homeFriends = JSON.parse(localStorage.friends);
        homeFriends = homeFriends.friends;
        var friendsNumber = homeFriends.length;

        // Display best friends
        var bestfriends = homeFriends.sort(sort_by('numberOfInteractions', true, parseInt));
        $('#friendToSend form ul').append('<li class="item-category">Meilleurs amis</li>');
        for (var i = 0; i < 5; i++) {
            $('#friendToSend form ul').append('<li class="item"><label for="bestfriend'+i+'">'+bestfriends[i]['name']+'</label><input type="checkbox" name="friends[]" value="'+bestfriends[i]['id']+'" id="bestfriend'+i+'"></li>');
        }

        // Display all friends
        homeFriends.sort(sort_by('name', false, function(a){return a.toUpperCase()}));
        $('#friendToSend form ul').append('<li class="item-category">Mes amis</li>');
         for (var i = 0; i < friendsNumber; i++) {
            $('#friendToSend form ul').append('<li class="item"><label for="homeFriends'+i+'">'+homeFriends[i]['name']+'</label><input type="checkbox" name="friends[]" value="'+homeFriends[i]['id']+'" id="homeFriends'+i+'"></li>');
        }

    },
    // displayMenuFriends()
    // 
    // display friends on the "friends" page list of available friends
    // 
    displayMenuFriends:function(){
        $('#friendsList').empty();
        var homeFriends = JSON.parse(localStorage.friends);
        homeFriends = homeFriends.friends;
        var friendsNumber = homeFriends.length;

        

        // Display all friends
        homeFriends.sort(sort_by('name', false, function(a){return a.toUpperCase()}));
        
         for (var i = 0; i < friendsNumber; i++) {
            $('#friendsList').append('<li class="item" data-id="'+homeFriends[i]['id']+'">'+homeFriends[i]['name']+'<div class="delete_btn">x</div></li>');
        }
    },
    // getMessages()
    // 
    // get new messages and launch notification and vibration
    //
    getMessages:function(){
        

        var formdata = new FormData();
            formdata.append("request",'getMessages');
            formdata.append("token",localStorage.token);
        $.ajax({
                url:app.config.apiUrl,
                data: formdata,
                type:'POST',
                 processData: false, 
                contentType: false, 
                success:function(data){
                    console.log(data)
                }
            });

        var messages = [
            {
                "id":123456,
                "type":"heart",
                "vibrationPattern":[200,100,200],
                "img":"img/heart.svg",
                "from": "Lisa",
                "dateSent":"2016-09-19 16:00:00"                
            },
            {
                "id":123457,
                "type":"heart",
                "vibrationPattern":[200,100,200],
                "img":"img/heart.svg",
                "from": "Denis",
                "dateSent":"2016-09-20 17:00:00"                
            },
            {
                "id":123458,
                "type":"smile",
                "vibrationPattern":[200,100,200],
                "img":"img/smile.svg",
                "from": "David",
                "dateSent":"2016-09-20 17:00:00"                
            },
        ];

        if(messages.length== 0){
            console.log('Not Any new message')
        }
        else if(messages.length >=0){
            console.log(messages.length+ "new messages");
            // app.doVibrate(messages[0]['vibrationPattern']);
            localStorage.receivedMessages = JSON.stringify(messages);
        }
    },
    // doVibrate(array vibrationPattern)
    // 
    // make the device vibrate following the message pattern
    //
    doVibrate:function(vibrationPattern){

        if(app.config.os == 'iOS' ){
            
            var modifiedPattern = [];
            for(var i=0; i<vibrationPattern.length;i=i+2){
                var delay=0;
                for(var j =0; j<i;j++){
                       delay = delay + vibrationPattern[j];
                }
                modifiedPattern.push({
                    'delay':delay,
                    'time':vibrationPattern[i]
                });
             

            }
            $.each(modifiedPattern, function(index,val){
                setTimeout(function(){
                    console.log(index+': Vibrating for '+val['time']+'ms');
                    navigator.vibrate(val['time']);

                }, val['delay']) 
            });

        }
        else if(app.config.os == 'Android'){
            navigator.vibrate(vibrationPattern);
        }   
       
    },
    // doVibrate(object messages)
    // 
    // display notifications for each new messages
    //
    displayNotification:function(messages){
        if(!localStorage.messagesFormated || localStorage.messagesFormated==''){
            localStorage.messagesFormated = '[]';
        }
        // localStorage.messagesFormated = [];
        var messagesFormated = JSON.parse(localStorage.messagesFormated);
        console.log(messagesFormated);
        var startLength = messagesFormated.length;

        var endLength = startLength;

        var messLength = messages.length;

        $.each(messages, function(index, val) {
           
            cordova.plugins.notification.local.isPresent(val['id'],function (present) {
                if(!present){
                    messagesFormated.push({
                        id: val['id'],
                        title:'HeartVib',
                        text:'You received a '+val['type']+' from '+val['from'],
                        badge:index+1,
                        icon: 'file://'+val['img']
                    })
                    endLength = endLength +1 
                }
                else{
                    console.log('Notification '+val['id']+' is already present')
                }
                if(index == messLength - 1){
                    localStorage.messagesFormated = JSON.stringify(messagesFormated);
                    if(startLength< endLength){
                        displayNotif();
                    }
                }
            });
            
            
        });
        function displayNotif(){
        

            
            var messagesList = JSON.parse(localStorage.messagesFormated);
            
           
                cordova.plugins.notification.local.schedule(messagesList);

                cordova.plugins.notification.local.on("click", function(notification) {
                    cordova.plugins.notification.local.clearAll();

                    $('#vibsList').animate({
                        top:'0',
                        height:'100vh',
                    },400)

                    $('#vibsList ul').empty();


                    var receivedMessages = JSON.parse(localStorage.receivedMessages);
                    var vibsListMessages = [];
                    $.each(receivedMessages,function(index,val){
                        if(val['id'] == notification.id){
                            vibsListMessages.push(val);
                        }
                    });
                    $.each(receivedMessages,function(index,val){
                        if(val['id'] != notification.id){
                            vibsListMessages.push(val);
                        }
                    })
                    var html='';
                    $.each(vibsListMessages, function(index, message) {
                        if(index == vibsListMessages.length -1){
                            html+= '<li class="modal" data-id="'+message['id']+'"><div class="modal_header"><div class="from">'+message['from']+'</div><div class="posted">'+message['dateSent']+'</div></div><div class="modal_body"><img src="'+message['img']+'" alt=""></div><div class="modal_footer"><div class="modal_close">x</div></div></li>';

                        }
                        else{
                            html+= '<li class="modal" data-id="'+message['id']+'"><div class="modal_header"><div class="from">'+message['from']+'</div><div class="posted">'+message['dateSent']+'</div></div><div class="modal_body"><img src="'+message['img']+'" alt=""></div><div class="modal_footer"><div class="modal_close">x</div><div class="next">&gt;</div></div></li>';
                        }
                    });

                    $('#vibsList ul').append(html);
                });
                
            
            // else{
            //     cordova.plugins.notification.local.clearAll(function() {
            //          console.log('notifications cleared');
            //     }, this);
            // }
        
        }
        
    }
};
app.initialize();


function sort_by(field, reverse, primer){
        var key = primer ? 
            function(x) {return primer(x[field])} : 
            function(x) {return x[field]};
        reverse = !reverse ? 1 : -1;

        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        } 
    }
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

