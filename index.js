const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
const port = 3400;
const userModule = require('./modules/user');
const authModule = require('./modules/auth');
const path = require('path');
const session = require('express-session');

const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'root',
	database : 'Library'
});

// parse application/json
app.use(cors());
app.use(bodyParser.json());
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

app.get('/auth', function(request, response) {
    let ssn = request.query.ssn;
	let password = request.query.psw;
	// Ensure the input fields exists and are not empty
	if (ssn && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM BORROWER WHERE Ssn = ? AND BPass = ?', [ssn, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				request.session.username = ssn;
				request.session.card_id = results[0].Card_id;
				response.redirect('/api/user/');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
})

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/modules/Login.html'));
})

app.get('/create', function(request, response) {
    response.sendFile(path.join(__dirname + '/modules/CreateAccount.html'));
})

app.get('/createaccount', function(request, response) {
    let ssn = request.query.ssn;
	let username = request.query.uname;
	let password = request.query.psw;
	let address = request.query.address;
	let phone = request.query.phone

	if (ssn && password && username && address && phone) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('INSERT INTO borrower (Ssn, Bname, BPass, Address, Phone) values (?, ?, ?, ?, ?)', [ssn,username, password, address, phone], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			response.redirect('/');		
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
})

app.get('/checkout', function(request, response) {
	let isbn = request.query.isbn;
	let ssn = request.session.username;
	let card_id = 0;
	let book_id = 0;
	
	let today = new Date();

	var fortnightAway = new Date(Date.now() + 12096e5);

	if(ssn && isbn) {
		connection.query('select card_id from borrower where ssn = ?', [ssn], function(error, results, fields) {
			if (error) throw error;
			card_id = results[0].card_id;

			connection.query('select * from book_loans where card_id = ? and date_in is null', [card_id], function(error, results, fields) {
				if (error) throw error;
	
				if(results.length >= 3) {
					response.send('More than limit');
					response.end();
				}else {
					connection.query('Update book set availability = 0 where isbn = ?', [isbn], function(error, results, fields) {
						if (error) throw error;
					})
					connection.query('select card_id from borrower where ssn = ?', [ssn], function(error, results, fields) {
						if (error) throw error;
						card_id = results[0].card_id;
						connection.query('select book_id from book where isbn = ?', [isbn], function(error, results, fields) {
							if (error) throw error;
							book_id = results[0].book_id;
							connection.query('Insert into book_loans (book_id, card_id, date_out, due_date) values (?, ?, ?, ?)', [book_id, card_id, today, fortnightAway], function(error, results, fields) {
								if (error) throw error;
								response.send('Checked out');
								response.end();
							})
						})
					})
				}
			})
		})
	}
})

app.get('/checkin', function(request, response) {
    response.sendFile(path.join(__dirname + '/modules/checkin.html'));
})

app.get('/loans', function(request, response) {
	let ssn = request.session.username;
	if(ssn) {
		connection.query('select card_id from borrower where ssn = ?', [ssn], function(error, results, fields) {
			if (error) throw error;
			let card_id = results[0].card_id;
			connection.query('select book_id from book_loans where card_id = ? and date_in is null', [card_id], function(error, results, fields) {
				if (error) throw error;
				let book_id_string = "select isbn, title, book_id from book where ";
				for(i=0; i<results.length; i++) {
					if(i==results.length-1) {
						book_id_string = book_id_string + "book_id = " + results[i].book_id
					}else {
						book_id_string = book_id_string + "book_id = " + results[i].book_id + " or "
					}
				}
				connection.query(book_id_string, [], function(error, results, fields) {
					if (error) throw error;
					response.send(results);
				})
			})
		})
	}
})

app.get('/checkinbook', function(request, response) {
	let book_id = request.query.book_id;
	let card_id = request.session.card_id;
	if(book_id) {
		connection.query('Update book set availability = 1 where book_id = ?', [book_id], function(error, results, fields) {
			if (error) throw error;
		})
		let today = new Date();
		connection.query('Update book_loans set date_in = ? where book_id = ? and card_id = ?', [today, book_id, card_id], function(error, results, fields) {
			if (error) throw error;
			response.send('Check In successful')
			response.end();
		})
	}
})

app.get('/fines', function(request, response) {
    response.sendFile(path.join(__dirname + '/modules/fines.html'));
})

app.get('/getfines', function(request, response) {
	let card_id = request.session.card_id;
	let fine_amt = 0;
	connection.query('select loan_id, due_date, date_in from book_loans where card_id = ?', [card_id], function(error, results, fields) {
		if (error) throw error;
		
		for(i=0; i<results.length; i++) {
			if(!results[i].date_in) {
				let today = new Date();
					if(today>results[0].due_date) {
						const diffTime = Math.abs(today - results[0].due_date);
						const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
						fine_amt = diffDays * 0.25;
					}
			}else {
				let date_in = results[0].date_in;
				for(i=0; i<results.length; i++) {
					if(date_in>results[0].due_date) {
						const diffTime = Math.abs(date_in - results[0].due_date);
						const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
						fine_amt = diffDays * 0.25;
					}
				}
			}
			
			if(fine_amt > 0) {
				let loan_id = results[0].loan_id;
				connection.query('select * from fines where loan_id = ?', [results[0].loan_id], function (error, results, fields) {
					if(results.length == 0) {
							connection.query('Insert into fines values (?, ?, ?)', [loan_id, fine_amt, 0], function (error, results, fields) {
								if (error) throw error;
								connection.query('select loan_id, fine_amt, paid from fines', [], function(error, results, fields) {
									if (error) throw error;
									let fines = [];
									for(i=0; i<results.length; i++) {
										let fine_obj = {};
										let fine_amt = results[i].fine_amt;
										let paid = results[i].paid;
										let loan_id = results[i].loan_id;
										fine_obj.fine_amt = fine_amt;
										fine_obj.paid = paid;
										fine_obj.loan_id = loan_id;
										connection.query('select book_id from book_loans where loan_id = ?', [results[i].loan_id], function(error, results, fields) {
											if (error) throw error;
											connection.query('select title from book where book_id = ?', [results[0].book_id], function(error, results, fields) {
												fine_obj.title = results[0].title;
												if(!paid) {
													fines.push(fine_obj);
													response.send(fines);
													response.end();
												}
											})
										})
									}
								})
							})
					}else{
						response.send([]);
						response.end();
					}
				})
			}
		}

	})
})

app.get('/payfines', function(request, response) {
	let loan_id = request.session.loan_id;
	connection.query('Update fines set paid = 1', [], function(error, results, fields) {
		if (error) throw error;
		response.send("Successfully checked out");
		response.end();
	})
})

app.use('/api/user', userModule);
app.use('/api/authenticate', authModule);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));