const search_llaveprocess = async () => {
    const llaveProcess = "47001310300220130008400"
    const response_llaveprocess = await fetch ("https://consultaprocesos.ramajudicial.gov.co:448/api/v2/Procesos/Consulta/NumeroRadicacion?numero="+ llaveProcess +"&SoloActivos=false&pagina=1");
    const consulta_llaveprocess = await response_llaveprocess.json();
    console.log(consulta_llaveprocess);
    const idProceso = 0 ;
 
    let tableBody = ``
    consulta_llaveprocess.procesos.forEach ((proceso, index) => {
                    
     console.log(proceso)
        if  (proceso.fechaUltimaActuacion != null) {
            
            const f = async() => {
                return await actualizar(proceso.idProceso);
              }
              
              f().then(x => console.log(x));
              console.log(f())
            //const actuacion = async() => {
             //   await actualizar(proceso.idProceso)
               // }; 
            //console.log(actuacion())
            //const actuacion = 0
            //const  info_proceso_actuacion = actualizar(proceso.idProceso).then(val => val.actuacion);
            //const info_proceso_fechaActuacion =  actualizar(proceso.idProceso).fechaActuacion;
            //console.log(info_proceso_actuacion)
        

            tableBody += `<tr>
            <td>${"*"}</td>
            <td>${proceso.llaveProceso}</td>
            <td>${new Date(proceso.fechaProceso).toLocaleDateString()}</td>
            <td>${new Date(proceso.fechaUltimaActuacion).toLocaleDateString()}</td>
            <td>${proceso.despacho}</td>
            <td>${proceso.departamento}</td>
            <td>${proceso.idProceso}</td>
            <td>${f().then(x => console.log(x))}</td>
            
            
            
            </tr>`        

            //<td>${new Date(info_proceso_fechaActuacion).toLocaleDateString()}</td>
        };

    async function actualizar(idProceso) {

        const Response = await fetch ("https://consultaprocesos.ramajudicial.gov.co:448/api/v2/Proceso/Actuaciones/"+ idProceso +"?pagina=1");
        const consulta_proceso = await Response.json();
        const actuacion_proceso = consulta_proceso.actuaciones[0];
        console.log(actuacion_proceso);
        return actuacion_proceso.actuacion;
      

    };
            
    });
    document.getElementById("tableBody_process").innerHTML = tableBody;
};


window.addEventListener("load", function () {
    search_llaveprocess();
   
})
