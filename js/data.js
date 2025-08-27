export const modulesData = {
    ventas: {
        name: 'Ventas',
        categories: [
            {
                id: 'vt-comprobantes',
                name: 'Comprobantes',
                children: [
                    { id: 'vt-cons-camion', name: 'Consolidado por Camión', type: 'final' },
                    { id: 'vt-comp-vendedor', name: 'Comprobantes por Vendedor', type: 'final' },
                    { id: 'vt-comp-pend-desc', name: 'Comprobantes Pendientes a Descargar', type: 'final' },
                    { id: 'vt-comp-pend-desc-stock', name: 'Comprobantes Pendientes a Descargar/Stock', type: 'final' },
                    { id: 'vt-comp-pend-imputar', name: 'Comprobantes Pendientes a Imputar', type: 'final' },
                    { id: 'vt-comp-pend-vendedor', name: 'Comprobantes Pendientes por Vendedor', type: 'final' },
                    { id: 'vt-comp-por-camion', name: 'Comprobantes por Camión', type: 'final' },
                    { id: 'vt-comp-det', name: 'Comprobantes Detallados', type: 'final' },
                    { id: 'vt-cambio-estado', name: 'Cambio de Estados Detallado por Comprobante', type: 'final' }
                ]
            },
            {
                id: 'vt-descargas',
                name: 'Descargas',
                children: [
                    { id: 'vt-desc-resumen', name: 'Resumen de descargas', type: 'final' },
                    { id: 'vt-desc-historico', name: 'Histórico de descargas', type: 'final' }
                ]
            },
            {
                id: 'vt-cobranzas',
                name: 'Cobranzas',
                children: [
                    { id: 'vt-cob-pendiente', name: 'Cobranzas Pendientes', type: 'final' },
                    { id: 'vt-cob-detallada', name: 'Cobranzas Detalladas', type: 'final' }
                ]
            },
            {
                id: 'vt-iva-ventas',
                name: 'IVA Ventas',
                children: [
                    { id: 'vt-iva-resumen', name: 'Resumen IVA Ventas', type: 'final' },
                    { id: 'vt-iva-detallado', name: 'IVA Ventas Detallado', type: 'final' }
                ]
            },
            {
                id: 'vt-utilidad',
                name: 'Utilidad por Comprobantes',
                children: [
                    { id: 'vt-util-resumen', name: 'Utilidad por Comprobante', type: 'final' },
                    { id: 'vt-util-detalle', name: 'Utilidad Detallada', type: 'final' }
                ]
            },
            {
                id: 'vt-vencimientos',
                name: 'Vencimientos a Cobrar',
                children: [
                    { id: 'vt-venc-resumen', name: 'Vencimientos a Cobrar', type: 'final' }
                ]
            },
            {
                id: 'vt-ventas',
                name: 'Ventas',
                children: [
                    { id: 'vt-ventas-cliente', name: 'Ventas por Cliente', type: 'final' },
                    { id: 'vt-ventas-fecha', name: 'Ventas por Fecha', type: 'final' },
                    { id: 'vt-ventas-general', name: 'Resumen de Ventas', type: 'final' }
                ]
            },
            {
                id: 'vt-clientes',
                name: 'Clientes',
                children: [
                    { id: 'vt-clientes-general', name: 'Clientes detallados', type: 'final' },
                    { id: 'vt-clientes-deudores', name: 'Clientes deudores', type: 'final' }
                ]
            },
            {
                id: 'vt-tallecolor',
                name: 'Talle / Color',
                children: [
                    { id: 'vt-talle-resumen', name: 'Ventas por Talle', type: 'final' },
                    { id: 'vt-color-resumen', name: 'Ventas por Color', type: 'final' }
                ]
            },
            {
                id: 'vt-proyectos',
                name: 'Proyectos',
                children: [
                    { id: 'vt-proyecto-general', name: 'Proyectos vendidos', type: 'final' },
                    { id: 'vt-proyecto-fecha', name: 'Proyectos por Fecha', type: 'final' }
                ]
            },
            {
                id: 'vt-cuentas',
                name: 'Cuentas',
                children: [
                    { id: 'vt-cuenta-general', name: 'Cuentas corrientes', type: 'final' },
                    { id: 'vt-cuenta-mov', name: 'Movimientos de cuenta', type: 'final' }
                ]
            },
            {
                id: 'vt-otros',
                name: 'Otros',
                children: [
                    { id: 'vt-otros-general', name: 'Listado general de ventas', type: 'final' }
                ]
            }
        ]
    },
    compras: {
        name: 'Compras',
        categories: [
            {
                id: 'cp-ordenes',
                name: 'Órdenes de compra',
                children: [
                    { id: 'cp-ord-proveedor', name: 'Órdenes por Proveedor', type: 'final' },
                    { id: 'cp-ord-pendientes', name: 'Órdenes Pendientes', type: 'final' },
                    { id: 'cp-ord-fecha', name: 'Órdenes por Fecha', type: 'final' }
                ]
            },
            {
                id: 'cp-recepciones',
                name: 'Recepciones',
                children: [
                    { id: 'cp-rec-proveedor', name: 'Recepciones por Proveedor', type: 'final' },
                    { id: 'cp-rec-fecha', name: 'Recepciones por Fecha', type: 'final' }
                ]
            },
            {
                id: 'cp-pagos',
                name: 'Pagos',
                children: [
                    { id: 'cp-pagos-pendientes', name: 'Pagos Pendientes', type: 'final' },
                    { id: 'cp-pagos-fecha', name: 'Pagos por Fecha', type: 'final' }
                ]
            },
            {
                id: 'cp-iva-compras',
                name: 'IVA Compras',
                children: [
                    { id: 'cp-iva-resumen', name: 'IVA Compras Resumen', type: 'final' },
                    { id: 'cp-iva-detallado', name: 'IVA Compras Detallado', type: 'final' }
                ]
            },
            {
                id: 'cp-otros',
                name: 'Otros',
                children: [
                    { id: 'cp-otros-general', name: 'Listado general de compras', type: 'final' }
                ]
            }
        ]
    },
    tesoreria: {
        name: 'Tesorería',
        categories: [
            {
                id: 'ts-cobranzas',
                name: 'Cobranzas',
                children: [
                    { id: 'ts-cob-fecha', name: 'Cobranzas por Fecha', type: 'final' },
                    { id: 'ts-cob-pendientes', name: 'Cobranzas Pendientes', type: 'final' }
                ]
            },
            {
                id: 'ts-pagos',
                name: 'Pagos',
                children: [
                    { id: 'ts-pagos-proveedor', name: 'Pagos a Proveedores', type: 'final' },
                    { id: 'ts-pagos-programados', name: 'Pagos Programados', type: 'final' }
                ]
            },
            {
                id: 'ts-bancos',
                name: 'Bancos',
                children: [
                    { id: 'ts-bancos-mov', name: 'Movimientos Bancarios', type: 'final' },
                    { id: 'ts-bancos-conciliaciones', name: 'Conciliaciones Bancarias', type: 'final' }
                ]
            },
            {
                id: 'ts-caja',
                name: 'Caja',
                children: [
                    { id: 'ts-caja-mov', name: 'Movimientos de Caja', type: 'final' },
                    { id: 'ts-caja-dia', name: 'Caja por Día', type: 'final' }
                ]
            },
            {
                id: 'ts-cheques',
                name: 'Cheques',
                children: [
                    { id: 'ts-cheques-emitidos', name: 'Cheques Emitidos', type: 'final' },
                    { id: 'ts-cheques-recibidos', name: 'Cheques Recibidos', type: 'final' }
                ]
            },
            {
                id: 'ts-otros',
                name: 'Otros',
                children: [
                    { id: 'ts-otros-general', name: 'Listado general de tesorería', type: 'final' }
                ]
            }
        ]
    }
};