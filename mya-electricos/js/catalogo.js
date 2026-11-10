/*
 * Catálogo de M&A Eléctricos e Ingeniería S.A.S.
 * Fuente: brochure de productos y servicios.
 *
 * Para agregar o cambiar productos solo hay que editar este archivo:
 *   - lineas[]            → cada línea (tarjeta en el inicio y bloque en productos.html)
 *   - lineas[].grupos[]   → subcategorías con marcas, referencias e imágenes
 *   - imgs                → nombres de archivo dentro de img/prod/ (sin extensión)
 */
window.MYA = {
  empresa: {
    nombre: 'M&A Eléctricos e Ingeniería S.A.S.',
    whatsapp: '573185756242',
    whatsappVisible: '(318) 575 6242',
    celular: '+573183920090',
    celularVisible: '(318) 392 0090',
    correo: 'electricoseingenierias@hotmail.com'
  },

  lineas: [
    {
      id: 'iluminacion',
      nombre: 'Iluminación LED',
      resumen: 'Bombillos, tubos, paneles, reflectores, alumbrado de poste y luminaria solar.',
      portada: '059',
      grupos: [
        {
          nombre: 'Bombillos ahorradores LED',
          marcas: ['Mercury', 'Sylvania', 'Lumek', 'Lexmana', 'Osram', 'Deko', 'Munilux', 'Karluz'],
          items: [
            'Bombillo ahorrador LED de 3W hasta 100W',
            'Bombillo vela LED 3W con rosca E27, E14 y E12',
            'Bombillo ahorrador LED 6.2W y 9W rosca E27',
            'Bombillo dicroico LED con rosca GU10 y bipin',
            'Soporte plafón en loza y plástico',
            'Soporte en loza de dos piezas y mogul',
            'Soporte GU10',
            'Dimmer',
            'Convertidor de GU10 a rosca E27'
          ],
          imgs: ['016', '017', '020', '011', '019', '003', '018', '005', '012', '014', '013', '015']
        },
        {
          nombre: 'Tubos y cinta LED',
          marcas: ['Sylvania', 'Philips', 'Lumek', 'Karluz', 'Munilux'],
          items: ['Tubo o vela LED T5 y T8', 'Lámpara de emergencia', 'Cinta LED 50/50 y 35/18 x 5 m'],
          imgs: ['037', '036', '038', '050']
        },
        {
          nombre: 'Ojo de buey LED',
          marcas: [],
          items: [
            'Ojo de buey ecualizable',
            'Ojo de buey con vidrio y sin vidrio',
            'Carcasa para ojo de buey',
            'Bala de 5 y 7 LED satinada luz cálida',
            'Bala de piso'
          ],
          imgs: ['039', '051', '052', '040', '041', '042']
        },
        {
          nombre: 'Reflectores',
          marcas: ['Lumek', 'Philips', 'Lexmana', 'Karluz', 'Munilux'],
          items: [
            'Reflector LED de 10W, 20W, 50W, 100W, 200W y 400W',
            'Reflector multicolor de 10W, 20W, 50W y 100W',
            'Reflector antiexplosivo'
          ],
          imgs: ['059', '060', '078', '079', '061']
        },
        {
          nombre: 'Luminaria de poste',
          marcas: [],
          items: [
            'Luminaria de poste de 50W hasta 500W',
            'Fotocelda y su base',
            'Brazo para luminaria',
            'Poste para luminaria',
            'Cinta bandit y hebilla',
            'Collarín para poste'
          ],
          imgs: ['071', '063', '064', '076', '077', '075', '073', '074', '072']
        },
        {
          nombre: 'Luminaria solar',
          marcas: [],
          items: [
            'Reflector LED solar desde 30W hasta 500W',
            'Luminaria solar de poste desde 80W hasta 500W',
            'Panel solar',
            'Luminaria solar para jardín'
          ],
          imgs: ['085', '084', '082', '083']
        },
        {
          nombre: 'Lámparas y paneles',
          marcas: ['Mercury', 'Sylvania', 'Lumek', 'Lexmana', 'Osram', 'Deko', 'Munilux', 'Karluz', 'Aura'],
          items: [
            'Lámpara hermética LED de 2 tubos',
            'Panel LED de incrustar y de sobreponer de 3W hasta 24W',
            'Bala LED 120x30 de 30W y 48W',
            'Panel LED 60x60 de 48W',
            'Lámpara recargable',
            'Lámpara de exterior'
          ],
          imgs: ['101', '099', '102', '100', '098', '096', '097', '103', '104', '105']
        }
      ]
    },
    {
      id: 'cables',
      nombre: 'Cables y alambres',
      resumen: 'Cable de 7 hilos, encauchetado, dúplex, desnudo, vehicular, UTP y coaxial.',
      portada: '161',
      grupos: [
        {
          nombre: 'Cable de 7 filamentos',
          marcas: ['Procables', 'Centelsa', 'Nexans', 'Andes Cables', 'Argos', 'Condumex'],
          items: ['Cable desde calibre #2 hasta #14'],
          imgs: ['161', '160']
        },
        {
          nombre: 'Alambre de 1 filamento',
          marcas: ['Procables', 'Centelsa', 'Nexans'],
          items: ['Alambre desde calibre #8 hasta #14'],
          imgs: ['198', '199']
        },
        {
          nombre: 'Cable encauchetado',
          marcas: ['Procables', 'Centelsa'],
          items: ['Cable encauchetado desde 2x10 hasta 4x16'],
          imgs: ['162', '163']
        },
        {
          nombre: 'Cable dúplex',
          marcas: ['Procables', 'Centelsa'],
          items: ['Cable dúplex 2x10, 2x12, 2x14, 2x16, 2x18, 2x20 y 2x22'],
          imgs: ['158', '159']
        },
        {
          nombre: 'Cobre y aluminio desnudo',
          marcas: ['Procables', 'Centelsa'],
          items: ['Cable de cobre y aluminio desnudo #2, #4, 1/0, 2/0, 3/0 y 4/0', 'Cable soldador de 1/0 hasta 4/0'],
          imgs: ['190', '191', '182']
        },
        {
          nombre: 'Cable vehicular',
          marcas: [],
          items: ['Cable vehicular desde calibre 22 hasta calibre 8'],
          imgs: ['173', '184']
        },
        {
          nombre: 'Cable UTP',
          marcas: [],
          items: ['Cable UTP categoría 5 y 6', 'Bota industrial para cable UTP', 'Conector RJ45'],
          imgs: ['174', '175', '185', '186', '187']
        },
        {
          nombre: 'Cable coaxial',
          marcas: [],
          items: ['Cable coaxial y conectores'],
          imgs: ['172', '171', '170']
        }
      ]
    },
    {
      id: 'cajas-tableros',
      nombre: 'Cajas, tableros y cofres',
      resumen: 'Cajas de circuitos, de paso y registro, tableros, racks y cofres con norma RETIE.',
      portada: '120',
      grupos: [
        {
          nombre: 'Cajas, tableros y cofres',
          marcas: ['Indelpa', 'Tercol', 'Karluz', 'Melta Delk', 'Sassin', 'Legrand'],
          items: [
            'Caja de circuitos con y sin puerta',
            'Caja de paso metálica y plástica',
            'Caja de registro metálica y plástica',
            'Caja PVC y galvanizada',
            'Caja octagonal PVC, galvanizada y Rawelt',
            'Caja Mini Pragma de sobreponer e incrustar',
            'Caja para contador de luz',
            'Rack gabinete para comunicaciones',
            'Tapas 2x4, 4x4, octagonal, Rawelt y doble para intemperie',
            'Tablero bifásico y trifásico, con y sin puerta, metálico y plástico',
            'Cofres con norma RETIE'
          ],
          imgs: ['110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '127']
        }
      ]
    },
    {
      id: 'breakers',
      nombre: 'Breakers',
      resumen: 'Breakers atornillables, de riel y enchufables en todas las configuraciones.',
      portada: '133',
      grupos: [
        {
          nombre: 'Breakers',
          marcas: ['Luminex', 'Siemens', 'Chint', 'Schneider Electric', 'Eaton', 'Legrand', 'Ciles'],
          items: ['Breaker atornillable, de riel y enchufable', 'Breaker THQL – THQC monopolar, bipolar y tripolar'],
          imgs: ['132', '133', '134']
        }
      ]
    },
    {
      id: 'maniobra-control',
      nombre: 'Maniobra, control y señalización',
      resumen: 'Contactores, relés, pulsadores, arrancadores, borneras y más.',
      portada: '137',
      grupos: [
        {
          nombre: 'Maniobra, control y señalización',
          marcas: ['Siemens', 'Schneider Electric', 'ABB', 'Lovato', 'Eaton', 'Chint', 'Autonics', 'EBC'],
          items: [
            'Contactores',
            'Relé térmico',
            'Pulsadores',
            'Lámpara de señalización',
            'Interruptores',
            'Detectores de proximidad fotoeléctricos',
            'Detectores de capacidad',
            'Conmutador de 3 posiciones',
            'Conmutador de 2 posiciones con llave',
            'Arrancador',
            'Borneras',
            'Guardamotor',
            'Regleta',
            'Relevo de 8 pines'
          ],
          imgs: ['130', '137', '138', '139', '140', '141']
        }
      ]
    },
    {
      id: 'transformadores',
      nombre: 'Transformadores y accesorios',
      resumen: 'Transformadores de potencia, aisladores de baja y alta tensión, fusibles y capacetes.',
      portada: '148',
      grupos: [
        {
          nombre: 'Aisladores de baja y alta tensión',
          marcas: ['Celsa', 'Melec', 'Tyco', '3M', 'Importados'],
          items: ['Aisladores tipo pin 13.2, 23 y 34.5 kV', 'Aisladores post type', 'Aisladores de suspensión de 6” y 10”'],
          imgs: ['144', '145', '146']
        },
        {
          nombre: 'Transformadores de potencia',
          marcas: ['ABB', 'Magnetrón', 'Rymel', 'Tesla', 'Prolec GE', 'Siemens'],
          items: [
            'Transformadores de potencia monofásicos y trifásicos',
            'Fusible de baja y alta tensión',
            'Capacete de ½” hasta 4”'
          ],
          imgs: ['148', '149', '150', '151']
        }
      ]
    },
    {
      id: 'tuberia',
      nombre: 'Tubería y accesorios',
      resumen: 'Tubería conduit PVC, IMC galvanizada y EMT con uniones, conectores y curvas.',
      portada: '229',
      grupos: [
        {
          nombre: 'Tubería conduit y accesorios',
          marcas: ['Durman', 'TuboCosta', 'Colmena', 'Gerfor', 'Plastimec', 'Importados'],
          items: [
            'Tubo conduit PVC, IMC galvanizado y EMT desde ½” hasta 4”',
            'Unión conduit PVC, IMC galvanizado y EMT desde ½” hasta 4”',
            'Conector conduit PVC, IMC galvanizado y EMT desde ½” hasta 4”',
            'Curva conduit PVC, IMC galvanizado y EMT desde ½” hasta 4”'
          ],
          imgs: ['229', '228', '226', '236', '238']
        }
      ]
    },
    {
      id: 'coraza-conduletas',
      nombre: 'Coraza, conduletas y canaletas',
      resumen: 'Coraza liquid tight, flexi conduit, conduletas, conectores y canaletas.',
      portada: '311',
      grupos: [
        {
          nombre: 'Coraza y flexi conduit',
          marcas: ['Iluram', 'Appleton', 'Crouse-Hinds', 'Albron', 'Arlington'],
          items: ['Coraza liquid tight de ½” a 4”', 'Flexi conduit'],
          imgs: ['311', '312']
        },
        {
          nombre: 'Conduletas y canaletas',
          marcas: ['Iluram', 'Appleton', 'Crouse-Hinds', 'Albron', 'Arlington'],
          items: [
            'Conduleta en aluminio o hierro fundido tipo L, LB, LR y T',
            'Conector recto liquid tight de ½” a 4”',
            'Conector curvo liquid tight de ½” a 4”',
            'Derivación en T',
            'Canaletas con y sin adhesivo',
            'Chazos y tornillos'
          ],
          imgs: ['313', '314', '315', '316', '317', '318', '329', '330', '319', '328', '333', '334', '335', '336']
        }
      ]
    },
    {
      id: 'terminales-tomas',
      nombre: 'Terminales, clavijas y tomas',
      resumen: 'Terminales, conectores de perforación, clavijas, tomas e interruptores.',
      portada: '299',
      grupos: [
        {
          nombre: 'Terminales, conectores, clavijas y tomas',
          marcas: ['EBCHQ', '3M Colombia', 'Industrial Verni', 'Burndy', 'Codelca'],
          items: [
            'Terminal con tornillo',
            'Terminal tipo zapato en cobre',
            'Terminal tipo “O” anillo y tipo “U”',
            'Terminal tipo pin y faston',
            'Conector de perforación',
            'Conector recto liquid tight de ½” a 4”',
            'Conector curvo liquid tight de ½” a 4”',
            'Clavijas con y sin polo',
            'Toma aérea con y sin polo'
          ],
          imgs: ['306', '303', '298', '300', '301', '308', '291', '299', '283', '292', '293', '304', '290', '294', '296', '288', '286', '263', '265', '266', '268', '270', '271', '272', '273', '274']
        }
      ]
    },
    {
      id: 'cinta-soldadura',
      nombre: 'Cinta aislante y soldadura',
      resumen: 'Cinta aislante para baja y alta tensión, soldadura PVC y exotérmica.',
      portada: '223',
      grupos: [
        {
          nombre: 'Cinta aislante en baja y alta tensión',
          marcas: ['Scotch', 'Cobra'],
          items: ['Cinta aislante Super 33', 'Cinta eléctrica autofundente para alto voltaje', 'Cinta aislante de colores'],
          imgs: ['221', '222', '223', '224', '225']
        },
        {
          nombre: 'Soldadura PVC y exotérmica',
          marcas: ['Tubison', 'Unisolder'],
          items: ['Soldadura PVC', 'Soldadura exotérmica'],
          imgs: ['343', '342', '344']
        }
      ]
    },
    {
      id: 'medidores',
      nombre: 'Medidores de energía',
      resumen: 'Medidores monofásicos, bifásicos, trifásicos, bidireccionales y activa-reactiva.',
      portada: '339',
      grupos: [
        {
          nombre: 'Medidores de energía',
          marcas: ['Inelca', 'Tecun', 'CDM', 'Nansen'],
          items: [
            'Medidores monofásicos',
            'Medidores bifásicos',
            'Medidores trifásicos',
            'Medidores bidireccionales',
            'Medidores activa-reactiva'
          ],
          imgs: ['351', '339', '340', '341']
        }
      ]
    },
    {
      id: 'extractores-motores',
      nombre: 'Extractores y motores',
      resumen: 'Extractores industriales, de aire acondicionado y motores eléctricos de ½ a 5 HP.',
      portada: '215',
      grupos: [
        {
          nombre: 'Extractores industriales y motores eléctricos',
          marcas: ['EMI', 'Cheka'],
          items: [
            'Extractores desde 4” hasta 17”',
            'Extractor línea económica',
            'Extractor línea industrial media',
            'Extractor línea industrial pesada',
            'Extractor de aire acondicionado con y sin rejilla',
            'Motores eléctricos monofásicos y trifásicos desde ½ hasta 5 HP'
          ],
          imgs: ['215', '216', '218']
        }
      ]
    },
    {
      id: 'accesorios',
      nombre: 'Accesorios en general',
      resumen: 'Puesta a tierra, sensores, estabilizadores, timbres, multitomas y soportería.',
      portada: '366',
      grupos: [
        {
          nombre: 'Accesorios en general',
          marcas: ['Magom', 'Ultra Line', 'Exceline'],
          items: [
            'Pararrayos de cinco puntas',
            'Sensor de humo',
            'Sensor de movimiento',
            'Cuchilla doble tiro',
            'Timbre industrial, inalámbrico y chicharra',
            'Estabilizador y elevador',
            'Multitoma de 6 y 8 puestos',
            'Varilla copperweld en cobre de ½” y 5/8”, de 1.20 hasta 2.40 m',
            'Conector de cobre de ½” y 5/8”',
            'Hidrosolta',
            'Grapa channel',
            'Grapa galvanizada de una y dos alas',
            'Riel channel y omega'
          ],
          imgs: ['366', '367', '368', '369', '370', '372', '373', '376', '362', '364', '365', '371']
        }
      ]
    }
  ],

  marcasLogos: [
    'sylvania', 'deko', 'munilux', 'karluz', 'lexmana', 'pavco', 'gerfor', 'colmena', 'plastimec',
    'tecnosa', 'ipac', '3m', 'grupo-electrico-colombiano', 'inelca', 'tecun', 'cdm', 'nansen',
    'ultraline', 'exceline', 'magom'
  ]
};
