```javascript
/* =====================================
   Township Shop Tycoon
   Customer.js
===================================== */

class Customer {

    constructor(scene, x, y) {

        this.scene = scene;

        // Product names only.
        // EconomySystem is now the single
        // source of truth for prices/stock.
        this.products = [
            "Bread",
            "Chips",
            "Cold Drink"
        ];

        // State machine
        this.state = "TO_SHELF";

        // Random product selection
        this.selectedProduct =
            Phaser.Utils.Array.GetRandom(
                this.products
            );

        // Customer body
        this.sprite = scene.add.circle(
            x,
            y,
            14,
            this.getRandomColor()
        );

        // Product label
        this.label = scene.add.text(
            x,
            y - 24,
            "",
            {
                fontSize: "12px",
                color: "#ffffff"
            }
        ).setOrigin(0.5);

        // Movement speed
        this.speed = Phaser.Math.Between(
            60,
            100
        );

        // Wait timers
        this.waitUntil = 0;

        console.log(
            "Customer entered:",
            this.selectedProduct
        );

    }

    /* ==========================
       UPDATE
    ========================== */

    update(time) {

        switch (this.state) {

            case "TO_SHELF":
                this.moveToShelf();
                break;

            case "BROWSING":
                this.browse(time);
                break;

            case "TO_COUNTER":
                this.moveToCounter();
                break;

            case "PAYING":
                this.pay(time);
                break;

            case "LEAVING":
                this.leaveShop();
                break;

        }

        // Keep label above customer
        this.label.x = this.sprite.x;
        this.label.y = this.sprite.y - 24;

    }

    /* ==========================
       WALK TO SHELF
    ========================== */

    moveToShelf() {

        const targetX =
            this.scene.shelf.x;

        const targetY =
            this.scene.shelf.y + 70;

        const arrived =
            this.moveTowards(
                targetX,
                targetY
            );

        if (arrived) {

            this.state = "BROWSING";

            this.label.setText(
                this.selectedProduct
            );

            this.waitUntil =
                this.scene.time.now + 1500;

        }

    }

    /* ==========================
       BROWSING
    ========================== */

    browse(time) {

        if (time >= this.waitUntil) {

            this.state = "TO_COUNTER";

        }

    }

    /* ==========================
       WALK TO COUNTER
    ========================== */

    moveToCounter() {

        const targetX =
            this.scene.counter.x;

        const targetY =
            this.scene.counter.y - 70;

        const arrived =
            this.moveTowards(
                targetX,
                targetY
            );

        if (arrived) {

            this.state = "PAYING";

            this.waitUntil =
                this.scene.time.now + 1000;

        }

    }

    /* ==========================
       PAY
    ========================== */

    pay(time) {

        if (time < this.waitUntil) {
            return;
        }

        const success =
            Economy.sellProduct(
                this.selectedProduct
            );

        if (success) {

            recordCustomer();

            this.label.setText("✓");

        } else {

            this.label.setText("✗");

        }

        this.state = "LEAVING";

    }

    /* ==========================
       LEAVE SHOP
    ========================== */

    leaveShop() {

        const targetX =
            this.scene.entrance.x;

        const targetY =
            this.scene.entrance.y;

        const arrived =
            this.moveTowards(
                targetX,
                targetY
            );

        if (arrived) {

            this.destroy();

        }

    }

    /* ==========================
       MOVEMENT
    ========================== */

    moveTowards(targetX, targetY) {

        const dx =
            targetX - this.sprite.x;

        const dy =
            targetY - this.sprite.y;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        if (distance < 4) {

            this.sprite.x = targetX;
            this.sprite.y = targetY;

            return true;

        }

        const moveX =
            (dx / distance) *
            (this.speed / 60);

        const moveY =
            (dy / distance) *
            (this.speed / 60);

        this.sprite.x += moveX;
        this.sprite.y += moveY;

        return false;

    }

    /* ==========================
       RANDOM CUSTOMER COLOR
    ========================== */

    getRandomColor() {

        const colors = [
            0x42a5f5,
            0xef5350,
            0xffca28,
            0x66bb6a,
            0xab47bc,
            0xff7043
        ];

        return Phaser.Utils.Array.GetRandom(
            colors
        );

    }

    /* ==========================
       DESTROY
    ========================== */

    destroy() {

        if (this.sprite) {
            this.sprite.destroy();
        }

        if (this.label) {
            this.label.destroy();
        }

        this.scene.removeCustomer(
            this
        );

    }

}

/* =====================================
   GLOBAL ACCESS
===================================== */

window.Customer = Customer;
```
