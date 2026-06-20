```javascript
/* =====================================
   Township Shop Tycoon
   ShopScene.js
===================================== */

class ShopScene extends Phaser.Scene {

    constructor() {
        super("ShopScene");
    }

    create() {

        // Scene references
        this.shopWidth = this.scale.width;
        this.shopHeight = this.scale.height;

        // Customer management
        this.customers = [];

        // Spawn settings
        this.spawnInterval = 3000;
        this.maxCustomers = 10;

        // Draw shop
        this.createFloor();
        this.createShopLayout();

        // Spawn customers
        this.customerTimer = this.time.addEvent({
            delay: this.spawnInterval,
            callback: this.spawnCustomer,
            callbackScope: this,
            loop: true
        });

        notify("Customers are arriving.");

        console.log("ShopScene created.");
    }

    /* ==========================
       FLOOR
    ========================== */

    createFloor() {

        this.add.rectangle(
            this.shopWidth / 2,
            this.shopHeight / 2,
            this.shopWidth,
            this.shopHeight,
            0x263238
        );

        // Tile pattern
        const tileSize = 64;

        for (let x = 0; x < this.shopWidth; x += tileSize) {

            for (let y = 0; y < this.shopHeight; y += tileSize) {

                this.add.rectangle(
                    x + tileSize / 2,
                    y + tileSize / 2,
                    tileSize - 2,
                    tileSize - 2,
                    0x37474f
                );

            }

        }

    }

    /* ==========================
       SHOP LAYOUT
    ========================== */

    createShopLayout() {

        const centerX = this.shopWidth / 2;
        const centerY = this.shopHeight / 2;

        // Shelf
        this.shelf = this.add.rectangle(
            centerX,
            centerY - 100,
            220,
            50,
            0x8d6e63
        );

        this.add.text(
            centerX,
            centerY - 100,
            "Shelf",
            {
                fontSize: "18px",
                color: "#ffffff"
            }
        ).setOrigin(0.5);

        // Counter
        this.counter = this.add.rectangle(
            centerX,
            centerY + 100,
            250,
            60,
            0x546e7a
        );

        this.add.text(
            centerX,
            centerY + 100,
            "Counter",
            {
                fontSize: "18px",
                color: "#ffffff"
            }
        ).setOrigin(0.5);

        // Entrance
        this.entrance = {
            x: centerX,
            y: this.shopHeight - 50
        };

        this.add.rectangle(
            this.entrance.x,
            this.entrance.y,
            200,
            20,
            0x2e7d32
        );

        this.add.text(
            this.entrance.x,
            this.entrance.y - 20,
            "Entrance",
            {
                fontSize: "16px",
                color: "#ffffff"
            }
        ).setOrigin(0.5);

    }

    /* ==========================
       CUSTOMER SPAWNING
    ========================== */

    spawnCustomer() {

        if (this.customers.length >= this.maxCustomers) {
            return;
        }

        const customer = new Customer(
            this,
            this.entrance.x,
            this.entrance.y
        );

        this.customers.push(customer);

    }

    /* ==========================
       CUSTOMER REMOVAL
    ========================== */

    removeCustomer(customer) {

        const index =
            this.customers.indexOf(customer);

        if (index !== -1) {

            this.customers.splice(index, 1);

        }

    }

    /* ==========================
       UPDATE LOOP
    ========================== */

    update(time, delta) {

        for (let i = 0; i < this.customers.length; i++) {

            const customer = this.customers[i];

            if (customer && customer.update) {

                customer.update(time, delta);

            }

        }

    }

}

/* =====================================
   GLOBAL ACCESS
===================================== */

window.ShopScene = ShopScene;
```
