function buscar_recargarpagina(){
    let tableBody= ``;
    document.getElementById('tableBody_process').innerHTML = tableBody;
    search_llaveprocess();
};

function variantes_llaveprocess() {
    const llaveProcess = document.getElementById("radicado").value;
   
}

function search_llaveprocess() {
    const llaveProcess = document.getElementById("radicado").value;
    const filtroProcess = document.getElementById("date").value;
    var proceso;
    let idProceso = 0 ;
    var valorActuacion;
    let tableBody= ``;
    obtenerConsulta(llaveProcess).then(
        valorConsulta => {
            console.log(valorConsulta.procesos),
            procesoprocesos = valorConsulta
            console.log(procesoprocesos)

            procesoprocesos.procesos.forEach ((proceso, index) => {       
                
                let i = 0;
                if  (proceso.fechaUltimaActuacion != null && proceso.fechaUltimaActuacion > filtroProcess ) {
                    
                    //proceso = procesoprocesos;
                    actualizarPorIdProceso(proceso.idProceso).then(
                        (valorProceso) => 
                            {
                                console.log(valorProceso.actuaciones);
                                valorActuacion = valorProceso.actuaciones[0].actuacion;
                                valorFechaActuacion = valorProceso.actuaciones[0].fechaActuacion;
                                valorAnotacion = valorProceso.actuaciones[0].anotacion;
                                //valorActuacion = valorActuacion[0].actuacion;
                                console.log(valorFechaActuacion)
                                
                                tableBody += `<tr>
                                <td>${"*"}</td>
                                <td>${proceso.llaveProceso}</td>
                                <td>${new Date(proceso.fechaProceso).toLocaleDateString()}</td>
                                <td>${new Date(proceso.fechaUltimaActuacion).toLocaleDateString()}</td>
                                <td>${proceso.despacho}</td>
                                <td>${proceso.departamento}</td>
                                <td>${proceso.idProceso}</td>
                                <td>${valorActuacion}</td>
                                <td>${new Date(valorFechaActuacion).toLocaleDateString()}</td>
                                <td>${valorAnotacion}</td>
                                </tr>`
                                cargarTabla(tableBody);
                            });
                                                      
                        console.log(valorActuacion)      

                }
                i++;
                
        })
        
    });     
    
};


window.addEventListener("load", function () {
    //search_llaveprocess();
    buscar_recargarpagina();
   
})

async function obtenerConsulta(llaveProcess){
     
    const consulta = await fetch ("https://consultaprocesos.ramajudicial.gov.co:448/api/v2/Procesos/Consulta/NumeroRadicacion?numero="+ llaveProcess +"&SoloActivos=false&pagina=1");
    number = parseInt(llaveProcess)
    console.log(number)
    return consulta.json();
  
}

async function actualizarPorIdProceso(idProceso) {

    const Response = await fetch ("https://consultaprocesos.ramajudicial.gov.co:448/api/v2/Proceso/Actuaciones/"+ idProceso +"?pagina=1");
    const consulta_proceso =  Response.json();
    return consulta_proceso;

};

async function cargarTabla(tableBody){

    document.getElementById('tableBody_process').innerHTML = tableBody
}