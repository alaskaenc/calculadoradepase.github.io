// Precios de pase por unidad definidos para cada tipo de prenda
const datosPrendas = {
    camperas: { pase: 2.30 },
    conjuntos: { pase: 1.70 },
    pantalon: { pase: 1.50 },
    sweaters: { pase: 1.20 },
    "tapados grandes": { pase: 2.50 },
    rompeviento: { pase: 1.20 },
    ponchos: { pase: 2.00 },
    Zapatillas: { pase: 1.20 },
    "mochilas carteras": { pase: 1.50 },
    chalecos: { pase: 2.00 },
    valijas: { pase: 15.00 },
    butacas: { pase: 1.00 },
    sabanas: { pase: 2.00 }
};

let uniqueProductId = 0; // Para dar un ID único a cada producto agregado a la lista
const currentBoletaProducts = []; // Array para almacenar los productos que forman la boleta

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa el formulario de entrada:
    resetInputForm();

    // Event listener para el botón "Añadir a la Boleta"
    document.getElementById('add-to-boleta-btn').addEventListener('click', addProductToBoleta);

    // *** NUEVA LÓGICA DE NAVEGACIÓN CON ENTER ***
    const tipoPrendaSelect = document.getElementById('tipo_prenda');
    const cantidadInput = document.getElementById('cantidad');
    const precioBaseInput = document.getElementById('precio_base');
    const paseUnidadInput = document.getElementById('pase_unidad');
    const addBoletaBtn = document.getElementById('add-to-boleta-btn');

    // Manejar Enter en el select de Tipo de Prenda
    tipoPrendaSelect.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Previene cualquier acción por defecto del Enter en el select
            cantidadInput.focus(); // Salta a Cantidad
        }
    });

    // Manejar Enter en Cantidad
    cantidadInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            precioBaseInput.focus(); // Salta a Precio Unitario
        }
    });

    // Manejar Enter en Precio Unitario
    precioBaseInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            paseUnidadInput.focus(); // Salta a Pase por Unidad
        }
    });

    // Manejar Enter en Pase por Unidad
    paseUnidadInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addBoletaBtn.click(); // Simula un clic en el botón Añadir a la Boleta
        }
    });
});

/**
 * Obtiene el ID único para el próximo producto a añadir a la boleta.
 * @returns {number} Nuevo ID único.
 */
function getUniqueProductId() {
    uniqueProductId++;
    return uniqueProductId;
}

/**
 * Actualiza el valor del "Pase por Unidad" basándose en el tipo de prenda seleccionada.
 */
function actualizarPase() {
    const tipoPrendaSelect = document.getElementById('tipo_prenda');
    const paseUnidadInput = document.getElementById('pase_unidad');

    const selectedType = tipoPrendaSelect?.value;
    const data = datosPrendas[selectedType];

    if (data && paseUnidadInput) {
        paseUnidadInput.value = data.pase.toFixed(2);
    } else if (paseUnidadInput) {
        paseUnidadInput.value = (0.00).toFixed(2);
        console.warn(`Tipo de prenda '${selectedType}' no encontrada en datosPrendas.`);
    }
}

/**
 * Agrega el producto del formulario de entrada a la lista de la boleta.
 */
function addProductToBoleta() {
    const tipoPrendaSelect = document.getElementById('tipo_prenda');
    const cantidadInput = document.getElementById('cantidad');
    const precioBaseInput = document.getElementById('precio_base');
    const paseUnidadInput = document.getElementById('pase_unidad');

    const prendaDisplay = tipoPrendaSelect.options[tipoPrendaSelect.selectedIndex].textContent;
    const cantidad = parseFloat(cantidadInput.value);
    const precioBase = parseFloat(precioBaseInput.value) || 0;
    const paseUnidad = parseFloat(paseUnidadInput.value);

    // Validaciones básicas antes de añadir
    if (isNaN(cantidad) || cantidad <= 0 || isNaN(paseUnidad) || paseUnidad < 0) {
        alert('Por favor, ingresa una cantidad válida (mayor a 0) y un pase por unidad válido (mayor o igual a 0).');
        return;
    }

    // Total Producto = Cantidad * Pase por Unidad
    const totalProducto = cantidad * paseUnidad;

    currentBoletaProducts.push({
        id: getUniqueProductId(),
        prendaDisplay: prendaDisplay,
        cantidad: cantidad,
        precioUnitario: precioBase,
        paseUnitario: paseUnidad,
        totalProducto: totalProducto
    });

    // Resetea el formulario de entrada y pone el foco en el primer campo
    resetInputForm();
    // Actualiza la tabla de resumen y el total general
    updateBoletaSummary();
}

/**
 * Elimina un producto de la lista de la boleta por su ID único.
 */
function removeProductFromBoleta(id) {
    const indexToRemove = currentBoletaProducts.findIndex(product => product.id === id);
    if (indexToRemove > -1) {
        currentBoletaProducts.splice(indexToRemove, 1);
        updateBoletaSummary();
    }
}

/**
 * Recalcula el total general de la boleta y actualiza la tabla de resumen.
 */
function updateBoletaSummary() {
    const summaryTableBody = document.getElementById('summary-table-body');
    const summaryTotalGeneralSpan = document.getElementById('summary-total-general');

    let totalGeneral = 0;
    let tableRowsHTML = '';

    currentBoletaProducts.forEach(product => {
        totalGeneral += product.totalProducto;
        tableRowsHTML += `
            <tr>
                <td>${product.cantidad}</td>
                <td>${product.prendaDisplay}</td>
                <td>$${product.precioUnitario.toFixed(2)}</td>
                <td>$${product.paseUnitario.toFixed(2)}</td>
                <td>$${product.totalProducto.toFixed(2)}</td>
                <td>
                    <button type="button" class="remove-product-summary-btn" onclick="removeProductFromBoleta(${product.id})">X</button>
                </td>
            </tr>
        `;
    });

    summaryTableBody.innerHTML = tableRowsHTML;
    summaryTotalGeneralSpan.textContent = totalGeneral.toFixed(2);
}

/**
 * Resetea los campos del formulario de entrada a sus valores iniciales.
 * Después de resetear, coloca el foco en el primer campo de entrada para facilitar la carga rápida.
 */
function resetInputForm() {
    const tipoPrendaSelect = document.getElementById('tipo_prenda');
    tipoPrendaSelect.value = 'camperas';
    document.getElementById('cantidad').value = '1';
    document.getElementById('precio_base').value = '';
    actualizarPase();

    // Poner el foco en el primer campo de entrada (Tipo de Prenda)
    tipoPrendaSelect.focus();
}