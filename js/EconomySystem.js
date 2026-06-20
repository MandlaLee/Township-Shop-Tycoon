```javascript
/* =====================================
   Township Shop Tycoon
   EconomySystem.js
===================================== */

class EconomySystem {

    constructor() {

        this.products = {
            bread: {
                id: "bread",
                name: "Bread",
                sellPrice: 18,
                stock: 25
            },

            chips: {
                id: "chips",
                name: "Chips",
                sellPrice: 10,
                stock: 40
            },

            coldDrink: {
                id: "coldDrink",
                name: "Cold Drink",
                sellPrice: 25,
                stock: 20
            }
        };

        this.totalRevenue = 0;
    }

    /* ==========================
       PRODUCTS
    ========================== */

    getProduct(productName) {

        const values =
            Object.values(this.products);

        return values.find(
            product =>
                product.name === productName
        );

    }

    hasStock(productName) {

        const product =
            this.getProduct(productName);

        if (!product) {
            return false;
        }

        return product.stock > 0;

    }

    getStock(productName) {

        const product =
            this.getProduct(productName);

        if (!product) {
            return 0;
        }

        return product.stock;

    }

    /* ==========================
       SALES
    ========================== */

    sellProduct(productName) {

        const product =
            this.getProduct(productName);

        if (!product) {

            console.warn(
                "Product not found:",
                productName
            );

            return false;

        }

        if (product.stock <= 0) {

            notify(
                `${product.name} is out of stock.`
            );

            return false;

        }

        product.stock--;

        this.totalRevenue +=
            product.sellPrice;

        addCash(product.sellPrice);

        GameState.sales++;

        updateHUD();

        notify(
            `${product.name} sold for R${product.sellPrice}`
        );

        this.checkVictory();

        this.save();

        return true;

    }

    /* ==========================
       STOCK
    ========================== */

    restockProduct(
        productName,
        quantity
    ) {

        const product =
            this.getProduct(productName);

        if (!product) {
            return;
        }

        product.stock += quantity;

        notify(
            `${product.name} restocked (+${quantity})`
        );

        this.save();

    }

    restockAll() {

        this.products.bread.stock += 20;
        this.products.chips.stock += 30;
        this.products.coldDrink.stock += 15;

        notify(
            "All products restocked."
        );

        this.save();

    }

    /* ==========================
       REVENUE
    ========================== */

    getRevenue() {

        return this.totalRevenue;

    }

    /* ==========================
       WIN CONDITION
    ========================== */

    checkVictory() {

        if (
            GameState.cash >= 10000
        ) {

            notify(
                "🏆 Congratulations! You became a Township Shop Tycoon!"
            );

        }

    }

    /* ==========================
       SAVE
    ========================== */

    save() {

        const saveData = {

            products: this.products,

            totalRevenue:
                this.totalRevenue

        };

        localStorage.setItem(
            "township_shop_economy",
            JSON.stringify(saveData)
        );

    }

    load() {

        const raw =
            localStorage.getItem(
                "township_shop_economy"
            );

        if (!raw) {
            return;
        }

        try {

            const saveData =
                JSON.parse(raw);

            if (
                saveData.products
            ) {
                this.products =
                    saveData.products;
            }

            if (
                saveData.totalRevenue
            ) {
                this.totalRevenue =
                    saveData.totalRevenue;
            }

        } catch (error) {

            console.error(
                "Economy load failed:",
                error
            );

        }

    }

    reset() {

        localStorage.removeItem(
            "township_shop_economy"
        );

        location.reload();

    }

}

/* =====================================
   GLOBAL INSTANCE
===================================== */

window.Economy =
    new EconomySystem();

/* =====================================
   AUTO LOAD
===================================== */

window.addEventListener(
    "DOMContentLoaded",
    () => {

        Economy.load();

        console.log(
            "Economy System Loaded"
        );

    }
);
```
