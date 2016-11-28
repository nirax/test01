var firebaseRef = new Firebase('https://burning-fire-1723.firebaseio.com');
var wishRef = new Firebase('https://burning-fire-1723.firebaseio.com/WishList');
var auth = new FirebaseSimpleLogin(firebaseRef, function (error, user) {
    if (!error) {
        if (user) {
            App.load('LoginHome', user);
        }
    }
});
App.controller('SignIn', function (page) {
    // put stuff here
    $(page)
        .find('#btnSignIn')
        .on('click',function () {
            var email = $('#btnUsername').val();
            var password = $('#btnPass').val();
	    if(email && password){
            auth.login('password', {
                email: email,
                password: password
            });
	    }
	     else{
			 App.dialog({
                    title: 'Validation Error',
                    text: 'Please enter username and password.',
                    okButton: 'Try Again',
                    cancelButton: 'Cancel'
                }, function (tryAgain) {
                    if (tryAgain) {
                        App.load('SignIn');
                    }
                });
	     }
        });
});



App.controller('SignUp', function (page) {
    // put stuff here

    $(page)
        .find('#btnSignUp')
        .on('click', function () {
            var email = $('#btnEmail').val();
            var password = $('#btnPassword').val();
	    if(email && password){
            auth.createUser(email, password, function (error, user) {
                if (!error) {
                    App.load('SignIn');
                }
            });
            }
	    else{
		 App.dialog({
                    title: 'Validation Error',
                    text: 'Please enter username and password.',
                    okButton: 'Try Again',
                    cancelButton: 'Cancel'
                }, function (tryAgain) {
                    if (tryAgain) {
                        App.load('SignUp');
                    }
                });
	    }

        });

});


App.controller('WishList', function (page, user) {
    $(page)
        .find('.app-button')
        .on('click', function () {
            App.load('LoginHome', user);
        });
    // put stuff here
    new Firebase("https://burning-fire-1723.firebaseio.com/WishList")
        .once('value', show);

    function show(snap) {
        $.each(snap.val(), function (i, value) {
            var spanText = $('<span/>').css('font-weight', 'bold').text(value.text);
            var spanUser = $('<span/>').text(' by:: ' + value.user_id);
            $(page).find('.app-list').append($('<li/>').append(spanText, spanUser));
        });
    }
});




App.controller('LoginHome', function (page, user) {
    $(page)
        .find('.user').text(user.email);
    $(page)
        .find('#btnLogout')
        .on('click', function () {
            auth.logout();
            App.load('SignIn');
        });
    $(page)
        .find('#btnAdd')
        .on('click', function () {
            var wish = $('#txtWish').val();
            if (wish) {
                wishRef.push({
                    'user_id': user.email,
                    'text': wish
                });
                App.load('WishList', user);
            } else {
                App.dialog({
                    title: 'Validation Error',
                    text: 'Looks like you forgot to enter the wish.',
                    okButton: 'Try Again',
                    cancelButton: 'Cancel'
                }, function (tryAgain) {
                    if (tryAgain) {
                        App.load('LoginHome', user);
                    }
                });
            }

        });

    $(page)
        .find('#btnShowList')
        .on('click', function () {
            App.load('WishList', user);
        });
});

try {
    App.restore();
} catch (err) {
    App.load('home');
}
