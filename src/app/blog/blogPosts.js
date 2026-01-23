'use client'

/**
 * Blog Posts Data
 * Centralized content for all blog articles
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
        avatar: '/images/authors/michael-arias.jpg',
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
        author: 'Miguel Parra',
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
