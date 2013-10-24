
/*
 * GET home page.
 */

//// LOGIN PAGE
exports.index = function(req, res){
	res.render('index', { title: 'Login' });
};

//// DISPLAYS ADDUSER
exports.adduser = function(req, res){
	res.render('adduser', {title: 'Register' });
};

///// CREATES A NEW USER, called on adduser.jade
exports.newuser = function(db) {
	return function(req, res) {
		
		var uN = req.param('username');
		var uP = req.param('password');
		
		var collection = db.get('users');
		
		collection.findOne({username:uN}, function(error, user) {
			if (user)
			{
				res.send(401, "This username already exists. Sorry, but you've gotta pick another one.");
				res.end();
			}
			else
			{
				collection.insert(
					{
					 "username":uN,
					 "password":uP
					},
					function (err, doc) {
					if (err) {
						res.send(500, "I'm not sure what the problem is. Check back later.");
						res.end();
					}
					else {
						res.render('journal', 
							{ 
							  title:'Journal',
							  username:uN,
							  thoughtlist:[]
							});
						res.end();
					}
				});
			}
		});
	};
};

// Login function
exports.login = function(db){
	return function(req, res) {
		
		console.log('called');
		// Get form values
		var uN = req.param('username');
		var uP = req.param('password');
		
		// collection
		var collection = db.get('users');
		
		console.log('got db');
		console.log("looking for " + uN);
		
		// search database for matching account
		collection.findOne({username:uN}, function(error, user){
				if (user) {
					console.log('user found');
					if (user.password == uP)
					{
						// Grab the user's thoughts outta the db
						collection = db.get('thoughts');
						collection.find({username:uN}, function (error, thoughtlist) {
								// Even if thoughtlist is empty it'll return []
								// the if statement is probably unnecessary...but what the hey!
								if (thoughtlist) {
									console.log(thoughtlist);
									res.render('journal', {title: 'Journal',
											username: uN,
											thoughtlist:thoughtlist});
									res.end();
								}
								else {
									res.send(500, "We messed up when we got the thoughtlist. This is a strange error!");
									res.end();
								}
							});
					}
					else
					{
						res.send(401, "password didn't work");
						res.end();
					}
				}
				else {
					res.send(401, "user not found");
					res.end();
				}
		});

	};
};

exports.postThought = function(db) {
	return function(req, res) {
		
		var newthought = req.param('thought');
		var user = req.param('user');
		var time = req.param('time');
		console.log(user);
		
		// load collection of thoughts
		collection = db.get('thoughts');
		
		// insert
		collection.insert(
			{
			 'username':user,
			 'thought':newthought,
			 'timestamp':time
			}, 
			function (err, doc) {
				if(err) {
					// send an error message
					res.send(400, "There was a problem adding the information. Try again later");
					res.end();
				}
				else {
					// send back the new thought as a json object
					res.json(200, 
						{
						 thought:newthought,
						 timestamp:time
						});
					res.end();
				}
			});
	};
	
};

exports.deleteThought = function(db) {
	return function(req, res) {
		
		// get thought and username parameters for db insert
		var thought = req.param('thought');
		var user = req.param('user');
		var time = req.param('time');
		
		// load collection of thoughts
		collection = db.get('thoughts');
		
		// insert
		collection.remove(
			{
			 'username':user,
			 'thought':thought,
			 'timestamp':time
			}, 
			function (err, doc) {
				if(err) {
					// send an error message
					res.send(400, "There was a problem removing the information. Try again later");
					res.end();
				}
				else {
					res.send(200);
					res.end();
				}
			});
	};
};
		

exports.journal = function(req, res){
	res.render('journal', {title:'Journal', username:'Guest', thoughtlist:null});
	console.log(req.body.username);
};