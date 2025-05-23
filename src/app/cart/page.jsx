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
    totalItems,
    totalPrice,
  } = useCart();

  return (
    <div className="space-y-6 w-full mx-20">
      {cart.length === 0 ? (
        <div className="text-center py-12 border-b border-b-[#D7D7D7]">
          <p className="text-lg mb-4 uppercase text-white ">Your cart is empty </p>
          <div className="flex justify-center text-white">
          <Link
            href="/"
            className="text-white underline pr-[7px]"
          >
            Continue shopping 
          </Link>
           <p> to add items to your cart.</p>  </div>
        </div>
      ) : (
        <div className="flex flex-col gap-10 w-full">
          <div>
            <div className="divide-y divide-gray-400 mt-10 text-white">
              {cart.map((item, index) => (
                <div
                  key={`${item.id}-${item.color}-${item.size}`}
                  className="relative w-full py-4 flex justify-between gap-4 px-10 pt-10"
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

                  <div className="flex flex-col gap-4">
                    <div className="flex gap-2 items-center">
                      <h3 className="font-medium text-sm">Item:</h3>
                      <span className="px-4">{item.quantity}</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <button
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="px-2"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        className="px-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex gap-2 items-center">
                      <h3 className="font-medium text-md">ARS</h3>
                      <span className="text-lg font-medium text-md">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="font-medium text-xs text-[#A2A2A2]">
                        Precios sin inpuestos:
                      </span>
                      <span className="font-medium text-xs text-[#A2A2A2]">
                        ${(item.price / 1.21).toFixed(2)}
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
              <div className="w-full flex items-start justify-between px-10">
                <div className="flex-2 flex gap-4 items-start">
                  <div className="flex flex-col gap-2 max-w-[250px]">
                    <span className="text-sm font-light text-white">Shipping</span>
                    <span className="font-medium text-[10px] text-[#A2A2A2]">
                      Orders are normally dispatched within 24 hours Monday to
                      Friday.
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 max-w-[250px]">
                    <span className="text-sm font-light text-white">Returns</span>
                    <span className="font-medium text-[10px] text-[#A2A2A2]">
                      We offer returns for items in unworn condition within 14
                      days of delivery.
                    </span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-end">
                  <div className="w-full max-w-[250px] flex gap-2 items-center justify-between text-white">
                    <span className="text-sm font-light">Subtotal</span>
                    <div className="flex gap-2 items-center text-white">
                      <h3 className="font-medium text-md">ARS</h3>
                      <span className="text-lg font-medium text-md">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-1 mt-4">
                    <Link
                      href="/order"
                      className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition flex-1 text-center min-w-[100px]"
                    >
                      CHECKOUT
                    </Link>
                    <button
                      onClick={clearCart}
                      className="px-4 py-2 border text-white border-black rounded hover:bg-gray-100 hover:text-black transition min-w-[100px]"
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
    </div>
  );
}
