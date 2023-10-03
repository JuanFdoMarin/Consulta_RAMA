
function buscar_recargarpagina(){
    let tableBody= ``;
    document.getElementById('tableBody_process').innerHTML = tableBody;
    if (document.getElementById("radicado").value != "" || document.getElementById("multi_radicado").value != "") {
        search_llaveprocess();
    }    
    document.getElementById('multi_radicado').style.display = 'none';
};

function variantes_llaveprocess() {
    const llaveProcess = document.getElementById("radicado").value;
   
}

function search_llaveprocess() {
    if (document.getElementById('multi-radicado_check').checked == false) {
        var valor_llaveProcess = [];
        valor_llaveProcess.push(document.getElementById("radicado").value.replace().split(" "))
    } else {
        var valor_llaveProcess = [];
        valor_llaveProcess.push(document.getElementById("multi_radicado").value.replace().split(" "))
    }
    const llaves_Process = valor_llaveProcess[0];
    console.log(llaves_Process)
    const filtroProcess = document.getElementById("date").value;
    var proceso;
    let idProceso = 0 ;
    var valorActuacion;
    let tableBody= ``;
    console.log(llaves_Process.length)

    for (let index = 0; index < llaves_Process.length; index++)  {
        var llaveProcess = llaves_Process[index];
        console.log(index)
        obtenerConsulta(llaveProcess).then(
            valorConsulta => {
                console.log(valorConsulta.procesos),
                radicadosprocesos = valorConsulta;
                console.log(radicadosprocesos);
    
                radicadosprocesos.forEach((index) => {
    
                    console.log(index)
                    index.consulta_radicado.procesos.forEach ((proceso, index) => {       
                        console.log(proceso)
                        //let i = 0;
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
                                        <td>${"'"+proceso.llaveProceso}</td>
                                        <td>${new Date(proceso.fechaProceso).toLocaleDateString()}</td>
                                        <td>${new Date(proceso.fechaUltimaActuacion).toLocaleDateString()}</td>
                                        <td>${proceso.despacho +"(" +proceso.departamento + ")"}</td>
                                        <td>${proceso.idProceso}</td>
                                        <td style="width: 200px;">${valorActuacion}</td>
                                        <td>${new Date(valorFechaActuacion).toLocaleDateString()}</td>
                                        <td>${valorAnotacion}</td>
                                        </tr>`
                                        cargarTabla(tableBody);
                                    });
                                                              
                                console.log(valorActuacion)      
        
                        }
                        //i++;
                        
                    });
                });
    
            }
        );         
    };

    
    
};




async function obtenerConsulta(llaveProcess){
    var llavePorcess_variantes = []; 
    console.log(llaveProcess)

    const consulta = await fetch ("https://consultaprocesos.ramajudicial.gov.co:448/api/v2/Procesos/Consulta/NumeroRadicacion?numero="+ llaveProcess +"&SoloActivos=false&pagina=1");
    consulta_radicado = await consulta.json();

    if (consulta_radicado.paginacion.cantidadRegistros == 0) {
        alert("No se encontro información, revise el número del radicado: "+llaveProcess)

    };

    llavePorcess_variantes.push({consulta_radicado});
    var cantidadRegistros = await consulta_radicado.paginacion.cantidadRegistros;
    var ultimodigitoradicado = llaveProcess.slice(22);
    
    while (cantidadRegistros > 0){
        ultimodigitoradicado++;
        llaveProcess = llaveProcess.slice(0,-1);
        llaveProcess += ultimodigitoradicado;
        const consulta = await fetch ("https://consultaprocesos.ramajudicial.gov.co:448/api/v2/Procesos/Consulta/NumeroRadicacion?numero="+ llaveProcess +"&SoloActivos=false&pagina=1");
        consulta_radicado = await consulta.json();

        if (consulta_radicado.paginacion.cantidadRegistros > 0) {
            llavePorcess_variantes.push({consulta_radicado});
        };
        
        var cantidadRegistros = await consulta_radicado.paginacion.cantidadRegistros;
    
    };

    console.log(llavePorcess_variantes)
    return llavePorcess_variantes;
  
}

async function actualizarPorIdProceso(idProceso) {

    const Response = await fetch ("https://consultaprocesos.ramajudicial.gov.co:448/api/v2/Proceso/Actuaciones/"+ idProceso +"?pagina=1");
    const consulta_proceso =  Response.json();
    return consulta_proceso;

};

async function cargarTabla(tableBody){

    document.getElementById('tableBody_process').innerHTML = tableBody
};

function exportTableToExcel(tableId) {
    // Get the table element using the provided ID
    const table = document.getElementById(tableId);
    
    // Extract the HTML content of the table
    const html = table.outerHTML;
  
    // Create a Blob containing the HTML data with Excel MIME type
    const blob = new Blob(['\ufeff',html], { type: "application/vnd.ms-excel" });
  
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
  
    // Create a temporary anchor element for downloading
    const a = document.createElement("a");
    a.href = url;
  
    // Set the desired filename for the downloaded file
    a.download = "table.xls";
  
    // Simulate a click on the anchor to trigger download
    a.click();
  
    // Release the URL object to free up resources
    URL.revokeObjectURL(url);
  };



function mostrar_ocultar_multi_radicado(){
    if (document.getElementById('multi-radicado_check').checked == false) {
        
        document.getElementById('multi_radicado').style.display = 'none';
    }
    else {
        document.getElementById('multi_radicado').style.display = 'inline';
    }
};

function mostrar(){
    if (document.getElementById('multi-radicado_check').checked == true) {

        document.getElementById('multi_radicado').style.display = 'inline';
        
    }
};
  
  // Attach the function to the export button's click event
document.getElementById("export").addEventListener("click", function () {
    exportTableToExcel("tableId");
  });



document.addEventListener("DOMContentLoaded", function () {
    //search_llaveprocess();
    buscar_recargarpagina();
    document.getElementById("multi-radicado_check'")?.addEventListener("click", function () {
        mostrar_ocultar_multi_radicado();
      });
});