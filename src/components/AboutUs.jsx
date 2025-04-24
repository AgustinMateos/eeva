import Footer from "./Footer"
const AboutUs = () => {
    return (
        <div className="min-h-[100vh] w-full flex flex-col justify-center items-center pt-[150px]">
            <div className="w-[80%]">
                <div className="w-[100%] md:w-[720px] text-[#F2F2F2]">
                    <div >
                        <h3 className="font-normal text-[28px] leading-[64px] tracking-[-0.04em]">OBJETIVO</h3>
                        <br />
                        <p>Nuestro objetivo en cada colección es poder transmitir una narrativa única mediante nuestras prendas,
                            brindando emociones y sensaciones que conecten con la esencia de quienes las usan. Cada pieza está diseñada
                            para contar una historia, enfocándose en la cohesión estética y en el poder de los detalles.
                        </p>
                        <br />
                        <p >

                            En Eeva, entendemos el diseño como una experiencia sensorial, donde la estética no solo se ve, sino que también se siente.
                            Nuestra misión
                            es crear productos que conecten con quienes buscan algo auténtico, sofisticado y emocionalmente resonante.
                        </p>
                    </div>

                    <br />
                    <br />

                    <div >
                        <h3 className="font-normal text-[28px] leading-[64px] tracking-[-0.04em]">ACERCA DE NOSOTROS</h3>
                        <br />
                        <p>Eeva es un estudio de diseño con base en Buenos Aires, Argentina, fundado en 2025. Más que una marca, somos una expresión artística que busca contar historias a través del diseño, creando estéticas que representan emociones y sensaciones.
                        </p>
                        <br />
                        <p >

                            El nombre Eeva nace de la frase Engaging Experimental Vision in Artistry (Impulsando la Visión Experimental en la Artesanía), reflejando nuestra pasión por explorar nuevas formas de expresión visual.
                        </p>
                    </div>


                    <br />
                    <br />

                    <div >
                        <h3 className="font-normal text-[28px] leading-[34px] md:leading-[64px] tracking-[-0.04em]">EL VALOR DE EEVA STUDIOS</h3>
                        <br />
                        <p>En EEVA STUDIOS, cada precio es estratégicamente seleccionado con un propósito claro. No solo refleja la complejidad del diseño y la calidad de los materiales, sino también la exclusividad de cada prenda. Creemos que el lujo no es solo lo que se ve, sino también lo que se siente: la experiencia, la historia detrás de cada colección y el nivel de detalle en cada aspecto de la marca.
                        </p>
                        <br />
                        <p >

                            ada decisión nos permite seguir innovando y evolucionando, creando piezas cada vez más únicas y elevando la experiencia del consumidor. Desde la confección hasta el empaquetado, todo en EEVA STUDIOS está diseñado para destacar, para ofrecer algo más que ropa: una identidad, una visión, un estándar de calidad que trasciende el producto.
                        </p>
                        <br />
                        <p>Entendemos que el diseño no se detiene. Si bien buscamos la excelencia en cada colección, siempre hay espacio para mejorar, para experimentar y para sorprender. Es este compromiso con la evolución lo que nos mantiene en constante crecimiento, asegurando que cada prenda no solo vista, sino que comunique algo más.</p>
                    </div>
                    <br />
                    <br />

                    <div >
                        <h3 className="font-normal text-[28px] leading-[64px] tracking-[-0.04em]">POLÍTICA DE CAMBIOS</h3>
                        <br />
                        <p>Productos que aceptamos para cambio</p>
                        <ul>
                            <li>• Prendas sin uso, sin lavar y en perfecto estado.</li>
                            <li>• Con etiquetas originales adheridas y en su empaque original.</li>
                            <li>• Si el producto vino con caja, debe ser devuelto en la misma caja y en buen estado.</li>
                            <li>• Se aceptan cambios dentro de los 30 días posteriores a la compra.</li>
                        </ul>
                        <br/>
                        <p>Productos que no aceptamos para cambio</p>
                        <ul>
                            <li>	•	Bombachas y prendas íntimas por razones de higiene.</li>
                            <li>•	Prendas con signos de uso, lavado o alteraciones.</li>
                            <li>	•	Productos en promoción o en liquidación, salvo defecto de fábrica.</li>
                            
                        </ul>
                        <br />
                        <p>Productos que aceptamos para cambio</p>
                        <ul>
                            <li>• Prendas sin uso, sin lavar y en perfecto estado.</li>
                            <li>• Con etiquetas originales adheridas y en su empaque original.</li>
                            <li>• Si el producto vino con caja, debe ser devuelto en la misma caja y en buen estado.</li>
                            <li>• Se aceptan cambios dentro de los 30 días posteriores a la compra.</li>
                        </ul>
                        <br/>
                        <p>Cambios por talle</p>
                        <ul>
                            <li>	•	Si el cliente solicita un cambio por talle y no hay disponibilidad del talle deseado, se le otorgará un cupón por el monto de la prenda para utilizar en otra compra.</li>
                            <li>	•	Para gestionar el cambio, la prenda debe ser devuelta en perfectas condiciones, junto con su empaquetado original.</li>
                          
                            
                        </ul>
                        <br/>
                        <p>Proceso de cambio</p>
                        <ul>
                          <li>	1.	Enviar un correo a contacto@eevastudios.com con el número de pedido y motivo del cambio.</li>
                          <li>	2.	También pueden comunicarse a través de Instagram (@eevastudios) para consultas rápidas.</li>
                          <li>	3.	Una vez aprobado, te enviaremos instrucciones para el envío o entrega del producto.</li>
                          <li>	4.	Si la prenda cumple con las condiciones, se gestionará el cambio o la emisión del cupón según corresponda.</li>
                            
                        </ul>
                        <br/>
                        <br/>
                        <p>Importante: Los costos de envío por cambios corren por cuenta del cliente, salvo que se trate de un error de nuestra parte o un defecto de fábrica.</p>
                        <br/>
                        <p>Si tenés alguna duda, podés contactarnos en contacto@eevastudios.com o por Instagram en @eevastudios.</p>
                    </div>

                </div>

            </div>
            <div className="h-[315px] flex min-w-[100%]  md:min-w-[1315px]">
                <Footer />
            </div>
        </div>
    )
}

export default AboutUs