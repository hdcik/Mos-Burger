let setItemProductList = JSON.parse(localStorage.getItem('mainProductList'))
function addItem() {


    let productName = document.getElementById("inputProductName").value;
    let productPrice = document.getElementById("inputProductPrice").value;
    let productQty = document.getElementById("inputProductQty").value;
    let productCategory = document.getElementById("inputProductCategory").value;
    let ProductImage = document.getElementById("inputProductImage").value;

    console.log(productPrice);

    setItemProductList.push(
        {
            name: productName,
            price: productPrice,
            Qty:productQty,
            category: productCategory,
            image: ProductImage
        }
    );
    localStorage.setItem('mainProductList', JSON.stringify(setItemProductList));

}