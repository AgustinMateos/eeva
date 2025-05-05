'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isProductCareOpen, setIsProductCareOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null); // Estado para el color seleccionado
  const [isShopLookOpen, setIsShopLookOpen] = useState(false); // Nuevo estado para el modal de Shop Look
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://eeva-api.vercel.app/api/v1/products/${id}`);
        setProduct(response.data);
        setLoading(false);
        // Seleccionar el primer color por defecto al cargar
        if (response.data.colors && response.data.colors.length > 0) {
          setSelectedColor(response.data.colors[0].color.name);
        }
      } catch (err) {
        setError('Error al cargar el producto');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>No se encontró el producto</div>;

  // Función para cerrar el modal al hacer clic fuera
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsSizeGuideOpen(false);
      setIsShopLookOpen(false); // Cerrar también el modal de Shop Look
    }
  };

  // Lista fija de tamaños
  const allSizes = ['S', 'M', 'L'];

  // Obtener stock para el color seleccionado
  const sizeStockMap = selectedColor
    ? product.colors
      .find(color => color.color.name === selectedColor)
      ?.sizes.reduce((acc, size) => {
        acc[size.size.name] = size.stock;
        return acc;
      }, {}) || {}
    : {};

  // Calcular precio con descuento
  const discountedPrice = product.discount
    ? product.price - (product.price * (product.discount / 100))
    : product.price;

  // Datos de ejemplo para la tabla (puedes personalizarlos)
  const tableHeaders = ['REF', 'MEDIDAS (CM)', 'S', 'M', 'L'];
  const tableData = [
    ['A', 'TOTAL LENGTH', '108', '109', '114'],
    ['A', 'TOTAL LENGTH', '108', '109', '114'],
    ['A', 'TOTAL LENGTH', '108', '109', '114'],
    ['A', 'TOTAL LENGTH', '108', '109', '114'],
    ['A', 'TOTAL LENGTH', '108', '109', '114'],
    ['A', 'TOTAL LENGTH', '108', '109', '114'],
    ['A', 'TOTAL LENGTH', '108', '109', '114'],
    ['A', 'TOTAL LENGTH', '108', '109', '114'],
    ['A', 'TOTAL LENGTH', '108', '109', '114'],
    ['A', 'TOTAL LENGTH', '108', '109', '114'],
  ];

  // Determinar el color de fondo basado en el nombre
  const getColorBackground = (colorName) => {
    switch (colorName.toUpperCase()) {
      case 'BLANCO':
        return '#FFFFFF';
      case 'NEGRO':
        return '#232323';
      default:
        return '#000000'; // Color por defecto si no coincide
    }
  };

  return (
    <div className="h-[1022px] flex justify-center items-center">
      <div className="h-[800px] w-[1232px] flex justify-between">


        {/*modelo */}
        <div className="w-[519px] h-[600px] relative">
          <Image
            src="/Nicolas-360.gif"
            alt="Animated GIF"
            layout="fill"
            objectFit="contain"
            className="z-0"
          />
          {/*info modelo */}
          <div className="absolute top-[20px] left-[-10px] w-[200px] text-white z-10 font-normal text-[12px] tracking-[-0.04em] align-middle pl-[1px]">
            <div className="w-[200px] h-[60px] flex flex-row items-end overflow-hidden mb-[20px]">
              {Array.from({ length: 40 }, (_, index) => {
                // Definir diferentes rangos de altura máxima de forma aleatoria
                const maxHeightOptions = [30, 40, 50, 60]; // Diferentes alturas máximas (mitad, 2/3, completo)
                const maxHeight = maxHeightOptions[Math.floor(Math.random() * maxHeightOptions.length)]; // Selecciona un máximo aleatorio
                const animationClass = `animate-pulseHeight-${maxHeight}`; // Clase de animación según la altura máxima
                const delay = Math.random() * 2; // Retraso aleatorio entre 0 y 2 segundos

                return (
                  <div
                    key={index}
                    className={`bg-white w-[2px] mx-[2px] transition-all ${animationClass}`}
                    style={{
                      height: `${Math.floor(Math.random() * maxHeight) + 10}px`, // Altura inicial aleatoria entre 10px y el máximo
                      animationDelay: `${delay}s`, // Retraso aleatorio para desincronizar
                    }}
                  ></div>
                );
              })}
            </div>

            <style jsx>{`
  /* Animación para altura máxima de 30px */
  @keyframes pulseHeight-30 {
    0% { height: 10px; }
    50% { height: 30px; }
    100% { height: 10px; }
  }
  .animate-pulseHeight-30 {
    animation: pulseHeight-30 2s ease-in-out infinite;
  }

  /* Animación para altura máxima de 40px */
  @keyframes pulseHeight-40 {
    0% { height: 10px; }
    50% { height: 40px; }
    100% { height: 10px; }
  }
  .animate-pulseHeight-40 {
    animation: pulseHeight-40 2s ease-in-out infinite;
  }

  /* Animación para altura máxima de 50px */
  @keyframes pulseHeight-50 {
    0% { height: 10px; }
    50% { height: 50px; }
    100% { height: 10px; }
  }
  .animate-pulseHeight-50 {
    animation: pulseHeight-50 2s ease-in-out infinite;
  }

  /* Animación para altura máxima de 60px */
  @keyframes pulseHeight-60 {
    0% { height: 10px; }
    50% { height: 60px; }
    100% { height: 10px; }
  }
  .animate-pulseHeight-60 {
    animation: pulseHeight-60 2s ease-in-out infinite;
  }
`}</style>
            <div className="relative"> {/* Contenedor relativo para las filas de texto */}
              <div className="absolute top-0 left-0 w-[1px] bg-gradient-to-r from-white to-[#BEBEBE] z-[-1]"
                style={{ height: '100%' }}></div> {/* Borde ajustado al contenedor interno */}
              <div className="pl-[20px]">
                <div className="flex justify-between">
                  <p>Nombre:</p> <p className="w-[48px]">{product.models.name}</p>
                </div>
                <div className="flex justify-between">
                  <p>Altura:</p> <p className="w-[48px]">{product.models.height}</p>
                </div>
                <div className="flex justify-between">
                  <p>Peso:</p> <p className="w-[48px]">{product.models.weight} kg.</p>
                </div>
                <div className="flex justify-between">
                  <p>Talle:</p> <p className="w-[48px]">{product.models.size.name}</p>
                </div>
                <div className="flex justify-between">
                  <p>Piel:</p> <p className="w-[48px]">{product.models.skin}</p>
                </div>
                <div className="flex justify-between">
                  <p>Género:</p> <p className="w-[48px]">{product.models.gender}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="text-[#FCFDFD] w-[519px] flex flex-col">
          <div className="flex items-center">
            <p className="h-[40px] w-[100%] px-4 border uppercase flex items-center">
              Camisa Oversize
            </p>
          </div>
          <div className="h-[120px] flex justify-evenly flex-col">
            <div className="flex items-center">
              <div className="w-[60px] h-[25px] px-4 gap-[10px] border rounded-[2px] bg-[#FCFDFD] text-[#232323] mr-[10px]">
                <p className="font-normal text-[16px] tracking-[-0.04em] align-middle">{product.discount || 30}%</p>
              </div>
              <div className="flex items-baseline">
                <p className="uppercase mr-1">Ars $</p>
                <span className="line-through text-gray-400">{product.price.toFixed(2)}</span>
              </div>
            </div>
            {/* Precio con descuento */}
            <div className="flex items-baseline">
              <p className="uppercase mr-1">Ars $</p>
              <span>{discountedPrice.toFixed(2)}</span>
            </div>
            <div>
              <p>3 cuotas sin interés en bancos seleccionados</p>
            </div>
          </div>
          <div className="h-[213px] w-full">
            <div>
              <p className="uppercase">Color</p>
              <div className="flex w-[17%] justify-between mt-2">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color.color.name)}
                    className="w-[40px]  h-[40px] p-1  rounded-[20px] border"
                    style={{
                      backgroundColor: getColorBackground(color.color.name),
                      borderColor: selectedColor === color.color.name ? '#FFFFFF' : 'transparent',
                      borderWidth: selectedColor === color.color.name ? '2px' : '1px',
                    }}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="uppercase">Size</p>
              <div>
                <div>
                  <div className="flex gap-2 mt-2">
                    {allSizes.map((size, index) => {
                      const stock = sizeStockMap[size] || 0; // Si no existe el tamaño, stock es 0
                      return (
                        <button
                          key={index}
                          className={`w-[40px] h-[40px] p-[10px] lowercase border-white border-[0.5px] rounded-[1px] text-white ${stock <= 0 ? 'line-through opacity-50' : ''
                            }`}
                          disabled={stock <= 0} // Deshabilitar si no hay stock
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-white cursor-pointer flex w-full justify-between mt-2"
                  >
                    Size guide
                    <Image
                      src="/flechamobilediagonal.svg"
                      width={24}
                      height={24}
                      alt="diagonal arrow"
                      className="ml-2"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <p className="w-[344px] h-[40px] gap-2 px-[12px] py-[6px] rounded-[2px] backdrop-blur-[6px] bg-[#0D0D0DE5] uppercase text-center">
              + Add to bag
            </p>
            <button
              onClick={() => setIsShopLookOpen(true)}
              className="w-[140px] h-[40px] gap-2 px-[20px] py-[6px] border border-white rounded-[2px] bg-[#A8A8A81A] backdrop-blur-[6px] uppercase"
            >
              Shop Look
            </button>
          </div>
          {/* Dropdown para Details */}
          <div className="mt-2">
            <button
              onClick={() => setIsDetailsOpen(!isDetailsOpen)}
              className="w-full text-left flex justify-between h-[30px] items-center uppercase"
            >
              <span>Details</span>
              <Image
                src={isDetailsOpen ? '/flechamobileup.svg' : '/flechamobiledown.svg'}
                width={24}
                height={24}
                alt={isDetailsOpen ? 'arrow up' : 'arrow down'}
              />
            </button>
            {isDetailsOpen && (
              <div className="font-normal text-[12px] leading-[100%] tracking-[-0.04em] text-justify align-middle">
                <p>
                  Campera técnica de mujer, confeccionada en 100% nylon, con una silueta abombada que aporta volumen y una construcción marcada por múltiples rectores en ángulos rectos, reforzando una estética de fuerza y modernidad. Diseñada para definir la silueta y transmitir precisión visual, cuenta con cuello alto y cierre medio, equilibrando funcionalidad y estilo. Su diseño en blanco hueso y negro resalta los contrastes y potencia su impacto visual.
                </p>
                <p>
                  Las telas fueron cuidadosamente seleccionadas para garantizar la mejor calidad y durabilidad, utilizando materiales importados que elevan el nivel de la prenda.
                </p>
              </div>
            )}
          </div>
          {/* Dropdown para Product Care */}
          <div className="mt-2">
            <button
              onClick={() => setIsProductCareOpen(!isProductCareOpen)}
              className="w-full text-left flex justify-between items-center uppercase h-[30px]"
            >
              <span>Product Care</span>
              <Image
                src={isProductCareOpen ? '/flechamobileup.svg' : '/flechamobiledown.svg'}
                width={24}
                height={24}
                alt={isProductCareOpen ? 'arrow up' : 'arrow down'}
              />
            </button>
            {isProductCareOpen && (
              <div className="font-normal text-[12px] leading-[100%] tracking-[-0.04em] text-justify align-middle">
                <p>
                  Campera técnica de mujer, confeccionada en 100% nylon, con una silueta abombada que aporta volumen y una construcción marcada por múltiples rectores en ángulos rectos, reforzando una estética de fuerza y modernidad. Diseñada para definir la silueta y transmitir precisión visual, cuenta con cuello alto y cierre medio, equilibrando funcionalidad y estilo. Su diseño en blanco hueso y negro resalta los contrastes y potencia su impacto visual.
                </p>
                <p>
                  Las telas fueron cuidadosamente seleccionadas para garantizar la mejor calidad y durabilidad, utilizando materiales importados que elevan el nivel de la prenda.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Modal de Shop Look */}
      {isShopLookOpen && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50"
    onClick={handleOverlayClick}
  >
    <div className="w-[1062px] h-[655px] border-[#f2f2f2] border-[0.5px] bg-[#83838366] rounded-[6px] pt-[32px] pr-[40px] pb-[32px] pl-[40px] gap-[32px] backdrop-blur-[30px] relative">
      <div className="w-full h-[60px] flex justify-center items-center">
        <div className="w-[950px] h-[32px]">
          <h2 className="font-medium text-[14px] leading-[14px] tracking-[0.1em] uppercase text-[#f2f2f2]">
            SHOP ALL THE LOOK
          </h2>
          <button
            onClick={() => setIsShopLookOpen(false)}
            className="absolute top-[32px] right-[40px] text-gray-500 hover:text-gray-700"
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

      <div className="flex w-full h-[523px] justify-center items-center">
        <div className="h-full w-full flex flex-col items-center justify-between">
          {/* Contenedor de productos */}
          <div className="flex justify-between w-full h-[400px]">
            {/* Producto 1 */}
            <div className="w-[300px] h-full rounded-[6px] flex flex-col items-center justify-between p-4">
              <Image
                src="/product1.jpg" // Reemplaza con la ruta de la imagen del producto 1
                alt="Product 1"
                width={200}
                height={250}
                className="object-cover"
              />
              <p className="text-white text-[14px] uppercase mt-2">Native Iron Trunk</p>
              <p className="text-white text-[14px]">ARS $128.000</p>
              <div className="flex space-x-2 mt-2">
                <div className="w-4 h-4  rounded-full"></div>
                <div className="w-4 h-4  rounded-full"></div>
                <div className="w-4 h-4  rounded-full"></div>
              </div>
              <div className="flex space-x-2 mt-2">
                <button className="w-[40px] h-[40px] p-[10px] lowercase border-white border-[0.5px] rounded-[1px] text-white">S</button>
                <button className="w-[40px] h-[40px] p-[10px] lowercase border-white border-[0.5px] rounded-[1px] text-white">M</button>
                <button className="w-[40px] h-[40px] p-[10px] lowercase border-white border-[0.5px] rounded-[1px] text-white">L</button>
              </div>
              <div className='w-[207px] mt-[20px] h-[40px] px-[20px] py-[6px] gap-2 rounded-[2px] border border-white bg-[#A8A8A81A]'>
                <button className="w-full   text-white  uppercase">
                + Add
              </button></div>
            </div>

            {/* Producto 2 */}
            <div className="w-[300px] h-full  rounded-[6px] flex flex-col items-center justify-between p-4">
              <Image
                src="/product2.jpg" // Reemplaza con la ruta de la imagen del producto 2
                alt="Product 2"
                width={200}
                height={250}
                className="object-cover"
              />
              <p className="text-white text-[14px] uppercase mt-2">Native Iron Trunk</p>
              <p className="text-white text-[14px]">ARS $128.000</p>
              <div className="flex space-x-2 mt-2">
                <div className="w-4 h-4  rounded-full"></div>
                <div className="w-4 h-4  rounded-full"></div>
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <div className="flex space-x-2 mt-2">
                <button className="w-[40px] h-[40px] p-[10px] lowercase border-white border-[0.5px] rounded-[1px] text-white">S</button>
                <button className="w-[40px] h-[40px] p-[10px] lowercase border-white border-[0.5px] rounded-[1px] text-white">M</button>
                <button className="w-[40px] h-[40px] p-[10px] lowercase border-white border-[0.5px] rounded-[1px] text-white">L</button>
              </div>
              <div className='w-[207px] mt-[20px] h-[40px] px-[20px] py-[6px] gap-2 rounded-[2px] border border-white bg-[#A8A8A81A]'>
                <button className="w-full   text-white  uppercase">
                + Add
              </button></div>
            </div>

            {/* Producto 3 */}
            <div className="w-[300px] h-full  rounded-[6px] flex flex-col items-center justify-between p-4">
              <Image
                src="/product3.jpg" // Reemplaza con la ruta de la imagen del producto 3
                alt="Product 3"
                width={200}
                height={250}
                className="object-cover"
              />
              <p className="text-white text-[14px] uppercase mt-2">Native Iron Trunk</p>
              <p className="text-white text-[14px]">ARS $128.000</p>
              <div className="flex space-x-2 mt-2">
                <div className="w-4 h-4  rounded-full"></div>
                <div className="w-4 h-4  rounded-full"></div>
                <div className="w-4 h-4  rounded-full"></div>
              </div>
              <div className="flex space-x-2 mt-2 ">
                <button className="w-[40px] h-[40px] p-[10px] lowercase border-white border-[0.5px] rounded-[1px] text-white">S</button>
                <button className="w-[40px] h-[40px] p-[10px] lowercase border-white border-[0.5px] rounded-[1px] text-white">M</button>
                <button className="w-[40px] h-[40px] p-[10px] lowercase border-white border-[0.5px] rounded-[1px] text-white">L</button>
              </div>
              <div className='w-[207px] mt-[20px] h-[40px] px-[20px] py-[6px] gap-2 rounded-[2px] border border-white bg-[#A8A8A81A]'>
                <button className="w-full   text-white  uppercase">
                + Add
              </button></div>
              
            </div>
          </div>

          {/* Botón Finish Adding */}
          <div className='w-[889px] flex justify-end'> <button className="w-[208px] h-[40px] px-[20px] py-[6px] gap-2 rounded-[2px] bg-[#0D0D0DE5] backdrop-blur-[6px]">
            <p className='font-medium text-[14px] leading-[14px] tracking-[0.1em] uppercase text-[#F2F2F2]'>Finish Adding</p>
          </button> </div>
          
        </div>
      </div>
    </div>
  </div>
)}
      {/* Modal de Size Guide */}
      {isSizeGuideOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50"
          onClick={handleOverlayClick}
        >
          <div className="w-[1062px] h-[524px] border-[#f2f2f2] border-[0.5px] bg-[#83838366] rounded-[6px] relative">
            <div className="w-full h-[60px] mt-[40px] flex justify-center items-center">
              <div className="w-[950px] h-[32px]">
                <h2 className="font-medium text-[14px] leading-[14px] tracking-[0.1em] uppercase text-[#f2f2f2]">
                  Size Guide
                </h2>
                <button
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="absolute top-[55px] right-[40px] text-gray-500 hover:text-gray-700"
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

            <div className="flex w-full h-[400px] justify-center items-center">
              <div className="h-[356px] w-[1002px] flex">
                <div
                  className="w-[40%] h-[100%]"
                  style={{
                    backgroundImage: "url('/sizeguidepantalon.svg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                ></div>
                <div className="w-[60%] h-[100%] overflow-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-white">
                        {tableHeaders.map((header, index) => (
                          <th
                            key={index}
                            className="px-4 py-2 font-medium text-[14px] leading-[14px] tracking-[0.1em] uppercase"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row, rowIndex) => (
                        <tr key={rowIndex} className="text-white">
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-4 py-2 font-normal text-[14px] leading-[14px] tracking-[0.1em] uppercase"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;