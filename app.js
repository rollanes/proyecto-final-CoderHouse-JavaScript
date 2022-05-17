const botonCalendario = document.getElementById("botonCalendario");
const calendarioTurnos = document.getElementById("calendario-turnos");

const diasDispTurno = document.querySelectorAll(".diaDisp");
const celdasDias = Array.from(diasDispTurno);

const diasLibresCalend = document.querySelectorAll(".diaTurno");

const botonesServicio = document.querySelectorAll(".btnservicio");
const botonesCilindrada = document.querySelectorAll(".btncilindrada");

const botonTurnero = document.getElementById("botonTurnero");
const botonFormulario = document.getElementById("botonFormulario");
const botonGenerarTurno = document.getElementById("generarTurno");

const divFormulario = document.getElementById("formulario");
const divTurnero = document.getElementById("turnero");

const contenedorCalendario = document.getElementById("contenedorCalendario");
const contenedorTurnero = document.getElementById("contenedorTurnero");
const loadingCalendario = document.getElementById("loadingCalendario");
const loadingTurnero = document.getElementById("loadingTurnero");

let pantallaMostrada = "";
let seMuestraCalendario = false;

let servicioElegido = "";
let cilindradaElegida = "";
let pedidoDeTurno = {
  dia: "",
  hora: "",
  servicios: "",
  cilindrada: "",
};

let turnos = [];
let cargandoTurno = "";

const servicios = [
  {
    nombre: "Service",
    id: "service",
    precio1: 3600,
    precio2: 4200,
    precio3: 4600,
  },
  {
    nombre: "Transmision",
    id: "transmision",
    precio1: 2500,
    precio2: 3000,
    precio3: 3500,
  },
  {
    nombre: "Distribucion",
    id: "distribucion",
    precio1: 2800,
    precio2: 3200,
    precio3: 4000,
  },
  {
    nombre: "Estetica",
    id: "estetica",
    precio1: 4000,
    precio2: 4500,
    precio3: 5000,
  },
  {
    nombre: "Electricidad",
    id: "electricidad",
    precio1: 5500,
    precio2: 6300,
    precio3: 6700,
  },
];

Swal.fire({
  title: "Bienvenido al Turnero Online!",
  text: `Seleccioná el dia, el servicio deseado y la cilindrada de la moto de tu cliente. Luego, abre el calendario y elije el dia y la hora del turno. A partir de esto te daremos el costo final. En la pestaña "Ver turnero", podes consultar los turnos ya dados.`,
  confirmButtonText: "Entendido!",
  confirmButtonColor: "#db282c",
  allowOutsideClick: () => {
    const popup = Swal.getPopup();
    popup.classList.remove("swal2-show");
    setTimeout(() => {
      popup.classList.add("animate__animated", "animate__headShake");
    });
    setTimeout(() => {
      popup.classList.remove("animate__animated", "animate__headShake");
    }, 500);
    return false;
  },
});

botonCalendario.addEventListener("click", mostrarCalendario);
botonTurnero.addEventListener("click", mostrarTurnero);
botonFormulario.addEventListener("click", mostrarFormulario);
botonGenerarTurno.addEventListener("click", validarElecciones);
botonesServicio.forEach((boton) =>
  boton.addEventListener("click", validarServicio)
);
botonesCilindrada.forEach((boton) =>
  boton.addEventListener("click", validarCilindrada)
);
celdasDias.forEach((celdas) => celdas.addEventListener("click", obtenerDia));

diasLibresCalend.forEach((celda) =>
  celda.addEventListener("click", function () {
    turnos.forEach((turno) => {
      if (
        turno.dia == celda.attributes.dia.value &&
        turno.horario == celda.attributes.horario.value
      ) {
        Swal.fire({
          icon: "info",
          titleText: `Turno: Dia: ${turno.dia}. Hora: ${turno.horario}hs. Servicio: ${turno.servicio}. Cilindrada: ${turno.cilindrada}.`,
          showConfirmButton: true,
          confirmButtonColor: "#db282c",
          confirmButtonText: "Ok!",
          timer: 1700,
          timerProgressBar: true,
        });
      }
      if (celda.classList.contains("libre")) {
        Swal.fire({
          icon: "info",
          title: "No hay turnos en el dia seleccionado",
          showConfirmButton: false,
          timer: 1200,
          timerProgressBar: true,
        });
      }
    });
  })
);

function ocultarElemento(elemento) {
  elemento.classList.add("ocultar");
}

function mostrarElemento(elemento) {
  elemento.classList.remove("ocultar");
}

function mostrarTurnero() {
  botonTurnero.classList.add("activo");
  botonFormulario.classList.remove("activo");
  if (pantallaMostrada != "turnero") {
    ocultarElemento(divFormulario);
    mostrarElemento(divTurnero);
    fetch("https://62719a68c455a64564b57aa3.mockapi.io/turnos")
      .then((response) => response.json())
      .then((data) => {
        turnos = data;
        diasLibresCalend.forEach((dia) => {
          let estaOcupada = false;
          for (let i = 0; i < data.length; i++) {
            let elemento = data[i];
            if (
              elemento.dia == dia.attributes.dia.value &&
              elemento.horario == dia.attributes.horario.value
            ) {
              estaOcupada = true;
            }
          }
          if (estaOcupada) {
            dia.classList.add("ocupada");
            dia.innerHTML = "Ocupado";
          } else {
            dia.classList.add("libre");
            dia.innerHTML = "Libre";
          }
        });
      })
      .finally(function () {
        mostrarElemento(contenedorTurnero);
        ocultarElemento(loadingTurnero);
      });
  }
  pantallaMostrada = "turnero";
}

