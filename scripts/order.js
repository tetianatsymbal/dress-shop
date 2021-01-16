class Order {
    constructor(id) {
        this.form = $(id);
        this.name = this.form.children(".name");
        this.phone = this.form.children(".phone");
        this.email = this.form.children(".email");
        this.cartData = this.form.children(".cart-data");
        this.sendMessage = this.form.children(".send-message");

        this.createEvents();

    }
    send(event){
        event.preventDefault();
        $.ajax({
            "url": "order.php",
            "method": "post",
            "dataType": "json",
            "timeout": 5000,
            "data": {
                name: this.name.val(),
                phone: this.phone.val(),
                email: this.email.val(),
                goods: this.cartData.val()
            },
            "success": (serverResponse) => {
                this.sendMessage.text(serverResponse.message);
            },
            "error": (ajaxObject) => {
                this.sendMessage.text("Возникли техническте проблемы. Повторите попытку позже.");
            },
            "complete": (ajaxObject) => {
                console.log(ajaxObject);
            }
        });
    }
    createEvents(){
        this.form.submit(this.send.bind(this));
    }
}