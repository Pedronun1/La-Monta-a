/**
 * ============================================================================
 * RESTAURANTE LA MONTAÑA — CARTA OFICIAL Y DATOS DEL ESTABLECIMIENTO
 * C. del Rey Francisco, 28, Moncloa - Aravaca, 28008 Madrid
 * ============================================================================
 */

const RESTAURANT_INFO = {
  name: 'La Montaña',
  shortName: 'La Montaña',
  monogram: 'L.M',
  legalName: 'Restaurante La Montaña S.L.',
  tagline: 'La mesa se encuentra donde la montaña susurra.',
  address: {
    street: 'C. del Rey Francisco, 28',
    district: 'Moncloa - Aravaca',
    postalCode: '28008',
    city: 'Madrid',
    country: 'España',
    fullAddress: 'C. del Rey Francisco, 28, Madrid'
  },
  contact: {
    phone: '+34 915 47 31 11',
    phoneClean: '+34915473111',
    email: 'reservas@restaurantelamontana.es'
  }
};

const MENU_DATA = [
  {
    categoria: 'Primeros y Entrantes',
    subtitulo: 'Bocados de tradición castiza y producto seleccionado',
    platos: [
      {
        nombre: 'Croquetas cremosas de jamón ibérico',
        descripcion: 'Bechamel reposada de leche fresca con virutas de jamón ibérico de bellota y rebozado crujiente.',
        precio: '14 €'
      },
      {
        nombre: 'Oreja a la plancha con ajillo',
        descripcion: 'Marcada en plancha de hierro hasta lograr bordes crujientes con majado de ajo morado y perejil.',
        precio: '13 €'
      },
      {
        nombre: 'Huevos trufados con patatas de obrador',
        descripcion: 'Huevos camperos a baja temperatura sobre patata agria confitada y velo aromático de trufa negra.',
        precio: '16 €'
      },
      {
        nombre: 'Ensaladilla rusa de la casa',
        descripcion: 'Receta clásica con patata seleccionada, ventresca de bonito del norte y emulsión suave de aceite de oliva.',
        precio: '12 €'
      }
    ]
  },
  {
    categoria: 'Segundos Platos',
    subtitulo: 'Fuego lento, lonja fresca y parrilla de autor',
    platos: [
      {
        nombre: 'Cazón en adobo tradicional',
        descripcion: 'Dados de cazón marinados en adobo artesano de especias y vinagre de Jerez, fritos al momento.',
        precio: '18 €'
      },
      {
        nombre: 'Hamburguesas a la parrilla La Montaña',
        descripcion: 'Carne seleccionada de vacuno madurado a la brasa con queso fundente y guarnición artesana.',
        precio: '19 €'
      },
      {
        nombre: 'Rabo de toro estofado a baja temperatura',
        descripcion: 'Guiso meloso cocinado lentamente durante seis horas en reducción de vino tinto reserva.',
        precio: '22 €'
      },
      {
        nombre: 'Merluza de pincho a la romana',
        descripcion: 'Lomo central de merluza del Cantábrico con rebozado fino y jugoso en aceite de oliva virgen extra.',
        precio: '21 €'
      }
    ]
  },
  {
    categoria: 'Repostería Casera',
    subtitulo: 'Finales dulces elaborados a diario en nuestro obrador',
    platos: [
      {
        nombre: 'Tarta casera de queso cremosa',
        descripcion: 'Horneada a diario con interior fundente de quesos seleccionados y base artesana.',
        precio: '7 €'
      },
      {
        nombre: 'Flan de la casa con nata',
        descripcion: 'Flan tradicional de huevo campero al baño maría con caramelo tostado y nata montada.',
        precio: '6 €'
      },
      {
        nombre: 'Torrija caramelizada en brioche',
        descripcion: 'Pan brioche infusionado en leche merengada con canela y corteza caramelizada al momento.',
        precio: '8 €'
      }
    ]
  }
];

module.exports = {
  RESTAURANT_INFO,
  MENU_DATA
};
