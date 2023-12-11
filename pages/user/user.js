// addCart(id)
// removeCart(id)
// editCart(id)
// locAt()
// nav-tab-items swap
const navTabs = document.querySelectorAll('.nav-tab-items');
const mains = document.querySelectorAll('.mains');
const cartContent = document.querySelector('#cart-content');
const modal = document.querySelector('#modalAddCart');
const bsModal = new bootstrap.Modal('#modalAddCart');
const modalEdit = document.querySelector('#modalEditCart');
const bsModalEdit = new bootstrap.Modal('#modalEditCart');


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
                                    <button type="button" class="btn btn-danger" onclick="removeCart(this.parentNode.parentNode)">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                    <button type="button" class="btn" onclick="editCart(this.parentNode.parentNode)">
                                        <i class="fa-solid fa-gear"></i>
                                    </button>
                                </td>
                            </tr>`
            cartContent.innerHTML+=cartItem;
        });
    }else{
        cartContent.innerHTML=`<tr value="-1">
                                    <th class="text-primary" scope="row"></th>
                                    <td colspan="5">Sem itens no carrinho</td>
                                </tr>`;
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

async function modalCartAdd(o){
    await listByID(parseInt(o)).then(data=>{
        if(data){
            localStorage.setItem('cartAdd', JSON.stringify({
                id: data.id,
                q: 1
            }));
            if(linkValidation(data.foto)){
                modal.querySelector("#imgCartAdd").src=data.foto;
            }else{
                modal.querySelector("#imgCartAdd").src="../g_style/assets/no-photo.png";
            }
            modal.querySelector("#nameCartAdd").value=data.nome;
            modal.querySelector("#valueCartAdd").value="R$ "+convertBR(data.valor);
            modal.querySelector("#valueCartAdd").setAttribute('data-value', data.valor);
            modal.querySelector("#qCartAdd").addEventListener('input', (e)=>{
                if(e.target.value==""||parseInt(e.target.value)<=0){
                    e.target.value=1;
                }
                modal.querySelector("#totalCartAdd").value="R$ "+convertBR(modal.querySelector("#valueCartAdd").getAttribute('data-value')*modal.querySelector("#qCartAdd").value);
                localStorage.setItem('cartAdd', JSON.stringify({
                    id: data.id,
                    q: e.target.value
                }));
            });
            modal.querySelector("#qCartAdd").dispatchEvent(new Event('input'));
        }
    });
    bsModal.show();
    modal.querySelector("#btnCloseModalCardAdd").addEventListener('click', modalClose);
}

function modalClose(e){
    if(localStorage.cartAdd){
        const active = JSON.parse(localStorage.cartAdd);
        addCart(parseInt(active.id), parseInt(active.q));
        bsModal.hide();
    }
    modal.querySelector("#btnCloseModalCardAdd").removeEventListener('clcik', modalClose);
    localStorage.removeItem('cartAdd');
}

function removeCart(id){
    if(localStorage.cart && id){
        id=id.getAttribute('value');
        const cart = JSON.parse(localStorage.cart);
        if(id<cart.length){
            cart.forEach((v, i)=>{
                if(i==id){
                    cart.splice(i, 1);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    loadCart();
                }
            })
        }
    }
}

function editCart(id){
    if(localStorage.cart && id){
        id=id.getAttribute('value');
        const cart = JSON.parse(localStorage.cart);
        if(id < cart.length && id>=0){
            cart.forEach((v, i)=>{
                if(i==id){
                    modalCartEdit(i);
                }
            })
        }
    }
}

async function modalCartEdit(i){
    const cart = JSON.parse(localStorage.cart);
    const v = cart[i];
    await listByID(parseInt(v.id)).then(data=>{
        if(data){
            localStorage.setItem('cartEdit', JSON.stringify({
                i: i,
                q: v.quantidade
            }));
            if(linkValidation(data.foto)){
                modalEdit.querySelector("#imgCartEdit").src=data.foto;
            }else{
                modalEdit.querySelector("#imgCartEdit").src="../g_style/assets/no-photo.png";
            }
            modalEdit.querySelector("#nameCartEdit").value=data.nome;
            modalEdit.querySelector("#valueCartEdit").value="R$ "+convertBR(data.valor);
            modalEdit.querySelector("#valueCartEdit").setAttribute('data-value', data.valor);
            modalEdit.querySelector("#qCartEdit").value=v.quantidade;
            modalEdit.querySelector("#qCartEdit").addEventListener('input', (e)=>{
                if(e.target.value==""||parseInt(e.target.value)<=0){
                    e.target.value=1;
                }
                modalEdit.querySelector("#totalCartEdit").value="R$ "+convertBR(modalEdit.querySelector("#valueCartEdit").getAttribute('data-value')*modalEdit.querySelector("#qCartEdit").value);
                localStorage.setItem('cartEdit', JSON.stringify({
                    i: i,
                    q: e.target.value
                }));
            });
            modalEdit.querySelector("#qCartEdit").dispatchEvent(new Event('input'));
        }else{
            alert("Este produto não existe mais");
        }
    });
    bsModalEdit.show();
    modalEdit.querySelector("#btnCloseModalCardEdit").addEventListener('click', modalEditClose);
}

function modalEditClose(e){
    if(localStorage.cartEdit){
        const cart = JSON.parse(localStorage.cart);
        const active = JSON.parse(localStorage.cartEdit);
        const aux = cart[active.i];
        aux.quantidade=active.q;
        cart[active.i]=aux;
        localStorage.setItem('cart', JSON.stringify(cart));
        bsModalEdit.hide();
        loadCart();
    }
    modalEdit.querySelector("#btnCloseModalCardEdit").removeEventListener('clcik', modalEditClose);
    localStorage.removeItem('cartEdit');
}