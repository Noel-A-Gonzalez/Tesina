var user = function(){

	var initsEvents = function(){
        $(document).ready(function(){
            verifyUser();
            perfil();
        })
		
	}
	
	/*Obtiene el usuario y verifica los permisos del mismo*/
    var verifyUser = function(){
    	$.get("../rsesion/getSesion")
    	.done(function(data){
    		$(".nameUser").text(data.user);
    		$(".info>p").text(data.name);
    		$(".img-circle").attr("src", data.image);
    		$(".user-image").attr("src", data.image);

    	});
    }

    /*
    	Obtiene los usurios y llena la tabla de usuarios en /admin/usuarios
    */
    var getUsers = function(){

    	$.get("../rsesion/getAllUser")
    	.done(function(data){
    		var num = 0;
    		for(i=0;i<data.length;i++){
    			num++;
			    $('#tblUsuarios>tbody').append(
                    '<tr id='+data[i].userid+'><td>'+ num +'</td>'+
                    '<td>'+data[i].nombre+'</td><td>'+data[i].apellido+'</td>'+
                    '<td>'+data[i].email+'</td><td>'+data[i].permiso+'</td>'+
                    '<td><p data-toggle="tooltip" title="Guardar"><button class="btn btn-primary btn-xs btn-save"><span class="glyphicon glyphicon-floppy-saved"></span></button>'+
                    '</p><p data-toggle="tooltip" title="Editar"><button class="btn btn-success btn-xs btn-edit"><span class="glyphicon glyphicon-pencil"></span></button>'+
                    '</p><p data-toggle="tooltip" title="Eliminar"><button class="btn btn-danger btn-xs btn-delete"><span class="glyphicon glyphicon-trash"></span></button></p>'+
                    '<i style="float:right" class="fa fa-spinner fa-pulse fa-lg loading"></i><span class="sr-only">Loading...</span></td></tr>');
                $(".btn-save").hide();
                $(".loading").hide();
			}
			$("#tblUsuarios").DataTable();
			$(".btn-edit").bind("click", edit);
            $(".btn-delete").bind("click", deleteUser);
            
    	});
    }

    var edit = function(){
        var par = $(this).parents("tr"); //tr 
        var trID = par.attr("id");
        $("#"+trID).find(".btn-edit").hide();
        $("#"+trID).find(".btn-save").show();
        
        
        var tdNombre = par.children("td:nth-child(2)"); 
        var tdApellido = par.children("td:nth-child(3)"); 
        var tdMail = par.children("td:nth-child(4)");
        var tdNAcceso = par.children("td:nth-child(5)");
        tdNombre.html("<input type='text' onfocus='this.value = this.value' id='txtName' value='"+tdNombre.text()+"' />"); 
        tdApellido.html("<input type='text' id='txtApe' value='"+tdApellido.text()+"'/>"); 
        tdMail.html("<input type='text' id='txtMail' value='"+tdMail.text()+"'/>"); 
        tdNAcceso.html("<input type='number' id='txtAcce' value='"+tdNAcceso.text()+"'/>"); 
        
        $("#txtName").prop("selectionStart", $("#txtName").val().length)
       .focus();
        $(".btn-save").bind("click", save); 
    }

    var save = function(){
        var par = $(this).parents("tr"); //tr 
            trID = par.attr("id");
            tdNombre = par.children("td:nth-child(2)"); 
            tdApellido = par.children("td:nth-child(3)"); 
            tdMail = par.children("td:nth-child(4)");
            tdNAcceso = par.children("td:nth-child(5)");

        var name = $("#txtName").val();
            ape = $("#txtApe").val();
            mail = $("#txtMail").val();
            nacceso = $("#txtAcce").val();
        $.post("../rusers/updateUser", {idUser:par.attr('id'), name:name, ape:ape, mail:mail, nacc:nacceso})
        .done(function(){
            tdNombre.text(name);
            tdApellido.text(ape);
            tdMail.text(mail);
            tdNAcceso.text(nacceso);
            $("#"+trID).find(".btn-save").hide();
            $("#"+trID).find(".btn-edit").show();

            Lobibox.alert("success",{
                title: "Éxito",
                msg: "Actualización exitosa."
            });
        })
        .fail(function(){
            Lobibox.alert("danger",{
                title: "ERROR",
                msg: "Ha ocurrido un error al intentar actualizar los datos del usuario."
            });
        })
    }

    var deleteUser = function(){
        var par = $(this).parents("tr");
        
        Lobibox.confirm({
            title: "Confirmar",
            buttons: {
                yes: {
                    'class': 'lobibox-btn lobibox-btn-yes',
                    text: 'Si',
                    closeOnClick: true
                },
                no: {
                    'class': 'lobibox-btn lobibox-btn-no',
                    text: 'No',
                    closeOnClick: true
                }
            },
            msg: "¿Seguro que quiere eliminar este Usuario?",
            callback: function ($this, type, ev) {
                if (type == "yes") {
                    $.post("../rusers/deleteUser", {idUsuario: par.attr('id')})
                    .done(function(){
                        Lobibox.alert("success",{
                            title: "Éxito",
                            msg: "El usuario se ha eliminado con éxito."
                        });
                        par.remove();
                    })
                    .fail(function(){
                        Lobibox.alert("danger",{
                            title: "ERROR",
                            msg: "Ha ocurrido un error al intentar eliminar el usuario."
                        });
                    })
                };
            }
        });
    }

    var perfil = function(){
        $.get('../rsesion/getSesion')
        .done(function(datos){
            $.get("../rsesion/getDataUser", {user: datos.user})
            .done(function(data){
                $("#input_userName").attr('disabled','disabled');   
                $("#input_mail").attr('disabled','disabled');
                $("#input_name").val(data[0].u_username);
                $("#input_ape").val(data[0].u_surname);
                $("#input_mail").val(data[0].u_email);
                $("#input_userName").val(data[0].userName);
                $("#input_pass").val(data[0].u_password);
                $("#confirmPass").val(data[0].u_password); 
            })
        });
        
    }

    var editPerfil = function(){
        var name = $("#input_name").val();
        var ape = $("#input_ape").val();
        var email = $("#input_mail").val();
        var pass = $("#input_pass").val();
        var confirmPass = $("#confirmPass").val(); 

        $.post("../rsesion/editPerfil", {name:name, ape:ape, email:email, pass:pass, confirmPass:confirmPass})
        .done(function(res){
            if (res === 'success') {
                verifyUser();
                Lobibox.alert("success",{
                    title: "Éxito",
                    msg: "Los datos han sido actualizado con éxito.."
                });
            }else{
                Lobibox.alert("warning", {
                    title: "Atención",
                    msg: "Los password no coinciden. Verifique e inténtelo de nuevo.."
                });
            }
        });
    }

	return{
		initsEvents:initsEvents,
		getUsers:getUsers,
        verifyUser:verifyUser,
        editPerfil:editPerfil,
	}
}();
user.initsEvents();