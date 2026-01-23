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

function BlogPage() {
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
              En Colombia, volar de forma legal es un acto regulado bajo el RAC 100 para muchos casos requiere de un <a href="https://www.aerocivil.gov.co/publicaciones/3959/usuarios-registrados-ua/" target="_blank" rel="noopener noreferrer" >Certificado de Idoneidad</a>
              y de <a href="https://sgdea.aerocivil.gov.co/ControlPQR/Tramites" target="_blank" rel="noopener noreferrer" >permiso de vuelo</a> emitido por la Aeronáutica Civil. Entre 200 g hasta los 25 kg debes registrar tu equipo obligatoriamente en el SiRT.
              Consulta además el <a href="https://aerocivil.maps.arcgis.com/apps/instant/media/index.html?appid=b4be4d501c8d4bcabd0c35297521c16e&center=-74.3578;4.7377&level=10" target="_blank" rel="noopener noreferrer" >mapa de Zonas de No Vuelo Dron (ZNVD)</a> donde la presencia es una amenaza, como son cercanías a Aeropuertos, Bases Militares, Estaciones de Policia, Parques Nacionales Naturales.
            </p>
            <br />
            <p className="pt-4 pb-4">
              Si bien puedes darle un uso puramente recreativo en categoría abierta,
              eres legalmente responsable de cualquier daño. Se sugiere contar con una
              póliza de responsabilidad civil; un error técnico puede costar más de lo que imaginas.
            </p>
            <br />
            <br />
            <p className="pt-4 pb-4">
              Los límites del dominio son: un techo de 120 metros (400 pies) de altura, un alcance horizontal a máximo 750 metros desde tu posición, y contacto Visual (VLOS) permanente. Mantener al menos 30 metros de distancia horizontal de personas ajenas a la operación. y nada de vuelos sobre aglomeraciones.
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
              presionas en la parte superior del mando, las hélices se encenderán y el drone permanecerá en el suelo. Desde una distancia prudente a más de 5 metros,
              eleva el drone de forma gradual del suelo, ve deslizando
              suavemente la palanca del acelerador (throttle), hasta que pueda despegar del suelo. Utiliza la Guiñada (Yaw) para iniciar rotación a en sentido manecillas del reloj o en sentido contrario.
              Prueba la palanca de Alabeo (Roll) que controla la inclinación lateral a la izquierda y derecha. Intenta avanzar y retroceder lentamente algunos metros ajustando el Cabeceo (Pitch) hacia adelante/atrás.
              Haz estos movimientos alrededor de un punto fijo varias veces antes de continuar con ejercicios más complejos.{' '}
            </p>
            <br />
            <p className="pt-4 pb-4">
              Quieres probar tu desempeño, trata ahora de realizar rutas sobre una misma área como:
              circuito sin trayectoria, circuito con trayectoria, desplazamiento circular con foco en el centro,
              desplazamiento circular con foco hacia afuera, reloj de arena sentido manecillas del reloj, reloj de arena sentido invertido manecillas del reloj. Ya que has desarrollado el
              control sobre la velocidad y ubicación del drone, te invito a ver
              algunos videos de trucos que te adentraran en diferentes
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
