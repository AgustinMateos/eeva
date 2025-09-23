

"use client";

import React, { useState } from 'react';
import Footer from './Footer';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/context/CartContext';
import { useRouter } from 'next/navigation';

// Function to fetch color ID by name
const fetchColorId = async (colorName) => {
  try {
    const response = await fetch(`https://eeva-api.vercel.app/api/v1/colors/name/${colorName}`, {
      method: 'GET',
      headers: { 'Accept': '*/*' },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch color ID for ${colorName}`);
    }

    const colorData = await response.json();
    return colorData._id;
  } catch (error) {
    console.error(`Error fetching color ID for ${colorName}:`, error);
    return null;
  }
};

// Function to fetch size ID by name
const fetchSizeId = async (sizeName) => {
  try {
    const response = await fetch(`https://eeva-api.vercel.app/api/v1/sizes/name/${sizeName}`, {
      method: 'GET',
      headers: { 'Accept': '*/*' },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch size ID for ${sizeName}`);
    }

    const sizeData = await response.json();
    return sizeData._id;
  } catch (error) {
    console.error(`Error fetching size ID for ${sizeName}:`, error);
    return null;
  }
};

// Function to create Mercado Pago payment link
const createPaymentLink = async (orderId) => {
  try {
    const response = await fetch(`https://eeva-api.vercel.app/api/v1/payment/mercado-pago/${orderId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to create payment link for order ${orderId}`);
    }

    const paymentResult = await response.json();
    return paymentResult.link;
  } catch (error) {
    console.error(`Error creating payment link for order ${orderId}:`, error);
    throw error;
  }
};

// Function to validate email
const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const OrderStep1 = () => {
  const { cart, totalPrice } = useCart();
  const router = useRouter();

  // State for user input
  const [info, setInfo] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
  });
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
  const [emailError, setEmailError] = useState('');
  const [showAdditionalInputs, setShowAdditionalInputs] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState({ name: '', cost: 0 });
  const [paymentDetails, setPaymentDetails] = useState({
    paymentMethod: 'credit_card',
    numberOfInstallments: 3,
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [customAlert, setCustomAlert] = useState({ show: false, message: '' });

  const documentOptions = ['DNI', 'Pasaporte'];

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));

    if (name === 'correo') {
      if (!value) {
        setEmailError('El correo electrónico es obligatorio.');
      } else if (!validateEmail(value)) {
        setEmailError('Por favor, ingrese un correo electrónico válido (ejemplo: usuario@dominio.com).');
      } else {
        setEmailError('');
      }
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    // Handle numeric inputs for telefono and numeroDocumento
    if (name === 'telefono' || name === 'numeroDocumento') {
      // Remove non-numeric characters
      const numericValue = value.replace(/[^0-9]/g, '');
      setAddress((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setAddress((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDocumentSelect = (option) => {
    setAddress((prev) => ({ ...prev, tipoDocumento: option }));
    setIsDropdownOpen(false);
  };

  const areAllFieldsFilled = () => {
    return (
      info.nombres &&
      info.apellidos &&
      info.correo &&
      !emailError &&
      address.codigoArea &&
      address.telefono &&
      address.numeroDocumento &&
      address.pais &&
      address.region &&
      address.codigoPostal &&
      address.calle
    );
  };

  const handleContinue = () => {
    if (areAllFieldsFilled()) {
      setShowAdditionalInputs(true);
    } else {
      const errorMessage = emailError || 'Por favor, completa todos los campos antes de continuar.';
      setCustomAlert({ show: true, message: errorMessage });
    }
  };

  const closeCustomAlert = () => {
    setCustomAlert({ show: false, message: '' });
  };

  const handleBack = () => {
    setShowAdditionalInputs(false);
  };

  const handleShippingChange = (e) => {
    const { value, dataset } = e.target;
    setSelectedShipping({
      name: value,
      cost: Number(dataset.cost || 0),
    });
  };

  const generateOrder = async () => {
    if (!selectedShipping.name) {
      setCustomAlert({ show: true, message: 'Por favor, selecciona un método de envío antes de confirmar la orden.' });
      return;
    }
  
    if (!cart.length) {
      setCustomAlert({ show: true, message: 'El carrito está vacío.' });
      return;
    }
  
    const cartWithIds = await Promise.all(
      cart.map(async (item) => {
        const colorId = await fetchColorId(item.color);
        const sizeId = await fetchSizeId(item.size);
        return { ...item, colorId, sizeId };
      })
    );
  
    for (const item of cartWithIds) {
      if (!item.id) {
        setCustomAlert({ show: true, message: 'ID de producto faltante.' });
        return;
      }
      if (!item.quantity || item.quantity < 1) {
        setCustomAlert({ show: true, message: 'Cantidad inválida.' });
        return;
      }
      if (!item.price || item.price <= 0) {
        setCustomAlert({ show: true, message: 'Precio inválido.' });
        return;
      }
      if (!item.colorId) {
        setCustomAlert({ show: true, message: `No se pudo obtener el ID del color para ${item.color}.` });
        return;
      }
      if (!item.sizeId) {
        setCustomAlert({ show: true, message: `No se pudo obtener el ID del talle para ${item.size}.` });
        return;
      }
    }
  
    const amountPerInstallment = (totalPrice + selectedShipping.cost) / paymentDetails.numberOfInstallments;
  
    const order = {
      userInfo: {
        firstName: info.nombres,
        lastName: info.apellidos,
        email: info.correo,
        dni: String(address.numeroDocumento),
      },
      shippingAddress: {
        areaCode: String(address.codigoArea),
        phone: String(address.codigoArea + address.telefono),
        country: address.pais,
        city: address.region,
        postalCode: String(address.codigoPostal),
        street: address.calle,
      },
      deliveryDetails: {
        deliveryMethod: selectedShipping.name === 'Correo Argentino a Domicilio' ? 'SHIPPING' : 'PICKUP',
        pickupPoint: null,
      },
      paymentDetails: {
        totalAmount: Number((totalPrice + selectedShipping.cost).toFixed(2)),
        subtotalAmount: Number(totalPrice.toFixed(2)),
        discountAmount: 0,
        shippingPrice: Number(selectedShipping.cost.toFixed(2)),
        currency: 'ARS',
        paymentMethod: paymentDetails.paymentMethod.toUpperCase().replace(' ', '_'),
        installments: {
          numberOfInstallments: paymentDetails.numberOfInstallments,
          amountPerInstallment: Number(amountPerInstallment.toFixed(2)),
        },
      },
      items: cartWithIds.map((item) => ({
        product: item.id,
        quantity: item.quantity,
        price: Number(item.price.toFixed(2)),
        color: item.colorId,
        size: item.sizeId,
      })),
    };
  
    if (!order.userInfo.firstName || !order.userInfo.email || !order.shippingAddress.street) {
      setCustomAlert({ show: true, message: 'Datos de usuario o dirección incompletos.' });
      return;
    }
    if (!order.items.length) {
      setCustomAlert({ show: true, message: 'No hay ítems en la orden.' });
      return;
    }
  
    try {
      const orderResponse = await fetch('https://eeva-api.vercel.app/api/v1/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
  
      console.log('Order response status:', orderResponse.status);
      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        console.log('Order response error:', errorText);
        throw new Error(`Error al crear la orden: ${orderResponse.statusText} - ${errorText}`);
      }
  
      const orderResult = await orderResponse.json();
      console.log('Order creation response:', orderResult);
  
      const newOrderId = orderResult.order?._id || orderResult._id || orderResult.id || orderResult.orderId;
      if (!newOrderId) {
        throw new Error('No se recibió el ID de la orden en la respuesta. Verifica la estructura de la respuesta.');
      }
  
      setOrderId(newOrderId);
      setShowOrderConfirmation(true);
      setCustomAlert({ show: true, message: 'Orden creada exitosamente!' });
    } catch (error) {
      console.error('Error creating order:', error);
      setCustomAlert({ show: true, message: `Error: ${error.message}` });
    }
  };

  const handlePayOrder = async () => {
    if (!orderId) {
      setCustomAlert({ show: true, message: 'No hay una orden válida para pagar.' });
      return;
    }

    try {
      const paymentLink = await createPaymentLink(orderId);
      if (!paymentLink) {
        throw new Error('No se recibió el enlace de pago.');
      }
      window.location.href = paymentLink;
    } catch (error) {
      console.error('Error generating payment link:', error);
      setCustomAlert({ show: true, message: `Error: ${error.message}` });
    }
  };

  const formattedAddress = `${address.calle}, ${address.region}, ${address.pais} ${address.codigoPostal}.`;

  return (
    <div className="min-h-[100vh] w-full flex flex-col justify-center items-center pt-[150px]">
      <style jsx>{`
        .custom-radio { appearance: none; -webkit-appearance: none; -moz-appearance: none; width: 16px; height: 16px; border: 1px solid #F2F2F2; border-radius: 50%; position: relative; outline: none; cursor: pointer; }
        .custom-radio:focus { box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5); }
        .custom-radio::before { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 8px; height: 8px; border-radius: 50%; background-color: transparent; }
        .custom-radio:checked::before { background-color: white; }
        .custom-dropdown { position: relative; width: 139px; height: 48px; }
        .dropdown-button { height: 100%; padding: 0 16px; border: 1px solid #F2F2F2; background: #F2F2F203; color: white; font-size: 14px; border-radius: 2px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; }
        .dropdown-menu { position: absolute; top: 100%; left: 0; width: 100%; background: #F2F2F203; border: 1px solid #F2F2F2; border-radius: 2px; z-index: 10; margin-top: 4px; }
        .dropdown-item { padding: 8px 16px; color: white; font-size: 14px; cursor: pointer; }
        .dropdown-item:hover { background: rgba(255, 255, 255, 0.1); }
        .email-overflow { max-width: 70%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
        .error-message { color: #ff4d4f; font-size: 12px; margin-top: 4px; }
        .custom-alert { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; }
        .custom-alert-content { border: 1px solid #F2F2F2; border-radius: 8px; padding: 24px; max-width: 400px; width: 90%; text-align: center; color: white; }
        .custom-alert-content p { font-size: 16px; margin-bottom: 20px; }
        .custom-alert-content button { background: #0D0D0DE5; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; transition: background 0.2s; }
        .custom-alert-content button:hover { background: #2C2C2CE5; }
        .disabled-button { background: #4B4B4B !important; cursor: not-allowed !important; }
        @media (max-width: 767px) { .info-section button { padding: 4px 8px !important; font-size: 12px !important; } .email-overflow { max-width: 60% !important; } }
      `}</style>

      {customAlert.show && (
        <div className="custom-alert">
          <div className="custom-alert-content bg-gray-500/40">
            <p>{customAlert.message}</p>
            <button onClick={closeCustomAlert}>Aceptar</button>
          </div>
        </div>
      )}

      <div className="w-[100%] flex-col-reverse md:w-[85%] flex md:flex-row">
        {!showOrderConfirmation ? (
          <>
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
                    <div className="w-[90%] md:w-[713px]">
                      <input
                        className={`w-full text-[14px] placeholder-white h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border ${emailError ? 'border-[#ff4d4f]' : 'border-[#F2F2F2]'} bg-[#F2F2F203] focus:outline-none focus:ring-2 focus:ring-white/50 text-white`}
                        type="email"
                        name="correo"
                        value={info.correo}
                        onChange={handleInfoChange}
                        placeholder="Correo electrónico"
                      />
                      {emailError && <p className="error-message">{emailError}</p>}
                    </div>
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
                      <div className="w-[205px] md:w-[558px]">
                        <input
                          className="w-full text-[14px] placeholder-white h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                          type="number"
                          name="telefono"
                          value={address.telefono}
                          onChange={handleAddressChange}
                          placeholder="Teléfono / Celular"
                          onWheel={(e) => e.target.blur()}
                        />
                      </div>
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
                      <div className="w-[205px] md:w-[558px]">
                        <input
                          className="w-full text-[14px] placeholder-white h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                          type="number"
                          name="numeroDocumento"
                          value={address.numeroDocumento}
                          onChange={handleAddressChange}
                          placeholder="Número de documento"
                          onWheel={(e) => e.target.blur()}
                        />
                      </div>
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
                        placeholder="Calle + Altura + Piso"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-8 flex flex-col gap-4 items-center md:items-start info-section w-60-important md:w-[100%]">
                  <div className="flex justify-between items-center w-[90%] md:w-[713px] h-[48px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] text-white">
                    <div className="flex w-[82%] flex-row items-center">
                      <span className="font-ibm-mono font-semibold text-[14px] tracking-[-0.04em] align-middle pr-3">Contacto</span>
                      <span className="text-sm email-overflow">{info.correo}</span>
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
                      <span className="text-sm email-overflow">{formattedAddress}</span>
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
                            data-cost="8000"
                            checked={selectedShipping.name === 'Correo Argentino a Domicilio'}
                            onChange={handleShippingChange}
                            className="custom-radio mr-4 ml-4"
                          />
                          <span className="text-sm">Correo Argentino a Domicilio</span>
                        </div>
                        <span className="text-sm">ARS $8.000</span>
                      </label>
                      <p className="text-xs text-gray-400 w-[80%] md:w-[90%]">
                        Una vez despachado el paquete, la gestión y entrega quedan a cargo de Correo Argentino.
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
                      Confirmar
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
                      className={`text-white w-[90%] pb-[10px] md:w-[160px] h-[40px] gap-2 px-[12px] py-[6px] rounded-[2px] backdrop-blur-[6px] transition-all duration-200 uppercase text-center ${
                        areAllFieldsFilled() ? 'bg-[#0D0D0DE5] hover:bg-[#2C2C2CE5]' : 'disabled-button'
                      }`}
                      disabled={!areAllFieldsFilled()}
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
          </>
        ) : (
          <div className="w-[100%] md:w-[100%] flex flex-col items-start p-[10px]">
            <h2 className="font-ibm-mono text-[22px] sm:text-[28px] leading-[64px] tracking-[-0.75px] align-middle uppercase text-white mb-4">
              Detalle de la Orden
            </h2>
            <div className="w-[100%] md:w-[100%] xl:w-[100%] border-r border-r-[#D7D7D780]">
              {/* Order Details Section */}
              <div className="p-[15px] text-white">
                <h3 className="font-ibm-mono text-[18px] leading-[24px] tracking-[-0.04em] uppercase text-white mb-4">
                  Información del Cliente
                </h3>
                <div className="flex flex-col gap-2">
                  <p className="text-sm">
                    <span className="font-medium">ID de la Orden:</span> {orderId}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Nombre:</span> {info.nombres} {info.apellidos}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Correo Electrónico:</span> {info.correo}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Teléfono:</span> {address.codigoArea} {address.telefono}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Dirección de Envío:</span> {formattedAddress}
                  </p>
                </div>
              </div>
              {/* Existing Cart Items and Totals */}
              <div className="divide-y divide-gray-400 p-[10px] text-white">
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
                    <div className="flex flex-col md:min-w-[190px] gap-4">
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
                          ${(item.price * item.quantity).toLocaleString('es-ES', {
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
              <div className="w-[100%] md:w-[713px] xl:w-[100%] pr-[10px] pt-[60px] flex-col-reverse h-[150px] md:flex-row flex items-center justify-between">
                <button
                  onClick={() => setShowOrderConfirmation(false)}
                  className="inline-block pr-2 text-white underline hover:text-gray-400 transition text-sm"
                >
                  Volver a editar
                </button>
                <button
                  onClick={handlePayOrder}
                  className="text-white w-[90%] flex pb-[10px] md:w-[180px] justify-center h-[40px] gap-2 px-[12px] py-[6px] rounded-[2px] backdrop-blur-[6px] bg-[#0D0D0DE5] transition-all duration-200 hover:bg-[#2C2C2CE5] uppercase text-center"
                >
                  <p>Pagar Orden </p> <Image alt='mercado pago logo' width={30} height={30} src={'/mercadoPago.svg'}/>
                </button>
              </div>
            </div>
            <div className="w-[90%] md:w-[30%] pl-6">
              {/* Empty div to maintain layout symmetry */}
            </div>
          </div>
        )}
      </div>
      <div className="w-[90%] h-[315px] md:h-[415px] flex md:min-w-[1315px]">
        <Footer />
      </div>
    </div>
  );
};

export default OrderStep1;


// 



// "use client";

// import React, { useState } from 'react';
// import Footer from './Footer';
// import Link from 'next/link';
// import Image from 'next/image';
// import { useCart } from '@/components/context/CartContext';
// import { useRouter } from 'next/navigation';

// // Function to fetch color ID by name
// const fetchColorId = async (colorName) => {
//   try {
//     const response = await fetch(`https://eeva-api.vercel.app/api/v1/colors/name/${colorName}`, {
//       method: 'GET',
//       headers: { 'Accept': '*/*' },
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to fetch color ID for ${colorName}`);
//     }

//     const colorData = await response.json();
//     return colorData._id;
//   } catch (error) {
//     console.error(`Error fetching color ID for ${colorName}:`, error);
//     return null;
//   }
// };

// // Function to fetch size ID by name
// const fetchSizeId = async (sizeName) => {
//   try {
//     const response = await fetch(`https://eeva-api.vercel.app/api/v1/sizes/name/${sizeName}`, {
//       method: 'GET',
//       headers: { 'Accept': '*/*' },
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to fetch size ID for ${sizeName}`);
//     }

//     const sizeData = await response.json();
//     return sizeData._id;
//   } catch (error) {
//     console.error(`Error fetching size ID for ${sizeName}:`, error);
//     return null;
//   }
// };

// // Function to create Mercado Pago payment link
// const createPaymentLink = async (orderId) => {
//   try {
//     const response = await fetch(`https://eeva-api.vercel.app/api/v1/payment/mercado-pago/${orderId}`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': '*/*',
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to create payment link for order ${orderId}`);
//     }

//     const paymentResult = await response.json();
//     return paymentResult.link;
//   } catch (error) {
//     console.error(`Error creating payment link for order ${orderId}:`, error);
//     throw error;
//   }
// };

// // Function to validate email
// const validateEmail = (email) => {
//   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//   return emailRegex.test(email);
// };

// const OrderStep1 = () => {
//   const { cart, totalPrice } = useCart();
//   const router = useRouter();

//   // State for user input
//   const [info, setInfo] = useState({
//     nombres: '',
//     apellidos: '',
//     correo: '',
//   });
//   const [address, setAddress] = useState({
//     codigoArea: '',
//     telefono: '',
//     tipoDocumento: 'DNI',
//     numeroDocumento: '',
//     pais: '',
//     region: '',
//     codigoPostal: '',
//     calle: '',
//   });
//   const [emailError, setEmailError] = useState('');
//   const [showAdditionalInputs, setShowAdditionalInputs] = useState(false);
//   const [selectedShipping, setSelectedShipping] = useState({ name: '', cost: 0 });
//   const [paymentDetails, setPaymentDetails] = useState({
//     paymentMethod: 'credit_card',
//     numberOfInstallments: 3,
//   });
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [orderId, setOrderId] = useState(null);
//   const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
//   const [customAlert, setCustomAlert] = useState({ show: false, message: '' });

//   const documentOptions = ['DNI', 'Pasaporte'];

//   const handleInfoChange = (e) => {
//     const { name, value } = e.target;
//     setInfo((prev) => ({ ...prev, [name]: value }));

//     if (name === 'correo') {
//       if (!value) {
//         setEmailError('El correo electrónico es obligatorio.');
//       } else if (!validateEmail(value)) {
//         setEmailError('Por favor, ingrese un correo electrónico válido (ejemplo: usuario@dominio.com).');
//       } else {
//         setEmailError('');
//       }
//     }
//   };

//   const handleAddressChange = (e) => {
//     const { name, value } = e.target;

//     // Handle numeric inputs for telefono and numeroDocumento
//     if (name === 'telefono' || name === 'numeroDocumento') {
//       // Remove non-numeric characters
//       const numericValue = value.replace(/[^0-9]/g, '');
//       setAddress((prev) => ({ ...prev, [name]: numericValue }));
//     } else {
//       setAddress((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleDocumentSelect = (option) => {
//     setAddress((prev) => ({ ...prev, tipoDocumento: option }));
//     setIsDropdownOpen(false);
//   };

//   const areAllFieldsFilled = () => {
//     return (
//       info.nombres &&
//       info.apellidos &&
//       info.correo &&
//       !emailError &&
//       address.codigoArea &&
//       address.telefono &&
//       address.numeroDocumento &&
//       address.pais &&
//       address.region &&
//       address.codigoPostal &&
//       address.calle
//     );
//   };

//   const handleContinue = () => {
//     if (areAllFieldsFilled()) {
//       setShowAdditionalInputs(true);
//     } else {
//       const errorMessage = emailError || 'Por favor, completa todos los campos antes de continuar.';
//       setCustomAlert({ show: true, message: errorMessage });
//     }
//   };

//   const closeCustomAlert = () => {
//     setCustomAlert({ show: false, message: '' });
//   };

//   const handleBack = () => {
//     setShowAdditionalInputs(false);
//   };

//   const handleShippingChange = (e) => {
//     const { value, dataset } = e.target;
//     setSelectedShipping({
//       name: value,
//       cost: Number(dataset.cost || 0),
//     });
//   };

//   const generateOrder = async () => {
//     if (!selectedShipping.name) {
//       setCustomAlert({ show: true, message: 'Por favor, selecciona un método de envío antes de confirmar la orden.' });
//       return;
//     }

//     if (!cart.length) {
//       setCustomAlert({ show: true, message: 'El carrito está vacío.' });
//       return;
//     }

//     const cartWithIds = await Promise.all(
//       cart.map(async (item) => {
//         const colorId = await fetchColorId(item.color);
//         const sizeId = await fetchSizeId(item.size);
//         return { ...item, colorId, sizeId };
//       })
//     );

//     for (const item of cartWithIds) {
//       if (!item.id) {
//         setCustomAlert({ show: true, message: 'ID de producto faltante.' });
//         return;
//       }
//       if (!item.quantity || item.quantity < 1) {
//         setCustomAlert({ show: true, message: 'Cantidad inválida.' });
//         return;
//       }
//       if (!item.price || item.price <= 0) {
//         setCustomAlert({ show: true, message: 'Precio inválido.' });
//         return;
//       }
//       if (!item.colorId) {
//         setCustomAlert({ show: true, message: `No se pudo obtener el ID del color para ${item.color}.` });
//         return;
//       }
//       if (!item.sizeId) {
//         setCustomAlert({ show: true, message: `No se pudo obtener el ID del talle para ${item.size}.` });
//         return;
//       }
//     }

//     const amountPerInstallment = (totalPrice + selectedShipping.cost) / paymentDetails.numberOfInstallments;

//     const order = {
//       userInfo: {
//         firstName: info.nombres,
//         lastName: info.apellidos,
//         email: info.correo,
//         dni: String(address.numeroDocumento),
//       },
//       shippingAddress: {
//         areaCode: String(address.codigoArea),
//         phone: String(address.codigoArea + address.telefono),
//         country: address.pais,
//         city: address.region,
//         postalCode: String(address.codigoPostal),
//         street: address.calle,
//       },
//       deliveryDetails: {
//         deliveryMethod: selectedShipping.name === 'Correo Argentino a Domicilio' ? 'SHIPPING' : 'PICKUP',
//         pickupPoint: null,
//       },
//       paymentDetails: {
//         totalAmount: Number(totalPrice + selectedShipping.cost),
//         currency: 'ARS',
//         paymentMethod: paymentDetails.paymentMethod.toUpperCase().replace(' ', '_'),
//         installments: {
//           numberOfInstallments: paymentDetails.numberOfInstallments,
//           amountPerInstallment: Number(amountPerInstallment.toFixed(2)),
//         },
//       },
//       items: cartWithIds.map((item) => ({
//         product: item.id,
//         quantity: item.quantity,
//         price: Number(item.price),
//         color: item.colorId,
//         size: item.sizeId,
//       })),
//     };

//     if (!order.userInfo.firstName || !order.userInfo.email || !order.shippingAddress.street) {
//       setCustomAlert({ show: true, message: 'Datos de usuario o dirección incompletos.' });
//       return;
//     }
//     if (!order.items.length) {
//       setCustomAlert({ show: true, message: 'No hay ítems en la orden.' });
//       return;
//     }

//     try {
//       const orderResponse = await fetch('https://eeva-api.vercel.app/api/v1/orders/create', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(order),
//       });

//       console.log('Order response status:', orderResponse.status); // Debug status
//       if (!orderResponse.ok) {
//         const errorText = await orderResponse.text();
//         console.log('Order response error:', errorText); // Debug error body
//         throw new Error(`Error al crear la orden: ${orderResponse.statusText} - ${errorText}`);
//       }

//       const orderResult = await orderResponse.json();
//       console.log('Order creation response:', orderResult); // Debug full response

//       // Try multiple possible ID fields
//       const newOrderId = orderResult.order?._id || orderResult._id || orderResult.id || orderResult.orderId;
//       if (!newOrderId) {
//         throw new Error('No se recibió el ID de la orden en la respuesta. Verifica la estructura de la respuesta.');
//       }

//       setOrderId(newOrderId);
//       setShowOrderConfirmation(true);
//       setCustomAlert({ show: true, message: 'Orden creada exitosamente!' });
//     } catch (error) {
//       console.error('Error creating order:', error);
//       setCustomAlert({ show: true, message: `Error: ${error.message}` });
//     }
//   };

//   const handlePayOrder = async () => {
//     if (!orderId) {
//       setCustomAlert({ show: true, message: 'No hay una orden válida para pagar.' });
//       return;
//     }

//     try {
//       const paymentLink = await createPaymentLink(orderId);
//       if (!paymentLink) {
//         throw new Error('No se recibió el enlace de pago.');
//       }
//       window.location.href = paymentLink;
//     } catch (error) {
//       console.error('Error generating payment link:', error);
//       setCustomAlert({ show: true, message: `Error: ${error.message}` });
//     }
//   };

//   const formattedAddress = `${address.calle}, ${address.region}, ${address.pais} ${address.codigoPostal}.`;

//   return (
//     <div className="min-h-[100vh] w-full flex flex-col justify-center items-center pt-[150px]">
//       <style jsx>{`
//         .custom-radio { appearance: none; -webkit-appearance: none; -moz-appearance: none; width: 16px; height: 16px; border: 1px solid #F2F2F2; border-radius: 50%; position: relative; outline: none; cursor: pointer; }
//         .custom-radio:focus { box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5); }
//         .custom-radio::before { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 8px; height: 8px; border-radius: 50%; background-color: transparent; }
//         .custom-radio:checked::before { background-color: white; }
//         .custom-dropdown { position: relative; width: 139px; height: 48px; }
//         .dropdown-button { height: 100%; padding: 0 16px; border: 1px solid #F2F2F2; background: #F2F2F203; color: white; font-size: 14px; border-radius: 2px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; }
//         .dropdown-menu { position: absolute; top: 100%; left: 0; width: 100%; background: #F2F2F203; border: 1px solid #F2F2F2; border-radius: 2px; z-index: 10; margin-top: 4px; }
//         .dropdown-item { padding: 8px 16px; color: white; font-size: 14px; cursor: pointer; }
//         .dropdown-item:hover { background: rgba(255, 255, 255, 0.1); }
//         .email-overflow { max-width: 70%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
//         .error-message { color: #ff4d4f; font-size: 12px; margin-top: 4px; }
//         .custom-alert { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; }
//         .custom-alert-content { border: 1px solid #F2F2F2; border-radius: 8px; padding: 24px; max-width: 400px; width: 90%; text-align: center; color: white; }
//         .custom-alert-content p { font-size: 16px; margin-bottom: 20px; }
//         .custom-alert-content button { background: #0D0D0DE5; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; transition: background 0.2s; }
//         .custom-alert-content button:hover { background: #2C2C2CE5; }
//         .disabled-button { background: #4B4B4B !important; cursor: not-allowed !important; }
//         @media (max-width: 767px) { .info-section button { padding: 4px 8px !important; font-size: 12px !important; } .email-overflow { max-width: 60% !important; } }
//       `}</style>

//       {customAlert.show && (
//         <div className="custom-alert">
//           <div className="custom-alert-content bg-gray-500/40">
//             <p>{customAlert.message}</p>
//             <button onClick={closeCustomAlert}>Aceptar</button>
//           </div>
//         </div>
//       )}

//       <div className="w-[100%] flex-col-reverse md:w-[85%] flex md:flex-row">
//         {!showOrderConfirmation ? (
//           <>
//             <div className="w-[100%] md:w-[70%] border-r border-r-[#D7D7D780]">
//               <div className="w-full flex justify-center md:justify-start">
//                 <h2 className="font-ibm w-[90%] md:w-[713px] text-[22px] leading-[64px] tracking-[-0.04em] align-middle uppercase text-white">
//                   INFORMACIÓN
//                 </h2>
//               </div>
//               {!showAdditionalInputs ? (
//                 <div className="flex flex-col gap-8">
//                   <div className="h-[256px] flex flex-col justify-between items-center md:items-start">
//                     <input
//                       className="w-[90%] text-[14px] placeholder-white md:w-[713px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
//                       type="text"
//                       name="nombres"
//                       value={info.nombres}
//                       onChange={handleInfoChange}
//                       placeholder="Nombres"
//                     />
//                     <input
//                       className="w-[90%] text-[14px] placeholder-white md:w-[713px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
//                       type="text"
//                       name="apellidos"
//                       value={info.apellidos}
//                       onChange={handleInfoChange}
//                       placeholder="Apellidos"
//                     />
//                     <div className="w-[90%] md:w-[713px]">
//                       <input
//                         className={`w-full text-[14px] placeholder-white h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border ${emailError ? 'border-[#ff4d4f]' : 'border-[#F2F2F2]'} bg-[#F2F2F203] focus:outline-none focus:ring-2 focus:ring-white/50 text-white`}
//                         type="email"
//                         name="correo"
//                         value={info.correo}
//                         onChange={handleInfoChange}
//                         placeholder="Correo electrónico"
//                       />
//                       {emailError && <p className="error-message">{emailError}</p>}
//                     </div>
//                   </div>
//                   <div className="h-[400px] flex flex-col justify-between items-center md:items-start">
//                     <h2 className="font-ibm text-[22px] w-[90%] md:w-[713px] leading-[64px] tracking-[-0.04em] align-middle uppercase text-white">
//                       DIRECCIÓN DE ENVÍO
//                     </h2>
//                     <div className="flex justify-between w-[90%] md:w-[713px]">
//                       <input
//                         className="w-[109px] text-[14px] placeholder-white md:w-[139px] h-[48px] pr-[16px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
//                         name="codigoArea"
//                         value={address.codigoArea}
//                         onChange={handleAddressChange}
//                         placeholder="C. Área"
//                       />
//                       <div className="w-[205px] md:w-[558px]">
//                         <input
//                           className="w-full text-[14px] placeholder-white h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
//                           type="number"
//                           name="telefono"
//                           value={address.telefono}
//                           onChange={handleAddressChange}
//                           placeholder="Teléfono / Celular"
//                           onWheel={(e) => e.target.blur()}
//                         />
//                       </div>
//                     </div>
//                     <div className="flex justify-between w-[90%] md:w-[713px]">
//                       <div className="custom-dropdown">
//                         <div
//                           className="dropdown-button w-[109px] md:w-[100%]"
//                           onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                         >
//                           <span>{address.tipoDocumento}</span>
//                           <Image height={14} width={14} alt="flecha" src={'/check.svg'} />
//                         </div>
//                         {isDropdownOpen && (
//                           <div className="dropdown-menu">
//                             {documentOptions.map((option) => (
//                               <div
//                                 key={option}
//                                 className="dropdown-item backdrop-blur-[6px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A] focus:outline-none"
//                                 onClick={() => handleDocumentSelect(option)}
//                               >
//                                 {option}
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                       <div className="w-[205px] md:w-[558px]">
//                         <input
//                           className="w-full text-[14px] placeholder-white h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
//                           type="number"
//                           name="numeroDocumento"
//                           value={address.numeroDocumento}
//                           onChange={handleAddressChange}
//                           placeholder="Número de documento"
//                           onWheel={(e) => e.target.blur()}
//                         />
//                       </div>
//                     </div>
//                     <input
//                       className="w-[90%] text-[14px] placeholder-white md:w-[713px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
//                       type="text"
//                       name="pais"
//                       value={address.pais}
//                       onChange={handleAddressChange}
//                       placeholder="País / Región"
//                     />
//                     <input
//                       className="w-[90%] text-[14px] placeholder-white md:w-[713px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
//                       type="text"
//                       name="region"
//                       value={address.region}
//                       onChange={handleAddressChange}
//                       placeholder="Región / Provincia"
//                     />
//                     <div className="flex justify-between w-[90%] md:w-[713px]">
//                       <input
//                         className="w-[109px] text-[14px] placeholder-white md:w-[139px] h-[48px] pr-[16px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
//                         name="codigoPostal"
//                         value={address.codigoPostal}
//                         onChange={handleAddressChange}
//                         placeholder="C. Postal"
//                       />
//                       <input
//                         className="w-[205px] text-[14px] placeholder-white md:w-[558px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
//                         type="text"
//                         name="calle"
//                         value={address.calle}
//                         onChange={handleAddressChange}
//                         placeholder="Calle + Altura"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="mt-8 flex flex-col gap-4 items-center md:items-start info-section w-60-important md:w-[100%]">
//                   <div className="flex justify-between items-center w-[90%] md:w-[713px] h-[48px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] text-white">
//                     <div className="flex w-[82%] flex-row items-center">
//                       <span className="font-ibm-mono font-semibold text-[14px] tracking-[-0.04em] align-middle pr-3">Contacto</span>
//                       <span className="text-sm email-overflow">{info.correo}</span>
//                     </div>
//                     <button
//                       onClick={handleBack}
//                       className="text-white underline hover:text-gray-400 transition text-sm"
//                     >
//                       Cambiar
//                     </button>
//                   </div>
//                   <div className="flex justify-between items-center w-[90%] md:w-[713px] h-[48px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] text-white">
//                     <div className="flex w-[82%] flex-row items-center">
//                       <span className="font-ibm-mono font-semibold text-[14px] tracking-[-0.04em] align-middle pr-3">Envia a</span>
//                       <span className="text-sm email-overflow">{formattedAddress}</span>
//                     </div>
//                     <button
//                       onClick={handleBack}
//                       className="text-white underline hover:text-gray-400 transition text-sm"
//                     >
//                       Cambiar
//                     </button>
//                   </div>
//                   <div className="mt-8 w-full">
//                     <div className="w-full flex justify-center md:justify-start">
//                       <h2 className="font-ibm w-[90%] md:w-[713px] text-[22px] leading-[64px] tracking-[-0.04em] align-middle uppercase text-white">
//                         MÉTODO DE ENVÍO
//                       </h2>
//                     </div>
//                     <div className="flex flex-col gap-4 items-center md:items-start">
//                       <label className="flex justify-between items-center w-[90%] md:w-[713px] h-[48px] md:px-4 pr-4 pl-[0px] py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] text-white">
//                         <div className="flex items-center gap-2 w-[65%]">
//                           <input
//                             type="radio"
//                             name="shipping"
//                             value="Correo Argentino a Domicilio"
//                             data-cost="8000"
//                             checked={selectedShipping.name === 'Correo Argentino a Domicilio'}
//                             onChange={handleShippingChange}
//                             className="custom-radio mr-4 ml-4"
//                           />
//                           <span className="text-sm">Correo Argentino a Domicilio</span>
//                         </div>
//                         <span className="text-sm">ARS $8.000</span>
//                       </label>
//                       <p className="text-xs text-gray-400 w-[80%] md:w-[90%]">
//                         Una vez despachado el paquete, la gestión y entrega quedan a cargo de Correo Argentino.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div className="w-[100%] md:w-[713px] pt-[60px] flex-col-reverse h-[150px] md:flex-row flex items-center justify-between">
//                 {showAdditionalInputs ? (
//                   <>
//                     <button
//                       onClick={handleBack}
//                       className="inline-block pr-2 text-white underline hover:text-gray-400 transition"
//                     >
//                       Volver a editar información
//                     </button>
//                     <button
//                       onClick={generateOrder}
//                       className="text-white w-[90%] pb-[10px] md:w-[160px] h-[40px] gap-2 px-[12px] py-[6px] rounded-[2px] backdrop-blur-[6px] bg-[#0D0D0DE5] transition-all duration-200 hover:bg-[#2C2C2CE5] uppercase text-center"
//                     >
//                       Confirmar
//                     </button>
//                   </>
//                 ) : (
//                   <>
//                     <Link
//                       href="/"
//                       className="inline-block pr-2 text-white underline hover:text-gray-400 transition"
//                     >
//                       Continue shopping
//                     </Link>
//                     <button
//                       onClick={handleContinue}
//                       className={`text-white w-[90%] pb-[10px] md:w-[160px] h-[40px] gap-2 px-[12px] py-[6px] rounded-[2px] backdrop-blur-[6px] transition-all duration-200 uppercase text-center ${
//                         areAllFieldsFilled() ? 'bg-[#0D0D0DE5] hover:bg-[#2C2C2CE5]' : 'disabled-button'
//                       }`}
//                       disabled={!areAllFieldsFilled()}
//                     >
//                       Continuar
//                     </button>
//                   </>
//                 )}
//               </div>
//             </div>
//             <div className="w-[90%] md:w-[30%] pl-6">
//               <div className="divide-y divide-gray-400 text-white">
//                 {cart.map((item, index) => (
//                   <div
//                     key={`${item.id}-${item.color}-${item.size}`}
//                     className="relative w-full py-4 flex justify-between gap-4 pt-10"
//                   >
//                     <div className="w-24 h-24 relative">
//                       <Image
//                         src={'/products/' + item.image + '.webp'}
//                         alt={item.name}
//                         fill
//                         className="object-contain"
//                       />
//                     </div>
//                     <div className="flex flex-col gap-4">
//                       <h3 className="font-medium">{item.name.toUpperCase()}</h3>
//                       <div className="flex gap-2 items-center">
//                         <p className="text-xs">{item.color}</p>
//                         <p className="text-sm">|</p>
//                         <p className="text-xs">{item.size}</p>
//                       </div>
//                       <div className="flex gap-2 items-center">
//                         <p className="text-xs">Item:</p>
//                         <p className="text-xs">{item.quantity}</p>
//                       </div>
//                     </div>
//                     <div className="flex flex-col items-center">
//                       <div className="flex gap-2 items-center">
//                         <h3 className="font-medium text-md">ARS</h3>
//                         <span className="text-lg font-medium text-md">
//                           ${(item.price * item.quantity).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                         </span>
//                       </div>
//                       <div className="flex flex-col items-center">
//                         <span className="font-medium text-xs text-[#A2A2A2]">
//                           Precios sin impuestos:
//                         </span>
//                         <span className="font-medium text-xs text-[#A2A2A2]">
//                           ${((item.price * item.quantity) / 1.21).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//                 <div className="pt-10">
//                   <div className="w-full flex gap-2 items-center justify-between text-white">
//                     <span className="text-sm font-light">Subtotal</span>
//                     <div className="flex gap-2 items-center text-white">
//                       <h3 className="font-medium text-md">ARS</h3>
//                       <span className="text-lg font-medium text-md">
//                         ${totalPrice.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                       </span>
//                     </div>
//                   </div>
//                   {selectedShipping.name && (
//                     <div className="w-full flex gap-2 items-center justify-between text-white mt-4">
//                       <span className="text-sm font-light">Envío ({selectedShipping.name})</span>
//                       <div className="flex gap-2 items-center text-white">
//                         <h3 className="font-medium text-md">ARS</h3>
//                         <span className="text-lg font-medium text-md">
//                           ${selectedShipping.cost.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                         </span>
//                       </div>
//                     </div>
//                   )}
//                   <div className="w-full flex gap-2 items-center justify-between text-white mt-4">
//                     <span className="text-sm font-medium">Total</span>
//                     <div className="flex gap-2 items-center text-white">
//                       <h3 className="font-medium text-md">ARS</h3>
//                       <span className="text-lg font-medium text-md">
//                         ${(totalPrice + selectedShipping.cost).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="w-[100%] md:w-[100%] flex flex-col items-start p-[10px]">
//             <h2 className="font-ibm-mono text-[22px] sm:text-[28px] leading-[64px] tracking-[-0.75px] align-middle uppercase text-white mb-4">
//               Detalle de la Orden
//             </h2>
//             <div className="w-[100%] md:w-[100%] xl:w-[100%] border-r border-r-[#D7D7D780]">
//               {/* Order Details Section */}
//               <div className="p-[15px] text-white">
//                 <h3 className="font-ibm-mono text-[18px] leading-[24px] tracking-[-0.04em] uppercase text-white mb-4">
//                   Información del Cliente
//                 </h3>
//                 <div className="flex flex-col gap-2">
//                   <p className="text-sm">
//                     <span className="font-medium">ID de la Orden:</span> {orderId}
//                   </p>
//                   <p className="text-sm">
//                     <span className="font-medium">Nombre:</span> {info.nombres} {info.apellidos}
//                   </p>
//                   <p className="text-sm">
//                     <span className="font-medium">Correo Electrónico:</span> {info.correo}
//                   </p>
//                   <p className="text-sm">
//                     <span className="font-medium">Teléfono:</span> {address.codigoArea} {address.telefono}
//                   </p>
//                   <p className="text-sm">
//                     <span className="font-medium">Dirección de Envío:</span> {formattedAddress}
//                   </p>
//                 </div>
//               </div>
//               {/* Existing Cart Items and Totals */}
//               <div className="divide-y divide-gray-400 p-[10px] text-white">
//                 {cart.map((item, index) => (
//                   <div
//                     key={`${item.id}-${item.color}-${item.size}`}
//                     className="relative w-full py-4 flex justify-between gap-4 pt-10"
//                   >
//                     <div className="w-24 h-24 relative">
//                       <Image
//                         src={'/products/' + item.image + '.webp'}
//                         alt={item.name}
//                         fill
//                         className="object-contain"
//                       />
//                     </div>
//                     <div className="flex flex-col md:min-w-[190px] gap-4">
//                       <h3 className="font-medium">{item.name.toUpperCase()}</h3>
//                       <div className="flex gap-2 items-center">
//                         <p className="text-xs">{item.color}</p>
//                         <p className="text-sm">|</p>
//                         <p className="text-xs">{item.size}</p>
//                       </div>
//                       <div className="flex gap-2 items-center">
//                         <p className="text-xs">Item:</p>
//                         <p className="text-xs">{item.quantity}</p>
//                       </div>
//                     </div>
//                     <div className="flex flex-col items-center">
//                       <div className="flex gap-2 items-center">
//                         <h3 className="font-medium text-md">ARS</h3>
//                         <span className="text-lg font-medium text-md">
//                           ${(item.price * item.quantity).toLocaleString('es-ES', {
//                             minimumFractionDigits: 2,
//                             maximumFractionDigits: 2,
//                           })}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//                 <div className="pt-10">
//                   <div className="w-full flex gap-2 items-center justify-between text-white">
//                     <span className="text-sm font-light">Subtotal</span>
//                     <div className="flex gap-2 items-center text-white">
//                       <h3 className="font-medium text-md">ARS</h3>
//                       <span className="text-lg font-medium text-md">
//                         ${totalPrice.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                       </span>
//                     </div>
//                   </div>
//                   {selectedShipping.name && (
//                     <div className="w-full flex gap-2 items-center justify-between text-white mt-4">
//                       <span className="text-sm font-light">Envío ({selectedShipping.name})</span>
//                       <div className="flex gap-2 items-center text-white">
//                         <h3 className="font-medium text-md">ARS</h3>
//                         <span className="text-lg font-medium text-md">
//                           ${selectedShipping.cost.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                         </span>
//                       </div>
//                     </div>
//                   )}
//                   <div className="w-full flex gap-2 items-center justify-between text-white mt-4">
//                     <span className="text-sm font-medium">Total</span>
//                     <div className="flex gap-2 items-center text-white">
//                       <h3 className="font-medium text-md">ARS</h3>
//                       <span className="text-lg font-medium text-md">
//                         ${(totalPrice + selectedShipping.cost).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="w-[100%] md:w-[713px] xl:w-[100%] pr-[10px] pt-[60px] flex-col-reverse h-[150px] md:flex-row flex items-center justify-between">
//                 <button
//                   onClick={() => setShowOrderConfirmation(false)}
//                   className="inline-block pr-2 text-white underline hover:text-gray-400 transition text-sm"
//                 >
//                   Volver a editar
//                 </button>
//                 <button
//                   onClick={handlePayOrder}
//                   className="text-white w-[90%] pb-[10px] md:w-[160px] h-[40px] gap-2 px-[12px] py-[6px] rounded-[2px] backdrop-blur-[6px] bg-[#0D0D0DE5] transition-all duration-200 hover:bg-[#2C2C2CE5] uppercase text-center"
//                 >
//                   Pagar Orden
//                 </button>
//               </div>
//             </div>
//             <div className="w-[90%] md:w-[30%] pl-6">
//               {/* Empty div to maintain layout symmetry */}
//             </div>
//           </div>
//         )}
//       </div>
//       <div className="w-[90%] h-[315px] md:h-[415px] flex md:min-w-[1315px]">
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default OrderStep1;