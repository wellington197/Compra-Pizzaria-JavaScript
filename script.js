let modalQt=1;
let cart=[];
let modalKey=0;

//Criar um função anônima
const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);


///////////////////Função de mapeamento do item no arquivo JSon
pizzaJson.map((item, index)=>{
    //preencher as informações em pizzaitem
    let pizzaItem = c('.models .pizza-item').cloneNode(true);


    // setando a chave da pizza em específico para saber qual item eu cliquei
    pizzaItem.setAttribute('data-key', index);




    /*Área de inserção das informçãoes no modal das pizzas*/

    //selecionando imagem na tela para substituição das imagens da pizza. Neste campo tem de buscar a TAG img
    pizzaItem.querySelector('.pizza-item--img img').src=item.img;
    //selecionando o prço do item. Usando também o template String
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;

    //selecionando o prço do item. Usando também o template String
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    
    //selecionando o prço do item. Usando também o template String
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;


    //Criar evento no botão de click para criar Modal
    pizzaItem.querySelector('a').addEventListener('click',(e)=>{
        e.preventDefault();
      
     
        
        let key=e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt=1;
        modalKey= key;

            /*Inserindo os itens no pizzaWindowArea*/
            c('.pizzaBig img').src=pizzaJson[key].img;
            c('.pizzaInfo h1').innerHTML=pizzaJson[key].name;
            c('.pizzaInfo--desc').innerHTML=pizzaJson[key].description;
            c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;

            //remover a seleção do botão select
            c('.pizzaInfo--size.selected').classList.remove('selected');
            //inserindo o peso das pizzas
            cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
                if(sizeIndex == 2){
                    size.classList.add('selected');
                }

                size.querySelector('span').innerHTML=pizzaJson[key].sizes[sizeIndex];
            });

            //Inserir a quantidade de pizzas no modal
            c('.pizzaInfo--qt').innerHTML=modalQt;


            /*Área de inserção do tempo de transição da janela ao clicar nas pizzas*/
            c('.pizzaWindowArea').style.opacity=0;
            c('.pizzaWindowArea').style.display='flex';

                //Setar tempo para a transição da janela do carrinho na sua abertura
                setTimeout(()=>{
                    c('.pizzaWindowArea').style.opacity=1;
                },200);
            


            })

            //Listar as pizzas na área 
            c('.pizza-area').append(pizzaItem);


});//fim do mapeamento de item



///////////////////////////////////Eventos do Modal

function closeModal(){
            /*Área de inserção do tempo de transição da janela ao clicar nas pizzas*/
            c('.pizzaWindowArea').style.opacity=0;

            //Esperar meio segundo para fechar 
            setTimeout(()=>{
                c('.pizzaWindowArea').style.display='none';
            },500);
}//fim do close Modal

//selecionando os botões de cancelar e voltar para fechar window
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
            item.addEventListener('click',closeModal);
});



////////////////////Inserindo as funções dos botões de inserir mais e menos

//aumentar a quantidade
c('.pizzaInfo--qtmais').addEventListener('click',()=>{
    modalQt++;
    //Inserir a quantidade de pizzas no modal
    c('.pizzaInfo--qt').innerHTML=modalQt;

});

//diminuir a quantidade
c('.pizzaInfo--qtmenos').addEventListener('click',()=>{
   
    //validar se o valor é acima de 1
    if(modalQt>1){
        modalQt--;
    }
    //Inserir a quantidade de pizzas no modal
    c('.pizzaInfo--qt').innerHTML=modalQt;

});

////////////////////Função de inserir os tamanhos e quantidade no carrinho ao clicar no botão

//inserindo o peso das pizzas
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click',(e)=>{
        //remover a seleção do botão select
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});


//////////////////// Adicionar ação do botão ao carrinho

c('.pizzaInfo--addButton').addEventListener('click', ()=>{

    let size=c('.pizzaInfo--size.selected').getAttribute('data-key');
    
    // adicionar identificador a Pizza pelo códiog e tamanho.
    let identifier=pizzaJson[modalKey].id+'@'+size;

    //ele irá retornar valor -1 se item existir já no carrinho
    let key=cart.findIndex((item)=>item.identifier == identifier);

    // se resultado do letKey for -1 executar a ação
    if (key>-1){
            cart[key].qt+=modalQt;
    }else{
            cart.push({
                identifier,
                id:pizzaJson[modalKey].id,
                size,
                qt:modalQt
            });
    }
    //Atualizar o carrinho
    updateCart();
    //Fecha o modal
    closeModal();
});


// Função de click para abrir carrinho
c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length>0){
        c('aside').style.left='0';

    }
});

//Fechar o menu do carrinho
c('.menu-closer').addEventListener('click', ()=>{
    if(cart.length>0){
        c('aside').style.left='100vw';

    }
});

/////////////// Função de atulaizar o carrinho de compras

function updateCart(){

    //adicionar a quantidade no carrinho
    c('.menu-openner span').innerHTML=cart.length;

    if(cart.length>0){
        c('aside').classList.add('show');

        //zerar HTML para não efetuar a repatição
        c('.cart').innerHTML='';


            let subtotal=0;
            let desconto=0;
            let total=0;

            for(let i in cart){
                let pizzaItem=pizzaJson.find((item)=>item.id==cart[i].id);

                subtotal +=pizzaItem.price*cart[i].qt;

                // clonar cart item e clonar na tela
                let cartItem=c('.models .cart--item').cloneNode(true);

                let pizzaSizeName;
                switch(parseInt(cart[i].size)){
                    case 0:
                        pizzaSizeName='P';
                        break;
                    case 1:
                        pizzaSizeName='M';
                        break;
                    case 2:
                        pizzaSizeName='G';
                        break;                                    
                }


                let pizzaName=`${pizzaItem.name} (${pizzaSizeName})`;

                cartItem.querySelector('img').src=pizzaItem.img;
                cartItem.querySelector('.cart--item-nome').innerHTML=pizzaName;
                cartItem.querySelector('.cart--item--qt').innerHTML=cart[i].qt;
                
                //Adiconar eventos de click nos botões de mais e menos
                cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                    if(cart[i].qt>1){
                        cart[i].qt--;
                    }else{
                        cart.splice(i, 1);
                    }
                    updateCart();  
                
                    });
                
                cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                    cart[i].qt++;
                    updateCart();                
                     });               
                
                
                c('.cart').append(cartItem);


            }
            desconto=subtotal*0.1;

            total=subtotal-desconto;

            c('.subtotal span:last-child').innerHTML=`R$ ${subtotal.toFixed(2)}`;
            
            c('.desconto span:last-child').innerHTML=`R$ ${desconto.toFixed(2)}`;
            
            c('.total span:last-child').innerHTML=`R$ ${total.toFixed(2)}`;


    }else{
        c('aside').classList.remove('show');
        c('aside').style.left='100vw';

    }
}

