var express = require('express');
	ritem = express.Router();
  json = require('express-json');
  client = require('./config/pg.js');

ritem.get("/getNextID", function(req, res) {
	var jsonStringify,data;
  client.query("SELECT nextval('app_kanban.posit_id_seq'::regclass) as nextid", function(err, result) {
    if (err) {
        console.log(err);
        return;
      }else{
        jsonStringify = JSON.stringify(result.rows);
        data = JSON.parse(jsonStringify)
        res.jsonp(data);
      }
  });
});

ritem.post("/saveItem", function(req, res) {
  var fecha = new Date();
      item = {
                id: req.body.id,
                title: req.body.tit,
                descr: req.body.desc,
                date: req.body.date,
                list: req.body.list,
              };
  client.query("SELECT * FROM app_kanban.sp_insert_posit($1, $2, $3, $4, $5, $6)", [item.id, item.list, item.title, item.descr, fecha, item.date], function(err, result) {
    if (err) {
        console.log(err);
        res.status(500);
      }else{
        res.end("success");
      }
  });
});

ritem.post("/updateItem", function(req, res) {
  item = {
                id: req.body.itemid,
                title: req.body.itemtit,
                descr: req.body.itemdescr,
                date: req.body.itemdate,
              };
  client.query("UPDATE app_kanban.posit SET p_title=($1), p_description=($2), p_fecha_wait=($3) WHERE posit_id = ($4)", [item.title, item.descr, item.date, item.id], function(err, result) {
    if (err) {
      console.log(err);
        res.status(err);
      }else{
        res.end("success");
      }
  });
});

ritem.post("/deleteItem", function(req, res) {
  var itemid = req.body.item;
  client.query("DELETE FROM app_kanban.posit WHERE posit_id=($1)", [itemid], function(err, result) {
    if (err) {
        console.log(err);
        res.status(500);
      }else{
        res.end("success");
      }
  });
});

ritem.post("/deleteFecWait", function(req, res){
  var itemid = req.body.itemID;
      idList = req.body.list;
  client.query("UPDATE app_kanban.posit SET p_fecha_wait=($1), status_id=($2) WHERE posit_id=($3)", [null, idList, itemid], function(err, result) {
    if (err) {
        console.log(err);
        res.status(500);
      }else{
        res.end("success");
      }
  });
})

ritem.post("/updateStatus", function(req, res){
  var itemid = req.body.positID;
      idListDest = req.body.listID;
      idListOrig = req.body.listOrigenID
      fecha = req.body.fecha;

  client.query("SELECT * FROM app_kanban.updateStatus($1, $2, $3, $4)", [itemid, idListOrig, idListDest, fecha], function(err, result) {
    if (err) {
        console.log(err);
        res.status(500);
      }else{
        res.end("success");
      }
  });
})

var formatFecha = function(date) {
  function pad(s) { return (s < 10) ? '0' + s : s; }
  var d = new Date(date);
  return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
}

module.exports = ritem;