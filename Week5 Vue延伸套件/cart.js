import userProductModal from './userProductModal.js';

Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
        VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

VeeValidate.defineRule('email', VeeValidateRules.email)
VeeValidate.defineRule('required', VeeValidateRules.required)
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
    validateOnInput: true, // 調整為輸入字元立即進行驗證
});

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const api_path = '124478313';

Vue.createApp({
    data() {
        return {
            cartData: {},
            product: [],
            products: [],
            productId: '',
            isLoadingItem: '',
            form: {
                user: {
                    name: '',
                    email: '',
                    tel: '',
                    address: '',
                },
                message: '',
            },

        }
    },
    components: {
        VForm: Form,
        VField: Field,
        ErrorMessage: ErrorMessage,
    },
    methods: {
        getProducts() {
            axios.get(`${apiUrl}/api/${api_path}/products/all`)
                .then((res) => {
                    this.products = res.data.products;
                });
        },
        openProductModal(id) {
            axios.get(`${apiUrl}/api/${api_path}/product/${id}`)
                .then((res) => {
                    this.product = res.data.product;
                    this.$refs.userProductModal.openModal();
                });
        },
        getCart() {
            axios.get(`${apiUrl}/api/${api_path}/cart`).then((res) => {
                this.cartData = res.data.data;

            });
        },
        deleteAllCarts() {
            axios.delete(`${apiUrl}/api/${api_path}/carts`).then((response) => {
                alert(response.data.message);
                this.getCart();
            }).catch((err) => {
                alert(err.data.message);
            });
        },
        addToCart(id, qty = 1) {
            const data = {
                product_id: id,
                qty,
            };
            this.isLoadingItem = id;

            axios.post(`${apiUrl}/api/${api_path}/cart`, { data }).then((res) => {

                this.getCart();
                this.$refs.userProductModal.hideModal();
                this.isLoadingItem = '';
            });
        },
        removeCartItem(id) {
            this.isLoadingItem = id;
            axios.delete(`${apiUrl}/api/${api_path}/cart/${id}`).then((res) => {
                console.log(res);
                this.getCart();
                this.isLoadingItem = '';
            });
        },
        createOrder() {
            const url = `${apiUrl}/api/${api_path}/order`;
            const order = this.form;
            axios.post(url, { data: order }).then((response) => {
                alert(response.data.message);
                this.$refs.form.resetForm();
                this.getCart();
            }).catch((err) => {
                alert(err.data.message);
            });
        },
        updateCartItem(item) {
            const data = {
                product_id: item.product.id,
                qty: item.qty,
            };
            this.isLoadingItem = item.id;
            axios.put(`${apiUrl}/api/${api_path}/cart/${item.id}`, { data }).then((res) => {
                console.log(res);
                this.getCart();
                this.isLoadingItem = '';
            });
        },
    },
    mounted() {
        this.getProducts();
        this.getCart();
    },
})
    .component('userProductModal', userProductModal)
    .mount('#app')