function mostrarFormulario() {
  ocultarElemento(divTurnero);
  mostrarElemento(divFormulario);
  pantallaMostrada = "formulario";
  botonFormulario.classList.add("activo");
  botonTurnero.classList.remove("activo");
}

function mostrarCalendario() {
  if (calendarioTurnos.classList.contains("ocultar")) {
    mostrarElemento(calendarioTurnos);
    seMuestraCalendario = true;
  } else {
    ocultarElemento(calendarioTurnos);
    seMuestraCalendario = false;
  }
  sacarClaseBotones(celdasDias, "seleccionado");
  if (seMuestraCalendario) {
    fetch("https://62719a68c455a64564b57aa3.mockapi.io/turnos")
      .then((response) => response.json())
      .then((data) =>
        celdasDias.forEach((celda) => {
          let celdaOcupada = false;
          for (let i = 0; i < data.length; i++) {
            let elemento = data[i];
            if (
              elemento.dia == celda.attributes.dia.value &&
              elemento.horario == celda.attributes.horario.value
            ) {
              celdaOcupada = true;
            }
          }
          if (celdaOcupada) {
            celda.classList.add("ocupada");
            celda.innerHTML = "Ocupado";
          } else {
            celda.classList.add("libre");
            celda.innerHTML = "Libre";
          }
        })
      )
      .finally(function () {
        mostrarElemento(contenedorCalendario);
        ocultarElemento(loadingCalendario);
      });
  }
}

function obtenerDia(e) {
  pedidoDeTurno.dia = e.target.attributes.dia.value;
  pedidoDeTurno.hora = e.target.attributes.horario.value;

  if (!e.target.classList.contains("ocupada")) {
    sacarClaseBotones(celdasDias, "seleccionado");
    e.target.classList.add("seleccionado");
  }
}

function validarServicio(e) {
  servicioElegido = e.currentTarget.id;
  sacarClaseBotones(botonesServicio, "active");
  e.currentTarget.classList.add("active");
}

function validarCilindrada(e) {
  cilindradaElegida = e.target.id;
  sacarClaseBotones(botonesCilindrada, "active");
  e.target.classList.add("active");
}

function sacarClaseBotones(botones, nombreClase) {
  botones.forEach((boton) => {
    boton.classList.remove(nombreClase);
  });
}

function validarElecciones() {
  pedidoDeTurno.servicios = servicioElegido;
  pedidoDeTurno.cilindrada = cilindradaElegida;
  if (
    !pedidoDeTurno.dia ||
    !pedidoDeTurno.hora ||
    !pedidoDeTurno.servicios ||
    !pedidoDeTurno.cilindrada
  ) {
    Swal.fire({
      icon: "error",
      title: "Ups...!",
      text: "No podes generar un turno sin completar todos los datos",
      confirmButtonText: "Entendido!",
      confirmButtonColor: "#db282c",
    });
  } else {
    formularTurno();
  }
}

function calcularTotal(servicio, cilindradas) {
  if (servicio) {
    switch (cilindradas) {
      case "125":
        return servicio.precio2;
      case "150":
        return servicio.precio2;
      case "200":
        return servicio.precio3;
      case "250":
        return servicio.precio3;
      default:
        return servicio.precio1;
    }
  }
}

function desactivarBoton() {
  if (cargandoTurno) {
    botonGenerarTurno.classList.add("ocultar");
  }
}

function formularTurno() {
  cargandoTurno = true;
  desactivarBoton();
  sacarClaseBotones(botonesCilindrada, "active");
  sacarClaseBotones(botonesServicio, "active");
  ocultarElemento(calendarioTurnos);
  sacarClaseBotones(celdasDias, "seleccionado");
  const servicioEncontrado = servicios.find(
    (servicio) => servicio.id === pedidoDeTurno.servicios
  );

  let precioTotal = calcularTotal(servicioEncontrado, pedidoDeTurno.cilindrada);

  fetch("https://62719a68c455a64564b57aa3.mockapi.io/turnos", {
    method: "POST",
    body: JSON.stringify({
      fechaCreacion: new Date().getTime(),
      dia: pedidoDeTurno.dia,
      horario: pedidoDeTurno.hora,
      servicio: pedidoDeTurno.servicios,
      cilindrada: pedidoDeTurno.cilindrada,
      precioTotal: precioTotal + "",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      Swal.fire({
        icon: "info",
        title: "Turno guardado!",
        text: `Tenes turno el dia ${data.dia} a las ${data.horario}hs para realizar ${data.servicio} y para tu moto ${data.cilindrada} tiene un costo de $${data.precioTotal}`,
        confirmButtonText: "Ok!",
        confirmButtonColor: "#db282c",
      });
    })
    .finally(() => {
      cargandoTurno = false;
      botonGenerarTurno.classList.remove("ocultar");
    });
}
