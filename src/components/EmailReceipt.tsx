import React from "react";

interface EmailReceiptProps {
  clientName: string;
  clientStreet: string;
  clientLote?: string;
  clientPhone?: string;
  amount: number;
  amountInWords: string;
  detail: string;
  conceptType: string;
  paymentType: string;
  formattedDate: string;
  number: number;
  concepts: Array<{
    conceptType: string;
    amount: number;
    detail: string;
  }>;
}

export const EmailReceipt = ({
  clientName,
  clientStreet,
  clientLote,
  clientPhone,
  amount,
  amountInWords,
  detail,
  conceptType,
  paymentType,
  formattedDate,
  number,
  concepts,
}: EmailReceiptProps) => {
  // Formatear el monto para mostrar
  const formattedAmount = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "ARS",
  }).format(amount);

  const today = new Date();
  const printDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        fontFamily: "'Segoe UI', Arial, sans-serif",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "30px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        backgroundColor: "#ffffff",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "20px",
          paddingBottom: "20px",
          borderBottom: "2px solid #0056b3",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <img
            src="https://generador-recibos-pagos.vercel.app/logo.jpg"
            alt="Logo"
            style={{
              width: "100px",
              height: "100px",
              display: "block",
              margin: "0 auto",
            }}
          />
        </div>
        <h2
          style={{
            margin: "0",
            color: "#0056b3",
          }}
        >
          CLUB NAUTICO Y PESCA
          <br />
          <span
            style={{
              fontWeight: "normal",
              fontSize: "20px",
            }}
          >
            Sociedad Civil
          </span>
        </h2>
        <p
          style={{
            margin: "10px 0 0 0",
            color: "#555",
          }}
        >
          AVENIDA EL LIBANO 1757 - 4000
        </p>
        <p
          style={{
            margin: "5px 0",
            color: "#555",
          }}
        >
          SAN MIGUEL DE TUCUMÁN
        </p>
        <p
          style={{
            margin: "5px 0",
            color: "#555",
            fontWeight: "bold",
          }}
        >
          IVA EXENTO
        </p>
        <p
          style={{
            margin: "5px 0",
            color: "#555",
          }}
        >
          C.U.I.T.: 30-71480079-1
        </p>
      </div>

      <div
        style={{
          display: "flex",
          backgroundColor: "#f8f9fa",
          padding: "12px 15px",
          borderRadius: "6px",
          marginBottom: "20px",
          fontSize: "15px",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            width: "50%",
            textAlign: "left",
          }}
        >
          <strong
            style={{
              color: "#333",
            }}
          >
            RECIBO N°:
          </strong>{" "}
          0001-
          {Array.from({ length: 6 - number.toString().length }, () => "0").join(
            ""
          )}
          {number}
        </div>
        <div
          style={{
            width: "50%",
            textAlign: "right",
          }}
        >
          <strong
            style={{
              color: "#333",
            }}
          >
            FECHA:
          </strong>{" "}
          {formattedDate}
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "6px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)", // 2 columnas de ancho flexible
            gap: "8px 16px", // 8 px entre filas, 16 px entre columnas
            alignItems: "baseline", // alinea las etiquetas y valores
          }}
        >
          <div>
            <strong
              style={{ color: "#333", width: 100, display: "inline-block" }}
            >
              Señor:
            </strong>
            <span style={{ color: "#333" }}>{clientName}</span>
          </div>

          <div>
            <strong
              style={{ color: "#333", width: 100, display: "inline-block" }}
            >
              Domicilio:
            </strong>
            <span style={{ color: "#333" }}>{clientStreet}</span>
          </div>

          {clientLote && (
            <div>
              <strong
                style={{ color: "#333", width: 100, display: "inline-block" }}
              >
                Lote:
              </strong>
              <span style={{ color: "#333" }}>{clientLote}</span>
            </div>
          )}

          {clientPhone && (
            <div>
              <strong
                style={{ color: "#333", width: 100, display: "inline-block" }}
              >
                Teléfono:
              </strong>
              <span style={{ color: "#333" }}>{clientPhone}</span>
            </div>
          )}
        </div>

        <div style={{ marginTop: "20px", marginBottom: "20px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #ddd" }}>
                <th style={{ textAlign: "left", padding: "8px", width: "20%" }}>
                  Concepto
                </th>
                <th
                  style={{ textAlign: "right", padding: "8px", width: "20%" }}
                >
                  Monto
                </th>
                <th style={{ textAlign: "left", padding: "8px", width: "60%" }}>
                  Detalle
                </th>
              </tr>
            </thead>
            <tbody>
              {concepts.map((concept, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "8px" }}>{concept.conceptType}</td>
                  <td style={{ textAlign: "right", padding: "8px" }}>
                    {new Intl.NumberFormat("es-ES", {
                      style: "currency",
                      currency: "ARS",
                    }).format(concept.amount)}
                  </td>
                  <td style={{ padding: "8px" }}>{concept.detail}</td>
                </tr>
              ))}
              <tr>
                <td
                  colSpan={2}
                  style={{
                    textAlign: "right",
                    padding: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Total:
                </td>
                <td
                  style={{
                    textAlign: "right",
                    padding: "8px",
                    fontWeight: "bold",
                  }}
                >
                  {formattedAmount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          style={{
            margin: "15px 0 8px 0",
          }}
        >
          <strong
            style={{
              color: "#333",
              display: "inline-block",
              width: "130px",
            }}
          >
            Recibí la suma de:
          </strong>
          <span
            style={{
              color: "#0056b3",
              fontWeight: "600",
            }}
          >
            {amountInWords}
          </span>
          <span
            style={{
              color: "#0056b3",
              fontWeight: "600",
              marginLeft: "10px",
            }}
          >
            ({formattedAmount})
          </span>
        </div>

        <div
          style={{
            marginTop: "15px",
          }}
        >
          <strong
            style={{
              color: "#333",
              display: "inline-block",
              width: "130px",
            }}
          >
            Forma de pago:
          </strong>
          <span
            style={{
              color: "#333",
            }}
          >
            {paymentType}
          </span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "30px",
          paddingTop: "20px",
          borderTop: "1px solid #ddd",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "50%",
            textAlign: "left",
          }}
        >
          <span
            style={{
              fontWeight: "bold",
            }}
          >
            {formattedAmount}
          </span>
        </div>
        <div
          style={{
            width: "50%",
            textAlign: "right",
          }}
        >
          <div
            style={{
              borderTop: "1px solid #333",
              width: "200px",
              marginLeft: "auto",
            }}
          ></div>
          <div
            style={{
              marginTop: "8px",
              color: "#555",
              textAlign: "right",
            }}
          >
            Firma y Aclaración
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "40px",
          fontSize: "12px",
          textAlign: "center",
          color: "#777",
          fontStyle: "italic",
        }}
      >
        Documento no válido como factura - Impresión: {printDate}
      </div>
    </div>
  );
};
