var eventBus = new Vue()
Vue.component('product',{
    props:{
        premium:{
            type:Boolean,
            required: true
        }
    },
    template:`
<div>
<div class="product-image">
<img v-bind:src="image" alt="A pair of socks">
</div>
<div class="product-info">
<h1>{{ title }}</h1>
<p>{{ descripition }}</p>
<p v-if="inStock">In Stock</p>
<!--<p>Almost Sold</p>-->
<p v-else
:class="{test:!inStock}">Out of Stock</p>
<h3 v-show="onSale">On Sale!</h3>
<p>Shipping: {{ shipping}}</p>
</div>
<div>
<ul>
<li v-for="detail in details">{{detail}}</li>
</ul>
</div>
<div class="color-box"
v-for="(variant, index) in variants" 
:key="variant.variantId" 
:style="{backgroundColor: variant.variantColor }"
@mouseover="updateProduct(index)">
</div>
<div>
<ul>
<li v-for="size in sizes">{{size}}</li>
</ul>
</div>
<button @click="addToCart"
:disabled="!inStock"
:class="{disabledButton: !inStock}">Add to Cart</button>
<button @click="deleteToCart"
:disabled="!inStock"
:class="{disabledButton: !inStock}">
Remove Item</button>
<a v-bind:href="url">Please Visit vue.js</a>
</br></br></br>
<product-tabs :reviews="reviews"></product-tabs>
</div>`,
    data(){
        return{
            brand:"Nike",
            product:"socks",
            descripition: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim dolore temporibus, voluptas nobis beatae, ratione. Asperiores, iure similique, autem quam voluptas iste officiis, voluptatem sint eveniet eos saepe minus optio.',
            /* image:"image/Socks-green.jpg",*/
            selectedVariant : 0,
            url:"https://vuejs.org/",
            /*        inStock: true,*/
            onSale: false,
            details:["80% cotton","20% polyester","Gender-neutral"],
            variants:[{
                variantId:2234,
                variantColor:'green',
                variantimage:"image/Socks-green.jpg",
                variantQuantity:10
            },{
                variantId:2235,
                variantColor:'blue',
                variantimage:"image/Socks-blue.jpg",
                variantQuantity:0

            }],
            sizes:["Small","Medium","larger"],
            reviews:[]
        }
    },
    methods:{
        addToCart: function(){
            this.$emit('add-to-cart',this.variants[this.selectedVariant].variantId)
        },
        updateProduct(index){
            this.selectedVariant=index
            console.log(index)
        },
        deleteToCart(){
            this.$emit('delete-to-cart',this.variants[this.selectedVariant].variantId)
        }
    },
    computed:{
        title(){
            return this.brand + ' '+ this.product;
        },
        image(){
            return this.variants[this.selectedVariant].variantimage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity;
        },
        shipping(){
            if(this.premium){
                return "free"
            }else{
                return 2.29
            }
        }
    },
    mounted(){
            eventBus.$on('review-submitted',productReview=>{
                this.reviews.push(productReview)
            })
    }
})
Vue.component('product-review',{
    template:`
<form class="review-form" @submit.prevent="onSubmit">
<p>
<label for="name">Name:</label>
<input id="name" v-model="name" placeholder="name">
</p>

<p>
<label for="review">Review:</label>      
<textarea id="review" v-model="review" ></textarea>
</p>

<p>
<label for="rating">Rating:</label>
<select id="rating" v-model.number="rating">
<option>5</option>
<option>4</option>
<option>3</option>
<option>2</option>
<option>1</option>
</select>
</p>

<p>
<p>Would you like to recommend this product:</p>
<label for="recommend" style="padding:10px;">Yes:</label>
<input type="radio" id="recommend" name="Yes" value="Yes" v-model="recommend" style="width:20px; margin-bottom:0px; margin-top:10px;">
<label for="recommend1" style="padding:10px;">NO :</label>
<input type="radio" id="recommend1"  value="No" v-model="recommend" style="width:20px;margin-bottom:0px;">

</p>
<p v-if="errors.length">
<b>Please correct the following error(s):</b>
<ul>
<li v-for="error in errors">{{ error }}</li>
</ul>
</p>
<p>
<input type="submit" value="Submit" >  
</p>    

</form>
`,
    data(){
        return{
            name:null,
            review:null,
            rating:null,
            recommend:null,
            errors: []
        }
    },
    methods:{
        onSubmit(){
            if(this.name && this.review && this.rating && this.recommend){
                let productReview={
                    name: this.name,
                    review :this.review,
                    rating :this.rating,
                    recommend: this.recommend
                }
                eventBus.$emit('review-submitted',productReview)
                this.name = null
                this.review = null
                this.rating =null
                this.recommend=null
            }
            else{
                if(!this.name) this.errors.push("Name Required")
                if(!this.review) this.errors.push("Review Required")
                if(!this.rating) this.errors.push("Rating Required")
                if(!this.recommend) this.errors.push("Recommendation is required")
            }
        },
        reset(){
            this.errors = null;
        }
        }
    })
Vue.component('product-tabs',{
    props:{
        reviews:{
            type: Array,
            required: false
        }
    },
    template:`<div>
<span class="tab" 
:class="{activeTab: selectedTab === tab }"
v-for="(tab,index) in tabs" 
                  :key ="index"
                   @click="selectedTab=tab">
                   {{ tab }}</span>
<div v-show="selectedTab === 'Reviews'">
<p v-if="!reviews.length">There are no reviews yet.</p>
<ul>
<li v-for="review in reviews">
<p>{{ review.name }}</p>
<p>Rating: {{ review.rating }}</p>
<p>{{ review.review }}</p>
<p>Recommed this product: {{review.recommend}}</p>
</li>
</ul>
</div>
<div v-show="selectedTab=== 'Make a Review'">
<product-review></product-review>
</div>
</div>`,
    data(){
        return{
            tabs:["Reviews","Make a Review"],
            selectedTab: 'Reviews'
        }
    }
    
})
var app = new Vue({
    el:'#app',
    data:{
        premium:true,
        cart:[]
    },
    methods:{
        updatecart(id){
            this.cart.push(id);
        },
        Deletecart(id){
            for(var i = this.cart.length - 1; i >= 0; i--) {
                if (this.cart[i] === id) {
                    this.cart.splice(i, 1);
                }
            }
        }
    }
})