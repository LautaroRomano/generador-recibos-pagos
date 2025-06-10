import React from "react";

interface EmailReceiptProps {
  clientName: string;
  clientStreet: string;
  amount: number;
  amountInWords: string;
  concept: string;
  paymentType: string;
  formattedDate: string;
}

export const EmailReceipt = ({
  clientName,
  clientStreet,
  amount,
  amountInWords,
  concept,
  paymentType,
  formattedDate,
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
        <h2
          style={{
            margin: "0",
            color: "#0056b3",
          }}
        >
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
          0001-00000000
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
            marginBottom: "8px",
          }}
        >
          <strong
            style={{
              color: "#333",
              display: "inline-block",
              width: "100px",
            }}
          >
            Señor:
          </strong>
          <span
            style={{
              color: "#333",
            }}
          >
            {clientName}
          </span>
        </div>
        <div
          style={{
            marginBottom: "8px",
          }}
        >
          <strong
            style={{
              color: "#333",
              display: "inline-block",
              width: "100px",
            }}
          >
            Domicilio:
          </strong>
          <span
            style={{
              color: "#333",
            }}
          >
            {clientStreet}
          </span>
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
            marginBottom: "8px",
          }}
        >
          <strong
            style={{
              color: "#333",
              display: "inline-block",
              width: "130px",
            }}
          >
            En concepto de:
          </strong>
          <span
            style={{
              color: "#333",
            }}
          >
            {concept}
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
