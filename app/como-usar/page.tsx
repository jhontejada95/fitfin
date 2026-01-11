import { Card } from '@/components/ui/Card';

const sections = [
  {
    title: '¿Para qué sirve?',
    items: [
      'Esta app nos ayuda a ver, en un solo lugar, cuánto entra, cuánto sale y cuánto nos queda cada mes.',
      'También nos permite comparar meses y probar un escenario de unificación de deudas sin hacer cuentas a mano.'
    ]
  },
  {
    title: 'Primera configuración (una sola vez)',
    items: [
      '1) Elegimos el mes (arrancamos en enero).',
      "2) Vamos a 'Registrar datos' y llenamos: Ingresos, Seguridad social, Gastos y Metas.",
      "3) Presionamos 'Guardar' (por sección o 'Guardar todo').",
      'Tip: si algo cambia durante el mes, solo volvemos a esa sección, ajustamos y Guardamos.'
    ]
  },
  {
    title: 'Rutina semanal (Ana)',
    items: [
      'Una vez por semana, registramos el ingreso de Ana en la semana que corresponda.',
      'Ejemplo: Semana 2: $350.000.',
      'Al final del mes, el total de Ana se suma automáticamente.'
    ]
  },
  {
    title: 'Rutina mensual en pareja',
    items: [
      '1) Definimos metas del mes (ahorro y amortización).',
      '2) Revisamos gastos reales vs lo que esperábamos.',
      '3) Miramos el semáforo: verde (bien), amarillo (ajustar), rojo (recortar/renegociar).'
    ]
  },
  {
    title: 'Cómo leer KPIs y semáforo',
    items: [
      'Ingresos: todo lo que entró en el mes.',
      'Comprometido: lo que sí o sí sale (seguridad social + gastos + cuotas + metas).',
      'Flujo neto: lo que queda después de todo lo comprometido.',
      'Semáforo: Verde si nos queda al menos 10% del ingreso. Amarillo si queda entre 0% y 10%. Rojo si quedamos en negativo.'
    ]
  },
  {
    title: 'Cómo leer gráficas',
    items: [
      'Línea Ingresos vs Comprometido: si el comprometido se acerca o supera ingresos, debemos ajustar.',
      'Dona de gastos: nos muestra en qué se nos va la plata (para recortar con inteligencia).',
      'Barras de Ana semanal: ayuda a ver semanas fuertes/flojas.',
      'Barras de cuotas: nos muestra qué deudas pesan más.'
    ]
  },
  {
    title: 'Cómo usar unificación',
    items: [
      "1) Vamos a 'Deudas & Unificación'.",
      '2) Marcamos las deudas que queremos unificar.',
      '3) Ponemos tasa EA y plazo en meses.',
      '4) Vemos la cuota estimada y la comparamos con la suma de cuotas actuales.',
      'Tip: si la cuota baja, ganamos flujo. Si sube, solo vale si reduce riesgo o simplifica, pero lo evaluamos con calma.'
    ]
  },
  {
    title: 'Qué hacer en meses difíciles',
    items: [
      'Primero, bajamos metas (ahorro/amortización) antes de tocar pagos obligatorios.',
      "Segundo, revisamos gastos 'Dona' y recortamos lo que no sea esencial.",
      'Tercero, si el semáforo sigue rojo, revisamos opciones: renegociar cuotas, extender plazos o unificar.'
    ]
  },
  {
    title: 'Errores comunes',
    items: [
      'Olvidar presionar Guardar (si no guardamos, no se refleja en KPIs y gráficas).',
      'Poner ingresos en 0 y asustarnos: primero registramos ingresos.',
      'Duplicar el mes y luego no ajustar semanas de Ana.',
      'Registrar cuotas de deudas mal (si cambia la cuota, la actualizamos).'
    ]
  },
  {
    title: 'Buenas prácticas',
    items: [
      'Registrar semanalmente los ingresos variables.',
      'Hacer 1 revisión mensual en pareja (15 minutos).',
      'Exportar JSON una vez al mes como respaldo.'
    ]
  },
  {
    title: 'Glosario simple',
    items: [
      'IBC: base sobre la que se calcula la seguridad social (aquí usamos 40% del ingreso de Ana).',
      'EA: tasa efectiva anual.',
      'Flujo neto: lo que queda al final del mes.'
    ]
  }
];

export default function ComoUsarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Cómo usar</h1>
        <p className="text-sm text-slate-400">Guía simple para no técnicos.</p>
      </div>
      {sections.map((section) => (
        <Card key={section.title} title={section.title}>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-200">
            {section.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}
