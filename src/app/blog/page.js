'use client'
import { Suspense } from 'react'
import theme from '@/modules/theme'
import AppFooter from '@/modules/views/AppFooter'
import AppAppBar from '@/modules/views/AppAppBar'

const styles = (theme) => ({
  blogSheet: {
    maxWidth: '1050px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '20px auto'
  }
})

function BlogPage () {
  const classes = styles(theme)
  return (
    <section>
      <Suspense fallback={<p>Cargando...</p>}>
        <AppAppBar />

        <div className="" style={classes.blogSheet}>
          <h2>¿Qué debes tener en cuenta en tu primera vez como piloto FPV?</h2>
          <div>
            <br />
            <p className="pt-4 pb-4">
              Experimentar la sensación de volar en primera persona, te permitira ver lo que
              observa la cámara sobre el drone, esa conexión con la ubicación real
              del cuadricoptero en vuelo hará sentir que sales del cuerpo.{' '}
            </p>
            <br />
            <p className="pt-4 pb-4">
              En Colombia, volar de forma legal es un acto regulado bajo el RAC 100 para muchos casos requiere de un "Certificado de Idoneidad" 
              y de permiso de vuelo emitido por la Aeronáutica Civil. Entre 200 g hasta los 25 kg debes registrar tu equipo obligatoriamente en el SiRT.
              Consulta además el mapa de Zonas Prohibidas (ZNVD), dado que existen lugares donde la presencia es una amenaza como Aeropuertos, Bases Militares, Estaciones de Policia, Parques Nacionales Naturales.
            </p>
            <br />
<p className="pt-4 pb-4">
              Si bien puedes darle un uso puramente recreativo en categoría abierta, , eres legalmente responsable de cualquier daño. Se recomienda encarecidamente una póliza de responsabilidad civil; un error técnico puede costar más de lo que imaginas.
            </p>
            <br />
<br />
<p className="pt-4 pb-4">
              Los Límites del Dominio son un techo de 120 metros (400 pies) de altura, un alcance horizontal a máximo 750 metros desde tu posición, y ontacto Visual (VLOS) permanente. Mantén al menos 30 metros de distancia horizontal de personas ajenas a tu operación. y nada de vuelos sobre aglomeraciones.
            </p>
            <br />
            <p className="pt-4 pb-4">
              Para comenzar recuerda, primero debes quitar el protector de
              seguridad para la cámara del drone, deberás conectar las antenas tanto del mando
              como de las gafas o goggles, pon las baterías en el drone
              sin conectarlas aún, y lo más importante recuerda tener suficiente cantidad de
              baterías cargadas y memoria SD libre para registrar el vuelo.{' '}
            </p>
            <br />
            <p className="pt-4 pb-4">
              Una vez que enciendes la radio transmisora, en tus manos el mando empezará a vibrar,
              indicando que es el momento en que deberás conectar las baterías del drone,
              continua prendiendo tus goggles y estas sintonizarán de forma automática tu canal de video.
              Al ponerte las goggles sobre tus ojos te sumergirás en esta aventura.{' '}
            </p>
            <br />
            <p className="pt-4 pb-4">
              Tienes un botón de armado y desarmado de los motores (encendido/apagado), apenas lo
              activas en la parte superior del mando, las hélices se encenderán y el drone permanecerá en el suelo. Desde una distancia prudente a más de 5 metros,
              eleva el drone de forma gradual del suelo, ve deslizando
              suavemente la palanca del acelerador (throttle), hasta que pueda despegar del suelo.
              Inicia intentando avanzar y retroceder lentamente algunos metros,
              esto varias veces antes de continuar con ejercicios más complejos (circuito con trayectoria, desplazamiento circular con foco en el centro, reloj de arena...).{' '}
            </p>
            <br />
            <p className="pt-4 pb-4">
              Quieres probar tu desempeño, trata ahora de realizar rutas
              circulares sobre una misma área. Ya que has desarrollado el
              control sobre la velocidad y ubicación del drone, te invito a ver
              algunos videos de trucos que te enseñaran las diferentes
              modalidades de vuelo: boca abajo, de reverso, flujo...
            </p>
            <br />
            <br />
          </div>
        </div>

        <AppFooter />
      </Suspense>
    </section>
  )
}

export default BlogPage
