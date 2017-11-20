var express = require('express');
	report = express.Router();
    json = require('express-json');
    client = require('./config/pg.js');


report.get("/getDataTable", function(req, res) {
	var jsonStringify, data;
	client.query('SELECT * FROM app_kanban.rpt_inicio_fin()', function(err, result){
		if (err) {
			console.log(err);
			res.status(500);
			return;
		}else{
			jsonStringify = JSON.stringify(result.rows);
	      	data = JSON.parse(jsonStringify)
	     	res.jsonp(data);
		}
	});
});

report.get("/getDataReport", function(req, res) {
	var jsonStringify, data;
	client.query('SELECT * FROM app_kanban.sp_report_posit_ini_fin()', function(err, result){
		if (err) {
			console.log(err);
			res.status(500);
			return;
		}else{
			jsonStringify = JSON.stringify(result.rows);
	      	data = JSON.parse(jsonStringify)
	     	res.jsonp(data);
		}
	});
});

report.get("/getDataReport2", function(req, res) {
	var jsonStringify, data;
	client.query('SELECT * FROM app_kanban.sp_report_posit_ini_fin_2()', function(err, result){
		if (err) {
			console.log(err);
			res.status(500);
			return;
		}else{
			jsonStringify = JSON.stringify(result.rows);
	      	data = JSON.parse(jsonStringify)
	     	res.jsonp(data);
		}
	});
});


/*OBTIENE LOS DATOS PARA EL REPORTE TIME LIFE*/

report.get("/getDataTimeLife", function(req, res) {
	var jsonStringify, data;
	client.query('SELECT * FROM app_kanban.rpt_time_life()', function(err, result){
		if (err) {
			console.log(err);
			res.status(500);
			return;
		}else{
			jsonStringify = JSON.stringify(result.rows);
	      	data = JSON.parse(jsonStringify)
	     	res.jsonp(data);
		}
	});
});

report.get("/getReportTimeLife", function(req, res) {
	var jsonStringify, data;
	client.query('SELECT * FROM app_kanban.sp_report_posit_time_life()', function(err, result){
		if (err) {
			console.log(err);
			res.status(500);
			return;
		}else{
			jsonStringify = JSON.stringify(result.rows);
	      	data = JSON.parse(jsonStringify)
	     	res.jsonp(data);
		}
	});
});

report.get("/getReportTimeLife2", function(req, res) {
	var jsonStringify, data;
	client.query('SELECT * FROM app_kanban.sp_report_posit_time_life_2()', function(err, result){
		if (err) {
			console.log(err);
			res.status(500);
			return;
		}else{
			jsonStringify = JSON.stringify(result.rows);
	      	data = JSON.parse(jsonStringify)
	     	res.jsonp(data);
		}
	});
});

module.exports = report;