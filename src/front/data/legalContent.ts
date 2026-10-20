/**
 * Contenido de las páginas legales.
 *
 * Los datos del titular (`siteOwner`) se pueden definir con variables de
 * entorno, para no tener que tocar el código al cambiar de titular o de
 * dirección:
 *
 *   VITE_SITE_OWNER_NAME        Nombre con el que se identifica el sitio.
 *   VITE_SITE_OWNER_LEGAL_NAME  Nombre legal o razón social del titular.
 *   VITE_SITE_OWNER_TAX_ID      NIF/NIE/CIF del titular.
 *   VITE_SITE_OWNER_ADDRESS     Dirección fiscal del titular.
 *   VITE_SITE_OWNER_EMAIL       Correo de contacto.
 *
 * ⚠️  Si `address` o `taxId` no están definidos, el sitio publica datos de
 *     marcador de posición: el build lo avisa y las páginas legales lo
 *     muestran. El artículo 10 de la Ley 34/2002 y el artículo 13 del RGPD
 *     obligan a identificar al responsable del tratamiento, así que hay que
 *     definirlos antes de publicar en un dominio propio.
 *
 * El resto del texto es una base de trabajo que un profesional debe validar
 * antes de usar en producción.
 */

import { ROUTE_BY_KEY } from './routeMeta'

/** Datos identificativos del titular del sitio. */
export interface SiteOwner {
  /** Nombre con el que se identifica el sitio. */
  name: string
  /** Nombre legal o razón social del titular. */
  legalName: string
  /** NIF, NIE o CIF del titular (obligatorio en el aviso legal). */
  taxId: string
  /** Dirección fiscal del titular. */
  address: string
  /** Correo de contacto. */
  email: string
}

/** Texto que delata que un dato sigue sin rellenarse. */
const PLACEHOLDER = '—'

/** Valor por defecto: el titular del repositorio. */
const DEFAULT_OWNER: SiteOwner = {
  name: 'Prompt.com',
  legalName: 'Fernando Alfonso Barrera Ortiz',
  taxId: '',
  address: 'Dirección fiscal del titular',
  email: 'ferbarotz23@gmail.com'
}

/** Lee una variable de entorno y descarta el valor si está vacía. */
const fromEnv = (value: string | undefined, fallback: string): string => {
  const clean = value?.trim()
  return clean ? clean : fallback
}

/** Datos identificativos del titular del sitio. */
export const siteOwner: SiteOwner = {
  name: fromEnv(import.meta.env.VITE_SITE_OWNER_NAME, DEFAULT_OWNER.name),
  legalName: fromEnv(
    import.meta.env.VITE_SITE_OWNER_LEGAL_NAME,
    DEFAULT_OWNER.legalName
  ),
  taxId: fromEnv(import.meta.env.VITE_SITE_OWNER_TAX_ID, DEFAULT_OWNER.taxId),
  address: fromEnv(import.meta.env.VITE_SITE_OWNER_ADDRESS, DEFAULT_OWNER.address),
  email: fromEnv(import.meta.env.VITE_SITE_OWNER_EMAIL, DEFAULT_OWNER.email)
}

/**
 * ¿Falta algún dato obligatorio del titular?
 *
 * Si es `true`, el aviso legal y la política de privacidad se publican con
 * marcadores de posición: hay que definir las variables de entorno antes de
 * publicar en un dominio propio.
 */
export const siteOwnerIncomplete = (): boolean =>
  !siteOwner.taxId || !siteOwner.address || siteOwner.address === DEFAULT_OWNER.address

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

/** Identificación fiscal del titular, tal y como se publica. */
const taxIdText = (): string => (siteOwner.taxId ? ` con NIF ${siteOwner.taxId}` : '')

