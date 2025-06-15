import React from "react";
import "./LegalNotice.css";

const LegalNotice: React.FC = () => {
  return (
    <div className="legal-container">
      <h1>Aviso Legal de Dashflow</h1>
      <p>
        <strong>www.dashflow.com</strong>
      </p>

      <section>
        <h2>I. Información General</h2>
        <p>
          En cumplimiento con el deber de información dispuesto en la Ley
          34/2002 de Servicios de la Sociedad de la Información y el Comercio
          Electrónico (LSSI-CE) de 11 de julio, se facilitan los siguientes
          datos:
        </p>
        <ul>
          <li>
            <strong>Titular del sitio:</strong> Dashflow
          </li>
          <li>
            <strong>NIF:</strong> 142345678B
          </li>
          <li>
            <strong>Registro:</strong> Valencia, 333
          </li>
          <li>
            <strong>Representante:</strong> Mr Dashflow
          </li>
          <li>
            <strong>Dirección:</strong> La calle de dashflow
          </li>
          <li>
            <strong>Teléfono:</strong> 622855841
          </li>
          <li>
            <strong>Email:</strong> dashflow@gmail.com
          </li>
        </ul>
      </section>

      <section>
        <h2>II. Términos y Condiciones Generales de Uso</h2>
        <p>
          El presente Aviso Legal regula el uso del sitio web www.dashflow.com
          (en adelante, "el Sitio Web"), que Dashflow pone a disposición de los
          usuarios de Internet. La utilización del Sitio Web atribuye la
          condición de usuario del mismo e implica la aceptación plena y sin
          reservas de todas y cada una de las disposiciones incluidas en este
          Aviso Legal.
        </p>
      </section>

      <section>
        <h2>III. Objeto</h2>
        <p>
          El presente sitio web tiene por objeto ofrecer a los usuarios
          información clara, precisa y actualizada sobre los productos y
          servicios financieros ofrecidos por Dashflow.
        </p>
      </section>

      <section>
        <h2>IV. Propiedad intelectual e industrial</h2>
        <p>
          Todos los contenidos de este sitio web, incluyendo textos, imágenes,
          diseños, logotipos, iconos, software, nombres comerciales, marcas o
          signos distintivos, están protegidos por los derechos de propiedad
          intelectual e industrial de Dashflow o, en su caso, de terceros, y no
          podrán ser utilizados sin autorización previa y por escrito del
          titular.
        </p>
      </section>

      <section>
        <h2>V. Responsabilidad</h2>
        <p>
          Dashflow no se responsabiliza de los errores u omisiones en los
          contenidos del sitio web u otros contenidos a los que se pueda acceder
          a través del mismo, ni de los daños derivados de la utilización del
          sitio web, ni por cualquier actuación realizada sobre la base de la
          información que en él se facilita.
        </p>
      </section>

      <section>
        <h2>VI. Legislación aplicable</h2>
        <p>
          El presente aviso legal se rige por la legislación española. Para la
          resolución de cualquier conflicto que pudiera derivarse del acceso al
          sitio web, el usuario y Dashflow acuerdan someterse expresamente a los
          juzgados y tribunales de la ciudad de Valencia, con renuncia a
          cualquier otro fuero general o especial que les pudiera corresponder.
        </p>
      </section>

      <footer>
        <p>Documento generado el 26/05/2025</p>
      </footer>
    </div>
  );
};

export default LegalNotice;
