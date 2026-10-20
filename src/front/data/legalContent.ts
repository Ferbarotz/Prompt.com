/**
 * Contenido de las páginas legales.
 *
 * ⚠️  Revisa y completa los datos de `siteOwner` antes de publicar: son
 *     marcadores de posición y las leyes citadas obligan a identificar al
 *     responsable del tratamiento. El resto del texto es una base de trabajo
 *     que un profesional debe validar antes de usar en producción.
 */

/** Datos identificativos del titular del sitio. */
export interface SiteOwner {
  name: string
  legalName: string
  email: string
  address: string
  url: string
}

/** Apartado de una página legal. */
export interface LegalSection {
  heading: string
  paragraphs: string[]
}

/** Página legal completa. */
export interface LegalPage {
  title: string
  description: string
  /** Fecha de la última actualización (ISO, `YYYY-MM-DD`). */
  updated: string
  sections: LegalSection[]
}

export const siteOwner: SiteOwner = {
  name: 'Prompt.com',
  legalName: 'Nombre legal o razón social del titular',
  email: 'contacto@prompt.com',
  address: 'Dirección fiscal del titular',
  url: 'https://prompt.com'
}

export const LEGAL_PAGES: Record<string, LegalPage> = {
  'aviso-legal': {
    title: 'Aviso legal',
    description:
      'Titularidad del sitio, condiciones de uso, propiedad intelectual y legislación aplicable de Prompt.com.',
    updated: '2026-10-19',
    sections: [
      {
        heading: 'Titularidad',
        paragraphs: [
          `En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Información Electrónica, se informa de que este sitio web se identifica bajo el nombre «${siteOwner.name}», con domicilio en ${siteOwner.address} y correo de contacto ${siteOwner.email}.`,
          `El titular de los derechos de este sitio web es ${siteOwner.legalName}.`
        ]
      },
      {
        heading: 'Condiciones de uso',
        paragraphs: [
          'El acceso al sitio es gratuito y no requiere registro. El usuario se compromete a hacer un uso diligente y lícito del contenido, a no intentar acceder de forma no autorizada a los sistemas del servidor ni a realizar acciones que puedan puedas llegar a detectar como dañinas (intentos de Denial of Service, Introduce virus, scraping masivo o vulneración de la seguridad).',
          'Los contenidos presentes en el sitio (textos, imágenes, código fuente y diseño) se ofrecen con fines informativos y educativos. Las sugerencias y plantillas que genera la web son orientativas: el usuario es responsable de revisar y validar cualquier prompt antes de usarlo en sus proyectos.'
        ]
      },
      {
        heading: 'Propiedad intelectual',
        paragraphs: [
          'Todos los elementos que forman parte de este sitio (textos, ilustraciones, código, tipografías y diseño) son titularidad de sus respectivos autores y están protegidos por la normativa de propiedad intelectual. Queda prohibida su reproducción, explotación, distribución o comunicación sin autorización previa.',
          'El código fuente de este sitio se publica bajo licencia MIT, con la excepción de los contenidos editoriales, que no pueden reproducirse sin permiso.'
        ]
      },
      {
        heading: 'Limitación de responsabilidad',
        paragraphs: [
          'El contenido de este sitio se ofrece «tal cual», sin garantía de que sea exacto, completo o esté actualizado. Los resultados generados por los modelos de lenguaje dependen del modelo, la versión y las instrucciones que se le proporcionen, por lo que no se garantiza que las salidas sean correctas o libres de sesgos. El uso del contenido es responsabilidad exclusiva del usuario.',
          'Prompt.com no se hace responsable de los daños derivados del uso de las plantillas y prompts generados, ni de las decisiones que el usuario tome basándose en ellos.'
        ]
      },
      {
        heading: 'Legislación aplicable',
        paragraphs: [
          'Este sitio web se rige por la legislación española. Cualquier controversia que pudiera plantearse en relación con el mismo será sometida a los tribunales competentes de la jurisdicción del domicilio del titular, de conformidad con la normativa aplicable.'
        ]
      }
    ]
  },

  privacidad: {
    title: 'Política de privacidad',
    description:
      'Qué datos se recogen en Prompt.com, con qué finalidad, cuánto tiempo se conservan y cómo ejercer tus derechos.',
    updated: '2026-10-19',
    sections: [
      {
        heading: 'Responsable del tratamiento',
        paragraphs: [
          `El responsable del tratamiento de los datos personales es ${siteOwner.legalName}, con domicilio en ${siteOwner.address} y correo de contacto ${siteOwner.email}.`
        ]
      },
      {
        heading: 'Datos que se recogen',
        paragraphs: [
          'Este sitio es estático y se ejecuta íntegramente en el navegador. Los prompts que escribes en el generador o en el analizador se procesan de forma local: no se envían a ningún servidor ni se almacenan.',
          'Únicamente se recogen los datos que decides enviar de forma explícita, como el correo electrónico si decides escribirnos. Si en el futuro se incorporan herramientas de analítica, se indicará en esta política y en la de cookies antes de su activación.'
        ]
      },
      {
        heading: 'Finalidad y legitimación',
        paragraphs: [
          'Los datos enviados por correo electrónico para comunicaciones con el titular se utilizan para atender tu consulta.'
        ]
      },
      {
        heading: 'Conservación',
        paragraphs: [
          'Las comunicaciones con el titular se conservan durante el tiempo necesario para resolver la solicitud y, después, durante los plazos exigidos por la normativa aplicable.'
        ]
      },
      {
        heading: 'Destinatarios y transferencias internacionales',
        paragraphs: [
          'No se ceden datos a terceros con fines comerciales. Si el alojamiento del sitio implicara una transferencia internacional, esta se garantizará con las garantías adecuadas del RGPD y se indicará en esta política.'
        ]
      },
      {
        heading: 'Tus derechos',
        paragraphs: [
          `Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a ${siteOwner.email}. Incluye un justificante de identidad cuando sea necesario y responderemos en el plazo máximo de un mes.`,
          'Si consideras que no hemos atendido correctamente tu solicitud, puedes reclamar ante la Agencia Española de Protección de Datos (www.aepd.es).'
        ]
      },
      {
        heading: 'Menores',
        paragraphs: [
          'Este sitio está dirigido a personas mayores de 14 años. No recopilamos datos de menores de esa edad. Si crees que un menor nos ha facilitado datos, escríbenos y los eliminaremos.'
        ]
      },
      {
        heading: 'Seguridad',
        paragraphs: [
          'Aplicamos medidas técnicas y organizativas razonables para proteger los datos frente a accesos no autorizados. Ten en cuenta que el sitio se sirve íntegramente desde GitHub Pages y que la conexión con el servicio de hosting se cifra mediante HTTPS.'
        ]
      }
    ]
  },

  cookies: {
    title: 'Política de cookies',
    description:
      'Qué cookies y tecnologías similares utiliza Prompt.com, para qué sirven y cómo gestionarlas.',
    updated: '2026-10-19',
    sections: [
      {
        heading: 'Qué son las cookies',
        paragraphs: [
          'Las cookies son pequeños archivos que un sitio web guarda en tu dispositivo para recordar información entre páginas. Algunas son necesarias para que la web funcione y otras se usan para medir cómo se usa el sitio.'
        ]
      },
      {
        heading: 'Cookies que utiliza este sitio',
        paragraphs: [
          'En su estado actual, Prompt.com no instala cookies publicitarias ni de seguimiento, y no utiliza herramientas de analítica con cookies. El sitio funciona sin ningún tipo de cookie.',
          'La única almacenamiento local que se utiliza es `sessionStorage`, que se borra al cerrar la pestaña y no contiene información identificable. Sirve para recordar la ruta solicitada cuando GitHub Pages sirve la aplicación en una URL interna.'
        ]
      },
      {
        heading: 'Analítica sin cookies',
        paragraphs: [
          'Si se activa una herramienta de analítica sin cookies, se emplea para con fines estadísticos y no requieren consentimiento según la normativa aplicable, siempre que no se traten de datos personales. En ese caso, esta política se actualizará indicando el proveedor y sus condiciones.'
        ]
      },
      {
        heading: 'Cómo gestionar las cookies',
        paragraphs: [
          'Puedes bloquear o eliminar las cookies desde la configuración de tu navegador. Ten en cuenta que desactivar todas las cookies puede impedir el uso de algunas funciones de los sitios web.'
        ]
      }
    ]
  }
}