export const LEGAL_PAGES: Record<string, LegalPage> = {
  avisoLegal: {
    title: ROUTE_BY_KEY.avisoLegal.title,
    description: ROUTE_BY_KEY.avisoLegal.description,
    updated: '2026-10-20',
    sections: [
      {
        heading: 'Titularidad',
        paragraphs: [
          `En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Información Electrónica, se informa de que este sitio web se identifica bajo el nombre «${siteOwner.name}»${taxIdText()}, con domicilio en ${siteOwner.address} y correo de contacto ${siteOwner.email}.`,
          `El titular de los derechos de este sitio web es ${siteOwner.legalName}.`
        ]
      },
      {
        heading: 'Condiciones de uso',
        paragraphs: [
          'El acceso al sitio es gratuito y no requiere registro. El usuario se compromete a hacer un uso diligente y lícito del contenido, a no intentar acceder de forma no autorizada a los sistemas del servidor ni a realizar acciones que puedan detectarse como dañinas (intentos de denegación de servicio, introducción de virus, scraping masivo o vulneración de la seguridad).',
          'Los contenidos presentes en el sitio (textos, imágenes, código fuente y diseño) se ofrecen con fines informativos y educativos. Las sugerencias y plantillas que genera la web son orientativas: el usuario es responsable de revisar y validar cualquier prompt antes de usarlo en sus proyectos.'
        ]
      },
      {
        heading: 'Propiedad intelectual',
        paragraphs: [
          'Todos los elementos que forman parte de este sitio (textos, ilustraciones, código, tipografías y diseño) son titularidad de sus respectivos autores y están protegidos por la normativa de propiedad intelectual. Queda prohibida su reproducción, explotación, distribución o comunicación sin autorización previa.',
          'El código fuente de este sitio se publica bajo licencia MIT (el fichero LICENSE del repositorio), con la excepción de los contenidos editoriales, que no pueden reproducirse sin permiso. La tipografía Inter se distribuye bajo la licencia SIL Open Font License.'
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
    title: ROUTE_BY_KEY.privacidad.title,
    description: ROUTE_BY_KEY.privacidad.description,
    updated: '2026-10-20',
    sections: [
      {
        heading: 'Responsable del tratamiento',
        paragraphs: [
          `El responsable del tratamiento de los datos personales es ${siteOwner.legalName}${taxIdText()}, con domicilio en ${siteOwner.address} y correo de contacto ${siteOwner.email}.`
        ]
      },
      {
        heading: 'Datos que se recogen',
        paragraphs: [
          'Este sitio es estático y se ejecuta íntegramente en el navegador. El generador y el analizador no llaman a ningún modelo de inteligencia artificial: escriben un prompt con una plantilla y lo puntúan con reglas locales. El texto que escribes se procesa en tu equipo.',
          'Lo único que se recoge son los datos que decides enviar de forma explícita, como el correo electrónico si decides escribirnos. Este sitio no instala cookies ni crea perfiles de usuario.',
          'El generador y el analizador guardan en el almacenamiento local de tu navegador (localStorage) lo que escribes, para que no pierdas el trabajo si recargas la página: el prompt en curso, el texto analizado y el tema que has elegido. Ese dato no se envía a ningún servidor y puedes borrarlo cuando quieras desde el enlace «Borrar los datos guardados» del pie de página.',
          'Hay una excepción a esto último, y conviene conocerla: el generador mantiene el prompt en la propia URL de la página para que puedas compartirlo con un enlace. Eso significa que, si recargas la página o abres un enlace compartido, el texto del prompt viaja en la línea de petición y queda registrado en los registros del servidor que sirve el sitio (GitHub Pages o el proveedor de alojamiento que elijas). Si necesitas que el prompt no salga de tu equipo, no compartas el enlace y borra los datos guardados al terminar.'
        ]
      },
      {
        heading: 'Finalidad y legitimación',
        paragraphs: [
          'Los datos enviados por correo electrónico para comunicaciones con el titular se utilizan para atender tu consulta.',
          'Los datos guardados en tu navegador (el prompt en curso, el texto del analizador y la preferencia de tema) se utilizan únicamente para devolvértelos cuando vuelves a la web. La legitimación es tu consentimiento, que puedes retirar en cualquier momento borrándolos.'
        ]
      },
      {
        heading: 'Conservación',
        paragraphs: [
          'Las comunicaciones con el titular se conservan durante el tiempo necesario para resolver la solicitud y, después, durante los plazos exigidos por la normativa aplicable.',
          'Los datos guardados en tu navegador (el prompt en curso, el texto del analizador y la preferencia de tema) se conservan durante un máximo de 30 días desde la última vez que los usaste, momento en el que se eliminan automáticamente.'
        ]
      },
      {
        heading: 'Destinatarios y transferencias internacionales',
        paragraphs: [
          'No se ceden datos a terceros con fines comerciales. Si el alojamiento del sitio o el proveedor de analítica implicaran una transferencia internacional, esta se garantizará con las garantías adecuadas del RGPD y se indicará en esta política.'
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
          'Aplicamos medidas técnicas y organizativas razonables para proteger los datos frente a accesos no autorizados. Ten en cuenta que el sitio se sirve íntegramente desde un alojamiento estático y que la conexión con el servicio de hosting se cifra mediante HTTPS.'
        ]
      }
    ]
  },

  cookies: {
    title: ROUTE_BY_KEY.cookies.title,
    description: ROUTE_BY_KEY.cookies.description,
    updated: '2026-10-20',
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
          'El único almacenamiento local que se utiliza es el localStorage, y solo en tu navegador: guarda el prompt que estás escribiendo en el generador, el texto que has pegado en el analizador y si prefieres el tema claro u oscuro. Sirve para que no pierdas el trabajo al recargar la página. No contiene información identificable, no se envía a ningún servidor y puedes borrarlo cuando quieras desde el enlace «Borrar los datos guardados» del pie de página o desde la configuración del navegador.'
        ]
      },
      {
        heading: 'Analítica sin cookies',
        paragraphs: [
          'Si se activase una herramienta de analítica sin cookies, se emplearía para fines estadísticos y no requeriría consentimiento según la normativa aplicable, siempre que no se traten de datos personales. En ese caso, esta política se actualizará indicando el proveedor y sus condiciones.'
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

/** Marcador que se muestra en las páginas legales si faltan datos del titular. */
export const OWNER_WARNING = `Faltan los datos del titular (dirección fiscal${PLACEHOLDER}). Rellena las variables VITE_SITE_OWNER_ADDRESS y VITE_SITE_OWNER_TAX_ID antes de publicar.`
