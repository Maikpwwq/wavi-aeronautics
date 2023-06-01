"use client";
import { Suspense } from "react";
import theme from "@/modules/theme";
import AppFooter from "@/modules/views/AppFooter";
import AppAppBar from "@/modules/views/AppAppBar";

const styles = (theme) => ({
  blogSheet: {
    maxWidth: "1050px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "20px auto",
  },
});

function BlogPage() {
  const classes = styles(theme);
  return (
    <section>
      <Suspense fallback={<p>Cargando...</p>}>
        <AppAppBar />

        <div className="" style={classes.blogSheet}>
          <h2>¿Qué debes saber en tu primera vez como piloto FPV?</h2>
          <div>
            <br />
            <p className="pt-4 pb-4">
              Experimenta la sensación de volar en primera persona, ve lo que
              observa la cámara sobre el drone, esa conexión con la ubicación
              del drone te hará sentir que sales de tu cuerpo.{" "}
            </p>
            <br />
            <p className="pt-4 pb-4">
              Antes de empezar recuerda, primero debes quitar el protector de
              seguridad para la cámara del drone, pon las baterías en el drone
              sin conectarlas aún, deberás conectar las antenas tanto del mando
              como de las gafas, lo más importante recuerda tener suficientes
              baterías cargadas y memoria libre para registrar tu vuelo.{" "}
            </p>
            <br />
            <p className="pt-4 pb-4">
              Luego de encender la radio transmisora en tus manos, empezará a
              vibrar el mando indicando que es el momento en que deberás
              conectar las baterías al drone, por ultimo prende tus Googles y
              estas sintonizaran de forma automática tu canal de video. Al
              ponerte tus googles te sumergirás en esta aventura.{" "}
            </p>
            <br />
            <p className="pt-4 pb-4">
              Tienes el boton de armado y desarmado de los motores, apenas lo
              actives encenderán las hélices y el drone permanecerá en el suelo.
              Para elevar el drone de forma gradual del suelo, ve deslizando
              suavemente la palanca del acelerador, hasta que pueda despegar del
              suelo, inicia tratando de avanzar y retroceder algunos metros,
              esto varias veces antes de continuar con ejercicios más complejos.{" "}
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
  );
}

export default BlogPage;
