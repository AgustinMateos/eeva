"use client";

import React, { useState } from 'react';
import Footer from './Footer';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/context/CartContext';

const OrderStep1 = () => {
  const { cart, totalPrice } = useCart();

  // Estado para los inputs de información
  const [info, setInfo] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
  });

  // Estado para los inputs de dirección
  const [address, setAddress] = useState({
    codigoArea: '',
    telefono: '',
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    pais: '',
    region: '',
    codigoPostal: '',
    calle: '',
  });

  // Estado para controlar la visibilidad de los inputs
  const [showAdditionalInputs, setShowAdditionalInputs] = useState(false);

  // Estado para el método de envío seleccionado (nombre y costo)
  const [selectedShipping, setSelectedShipping] = useState({
    name: '',
    cost: 0,
  });

  // Estado para los detalles de pago
  const [paymentDetails, setPaymentDetails] = useState({
    paymentMethod: 'credit_card',
    numberOfInstallments: 3,
  });

  // Estado para controlar la visibilidad del dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Opciones para el dropdown
  const documentOptions = ['DNI', 'Pasaporte'];

  // Manejar cambios en los inputs de información
  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar cambios en los inputs de dirección
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar la selección del tipo de documento
  const handleDocumentSelect = (option) => {
    setAddress((prev) => ({ ...prev, tipoDocumento: option }));
    setIsDropdownOpen(false);
  };

  // Validar que todos los inputs estén completos
  const areAllFieldsFilled = () => {
    return (
      info.nombres &&
      info.apellidos &&
      info.correo &&
      address.codigoArea &&
      address.telefono &&
      address.numeroDocumento &&
      address.pais &&
      address.region &&
      address.codigoPostal &&
      address.calle
    );
  };

  // Manejar el clic en "Continuar"
  const handleContinue = () => {
    if (areAllFieldsFilled()) {
      setShowAdditionalInputs(true);
    } else {
      alert('Por favor, completa todos los campos antes de continuar.');
    }
  };

  // Manejar el clic en "Volver a editar información"
  const handleBack = () => {
    setShowAdditionalInputs(false);
  };

  // Manejar la selección del método de envío
  const handleShippingChange = (e) => {
    const { value, dataset } = e.target;
    setSelectedShipping({
      name: value,
      cost: Number(dataset.cost || 0),
    });
  };

  // Generar la orden y enviarla al endpoint
  const generateOrder = async () => {
    if (!selectedShipping.name) {
      alert('Por favor, selecciona un método de envío antes de confirmar la orden.');
      return;
    }

    if (!cart.length) {
      alert('El carrito está vacío.');
      return;
    }

    // Log del carrito para inspección
    console.log('Contenido del carrito:', JSON.stringify(cart, null, 2));

    // Validar los ítems del carrito
    for (const item of cart) {
      if (!item.id) {
        alert('ID de producto faltante.');
        return;
      }
      if (!item.quantity || item.quantity < 1) {
        alert('Cantidad inválida.');
        return;
      }
      if (!item.price || item.price <= 0) {
        alert('Precio inválido.');
        return;
      }
      if (!(item.colorId || item.color)) {
        alert('Color inválido.');
        return;
      }
      if (!(item.sizeId || item.size)) {
        alert('Talle inválido.');
        return;
      }
    }

    // Calcular el monto por cuota
    const amountPerInstallment = (totalPrice + selectedShipping.cost) / paymentDetails.numberOfInstallments;

    // Payload dinámico
    const order = {
      userInfo: {
        firstName: info.nombres,
        lastName: info.apellidos,
        email: info.correo,
        dni: String(address.numeroDocumento),
      },
      shippingAddress: {
        areaCode: String(address.codigoArea),
        country: address.pais,
        postalCode: String(address.codigoPostal),
        street: address.calle,
      },
      deliveryDetails: {
        deliveryMethod: selectedShipping.name === 'Correo Argentino a Domicilio' ? 'SHIPPING' : 'PICKUP',
        pickupPoint: null,
      },
      paymentDetails: {
        totalAmount: Number(totalPrice + selectedShipping.cost),
        currency: 'ARS',
        paymentMethod: paymentDetails.paymentMethod.toUpperCase().replace(' ', '_'),
        installments: {
          numberOfInstallments: paymentDetails.numberOfInstallments,
          amountPerInstallment: Number(amountPerInstallment.toFixed(2)),
        },
      },
      items: cart.map((item) => ({
        product: item.id,
        quantity: item.quantity,
        price: Number(item.price),
        color: item.colorId || item.color,
        size: item.sizeId || item.size,
      })),
    };

    // Validar el payload antes de enviar
    if (!order.userInfo.firstName || !order.userInfo.email || !order.shippingAddress.street) {
      alert('Datos de usuario o dirección incompletos.');
      return;
    }
    if (!order.items.length) {
      alert('No hay ítems en la orden.');
      return;
    }

    console.log('Orden enviada:', JSON.stringify(order, null, 2));

    try {
      const requestBody = JSON.stringify(order);
      console.log('Cuerpo de la solicitud (raw):', requestBody);

      const response = await fetch('https://eeva-api.vercel.app/api/v1/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Descomentar si se requiere autenticación
          // 'Authorization': `Bearer ${yourToken}`,
        },
        body: requestBody,
      });

      console.log('Estado de la respuesta:', response.status, response.statusText);
      console.log('URL de la solicitud:', response.url);
      console.log('Cabeceras de la respuesta:', Object.fromEntries(response.headers));

      if (!response.ok) {
        let errorMessage = `Error al crear la orden en ${response.url}`;
        try {
          const errorData = await response.json();
          console.log('Cuerpo de error (JSON):', errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (jsonError) {
          console.error('Error al parsear la respuesta de error:', jsonError);
          const errorText = await response.text();
          console.log('Cuerpo de error (texto):', errorText);
          errorMessage = `Error ${response.status}: ${response.statusText} - ${errorText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Respuesta del servidor:', result);
      alert('Orden creada exitosamente!');

      // Opcional: Redirigir
      // import { useRouter } from 'next/navigation';
      // const router = useRouter();
      // router.push('/order-confirmation');
    } catch (error) {
      console.error('Error al enviar la orden:', error);
      alert(`Error: ${error.message}`);
    }
  };

  // Formatear la dirección para el campo "Enviar a"
  const formattedAddress = `${address.calle}, ${address.region}, ${address.pais} ${address.codigoPostal}.`;

  return (
    <div className="min-h-[100vh] w-full flex flex-col justify-center items-center pt-[150px]">
      {/* Estilos personalizados para los radio buttons y overflow handling */}
      <style jsx>{`
        .custom-radio {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          width: 16px;
          height: 16px;
          border: 1px solid #F2F2F2;
          border-radius: 50%;
          position: relative;
          outline: none;
          cursor: pointer;
        }
        .custom-radio:focus {
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
        }
        .custom-radio::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: transparent;
        }
        .custom-radio:checked::before {
          background-color: white;
        }
        .custom-dropdown {
          position: relative;
          width: 139px;
          height: 48px;
        }
        .dropdown-button {
          
          height: 100%;
          padding: 0 16px;
          border: 1px solid #F2F2F2;
          background: #F2F2F203;
          color: white;
          font-size: 14px;
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
        }
        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          background: #F2F2F203;
          border: 1px solid #F2F2F2;
          border-radius: 2px;
          z-index: 10;
          margin-top: 4px;
        }
        .dropdown-item {
          padding: 8px 16px;
          color: white;
          font-size: 14px;
          cursor: pointer;
        }
        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        .email-overflow {
          max-width: 70%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        @media (max-width: 767px) {
         
          .info-section button {
            padding: 4px 8px !important;
            font-size: 12px !important;
          }
          .email-overflow {
            max-width: 60% !important;
          }
        }
      `}</style>

      <div className="w-[100%] flex-col-reverse md:w-[85%] flex md:flex-row">
        <div className="w-[100%] md:w-[70%] border-r border-r-[#D7D7D780]">
          <div className="w-full flex justify-center md:justify-start">
            <h2 className="font-ibm w-[90%] md:w-[713px] text-[22px] leading-[64px] tracking-[-0.04em] align-middle uppercase text-white">
              INFORMACIÓN
            </h2>
          </div>
          {!showAdditionalInputs ? (
            <div className="flex flex-col gap-8">
              <div className="h-[256px] flex flex-col justify-between items-center md:items-start">
                <input
                  className="w-[90%] text-[14px] placeholder-white md:w-[713px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                  type="text"
                  name="nombres"
                  value={info.nombres}
                  onChange={handleInfoChange}
                  placeholder="Nombres"
                />
                <input
                  className="w-[90%] text-[14px] placeholder-white md:w-[713px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                  type="text"
                  name="apellidos"
                  value={info.apellidos}
                  onChange={handleInfoChange}
                  placeholder="Apellidos"
                />
                <input
                  className="w-[90%] md:w-[713px] text-[14px] placeholder-white h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                  type="email"
                  name="correo"
                  value={info.correo}
                  onChange={handleInfoChange}
                  placeholder="Correo electrónico"
                />
              </div>

              <div className="h-[400px] flex flex-col justify-between items-center md:items-start">
                <h2 className="font-ibm text-[22px] w-[90%] md:w-[713px] leading-[64px] tracking-[-0.04em] align-middle uppercase text-white">
                  DIRECCIÓN DE ENVÍO
                </h2>
                <div className="flex justify-between w-[90%] md:w-[713px]">
                  <input
                    className="w-[109px] text-[14px] placeholder-white md:w-[139px] h-[48px] pr-[16px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                    name="codigoArea"
                    value={address.codigoArea}
                    onChange={handleAddressChange}
                    placeholder="C. Área"
                  />
                  <input
                    className="w-[205px] text-[14px] placeholder-white md:w-[558px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                    type="text"
                    name="telefono"
                    value={address.telefono}
                    onChange={handleAddressChange}
                    placeholder="Teléfono / Celular"
                  />
                </div>
                <div className="flex justify-between w-[90%] md:w-[713px]">
                  <div className="custom-dropdown">
                    <div
                      className="dropdown-button w-[109px] md:w-[100%]"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <span>{address.tipoDocumento}</span>
                      <Image height={14} width={14} alt="flecha" src={'/check.svg'} />
                    </div>
                    {isDropdownOpen && (
                      <div className="dropdown-menu">
                        {documentOptions.map((option) => (
                          <div
                            key={option}
                            className="dropdown-item backdrop-blur-[6px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A] focus:outline-none"
                            onClick={() => handleDocumentSelect(option)}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <input
                    className="w-[205px] text-[14px] placeholder-white md:w-[558px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                    type="text"
                    name="numeroDocumento"
                    value={address.numeroDocumento}
                    onChange={handleAddressChange}
                    placeholder="Número de documento"
                  />
                </div>
                <input
                  className="w-[90%] text-[14px] placeholder-white md:w-[713px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                  type="text"
                  name="pais"
                  value={address.pais}
                  onChange={handleAddressChange}
                  placeholder="País / Región"
                />
                <input
                  className="w-[90%] text-[14px] placeholder-white md:w-[713px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                  type="text"
                  name="region"
                  value={address.region}
                  onChange={handleAddressChange}
                  placeholder="Región / Provincia"
                />
                <div className="flex justify-between w-[90%] md:w-[713px]">
                  <input
                    className="w-[109px] text-[14px] placeholder-white md:w-[139px] h-[48px] pr-[16px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                    name="codigoPostal"
                    value={address.codigoPostal}
                    onChange={handleAddressChange}
                    placeholder="C. Postal"
                  />
                  <input
                    className="w-[205px] text-[14px] placeholder-white md:w-[558px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                    type="text"
                    name="calle"
                    value={address.calle}
                    onChange={handleAddressChange}
                    placeholder="Calle + Altura"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8 flex flex-col gap-4 items-center md:items-start info-section w-60-important md:w-[100%]">
              <div className="flex justify-between items-center w-[90%] md:w-[713px] h-[48px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] text-white">
                <div className="flex w-[82%] flex-row items-center">
                  <span className="font-ibm-mono font-semibold text-[14px] tracking-[-0.04em] align-middle pr-3">Contacto</span>
                  <span className="text-sm  email-overflow">{info.correo}</span>
                
                </div>
                <button
                  onClick={handleBack}
                  className="text-white underline hover:text-gray-400 transition text-sm"
                >
                  Cambiar
                </button>
              </div>
             
              <div className="flex justify-between items-center w-[90%] md:w-[713px] h-[48px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] text-white">
                <div className="flex w-[82%] flex-row items-center">
                  <span className="font-ibm-mono font-semibold text-[14px] tracking-[-0.04em] align-middle pr-3">Envia a</span>
                  <span className="text-sm  email-overflow">{formattedAddress}</span>
                
                </div>
                <button
                  onClick={handleBack}
                  className="text-white underline hover:text-gray-400 transition text-sm"
                >
                  Cambiar
                </button>
              </div>
              <div className="mt-8 w-full">
                <div className="w-full flex justify-center md:justify-start">
                  <h2 className="font-ibm w-[90%] md:w-[713px] text-[22px] leading-[64px] tracking-[-0.04em] align-middle uppercase text-white">
                    MÉTODO DE ENVÍO
                  </h2>
                </div>
                <div className="flex flex-col gap-4 items-center md:items-start">
                  <label className="flex justify-between items-center w-[90%] md:w-[713px] h-[48px] md:px-4 pr-4 pl-[0px] py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] text-white">
                    <div className="flex items-center gap-2 w-[65%]">
                      <input
                        type="radio"
                        name="shipping"
                        value="Correo Argentino a Domicilio"
                        data-cost="16000"
                        checked={selectedShipping.name === 'Correo Argentino a Domicilio'}
                        onChange={handleShippingChange}
                        className="custom-radio mr-4 ml-4"
                      />
                      <span className="text-sm">Correo Argentino a Domicilio</span>
                    </div>
                    <span className="text-sm">ARS $16.000</span>
                  </label>
                  <p className="text-xs text-gray-400 w-[90%] md:w-full">
                    Lorem ipsum dolor sit amet consectetur adipiscing elit hendrerit felis nostra interdum, diam pretium turpis ut est libero dapibus vehicula purus sollicitudin
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="w-[100%] md:w-[713px] pt-[60px] flex-col-reverse h-[150px] md:flex-row flex items-center justify-between">
            {showAdditionalInputs ? (
              <>
                <button
                  onClick={handleBack}
                  className="inline-block pr-2 text-white underline hover:text-gray-400 transition"
                >
                  Volver a editar información
                </button>
                <button
                  onClick={generateOrder}
                  className="text-white w-[90%] pb-[10px] md:w-[160px] h-[40px] gap-2 px-[12px] py-[6px] rounded-[2px] backdrop-blur-[6px] bg-[#0D0D0DE5] transition-all duration-200 hover:bg-[#2C2C2CE5] uppercase text-center"
                >
                  Confirmar Orden
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/"
                  className="inline-block pr-2 text-white underline hover:text-gray-400 transition"
                >
                  Continue shopping
                </Link>
                <button
                  onClick={handleContinue}
                  className="text-white w-[90%] pb-[10px] md:w-[160px] h-[40px] gap-2 px-[12px] py-[6px] rounded-[2px] backdrop-blur-[6px] bg-[#0D0D0DE5] transition-all duration-200 hover:bg-[#2C2C2CE5] uppercase text-center"
                >
                  Continuar
                </button>
              </>
            )}
          </div>
        </div>
        <div className="w-[90%] md:w-[30%] pl-6">
          <div className="divide-y divide-gray-400 text-white">
            {cart.map((item, index) => (
              <div
                key={`${item.id}-${item.color}-${item.size}`}
                className="relative w-full py-4 flex justify-between gap-4 pt-10"
              >
                <div className="w-24 h-24 relative">
                  <Image
                    src={'/products/' + item.image + '.webp'}
                    alt={item.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="font-medium">{item.name.toUpperCase()}</h3>
                  <div className="flex gap-2 items-center">
                    <p className="text-xs">{item.color}</p>
                    <p className="text-sm">|</p>
                    <p className="text-xs">{item.size}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <p className="text-xs">Item:</p>
                    <p className="text-xs">{item.quantity}</p>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex gap-2 items-center">
                    <h3 className="font-medium text-md">ARS</h3>
                    <span className="text-lg font-medium text-md">
                      ${(item.price * item.quantity).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-medium text-xs text-[#A2A2A2]">
                      Precios sin impuestos:
                    </span>
                    <span className="font-medium text-xs text-[#A2A2A2]">
                      ${((item.price * item.quantity) / 1.21).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                    ${totalPrice.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
              {selectedShipping.name && (
                <div className="w-full flex gap-2 items-center justify-between text-white mt-4">
                  <span className="text-sm font-light">Envío ({selectedShipping.name})</span>
                  <div className="flex gap-2 items-center text-white">
                    <h3 className="font-medium text-md">ARS</h3>
                    <span className="text-lg font-medium text-md">
                      ${selectedShipping.cost.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              )}
              <div className="w-full flex gap-2 items-center justify-between text-white mt-4">
                <span className="text-sm font-medium">Total</span>
                <div className="flex gap-2 items-center text-white">
                  <h3 className="font-medium text-md">ARS</h3>
                  <span className="text-lg font-medium text-md">
                    ${(totalPrice + selectedShipping.cost).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
     <div className="w-[90%] h-[315px] md:h-[415px] flex md:min-w-[1315px]">
                 <Footer />
               </div>
    </div>
  );
};

export default OrderStep1;