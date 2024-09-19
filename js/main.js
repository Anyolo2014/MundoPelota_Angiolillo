const tarjetas = document.getElementById('tarjetas');
const items = document.getElementById('items');
const pie = document.getElementById('pie');
const templateTarjeta = document.getElementById('template-tarjeta').content;
const templatePie = document.getElementById('template-pie').content;
const templateCarrito = document.getElementById('template-carrito').content;
const fragment = document.createDocumentFragment();
let carrito = {};

document.addEventListener('DOMContentLoaded',() => {
    fetchData();
    if(localStorage.getItem('carrito')){

        carrito = JSON.parse(localStorage.getItem());
        pintarCarrito();
    }

});

tarjetas.addEventListener('click', e => {
    addCarrito(e);
});

items.addEventListener('click', e => 
    {
        btnAccion(e);
    });

const fetchData = async () => {
    try
        {
            const res = await fetch('productos.json');
            const data = await res.json();
            printTarjetas(data);
        } catch(error)
            {
                console.log(error);
            }

};

const printTarjetas = (data) => {
    data.forEach(pelota => {
        templateTarjeta.querySelector('h5').textContent = pelota.titulo;
        templateTarjeta.querySelector('p').textContent = pelota.precio + "$";
        templateTarjeta.querySelector('img').setAttribute("src", pelota.img);
        templateTarjeta.querySelector('.btn-success').dataset.id = pelota.id;

        const clone = templateTarjeta.cloneNode(true);
        fragment.appendChild(clone);
    });

    tarjetas.appendChild(fragment);
};

const addCarrito = e => {
    if(e.target.classList.contains('btn-success'))
        {
            setCarrito(e.target.parentElement);
        }
        e.stopPropagation();
};

const setCarrito = objeto => {

    const pelota = {
        id : objeto.querySelector('.btn-success').dataset.id,
        titulo : objeto.querySelector('h5').textContent,
        precio : objeto.querySelector('p').textContent,
        cantidad : 1
    };

    if(carrito.hasOwnProperty(pelota.id))
        {
            pelota.cantidad = carrito[pelota.id].cantidad + 1;
        }
    
    carrito[pelota.id] = {...pelota};
    console.log(carrito);
    pintarCarrito();
};

const pintarCarrito = () => {
    items.innerHTML = '';

    Object.values(carrito).forEach(pelota => {
        templateCarrito.querySelector('th').textContent = pelota.id;
        templateCarrito.querySelectorAll('td')[0].textContent = pelota.titulo;
        templateCarrito.querySelectorAll('td')[1].textContent = pelota.cantidad;
        templateCarrito.querySelector('.btn-success').dataset.id = pelota.id;
        templateCarrito.querySelector('.btn-danger').dataset.id = pelota.id;
        templateCarrito.querySelector('span').textContent = parseFloat(pelota.cantidad) * parseFloat(pelota.precio);

        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    });

    items.appendChild(fragment);

    pintarFooter();

    localStorage.setItem('carrito', JSON.stringify(carrito));
};

const pintarFooter = () => {

    pie.innerHTML = '';

    if(Object.keys(carrito).length === 0)
        {
            pie.innerHTML = `
                <th scope="row" colspan="5">Carrito vacío - ¡Comience a comprar!</th>
            `;
            return ;
        }

        const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0);
        const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + (parseFloat(cantidad)*parseFloat(precio)), 0);
        
        templatePie.querySelectorAll('td')[0].textContent = nCantidad;
        templatePie.querySelector('span').textContent = nPrecio;

        const clone = templatePie.cloneNode(true);
        fragment.appendChild(clone);
        pie.appendChild(fragment);

        const btnVaciar = document.getElementById('vaciar-carrito');

        btnVaciar.addEventListener('click', () => {
            carrito ={};
            pintarCarrito();

        });
    };

    const btnAccion = e =>{

        if(e.target.classList.contains('btn-success'))
            {
                const pelota = carrito[e.target.dataset.id];
                pelota.cantidad++;
                carrito[e.target.dataset.id] = {...pelota};
                pintarCarrito();
            }

            if(e.target.classList.contains('btn-danger'))
            {
                console.log('dentro')
                const pelota = carrito[e.target.dataset.id];
                if(pelota.cantidad === 0)
                    {
                        delete carrito[e.target.dataset.id];
                    }else
                        {
                            pelota.cantidad--;
                        }
                pintarCarrito();
            }
            e.stopPropagation();
    };