export function numberToText(numero: number) {
  if (
    typeof numero !== "number" ||
    !Number.isInteger(numero) ||
    numero < 0 ||
    numero > 1000000
  ) {
    return "Número inválido. Se esperaba un entero entre 0 y 1.000.000.";
  }

  const unidades = [
    "",
    "un",
    "dos",
    "tres",
    "cuatro",
    "cinco",
    "seis",
    "siete",
    "ocho",
    "nueve",
  ];
  const decenasEspeciales = [
    "diez",
    "once",
    "doce",
    "trece",
    "catorce",
    "quince",
    "dieciséis",
    "diecisiete",
    "dieciocho",
    "diecinueve",
  ];
  const decenas = [
    "",
    "",
    "veinte",
    "treinta",
    "cuarenta",
    "cincuenta",
    "sesenta",
    "setenta",
    "ochenta",
    "noventa",
  ];
  const centenas = [
    "",
    "cien",
    "doscientos",
    "trescientos",
    "cuatrocientos",
    "quinientos",
    "seiscientos",
    "setecientos",
    "ochocientos",
    "novecientos",
  ];

  if (numero === 0) {
    return "cero";
  }

  function convertirGrupoDeTresDigitos(num: number) {
    let textoGrupo = "";

    const parteCentenas = Math.floor(num / 100);
    const resto = num % 100;

    if (parteCentenas > 0) {
      if (parteCentenas === 1 && resto === 0) {
        textoGrupo += "cien"; // Cien, no ciento
      } else {
        textoGrupo += centenas[parteCentenas];
      }
    }

    if (resto > 0) {
      if (textoGrupo !== "") {
        textoGrupo += " ";
      }
      if (resto < 10) {
        textoGrupo += unidades[resto];
      } else if (resto >= 10 && resto < 20) {
        textoGrupo += decenasEspeciales[resto - 10];
      } else {
        const parteDecenas = Math.floor(resto / 10);
        const parteUnidades = resto % 10;
        textoGrupo += decenas[parteDecenas];
        if (parteUnidades > 0) {
          textoGrupo += " y " + unidades[parteUnidades];
        }
      }
    }
    return textoGrupo;
  }

  let textoFinal = "";

  // Manejar el millón
  if (numero === 1000000) {
    return "Un millón";
  }

  const parteMiles = Math.floor(numero / 1000);
  const parteUnidades = numero % 1000;

  if (parteMiles > 0) {
    if (parteMiles === 1) {
      textoFinal += "mil"; // Mil, no un mil
    } else {
      textoFinal += convertirGrupoDeTresDigitos(parteMiles) + " mil";
    }
  }

  if (parteUnidades > 0) {
    if (textoFinal !== "") {
      textoFinal += " ";
    }
    // Ajuste para el "un" en las unidades, por ejemplo "mil uno" vs "un mil"
    // Si hay miles, el "uno" de las unidades se dice "uno", no "un"
    let textoUnidades = convertirGrupoDeTresDigitos(parteUnidades);
    if (parteMiles > 0 && parteUnidades > 0) {
      // Reemplazar 'un ' por 'uno ' en el contexto de mil
      // Esto es para casos como "mil ciento uno", no "mil ciento un"
      textoUnidades = textoUnidades.replace(/^un\b/, "uno");
    }
    textoFinal += textoUnidades;
  }

  // Ajustes finales para capitalización y el "un" en la unidad
  if (numero === 1) {
    return "Uno";
  } else if (numero > 1 && numero < 10 && textoFinal.startsWith("un ")) {
    // Para números del 2 al 9, no deberían empezar con "un" si no es parte de un número mayor
    // Esto es para "dos" en lugar de "un dos"
    return (
      textoFinal.charAt(0).toUpperCase() +
      textoFinal.slice(1).replace(/^un /, "")
    );
  }

  // Ajuste para "veintiuno", "treinta y uno", etc.
  // La función interna de convertirGrupoDeTresDigitos ya debería manejar esto.
  // El caso de "un" en "mil uno", "mil ciento uno"
  // Ya se maneja dentro de convertirGrupoDeTresDigitos con el ajuste de unidades.

  return textoFinal.charAt(0).toUpperCase() + textoFinal.slice(1);
}
