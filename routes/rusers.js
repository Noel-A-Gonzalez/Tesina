var express = require('express');
	rusers = express.Router();
    json = require('express-json');
    json = require('express-json');
    client = require('./config/pg.js');


rusers.post("/deleteUser", function(req, res) {
	var idUser = req.body.idUsuario;

	client.query('DELETE FROM app_kanban.users WHERE user_id=($1)', [idUser], function(err, result){
		if (err) {
			console.log(err);
			res.status(500);
			return;
		}else{
			res.end("success");
		}
	});
});

rusers.post("/updateUser", function(req, res){
	var name = req.body.name;
		ape = req.body.ape;
		mail = req.body.mail;
		nacc = req.body.nacc;
		idUser = req.body.idUser;

	client.query("UPDATE app_kanban.users SET u_username = ($1), u_surname=($2), u_email=($3), u_permiso=($4) WHERE user_id = ($5)", [name, ape, mail, nacc, idUser], function(err, result){
		if (err) {
			console.log(err);
			res.status(500);
			return;
		}else{
			res.end("success");
		}
	});
})

module.exports = rusers;