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

  // Estado para el método de envío seleccionado
  const [selectedShipping, setSelectedShipping] = useState('');

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
      setShowAdditionalInputs(true); // Mostrar nuevos inputs y ocultar los anteriores
    } else {
      alert('Por favor, completa todos los campos antes de continuar.');
    }
  };

  // Manejar el clic en "Volver a editar información"
  const handleBack = () => {
    setShowAdditionalInputs(false); // Volver a mostrar los inputs originales
  };

  // Manejar la selección del método de envío
  const handleShippingChange = (e) => {
    setSelectedShipping(e.target.value);
  };

  // Formatear la dirección para el campo "Enviar a"
  const formattedAddress = ` ${address.calle}, ${address.region}, ${address.pais} ${address.codigoPostal}.`;

  return (
    <div className="min-h-[100vh] w-full flex flex-col justify-center items-center pt-[150px]">
      {/* Estilos personalizados para los radio buttons */}
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
      `}</style>

      <div className="w-[100%] flex-col-reverse md:w-[85%] flex md:flex-row">
        <div className="w-[100%] md:w-[70%] border-r border-r-[#D7D7D780]">
          <h2 className="font-ibm w-[90%] md:w-[713px] text-[22px] leading-[64px] tracking-[-0.04em] align-middle uppercase text-white">
            INFORMACIÓN
          </h2>
          {!showAdditionalInputs ? (
            <div className="flex flex-col gap-8">
              <div className="h-[256px] flex flex-col justify-between items-center md:items-start">
                <input
                  className="w-[90%] md:w-[713px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                  type="text"
                  name="nombres"
                  value={info.nombres}
                  onChange={handleInfoChange}
                  placeholder="Nombres"
                />
                <input
                  className="w-[90%] md:w-[713px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                  type="text"
                  name="apellidos"
                  value={info.apellidos}
                  onChange={handleInfoChange}
                  placeholder="Apellidos"
                />
                <input
                  className="w-[90%] md:w-[713px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
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
                <div className="flex justify-between  w-[90%] md:w-[713px]">
                  <select
                    className="w-[109px] md:w-[139px] h-[48px] pr-[16px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                    name="codigoArea"
                    value={address.codigoArea}
                    onChange={handleAddressChange}
                  >
                    <option value="">C. Área</option>
                    <option value="+54">+54</option>
                    <option value="+1">+1</option>
                    {/* Agrega más opciones según sea necesario */}
                  </select>
                  <input
                    className="w-[205px] md:w-[558px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                    type="text"
                    name="telefono"
                    value={address.telefono}
                    onChange={handleAddressChange}
                    placeholder="Teléfono / Celular"
                  />
                </div>
                <div className="flex justify-between w-[90%] md:w-[713px]">
                  <select
                    className="w-[109px] md:w-[139px]  text-white h-[48px] pr-[16px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:ring-2 focus:ring-white/50"
                    name="tipoDocumento"
                    value={address.tipoDocumento}
                    onChange={handleAddressChange}
                  >
                    <option value="DNI">DNI</option>
                    <option value="Pasaporte">Pasaporte</option>
                  </select>
                  <input
                    className="w-[205px] md:w-[558px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                    type="text"
                    name="numeroDocumento"
                    value={address.numeroDocumento}
                    onChange={handleAddressChange}
                    placeholder="Número de documento"
                  />
                </div>
                <input
                  className="w-[90%] md:w-[713px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                  type="text"
                  name="pais"
                  value={address.pais}
                  onChange={handleAddressChange}
                  placeholder="País / Región"
                />
                <input
                  className="w-[90%] md:w-[713px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                  type="text"
                  name="region"
                  value={address.region}
                  onChange={handleAddressChange}
                  placeholder="Región / Provincia"
                />
                <div className="flex justify-between w-[90%] md:w-[713px]">
                  <select
                    className="w-[109px] md:w-[139px]  h-[48px] pr-[16px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                    name="codigoPostal"
                    value={address.codigoPostal}
                    onChange={handleAddressChange}
                  >
                    <option value="">C. Postal</option>
                    <option value="1000">1000</option>
                    <option value="2000">2000</option>
                    {/* Agrega más opciones según sea necesario */}
                  </select>
                  <input
                    className="w-[205px] md:w-[558px] h-[48px] gap-[10px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
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
            <div className="mt-8 flex flex-col gap-4">
              {/* Sección de Contacto y Enviar a */}
              <div className="flex justify-between items-center w-[90%] md:w-[713px] h-[48px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] text-white">
                <div className="flex flex-row">
                  <span className="font-ibm-mono font-semibold text-[14px]  tracking-[-0.04em] align-middle pr-3">Contacto</span>
                  <span className="text-sm">{info.correo}</span>
                </div>
                <button
                  onClick={handleBack}
                  className="text-white underline hover:text-gray-400 transition"
                >
                  Cambiar
                </button>
              </div>
              <div className="flex justify-between items-center w-[90%] md:w-[713px] h-[48px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] text-white">
                <div className="flex flex-row">
                  <span className="font-ibm-mono font-semibold text-[14px]  tracking-[-0.04em] align-middle pr-3">Enviar a</span>
                  <span className="text-sm">{formattedAddress}</span>
                </div>
                <button
                  onClick={handleBack}
                  className="text-white underline hover:text-gray-400 transition"
                >
                  Cambiar
                </button>
              </div>

              {/* Sección de Método de Envío */}
              <div className="mt-8">
                <h2 className="font-ibm text-[22px] leading-[64px] tracking-[-0.04em] align-middle uppercase text-white">
                  MÉTODO DE ENVÍO
                </h2>
                <div className="flex flex-col gap-4">
                  {/* Opción 1: Andreani a Domicilio */}
                  {/* <div className="flex justify-between items-center w-[713px] h-[48px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] text-white">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="shipping"
                        value="andreani"
                        checked={selectedShipping === 'andreani'}
                        onChange={handleShippingChange}
                        className="custom-radio"
                      />
                      <span className="text-sm">Andreani a Domicilio</span>
                    </div>
                    <span className="text-sm">ARS $16.000</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Lorem ipsum dolor sit amet consectetur adipiscing elit hendrerit felis nostra interdum, diam pretium turpis ut est libero dapibus vehicula purus sollicitudin
                  </p> */}

                  {/* Opción 2: Correo Argentino a Domicilio */}
                  <div className="flex justify-between items-center w-[90%] md:w-[713px] h-[48px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] text-white">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="shipping"
                        value="correo"
                        checked={selectedShipping === 'correo'}
                        onChange={handleShippingChange}
                        className="custom-radio"
                      />
                      <span className="text-sm">Correo Argentino a Domicilio</span>
                    </div>
                    <span className="text-sm">ARS $16.000</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Lorem ipsum dolor sit amet consectetur adipiscing elit hendrerit felis nostra interdum, diam pretium turpis ut est libero dapibus vehicula purus sollicitudin
                  </p>

                  {/* Opción 3: Retiro en sucursal */}
                  <div className="flex justify-between items-center w-[713px] h-[48px] px-4 py-2 rounded-[2px] border border-[#F2F2F2] bg-[#F2F2F203] text-white">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="shipping"
                        value="sucursal"
                        checked={selectedShipping === 'sucursal'}
                        onChange={handleShippingChange}
                        className="custom-radio"
                      />
                      <span className="text-sm">Retiro en sucursal</span>
                    </div>
                    <span className="text-sm">Gratis</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Lorem ipsum dolor sit amet consectetur adipiscing elit hendrerit felis nostra interdum, diam pretium turpis ut est libero dapibus vehicula purus sollicitudin
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="w-[100%] md:w-[713px] pt-[60px] flex-col-reverse h-[150px] md:flex-row flex items-center justify-between">
            {showAdditionalInputs ? (
              <button
                onClick={handleBack}
                className="inline-block pr-2 text-white underline hover:text-gray-400 transition"
              >
                Volver a editar información
              </button>
            ) : (
              <Link
                href="/"
                className="inline-block pr-2 text-white underline hover:text-gray-400 transition"
              >
                Continue shopping
              </Link>
            )}
            <button
              onClick={handleContinue}
              className="text-white w-[90%] pb-[10px] md:w-[160px] h-[40px] gap-2 px-[12px] py-[6px] rounded-[2px] backdrop-blur-[6px] bg-[#0D0D0DE5] transition-all duration-200 hover:bg-[#2C2C2CE5] uppercase text-center"
            >
              Continuar
            </button>
          </div>
        </div>
        <div className="w-[90%] md:w-[30%] pl-6">
          {/* Cart Products Section */}
          <div className="divide-y divide-gray-400 text-white">
            {cart.map((item, index) => (
              <div
                key={`${item.id}-${item.color}-${item.size}`}
                className="relative w-full py-4 flex justify-between gap-4 pt-10"
              >
                <div className="w-24 h-24 relative">
                  <Image
                    src={"/" + item.image + ".png"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="font-medium">{item.name.toUpperCase()}</h3>
                  <div className="flex gap-2 items-center">
                    <p className="text-xs">{item.color}</p>
                    <p className="text-sm">|</p>
                    <p className="text-xs">{item.size}</p>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex gap-2 items-center">
                    <h3 className="font-medium text-md">ARS</h3>
                    <span className="text-lg font-medium text-md">
                      ${item.price.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-medium text-xs text-[#A2A2A2]">
                      Precios sin impuestos:
                    </span>
                    <span className="font-medium text-xs text-[#A2A2A2]">
                      ${(item.price / 1.21).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
            </div>
          </div>
        </div>
      </div>
      <div className="h-[315px] flex min-w-[100%] md:min-w-[1315px]">
        <Footer />
      </div>
    </div>
  );
};

export default OrderStep1;