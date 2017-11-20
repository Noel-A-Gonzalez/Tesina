var reportes = function(){
	
	var initEvents = function(){
		$(document).ready(function(){
			user.verifyUser();
			getDataTable();
			getDataTableTimeLife();
			initReport();
			initReportTimeLife();
		});
	}

	/*Obtiene los datos de la base para llenar la tabla*/
	var getDataTable = function(){
		$.get("../report/getDataTable")
		.done(function(data){
			var num = 0;
    		for(i=0;i<data.length;i++){
    			num++;
    			var fechaI = moment(data[i].out_fec_inicio).add(1, 'day');
    			var fechaInicio = moment(fechaI).format('DD/MM/YYYY');
    			var fechaF = moment(data[i].out_fec_fin).add(1, 'day');
    			var fechaFin = moment(fechaF).format('DD/MM/YYYY');
			    $('#tblReport>tbody').append(
                    '<tr>'+
	                    '<td>Tarea '+ num + '</td>'+
	                    '<td>'+ data[i].out_title + '</td>'+
	                    '<td>'+ fechaInicio + '</td>'+
	                    '<td>'+ fechaFin + '</td>'+
	                    '<td>'+ data[i].out_cant_dias +'</td>'+
                    '</tr>');
                $(".btn-save").hide();
                $(".loading").hide();
			}
			$("#tblReport").DataTable();
		})
	}

	var initReport = function(){
		$.get("../report/getDataReport")
		.done(function(data){
			$.get("../report/getDataReport2")
			.done(function(data2){
				var dataJSON = jQuery.parseJSON(data[0].sp_report_posit_ini_fin);
				var dataJSON2 = jQuery.parseJSON(data2[0].sp_report_posit_ini_fin_2);
				$('#container').highcharts({
			        chart: {
			            type: 'column'
			        },
			        title: {
			            text: 'Tiempo de progreso de las tareas finalizadas'
			        },
			        subtitle: {
			            text: 'Click en cada columna para ver mas información..'
			        },
			        xAxis: {
			            type: 'category'
			        },
			        yAxis: {
			            title: {
			                text: 'Total de días desde su inicio a su fin'
			            }

			        },
			        legend: {
			            enabled: true
			        },
			        plotOptions: {
			            series: {
			                borderWidth: 0,
			                dataLabels: {
			                    enabled: true,
			                    format: '{point.y:.0f}'
			                }
			            }
			        },

			        tooltip: {
			            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
			            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.0f}</b> dias<br/>'
			        },

			        series: [{
			            name: 'Posit',
			            colorByPoint: true,
			            data: dataJSON
			        }],
			        drilldown: {
			            series: dataJSON2
			        }
			    });
			})
			
		});	 
	}

	/*
	* REPORTES PARA TIME LIFE
	*/
	/*Obtiene los datos de la base para llenar la tabla de los reportes time life*/
	var getDataTableTimeLife = function(){
		$.get("../report/getDataTimeLife")
		.done(function(data){
			var num = 0;

    		for(i=0;i<data.length;i++){
    			num++;
    			var fechaI = moment(data[i].out_fec_inicio).add(1, 'day');
    			var fechaInicio = moment(fechaI).format('DD/MM/YYYY');
    			var fechaF = moment(data[i].out_fec_fin).add(1, 'day');
    			var fechaFin = moment(fechaF).format('DD/MM/YYYY');
			    $('#tblReport_time_life>tbody').append(
                    '<tr>'+
	                    '<td>Tarea '+ num + '</td>'+
	                    '<td>'+ data[i].out_title + '</td>'+
	                    '<td>'+ fechaInicio + '</td>'+
	                    '<td>'+ fechaFin + '</td>'+
	                    '<td>'+ data[i].out_cant_dias +'</td>'+
                    '</tr>');
                $(".btn-save").hide();
                $(".loading").hide();
			}
			$("#tblReport_time_life").DataTable();
		})
	}

	var initReportTimeLife = function(){
		$.get("../report/getReportTimeLife")
		.done(function(data){
			$.get("../report/getReportTimeLife2")
			.done(function(data2){
				var dataJSON = jQuery.parseJSON(data[0].sp_report_posit_time_life);
				var dataJSON2 = jQuery.parseJSON(data2[0].sp_report_posit_time_life_2);
				$('#container_time_life').highcharts({
			        chart: {
			            type: 'column'
			        },
			        title: {
			            text: 'Tiempo de progreso de las tareas finalizadas'
			        },
			        subtitle: {
			            text: 'Click en cada columna para ver mas información..'
			        },
			        xAxis: {
			            type: 'category'
			        },
			        yAxis: {
			            title: {
			                text: 'Total de días desde su inicio de vida a su fin'
			            }

			        },
			        legend: {
			            enabled: true
			        },
			        plotOptions: {
			            series: {
			                borderWidth: 0,
			                dataLabels: {
			                    enabled: true,
			                    format: '{point.y:.0f}'
			                }
			            }
			        },

			        tooltip: {
			            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
			            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.0f}</b> dias<br/>'
			        },

			        series: [{
			            name: 'Posit',
			            colorByPoint: true,
			            data: dataJSON
			        }],
			        drilldown: {
			            series: dataJSON2
			        }
			    });
			})
			
		});	 
	}


	return{
		initEvents:initEvents,
	}
}();
reportes.initEvents();