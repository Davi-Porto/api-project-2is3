// addCart(id)
// removeCart(id)
// editCart(id)
// locAt()
// nav-tab-items swap
const navTabs = document.querySelectorAll('.nav-tab-items');
const mains = document.querySelectorAll('.mains');
const cartContent = document.querySelector('#cart-content');

navTabs.forEach(v=>{
    v.addEventListener('click', swapTabs);
});

function swapTabs(e){
    if(!e.target.classList.contains('active')){
        navTabs.forEach(v=>{
            v.classList.toggle('active');
        });
        mains.forEach(v=>{
            v.classList.toggle('none');
        })
    }
}

function loadCart(){
    var cart=locAt();
    if(cart.length>0){
        cartContent.innerHTML="";
        cart.forEach((v, i)=>{
            const cartItem=`<tr value="${i}">
                                <th class="text-primary" scope="row">${i+1}</th>
                                <td>${v.nome}</td>
                                <td>${v.quantidade}</td>
                                <td>R$ ${convertBR(v.valor)}</td>
                                <td>R$ ${convertBR(v.valor*v.quantidade)}</td>
                                <td>
                                    <button type="button" class="btn btn-danger">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                    <button type="button" class="btn">
                                        <i class="fa-solid fa-gear"></i>
                                    </button>
                                </td>
                            </tr>`
            cartContent.innerHTML+=cartItem;
        });
    }
}

function addCart(id, q=1){
    if(id && typeof(id)=='number' && typeof(q)=='number'){
        listByID(id).then(data=>{
            if(data){
                var item={
                    id: data.id,
                    nome: data.nome,
                    quantidade: q,
                    valor: data.valor
                };
                var cart = locAt();
                cart.push(item);
                localStorage.setItem('cart', JSON.stringify(cart));
                loadCart();
            }else{
                alert('Produto inexistente, atualize a página');
            }
        });
    }
}

function locAt(){
    var cart = [];
    if(localStorage.cart){
        cart = JSON.parse(localStorage.cart);
    }else{
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    return cart
}