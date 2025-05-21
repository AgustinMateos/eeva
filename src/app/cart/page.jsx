"use client";

import { useCart } from "@/components/context/CartContext";
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
    <div className="space-y-6">
      {cart.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg mb-4">Tu carrito está vacío</p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
          >
            Seguir comprando
          </Link>
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-200">
            {cart.map((item, index) => (
              <div
                key={`${item.id}-${item.color}-${item.size}`}
                className="py-4 flex gap-4"
              >
                <div className="w-24 h-24 relative">
                  <Image
                    src={"/" + item.image + ".png"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">Color: {item.color}</p>
                  <p className="text-sm text-gray-600">Talla: {item.size}</p>
                  <p className="text-sm">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex flex-col items-end">
                  <button
                    onClick={() => removeFromCart(index)}
                    className="text-red-500 text-sm"
                  >
                    Eliminar
                  </button>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => updateQuantity(index, item.quantity - 1)}
                      className="px-2 border rounded-l"
                    >
                      -
                    </button>
                    <span className="px-4 border-t border-b">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(index, item.quantity + 1)}
                      className="px-2 border rounded-r"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-medium">
              <span>Total ({totalItems} items):</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={clearCart}
                className="px-4 py-2 border border-black rounded hover:bg-gray-100 transition"
              >
                Vaciar carrito
              </button>
              <Link
                href="/checkout"
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition flex-1 text-center"
              >
                Proceder al pago
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
