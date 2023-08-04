<template>
  <div id="app">
    <b-modal
      id="productModal"
      hide-footer
      centered
      :title="this.getProductById(this.modalProductId).description"
    >
      <div class="d-block text-center">
        <img
          class="modalImage"
          :src="this.getProductById(this.modalProductId).image"
        />
        <h4>
          Preis:
          {{ getEuroString(this.getProductById(this.modalProductId).price) }}
        </h4>
        <h4>
          Lagerbestand:
          {{ this.getProductById(this.modalProductId).quantity }} Stück
        </h4>
        <h4>Inhalt: {{ this.getProductById(this.modalProductId).size }}</h4>
      </div>
    </b-modal>
    <img alt="logo" id="logo" src="./assets/logo.png" />
    <b-input-group id="category-select" prepend="Kategorie">
      <b-form-select v-model="category" :options="categories"></b-form-select>
    </b-input-group>
    <div id="products" class="flex">
      <transition-group
        appear
        mode="out-in"
        name="scale-fade"
        tag="div"
        class="flex"
        ref="flex"
      >
        <b-card
          v-for="product in filteredProducts"
          :key="product.id"
          :title="product.description"
          :img-src="product.image"
          img-alt="product image"
          class="products transition-item"
          :class="{ unavaliable: product.quantity <= 0 }"
          @click="showProductModal(product.id)"
        >
          <b-card-text class="category">{{ product.category }}</b-card-text>

          <b-card-text class="quantity"
            >{{ product.quantity }} Stück lagernd</b-card-text
          >

          <b-card-text class="price">{{
            getEuroString(product.price)
          }}</b-card-text>
        </b-card>
      </transition-group>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data: function() {
    return {
      category: "Alles",
      modalProductId: 0,
      products: [
        {
          id: 0,
          description: "Apfelsaft",
          price: 1.2,
          size: "500ml",
          category: "Säfte",
          image:
            "https://auricher.gmbh/wp2/wp-content/uploads/2018/04/Apfelsaft-naturtrueb.jpg",
          quantity: 1
        },
        {
          id: 1,
          description: "Coca-Cola",
          price: 1,
          size: "500ml",
          category: "Softdrinks",
          image:
            "https://www.alfies.at/wp-content/uploads/2016/05/Coca_Cola_0.5l_672.jpg",
          quantity: 3
        },
        {
          id: 2,
          description: "Willi Dungl Durstlöscher",
          price: 0.9,
          size: "1 Willi",
          category: "Säfte",
          image:
            "https://oekastatic.orf.at/static/images/site/oeka/20160312/dungl_apa.5457538.jpg",
          quantity: 5
        },
        {
          id: 3,
          description: "Race Energy Drink",
          price: 1.1,
          size: "500ml",
          category: "Energy Drinks",
          image:
            "https://files.billa.at/files/artikel/00-902011_01__1200x1200.jpg",
          quantity: 2
        },
        {
          id: 4,
          description: "Mountain Dew",
          price: 1.5,
          size: "1500ml",
          category: "Daxi Drink",
          image:
            "https://www.dollargeneral.com/media/catalog/product/cache/image/700x700/e9c3970ab036de70892d86c6d221abfe/0/0/00012000001314_0.jpg",
          quantity: 0
        }
      ],
      // products: [
      //   {
      //     id: -1,
      //     description: "Error",
      //     price: -1,
      //     size: "Error",
      //     category: "Error",
      //     image: "Error",
      //     quantity: 0 - 1
      //   }
      // ],
      productsLoaded: false
    };
  },
  computed: {
    filteredProducts() {
      if (this.category === "" || this.category === "Alles")
        return this.products;
      return this.products.filter(
        product => product.category === this.category
      );
    },
    categories() {
      let categorySet = new Set();
      this.products.forEach(product => categorySet.add(product.category));
      categorySet.add("Alles");
      return Array.from(categorySet);
    }
  },
  mounted() {
    fetch("loadData.php")
      .then(response => response.text())
      .then(
        products =>
          (this.products = JSON.parse(products).sort((a, b) => {
            if (a.quantity <= 0 && b.quantity > 0) return -1;
            else if (b.quantity <= 0 && a.quantity > 0) return -1;
            else return a.description.localeCompare(b.description);
          }))
      )
      .catch(error => window.console.log("Error while loading data: " + error));
  },
  methods: {
    getEuroString: function(cents) {
      let eur = cents / 100;
      return eur.toFixed(2) + "€";
    },
    showProductModal: function(productId) {
      this.modalProductId = productId;
      this.$bvModal.show("productModal");
    },
    getProductById: function(id) {
      let filtered = this.products.filter(value => value.id === id)[0];
      return filtered === undefined ? {} : filtered;
    }
  }
};
</script>

<style>
body {
  background-color: #fafafa;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 2em;
}

#products {
  text-align: center;
  margin: 3em auto;
}

.flex {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

@media (min-aspect-ratio: 1/1) {
  #logo {
    position: relative;
    left: 0;
  }
}

#logo {
  width: 10em;
  height: auto;
  margin: auto 1em;
}

.products {
  max-width: 15em;
  margin: 2em;
}

.category {
  margin-bottom: 2rem;
}

.price {
  font-size: 1.25em;
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 0.25em;
  background: dodgerblue;
  color: white;
  border-radius: 1rem 0 0.25rem 0;
}

.quantity {
  font-size: 1.25em;
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 0.25em;
  background: dodgerblue;
  color: white;
  border-radius: 0 1rem 0 0.25rem;
  margin-bottom: 0;
}

.unavaliable {
  opacity: 0.5;
}

@media (max-aspect-ratio: 2/3) {
  .modalImage {
    max-width: 90vw;
    margin-bottom: 2em;
  }

  #category-select {
    width: 80vw;
    margin: 2em 10vw 3em 10vw;
  }
}
/*desktop*/
@media (min-aspect-ratio: 2/3) {
  #category-select {
    width: 20em;
    margin: 2em auto 3em auto;
  }
  .modalImage {
    max-width: 25rem;
    margin-bottom: 2em;
  }
}

.scale-fade-enter,
.scale-fade-leave-to {
  opacity: 0.5;
  transform: scale(0.05);
}

.scale-fade-leave,
.scale-fade-enter-to {
  opacity: 1;
  transform: scale(1);
}

.scale-fade-enter-active,
.scale-fade-leave-active,
.scale-fade-move,
.transition-item {
  transition: all 0.5s ease;
  display: inline-block;
}
</style>
