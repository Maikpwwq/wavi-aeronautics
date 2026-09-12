'use client'

/**
 * Blog Posts Data
 * Centralized content for all blog articles and technical guides
 */

export const blogPosts = [
    {
        id: 'primera-vez-piloto-fpv',
        title: '¿Qué debes tener en cuenta en tu primera vez como piloto FPV?',
        excerpt: 'Experimentar la sensación de volar en primera persona te permitirá ver lo que observa la cámara sobre el drone.',
        image: '/images/blog/fpv-pilot.jpg',
        category: 'Guía para principiantes',
        date: '2024-01-15',
        readTime: '8 min',
        author: 'Michael Arias',
        avatar: '',
        content: [
            {
                type: 'paragraph',
                text: 'Experimentar la sensación de volar en primera persona, te permitira ver lo que observa la cámara sobre el drone, esa conexión con la ubicación real del cuadricoptero en vuelo hará sentir que sales del cuerpo.'
            },
            {
                type: 'section',
                title: 'Regulación en Colombia',
                paragraphs: [
                    {
                        text: 'En Colombia, volar de forma legal es un acto regulado bajo el RAC 100 para muchos casos requiere de un <a href="https://www.aerocivil.gov.co/publicaciones/3959/usuarios-registrados-ua/" target="_blank" rel="noopener noreferrer">Certificado de Idoneidad</a> y de <a href="https://sgdea.aerocivil.gov.co/ControlPQR/Tramites" target="_blank" rel="noopener noreferrer">permiso de vuelo</a> emitido por la Aeronáutica Civil. Entre 200 g hasta los 25 kg debes registrar tu equipo obligatoriamente en el SiRT.',
                        isHtml: true
                    },
                    {
                        text: 'Consulta además el <a href="https://aerocivil.maps.arcgis.com/apps/instant/media/index.html?appid=b4be4d501c8d4bcabd0c35297521c16e&center=-74.3578;4.7377&level=10" target="_blank" rel="noopener noreferrer">mapa de Zonas de No Vuelo Dron (ZNVD)</a> donde la presencia es una amenaza, como son cercanías a Aeropuertos, Bases Militares, Estaciones de Policia, Parques Nacionales Naturales.',
                        isHtml: true
                    },
                    {
                        text: 'Si bien puedes darle un uso puramente recreativo en categoría abierta, eres legalmente responsable de cualquier daño. Se sugiere contar con una póliza de responsabilidad civil; un error técnico puede costar más de lo que imaginas.'
                    }
                ]
            },
            {
                type: 'section',
                title: 'Límites del Dominio Aéreo',
                paragraphs: [
                    {
                        text: 'Los límites del dominio son: un techo de 120 metros (400 pies) de altura, un alcance horizontal a máximo 750 metros desde tu posición, y contacto Visual (VLOS) permanente. Mantener al menos 30 metros de distancia horizontal de personas ajenas a la operación y nada de vuelos sobre aglomeraciones.'
                    }
                ]
            },
            {
                type: 'section',
                title: 'Preparación del Equipo',
                paragraphs: [
                    {
                        text: 'Para comenzar recuerda, primero debes quitar el protector de seguridad para la cámara del drone, deberás conectar las antenas tanto del mando como de las gafas o goggles, pon las baterías en el drone sin conectarlas aún, y lo más importante recuerda tener suficiente cantidad de baterías cargadas y memoria SD libre para registrar el vuelo.'
                    },
                    {
                        text: 'Una vez que enciendes la radio transmisora, en tus manos el mando empezará a vibrar, indicando que es el momento en que deberás conectar las baterías del drone, continua prendiendo tus goggles y estas sintonizarán de forma automática tu canal de video. Al ponerte las goggles sobre tus ojos te sumergirás en esta aventura.'
                    }
                ]
            },
            {
                type: 'section',
                title: 'Controles Básicos',
                paragraphs: [
                    {
                        text: 'Tienes un botón de armado y desarmado de los motores (encendido/apagado), apenas lo presionas en la parte superior del mando, las hélices se encenderán y el drone permanecerá en el suelo. Desde una distancia prudente a más de 5 metros, eleva el drone de forma gradual del suelo, ve deslizando suavemente la palanca del acelerador (throttle), hasta que pueda despegar del suelo.'
                    },
                    {
                        text: 'Utiliza la Guiñada (Yaw) para iniciar rotación en sentido manecillas del reloj o en sentido contrario. Prueba la palanca de Alabeo (Roll) que controla la inclinación lateral a la izquierda y derecha. Intenta avanzar y retroceder lentamente algunos metros ajustando el Cabeceo (Pitch) hacia adelante/atrás. Haz estos movimientos alrededor de un punto fijo varias veces antes de continuar con ejercicios más complejos.'
                    }
                ]
            },
            {
                type: 'section',
                title: 'Ejercicios de Práctica',
                paragraphs: [
                    {
                        text: 'Quieres probar tu desempeño, trata ahora de realizar rutas sobre una misma área como: circuito sin trayectoria, circuito con trayectoria, desplazamiento circular con foco en el centro, desplazamiento circular con foco hacia afuera, reloj de arena sentido manecillas del reloj, reloj de arena sentido invertido.'
                    },
                    {
                        text: 'Ya que has desarrollado el control sobre la velocidad y ubicación del drone, te invito a ver algunos videos de trucos que te adentrarán en diferentes modalidades de vuelo: boca abajo, de reverso, flujo...'
                    }
                ]
            }
        ]
    },
    {
        id: 'mantenimiento-drones-fpv',
        title: 'Guía de mantenimiento para tu drone FPV',
        excerpt: 'Aprende a mantener tu drone en óptimas condiciones para vuelos seguros y duraderos.',
        image: '/images/blog/drone-maintenance.jpg',
        category: 'Mantenimiento',
        date: '2024-02-10',
        readTime: '6 min',
        author: 'Michael Arias',
        avatar: '',
        content: [
            {
                type: 'paragraph',
                text: 'El mantenimiento regular de tu drone FPV es esencial para garantizar vuelos seguros y prolongar la vida útil de tu equipo. En esta guía te mostramos los pasos básicos que debes seguir después de cada sesión de vuelo.'
            },
            {
                type: 'section',
                title: 'Inspección Visual',
                paragraphs: [
                    {
                        text: 'Revisa cuidadosamente el frame en busca de grietas o daños. Inspecciona las hélices por muescas o deformaciones. Verifica que todos los tornillos estén bien ajustados y que los cables no presenten cortes o desgaste.'
                    }
                ]
            },
            {
                type: 'section',
                title: 'Cuidado de las Baterías',
                paragraphs: [
                    {
                        text: 'Almacena las baterías LiPo a voltaje de almacenamiento (3.8V por celda) si no vas a usarlas en varios días. Nunca las dejes completamente cargadas o descargadas por períodos prolongados. Usa una bolsa ignífuga para almacenamiento seguro.'
                    }
                ]
            }
        ]
    },
    {
        id: 'tuning-pid-betaflight-4-5',
        title: 'Sintonización PID y Filtros en Betaflight 4.5: Guía Definitiva',
        excerpt: 'Domina los algoritmos de control de vuelo, optimiza el FeedForward y elimina el propwash para una respuesta quirúrgica.',
        image: '/images/blog/tuning-betaflight.jpg',
        category: 'Sintonización & Software',
        date: '2024-03-01',
        readTime: '10 min',
        author: 'Michael Arias',
        avatar: '',
        content: [
            {
                type: 'paragraph',
                text: 'Lograr que un quad FPV se sienta como una extensión directa de tus dedos requiere comprender a fondo el lazo de control PID y el filtrado digital en Betaflight 4.5.'
            },
            {
                type: 'section',
                title: 'Entendiendo el bucle P-I-D y Feedforward',
                paragraphs: [
                    {
                        text: 'El término Proporcional (P) reacciona al error presente; el Integral (I) corrige desviaciones acumuladas por viento o centro de masa; y el Derivativo (D) frena las aceleraciones bruscas evitando sobrepasos. En versiones recientes, el Feedforward (FF) anticipa la reacción al movimiento de los gimbals sin introducir retardo en fase.'
                    }
                ]
            },
            {
                type: 'section',
                title: 'Filtrado RPM con DShot Bidireccional',
                paragraphs: [
                    {
                        text: 'Activar el DShot bidireccional permite que la controladora de vuelo lea las RPM de cada motor en tiempo real, aplicando filtros notch armónicos adaptativos que eliminan el ruido antes de que caliente los motores.'
                    }
                ]
            }
        ]
    },
    {
        id: 'vtx-digital-vs-analogico',
        title: 'Sistemas VTX Digital vs Analógico: Walksnail, DJI O3 y HDZero',
        excerpt: 'Comparativa exhaustiva de latencia, penetración de señal, resolución y costos para elegir tu sistema de transmisión ideal.',
        image: '/images/blog/vtx-comparison.jpg',
        category: 'Video & Transmisión',
        date: '2024-03-18',
        readTime: '9 min',
        author: 'Michael Arias',
        avatar: '',
        content: [
            {
                type: 'paragraph',
                text: 'La batalla por la supremacía del video FPV nunca ha sido tan emocionante. Desde la fidelidad cinemática de DJI hasta la latencia ultrabaja de HDZero, cada ecosistema tiene su propósito.'
            },
            {
                type: 'section',
                title: 'DJI O3 Air Unit: El estándar cinemático',
                paragraphs: [
                    {
                        text: 'Con grabación interna hasta 4K60 y una transmisión nítida a 1080p, DJI O3 es la opción indiscutible para grabaciones comerciales donde la calidad de imagen prima sobre la latencia fija.'
                    }
                ]
            },
            {
                type: 'section',
                title: 'HDZero y Walksnail Avatar',
                paragraphs: [
                    {
                        text: 'HDZero destaca en carreras gracias a su latencia fija de 14ms sin fluctuaciones de frame. Por su parte, Walksnail ofrece un balance versátil con soporte 1080p y amplio ecosistema de micro transmisores.'
                    }
                ]
            }
        ]
    },
    {
        id: 'baterias-lipo-4s-vs-6s',
        title: 'Guía de Baterías LiPo: 4S vs 6S y cómo entender el C-Rating',
        excerpt: 'Aprende la física detrás del voltaje, la resistencia interna y las curvas de descarga para maximizar la vida útil y potencia de tus packs.',
        image: '/images/blog/lipo-batteries.jpg',
        category: 'Potencia & Baterías',
        date: '2024-04-02',
        readTime: '7 min',
        author: 'Michael Arias',
        avatar: '',
        content: [
            {
                type: 'paragraph',
                text: 'La transición de 4S a 6S en quads de 5 pulgadas transformó la industria del FPV al reducir el voltaje sag y mejorar la eficiencia térmica de los motores.'
            },
            {
                type: 'section',
                title: 'La ventaja eléctrica de 6S',
                paragraphs: [
                    {
                        text: 'Al aumentar el voltaje nominal a 22.2V, la corriente (amperios) requerida para generar la misma potencia en vatios disminuye en un tercio, reduciendo la caída de voltaje en aceleraciones agresivas.'
                    }
                ]
            },
            {
                type: 'section',
                title: 'Mitos del C-Rating',
                paragraphs: [
                    {
                        text: 'El índice C anunciado por los fabricantes suele ser optimista. Monitorear la Resistencia Interna (IR) con tu cargador balanceador es el método más confiable para determinar la salud de tus celdas.'
                    }
                ]
            }
        ]
    },
    {
        id: 'cinelifters-produccion-audiovisual',
        title: 'Cinelifters y Drones Heavy-Duty en Cine y Producción Audiovisual',
        excerpt: 'Cómo transportar cámaras de cine Red Komodo o Sony FX6 con seguridad, redundancia de motores y perfiles de vuelo cinematográficos.',
        image: '/images/blog/cinelifter-fpv.jpg',
        category: 'Cinematografía FPV',
        date: '2024-04-20',
        readTime: '11 min',
        author: 'Michael Arias',
        avatar: '',
        content: [
            {
                type: 'paragraph',
                text: 'El cine moderno demanda tomas dinámicas imposibles para grúas o helicópteros convencionales. Aquí es donde los Cinelifters en configuración Octocóptero X8 marcan la diferencia.'
            },
            {
                type: 'section',
                title: 'Configuraciones X8 coaxial vs Hexacóptero',
                paragraphs: [
                    {
                        text: 'Los marcos coaxiales X8 brindan redundancia en caso de falla de un motor, manteniendo la aeronave controlable y protegiendo cargas útiles que superan los miles de dólares.'
                    }
                ]
            }
        ]
    },
    {
        id: 'antenas-polarizacion-lhcp-rhcp',
        title: 'Antenas FPV y Polarización Circular: LHCP vs RHCP en Vuelo Long Range',
        excerpt: 'Por qué la polarización circular rechaza el rebote de señales y cómo orientar tus antenas omnidireccionales y direccionales.',
        image: '/images/blog/fpv-antennas.jpg',
        category: 'Hardware & Señal',
        date: '2024-05-08',
        readTime: '8 min',
        author: 'Michael Arias',
        avatar: '',
        content: [
            {
                type: 'paragraph',
                text: 'Una antena adecuada puede multiplicar el alcance de tu señal de video y radio sin necesidad de aumentar la potencia de transmisión ni sobrecalentar tu VTX.'
            },
            {
                type: 'section',
                title: 'Polarización Circular Izquierda vs Derecha',
                paragraphs: [
                    {
                        text: 'Al rebotar contra obstáculos sólidos como concreto o tierra, la onda electromagnética invierte su sentido de polarización. Una antena con la polarización correcta atenúa esa señal reflejada evitando el molesto multipath.'
                    }
                ]
            }
        ]
    },
    {
        id: 'radio-expresslrs-vs-crossfire',
        title: 'Protocolos de Control RC: ExpressLRS (ELRS) vs TBS Crossfire',
        excerpt: 'Tasa de paquetes de 1000Hz, telemetría y penetración en 915MHz vs 2.4GHz: ¿cuál es el mejor enlace para tus vuelos?',
        image: '/images/blog/radio-protocols.jpg',
        category: 'Radio Control',
        date: '2024-05-25',
        readTime: '8 min',
        author: 'Michael Arias',
        avatar: '',
        content: [
            {
                type: 'paragraph',
                text: 'El enlace de control es la línea de vida entre el piloto y el drone. La revolución open-source de ExpressLRS ha desafiado el dominio histórico de Team BlackSheep Crossfire.'
            },
            {
                type: 'section',
                title: 'Tasas de actualización y latencia',
                paragraphs: [
                    {
                        text: 'ELRS alcanza tasas de sondeo de hasta 1000Hz en 2.4GHz con modulaciones LoRa, reduciendo la latencia de entrada a menos de 2 milisegundos para maniobras acrobáticas milimétricas.'
                    }
                ]
            }
        ]
    },
    {
        id: 'frame-geometries-deadcat-truex',
        title: 'Geometrías de Chasis FPV: Deadcat vs True-X y su impacto en vuelo',
        excerpt: 'Descubre las diferencias dinámicas entre disposiciones de brazos True-X, Stretch-X y Deadcat para eliminar las hélices del encuadre.',
        image: '/images/blog/frame-geometries.jpg',
        category: 'Estructuras & Frames',
        date: '2024-06-12',
        readTime: '6 min',
        author: 'Michael Arias',
        avatar: '',
        content: [
            {
                type: 'paragraph',
                text: 'La disposición de los brazos no es solo una decisión estética; determina la distribución del empuje aerodinámico y cómo el giroscopio percibe la inercia de rotación.'
            },
            {
                type: 'section',
                title: 'Deadcat para planos cinematográficos limpios',
                paragraphs: [
                    {
                        text: 'Los marcos Deadcat desplazan los motores delanteros hacia los costados para que las hélices no aparezcan en el campo de visión de la cámara HD, ideal para grabaciones con lentes gran angular.'
                    }
                ]
            }
        ]
    }
]

/**
 * Get a single post by ID
 */
export const getPostById = (id) => {
    return blogPosts.find(post => post.id === id)
}

/**
 * Get adjacent posts for navigation
 */
export const getAdjacentPosts = (currentId) => {
    const currentIndex = blogPosts.findIndex(post => post.id === currentId)
    return {
        prev: currentIndex > 0 ? blogPosts[currentIndex - 1] : null,
        next: currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null
    }
}
