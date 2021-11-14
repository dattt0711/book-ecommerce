function preventClick(e){
    e.preventDefault();
}
// let s = JSON.stringify({a: 1, b: 'Textual content'});
// async function fetchApi(){
//     await fetch('http://localhost:3000/api',{
//       headers:{
//       "Content-Type": 'application/json',
//       'Accept': 'application/json',
//       },
//       method: 'POST',
//       body: s
//     }).then(data => {
//     	return data.json();
//     }).then(data => {
//     	console.log(data)
//     })
 
//   }
//   fetchApi();

const $$ = document.querySelectorAll.bind(document);
const $ = document.querySelector.bind(document);


let plus = $$('.cart-body__qty-plus');
let minus = $$('.cart-body__qty-minus')
let deleteBtn = $$('.cart-body__remove');
let addCategory = $('.add-category-btn');
let editCategory = $$('.edit-category-btn');
let totalSpan = $('.cart__totals-price');
plus.forEach(e=>{
    e.addEventListener('click', async (plusIcon)=>{
        let id = plusIcon.target.id;
        let updateData = await changeQty(id, {sign: 'plus'});
        console.log(updateData);
        let {updateBook, total} = updateData;
        console.log(updateBook)
        let qty = plusIcon.target.previousElementSibling;
        let idTrim = id.trim();
        let classname = `[class='cart-body__amount ${idTrim}']`
        let amount = $(`${classname}`);   
        totalSpan.children[0].children[0].textContent = total;
        qty.textContent = updateBook.qty;
        amount.textContent = Number(qty.textContent) * updateBook.price;
        if(qty.textContent > 1){
            plusIcon.target.parentNode.firstElementChild.classList.remove('disabled');
        }
        else{
            plusIcon.target.parentNode.firstElementChild.classList.add('disabled');
        }
    })
})

minus.forEach(e=>{
    e.addEventListener('click', async (minusIcon)=>{
        let id = minusIcon.target.id;
        let qty = minusIcon.target.nextElementSibling;
        let idTrim = id.trim();
        let classname = `[class='cart-body__amount ${idTrim}']`
        let amount = $(`${classname}`);  
        if(qty.textContent > 1) {
            let updateData = await changeQty(id, {sign: 'minus'});
            let {updateBook, total} = updateData;
            totalSpan.children[0].children[0].textContent = total;
            qty.textContent = updateBook.qty;
            amount.textContent = Number(qty.textContent) * updateBook.price;
            minusIcon.target.classList.remove('disabled');
            if(qty.textContent == 1) {
                minusIcon.target.classList.add('disabled');
            }
        }
    })
})

deleteBtn.forEach(e=>{
    e.addEventListener('click',async (deleteIcon) => {     
        let id = deleteIcon.target.parentNode.id;
        await deleteBook(id);
        deleteIcon.target.parentNode.parentNode.parentNode.remove();
        
    })
})


let changeQty = async function(id, sign){
    return await fetch(`http://localhost:3000/cart/changeQty/${id}`,{
        headers:{
            "Content-Type": 'application/json',
            'Accept': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(sign)
    }).then(data=> data.json());
}
let deleteBook = async function(id){
    return await fetch(`http://localhost:3000/cart/deleteBook/${id}`,{
            method: 'DELETE',
    }).then(data=>data.json())
}


// Add category

addCategory.addEventListener('click', function(){
    let popup = $('.pop-up-category');  
    popup.style.display = "flex";
    popup.children[0].lastElementChild.addEventListener('click', function(){
        popup.style.display = "none";
    })
})


// Edit category
editCategory.forEach(e=>{
    e.addEventListener('click', function(element){
        let popup = element.target.parentElement.parentElement.parentElement.querySelector('.pop-up-category-edit');
        popup.style.display = "flex";
        popup.children[0].lastElementChild.addEventListener('click', function(){
            popup.style.display = "none";
        })
    })
})

