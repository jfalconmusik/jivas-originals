var credential = firebase.auth.EmailAuthProvider.credential(email, password);

auth.currentUser.linkWithCredential(credential)
    .then(function (usercred) {
        var user = usercred.user;
        console.log("Anonymous account successfully upgraded", user);
    }).catch(function (error) {
        console.log("Error upgrading anonymous account", error);
    });

  // new email signed in user has access to data stored while anon.
  // this technique can also be used to link any two accounts.