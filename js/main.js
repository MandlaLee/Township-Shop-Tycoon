```javascript
/* =====================================
   Township Shop Tycoon
   main.js
===================================== */

// Global Game State
window.GameState = {
    cash: 500,
    sales: 0,
    customersServed: 0,

    products: {
        bread: {
            name: "Bread",
            price: 18
        },

        chips: {
            name: "Chips",
            price: 10
        },

        coldDrink: {
            name: "Cold Drink",
            price: 25
        }
    },

    upgrades: {
        extraShelf: false,
        fridge: false,
        biggerShop: false
    }
};

// =====================================
// HUD REFERENCES
// =====================================

const HUD = {
    cashDisplay: null,
    salesDisplay: null,
    customerDisplay: null,
    notifications: null
};

// =====================================
// UI FUNCTIONS
// =====================================

function updateHUD() {

    if (HUD.cashDisplay) {
        HUD.cashDisplay.textContent =
            `R${GameState.cash.toLocaleString()}`;
    }

    if (HUD.salesDisplay) {
        HUD.salesDisplay.textContent =
            GameState.sales.toLocaleString();
    }

    if (HUD.customerDisplay) {
        HUD.customerDisplay.textContent =
            GameState.customersServed.toLocaleString();
    }

}

function notify(message) {

    if (!HUD.notifications) return;

    HUD.notifications.textContent = message;

    console.log("[Township Shop Tycoon]", message);

}

window.updateHUD = updateHUD;
window.notify = notify;

// =====================================
// GAME HELPERS
// =====================================

function addCash(amount) {

    GameState.cash += amount;

    updateHUD();

    if (window.SaveManager) {
        SaveManager.save();
    }

}

function spendCash(amount) {

    if (GameState.cash < amount) {
        notify("Not enough cash.");
        return false;
    }

    GameState.cash -= amount;

    updateHUD();

    if (window.SaveManager) {
        SaveManager.save();
    }

    return true;
}

function recordSale(amount) {

    GameState.sales += 1;

    addCash(amount);

    updateHUD();

}

function recordCustomer() {

    GameState.customersServed += 1;

    updateHUD();

}

window.addCash = addCash;
window.spendCash = spendCash;
window.recordSale = recordSale;
window.recordCustomer = recordCustomer;

// =====================================
// UPGRADE BUTTONS
// =====================================

function setupUpgradeButtons() {

    const shelfBtn =
        document.getElementById("buy-shelf-btn");

    const fridgeBtn =
        document.getElementById("buy-fridge-btn");

    const shopBtn =
        document.getElementById("buy-shop-btn");

    if (shelfBtn) {

        shelfBtn.addEventListener("click", () => {

            if (GameState.upgrades.extraShelf) {
                notify("Extra Shelf already purchased.");
                return;
            }

            if (spendCash(500)) {

                GameState.upgrades.extraShelf = true;

                shelfBtn.disabled = true;

                notify("Extra Shelf purchased!");

                SaveManager?.save();

            }

        });

    }

    if (fridgeBtn) {

        fridgeBtn.addEventListener("click", () => {

            if (GameState.upgrades.fridge) {
                notify("Fridge already purchased.");
                return;
            }

            if (spendCash(1000)) {

                GameState.upgrades.fridge = true;

                fridgeBtn.disabled = true;

                notify("Fridge purchased!");

                SaveManager?.save();

            }

        });

    }

    if (shopBtn) {

        shopBtn.addEventListener("click", () => {

            if (GameState.upgrades.biggerShop) {
                notify("Shop already expanded.");
                return;
            }

            if (spendCash(2500)) {

                GameState.upgrades.biggerShop = true;

                shopBtn.disabled = true;

                notify("Shop expanded!");

                SaveManager?.save();

            }

        });

    }

}

// =====================================
// PHASER CONFIG
// =====================================

const config = {

    type: Phaser.AUTO,

    parent: "game-container",

    width: 1280,

    height: 720,

    backgroundColor: "#18212f",

    scale: {

        mode: Phaser.Scale.RESIZE,

        autoCenter: Phaser.Scale.CENTER_BOTH

    },

    scene: [
        ShopScene
    ]

};

// =====================================
// GAME START
// =====================================

window.addEventListener("DOMContentLoaded", () => {

    // HUD
    HUD.cashDisplay =
        document.getElementById("cash-display");

    HUD.salesDisplay =
        document.getElementById("sales-count");

    HUD.customerDisplay =
        document.getElementById("customer-count");

    HUD.notifications =
        document.getElementById("notifications");

    // Load Save
    if (window.SaveManager) {
        SaveManager.load();
    }

    updateHUD();

    setupUpgradeButtons();

    // Start Phaser
    window.game =
        new Phaser.Game(config);

    // Hide Loading Screen
    const loadingScreen =
        document.getElementById("loading-screen");

    if (loadingScreen) {

        setTimeout(() => {

            loadingScreen.style.display = "none";

        }, 500);

    }

    notify("Shop opened for business!");

});

// =====================================
// DEBUG SHORTCUTS
// =====================================

window.debug = {

    add500() {

        addCash(500);

        notify("Added R500");

    },

    add1000() {

        addCash(1000);

        notify("Added R1000");

    },

    win() {

        GameState.cash = 10000;

        updateHUD();

        notify("Victory target reached!");

    }

};

console.log(
    "Township Shop Tycoon - main.js loaded"
);
```
