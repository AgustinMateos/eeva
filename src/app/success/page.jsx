"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Extraer el external_reference de la URL
    const externalReference = searchParams.get("external_reference");
    let orderId = null;

    if (externalReference) {
      try {
        // Parsear el JSON de external_reference
        const parsedRef = JSON.parse(decodeURIComponent(externalReference));
        orderId = parsedRef.idOrder;
      } catch (err) {
        console.error("Error al parsear external_reference:", err);
        setError("No se pudo obtener el ID de la orden.");
        setLoading(false);
        return;
      }
    }

    if (!orderId) {
      setError("ID de la orden no encontrado en la URL.");
      setLoading(false);
      return;
    }

    // Hacer la solicitud al endpoint GET
    const fetchOrder = async () => {
      try {
        const response = await fetch(`https://eeva-api.vercel.app/api/v1/orders/${orderId}`, {
          method: "GET",
          headers: {
            Accept: "*/*",
          },
        });

        if (!response.ok) {
          throw new Error(`Error al obtener la orden: ${response.statusText}`);
        }

        const data = await response.json();
        setOrderData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener la orden:", err);
        setError("No se pudo cargar la información de la orden.");
        setLoading(false);
      }
    };

    fetchOrder();

    // Limpiar el carrito
    localStorage.removeItem("cart");
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-[100vh] bg-gradient-to-r from-[#303F48] to-[#6D7276] w-full flex flex-col justify-center items-center md:pt-[150px] text-white">
        <p>Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[100vh] bg-gradient-to-r from-[#303F48] to-[#6D7276] w-full flex flex-col justify-center items-center md:pt-[150px] text-white">
        <p>{error}</p>
        <Link href="/collections/slider" className="mt-4 text-white underline">
          Volver a colecciones
        </Link>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-[100vh] bg-gradient-to-r from-[#303F48] to-[#6D7276] w-full flex flex-col justify-center items-center md:pt-[150px] text-white">
        <p>No se encontraron datos de la orden.</p>
        <Link href="/collections/slider" className="mt-4 text-white underline">
          Volver a colecciones
        </Link>
      </div>
    );
  }

  // Calcular subtotal y total
  const subtotal = orderData.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost = orderData.paymentDetails.totalAmount - subtotal;

  return (
    <div className="min-h-[100vh] bg-gradient-to-r from-[#303F48] to-[#6D7276] w-full flex flex-col justify-center items-center md:pt-[150px] text-white">
      <div className="flex justify-center md:w-[590px] items-center flex-col flex-grow">
        <Link href="/collections/slider">
          <Image src={"/LogoFullEEVA.svg"} width={262} height={31} alt="logo" className="" />
        </Link>
        <h2 className="pt-[60px] font-ibm-mono text-[28px] leading-[64px] tracking-[-0.75px] uppercase mb-4">
          ¡Pago Exitoso!
        </h2>
        <p className="p-[10px] pt-[20px] font-ibm-mono text-[18px] leading-[34px] tracking-[-0.75px] uppercase mb-4">
          En la brevedad se remitirá la orden al email registrado.
        </p>

        {/* Información del Cliente */}
        <div className="w-[90%] md:w-full mt-8">
          <h3 className="font-ibm-mono text-[18px] leading-[24px] tracking-[-0.04em] uppercase text-white mb-4">
            Información de la Orden
          </h3>
          <div className="flex flex-col gap-2 text-sm">
            <p>
              <span className="font-medium">ID de la Orden:</span> {orderData._id}
            </p>
            <p>
              <span className="font-medium">Nombre:</span> {orderData.userInfo.firstName}{" "}
              {orderData.userInfo.lastName}
            </p>
            <p>
              <span className="font-medium">Correo Electrónico:</span> {orderData.userInfo.email}
            </p>
            <p>
              <span className="font-medium">Teléfono:</span> {orderData.shippingAddress.phone}
            </p>
            <p>
              <span className="font-medium">Dirección de Envío:</span>{" "}
              {`${orderData.shippingAddress.street}, ${orderData.shippingAddress.city}, ${orderData.shippingAddress.country} ${orderData.shippingAddress.postalCode}`}
            </p>
          </div>
        </div>

        {/* Detalles del Carrito */}
        <div className="w-[90%] md:w-full mt-8">
          <h3 className="font-ibm-mono text-[18px] leading-[24px] tracking-[-0.04em] uppercase text-white mb-4">
            Detalles del Carrito
          </h3>
          <div className="divide-y divide-gray-400 text-white">
            {orderData.items.map((item, index) => (
              <div
                key={`${item.product}-${item.color}-${item.size}-${index}`}
                className="relative w-full py-4 flex justify-between gap-4"
              >
                <div className="w-24 h-24 relative">
                  {/* Asegúrate de tener la URL de la imagen en los datos de la orden */}
                  <Image
                    src={`/products/${item.product}.webp`} // Ajusta según la estructura de tu API
                    alt={item.product}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="font-medium">
                    {/* Asume que el nombre del producto está en la respuesta de la API */}
                    {item.product.toUpperCase()}
                  </h3>
                  <div className="flex gap-2 items-center">
                    <p className="text-xs">{item.color.name}</p>
                    <p className="text-sm">|</p>
                    <p className="text-xs">{item.size.name}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <p className="text-xs">Cantidad:</p>
                    <p className="text-xs">{item.quantity}</p>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex gap-2 items-center">
                    <h3 className="font-medium text-md">ARS</h3>
                    <span className="text-lg font-medium text-md">
                      ${(item.price * item.quantity).toLocaleString("es-ES", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-10">
              <div className="w-full flex gap-2 items-center justify-between text-white">
                <span className="text-sm font-light">Subtotal</span>
                <div className="flex gap-2 items-center text-white">
                  <h3 className="font-medium text-md">ARS</h3>
                  <span className="text-lg font-medium text-md">
                    ${subtotal.toLocaleString("es-ES", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
              <div className="w-full flex gap-2 items-center justify-between text-white mt-4">
                <span className="text-sm font-light">
                  Envío ({orderData.deliveryDetails.deliveryMethod})
                </span>
                <div className="flex gap-2 items-center text-white">
                  <h3 className="font-medium text-md">ARS</h3>
                  <span className="text-lg font-medium text-md">
                    ${shippingCost.toLocaleString("es-ES", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
              <div className="w-full flex gap-2 items-center justify-between text-white mt-4">
                <span className="text-sm font-medium">Total</span>
                <div className="flex gap-2 items-center text-white">
                  <h3 className="font-medium text-md">ARS</h3>
                  <span className="text-lg font-medium text-md">
                    ${orderData.paymentDetails.totalAmount.toLocaleString("es-ES", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="pt-[60px] font-ibm-mono text-[18px] leading-[34px] tracking-[-0.75px] uppercase mb-4">
          Gracias por tu compra!
        </p>
        <div className="w-full pt-[60px] flex justify-center">
          <Link
            href="/collections/slider"
            className="text-white w-[90%] md:w-[250px] h-[40px] px-[12px] py-[6px] rounded-[2px] backdrop-blur-[6px] bg-[#0D0D0DE5] hover:bg-[#2C2C2CE5] uppercase text-center flex items-center justify-center"
          >
            Volver a colecciones
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;