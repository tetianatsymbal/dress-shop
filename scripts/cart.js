class Cart extends Component{
  constructor(cardId, catalogId){
    super(catalogId);
    this.cartBlock = $(cardId);
    this.goodsList = this.cartBlock.find(".ftco-cart");
    this.goodsTable = this.cartBlock.find(".cart");
    this.cartGoodsQty = this.cartBlock.find(".total-goods-qty");
    this.goodsInCartTemplete = this.cartBlock.find(".cart-goods:first-child");
    this.cartLink = this.cartBlock.find(".cart-link");
    // this.del-goods-link = this.cartBlock.find(".del-goods-link");
    this.goods = {}; //id : quantity
    this.deliveryPrice = this.cartBlock.find(".delivery-price");
    this.subtotal = this.cartBlock.find(".subtotal");
    this.subtotalWithDiscount = this.cartBlock.find(".subtotal-with-discount");
    this.total = this.cartBlock.find(".total-payment");

    $.cookie.json = true;

    this.setCartData();
    this.load();
    this.createEvents();
  }
  setCookie(){
    $.cookie("cardGoods", this.goods);
  }
  getCookie(){
    this.goods = $.cookie("cardGoods");
  }
  setCartData(){
    this.getCookie();
    let totalQty = 0,
        price = 0,
        discount = 0,
        title = "",
        totalForGoods = 0,
        subtotal = 0,
        subtotalWithDiscount = 0,
        total = 0,
        currentGoods = null,
        orderData = ``
        // orderData = {}
      ;
    for(let id in this.goods){
      totalQty += + this.goods[id];
      currentGoods = this.goodsTable.find(`.cart-goods_${id}`);
      title = currentGoods.find(".goods-title a").text();
      price = currentGoods.find(`.goods-price`).text();
      discount = + currentGoods.find(`.goods-discount`).text();
      totalForGoods = price * this.goods[id];
      subtotal += totalForGoods;
      subtotalWithDiscount += (price - price * discount / 100 )* this.goods[id];
      // orderData[id] = {
      //   "title": title,
      //   "price": price,
      //   "qty" : this.goods[id],
      //   "total": totalForGoods
      // };
      orderData += `${id}: ${title} ${price}$ ${this.goods[id]}, ${totalForGoods}. `;
    }
    order.cartData.val(orderData);
    console.log(orderData);
    this.cartGoodsQty.text(totalQty);
    this.subtotal.text(subtotal);
    this.subtotalWithDiscount.text(subtotalWithDiscount);
    this.deliveryPrice.text(DELIVERYPRICE);
    this.total.text(subtotalWithDiscount + DELIVERYPRICE);
  }
  add(event){
    event.preventDefault();
    let currentGoods = $(event.currentTarget).closest(".product"),
        currentGoodsData = this.put(currentGoods)
        ;

    this.goods[currentGoodsData.id] = currentGoodsData.quantity;
    this.setCookie();
    this.setCartData();
    this.goodsList.slideDown();
  }
  put(currentGoods){
    let currentGoodsId = currentGoods.attr("id"),
      currentGoodsInCartTemplate = this.goodsInCartTemplete.clone(),
      currentGoodsClass = `cart-goods_${currentGoodsId}`,
      existingGoodsInCart =  this.goodsTable.find(`.${currentGoodsClass}`),
      currentGoodsQuantity = 0
      ;
      currentGoodsInCartTemplate.addClass(currentGoodsClass);
      currentGoodsInCartTemplate.attr("id", `cart-${currentGoodsId}`);

        if(existingGoodsInCart.length){
          //товар в корзине
          this.copyData(currentGoods, existingGoodsInCart, [".goods-qty"]);
          currentGoodsQuantity = this.setTotalPrice(existingGoodsInCart, currentGoodsId);
          existingGoodsInCart.find(".goods-total-calc-btn").click(() => {
            currentGoodsQuantity = this.setTotalPrice(existingGoodsInCart, currentGoodsId);
          });
        }
        else{
          // товара нет в корзине
          this.copyData(currentGoods, currentGoodsInCartTemplate, [".goods-photo", ".goods-title", ".goods-discount", ".goods-price"]);
          currentGoodsQuantity = this.setTotalPrice(currentGoodsInCartTemplate, currentGoodsId);
          currentGoodsInCartTemplate.find(".goods-total-calc-btn").click(() => {
            currentGoodsQuantity = this.setTotalPrice(currentGoodsInCartTemplate, currentGoodsId);
          }); 
          currentGoodsInCartTemplate.find(".del-goods-link").click(this.delete.bind(this));
          this.goodsTable.append(currentGoodsInCartTemplate);
        }
      return {"id" : currentGoodsId, "quantity" : currentGoodsQuantity};
  }
  setTotalPrice(currentGoods, currentGoodsId){
    let price = currentGoods.find(".goods-price").text(),
      discount = currentGoods.find(".goods-discount").text(),
      discountSum = discount ?  price * discount / 100 : 0,
      quantity = currentGoods.find(".goods-qty").val(),
      total = (price - discountSum) * quantity
    ;
    currentGoods.find(".goods-total").text(total);
    this.goods[currentGoodsId] = quantity;
    this.setCookie();
    this.setCartData();
    return quantity
  }

  copyData(sourceGoods, destinationGoods, cssClassList){
    let discount = 0;
    cssClassList.forEach((currentClass) => {
      const sourceGoodsElem = sourceGoods.find(currentClass);
      const destinationGoodsElem = destinationGoods.find(currentClass);
      const tagName = destinationGoodsElem.prop("tagName");
        if(tagName == "IMG"){
          destinationGoodsElem.attr("src", sourceGoodsElem.attr("src"));
        }
        else if(tagName == "H3" || tagName == "SPAN"){
          if(currentClass == ".goods-discount"){
            discount = + sourceGoodsElem.text();
          }
          destinationGoodsElem.html(sourceGoodsElem.html());
        }
        else if (tagName == "INPUT"){
          // console.log(destinationGoodsElem.val());
          destinationGoodsElem.val( + destinationGoodsElem.val() + 1);
        }
    });
  }
  delete(event){
    event.preventDefault();
    let currentGoods = $(event.currentTarget).closest(".cart-goods"),
        currentGoodsId = currentGoods.attr("id").replace("cart-", "")
      ;

    currentGoods.remove();

    delete this.goods[currentGoodsId];
    this.setCookie();
    this.setCartData();

  }
  toggleCard(event){
    event.preventDefault();
    this.goodsList.slideToggle();
  }
  load(){
    this.getCookie();
  
      if(this.goods){
        for(let id in this.goods){
          let currentGoods = this.elem.find(`#${id}`);
          this.put(currentGoods);
        }
      }
      else{
       this.goods = {};
      }
  }
  createEvents(){
    this.elem.find(".add-to-cart").click(this.add.bind(this));
    this.cartLink.click(this.toggleCard.bind(this));
  }
}
let order = new Order ("#order")
let cart = new Cart ("#cart", "#catalog");