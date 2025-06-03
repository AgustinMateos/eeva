"use client";

import { useCart } from "@/components/context/CartContext";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice,
    lastProductOpen,
    setLastProductOpen,
    confirmRemoveLastItem,
  } = useCart();

  return (
    <div className="space-y-6 w-full mx-20">
      {cart.length === 0 ? (
        <div className="flex flex-col gap-10 w-full">
          <div>
            <div className="divide-y divide-gray-400 mt-10 text-white">
              <div className="text-center py-12">
                <p className=" mb-4 font-ibm-mono font-normal text-[32px] leading-[64px] tracking-[-0.04em] text-center align-middle uppercase">
                  Your cart is empty
                </p>
                <Link
                  href="/"
                  className="inline-block pr-2 text-white underline hover:text-gray-400 transition"
                >
                  Continue shopping
                </Link>
                to add items to your cart.
              </div>
            </div>
            <div className="border-gray-400 border-t pt-10 mb-10">
              <div className="w-full flex items-start justify-between px-10">
                <div className="flex-2 flex gap-4 items-start">
                  <div className="flex flex-col gap-2 max-w-[250px]">
                    <span className="text-sm font-light text-white">
                      Envíos
                    </span>
                    <span className="font-medium text-[10px] text-[#A2A2A2]">
                      Los pedidos normalmente se envían dentro de los 3 días
                      habiles.
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 max-w-[250px]">
                    <span className="text-sm font-light text-white">
                      Devoluciones
                    </span>
                    <span className="font-medium text-[10px] text-[#A2A2A2]">
                      Ofrecemos devoluciones de artículos sin usar dentro de los
                      30 días posteriores a la entrega.
                    </span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-end">
                  <div className="w-full max-w-[250px] flex gap-2 items-center justify-between text-white">
                    <span className="text-sm font-light">Subtotal</span>
                    <div className="flex gap-2 items-center text-white">
                      <h3 className="font-medium text-md">ARS</h3>
                      <span className="text-lg font-medium text-md">
                        $
                        {totalPrice.toLocaleString("es-ES", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-1 mt-4">
                    <button
                      className="px-4 py-2 bg-black text-gray-400 rounded flex-1 text-center min-w-[100px]"
                      disabled
                    >
                      CHECKOUT
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full mb-4">
            <Footer />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-10 w-full">
          <div>
            <div className="divide-y divide-gray-400 mt-10 text-white w-[90%] lg:w-full mx-auto">
              {cart.map((item, index) => (
                <div
                  key={`${item.id}-${item.color}-${item.size}`}
                  className="relative w-full py-4 flex flex-col lg:flex-row lg:justify-between items-center gap-4 px-10 pt-10"
                >
                  <div className="flex gap-4 lg:flex-row lg:gap-20 lg:hidden w-full justify-center">
                    <div className="flex-1 flex justify-end items-center">
                      <div className="w-24 h-24 relative">
                        <Image
                          src={"/products/" + item.image + ".webp"}
                          alt={item.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-4">
                      <h3 className="font-medium">{item.name.toUpperCase()}</h3>
                      <div className="flex gap-2 items-center">
                        <p className="text-xs">{item.color}</p>
                        <p className="text-sm">|</p>
                        <p className="text-xs">{item.size}</p>
                      </div>
                    </div>
                  </div>
                  <div className="hidden lg:flex lg:flex-1 relative">
                    <div className="w-24 h-24 relative">
                      <Image
                        src={"/products/" + item.image + ".webp"}
                        alt={item.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div className="hidden lg:flex lg:flex-1 flex-col gap-4">
                    <h3 className="font-medium">{item.name.toUpperCase()}</h3>
                    <div className="flex gap-2 items-center">
                      <p className="text-xs">{item.color}</p>
                      <p className="text-sm">|</p>
                      <p className="text-xs">{item.size}</p>
                    </div>
                  </div>

                  <div className="lg:flex-1 flex lg:flex-col gap-4">
                    <div className="flex gap-2 items-center">
                      <h3 className="font-medium text-sm">Item:</h3>
                      <span className="px-4">{item.quantity}</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <button
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="pr-2"
                      >
                        Agregar
                      </button>
                      <button
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        className="px-2"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                  <div className="lg:flex-1 flex flex-col items-center">
                    <div className="flex gap-2 items-center">
                      <h3 className="font-medium text-md">ARS</h3>
                      <span className="text-lg font-medium text-md">
                        $
                        {item.price.toLocaleString("es-ES", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="font-medium text-xs text-[#A2A2A2]">
                        Precios sin inpuestos:
                      </span>
                      <span className="font-medium text-xs text-[#A2A2A2]">
                        $
                        {(item.price / 1.21).toLocaleString("es-ES", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(index)}
                    className="absolute top-2 right-2 text-md"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            <div className="border-gray-400 border-t pt-10 mb-10">
              <div className="w-full flex flex-col-reverse lg:flex-row items-center lg:items-start justify-between px-10">
                <div className="flex-2 flex flex-wrap gap-4 items-center justify-center pt-10 lg:pt-0 lg:items-start">
                  <div className="flex flex-col gap-2 max-w-[250px]">
                    <span className="text-sm font-light text-white">
                      Envíos
                    </span>
                    <span className="font-medium text-[10px] text-[#A2A2A2]">
                      Los pedidos normalmente se envían dentro de los 3 días
                      habiles.
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 max-w-[250px]">
                    <span className="text-sm font-light text-white">
                      Devoluciones
                    </span>
                    <span className="font-medium text-[10px] text-[#A2A2A2]">
                      Ofrecemos devoluciones de artículos sin usar dentro de los
                      30 días posteriores a la entrega.
                    </span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col md:flex-row lg:flex-col items-end md:items-center lg:items-end gap-4 lg:gap-0">
                  <div className="w-full max-w-[250px] flex gap-2 items-center justify-between text-white">
                    <span className="text-sm font-light">Subtotal</span>
                    <div className="flex gap-2 items-center text-white">
                      <h3 className="font-medium text-md">ARS</h3>
                      <span className="text-lg font-medium text-md">
                        $
                        {totalPrice.toLocaleString("es-ES", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-row gap-4 lg:gap-1 mt-4 md:mt-0 lg:mt-4">
                    <Link
                      href="/order"
                      className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition flex-1 text-center min-w-[100px]"
                    >
                      CHECKOUT
                    </Link>
                    <button
                      onClick={clearCart}
                      className="px-4 py-2 border text-white border-white rounded hover:bg-gray-100 hover:text-black transition min-w-[100px]"
                    >
                      Vaciar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full mb-4">
            <Footer />
          </div>
        </div>
      )}
      {lastProductOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto"
          onClick={() => setLastProductOpen(false)}
        >
          <div className="w-[70%] min-w-[300px] max-w-[1062px] mx-4 my-8 sm:mx-6 md:mx-8 bg-[#83838366] border-[#f2f2f2] border-[0.5px] rounded-[6px] pt-8 pb-6 px-4 sm:px-6 md:px-10 gap-6 backdrop-blur-[30px] relative min-h-[300px] max-h-[90vh] overflow-y-auto">
            <div className="w-full h-[30px] md:h-[60px] flex justify-center items-center">
              <div className="w-full max-w-[950px] h-[32px] flex justify-between items-center px-4">
                <h2 className="font-medium text-sm sm:text-base md:text-[14px] leading-tight tracking-[0.1em] uppercase text-[#f2f2f2]">
                  QUITAR PRODUCTO
                </h2>
                <button
                  onClick={() => setLastProductOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Image
                    src="/crossSize.svg"
                    width={16}
                    height={16}
                    alt="close modal"
                    className="ml-2"
                  />
                </button>
              </div>
            </div>
            <div className="w-full px-4 flex flex-col gap-4 mt-4">
              <h2 className="font-bold-medium text-white">¡Tu carrito quedará vacío!</h2>
              <p className="font-light text-xs text-white">
                Este es el último producto en tu carrito. Si lo eliminas, no
                quedará nada en él. ¿Seguro que quieres continuar?
              </p>
            </div>
            <div className="w-full px-4 flex items-center justify-end gap-2 mt-10">
              <button
                onClick={() => setLastProductOpen(false)}
                className="px-4 py-2 border text-white border-white rounded hover:bg-gray-100 hover:text-black transition text-sm"
              >
                CANCELAR
              </button>
              <button
                onClick={confirmRemoveLastItem}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition text-center text-sm"
              >
                QUITAR ITEM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
