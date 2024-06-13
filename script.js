const cash = document.getElementById("cash");
const changeDue = document.getElementById("change-due");
const purchaseBtn = document.getElementById("purchase-btn");

// Input variables
let price = 19.5;  // Update this to match your example
let cashPaid;

// Define currency units and values
const currencyUnits = [
    { name: "ONE HUNDRED", value: 100 },
    { name: "TWENTY", value: 20 },
    { name: "TEN", value: 10 },
    { name: "FIVE", value: 5 },
    { name: "ONE", value: 1 },
    { name: "QUARTER", value: 0.25 },
    { name: "DIME", value: 0.1 },
    { name: "NICKEL", value: 0.05 },
    { name: "PENNY", value: 0.01 }
];

// Cash in drawer
let cid = [
    ["PENNY", 0.5],
    ["NICKEL", 0],
    ["DIME", 0],
    ["QUARTER", 0],
    ["ONE", 0],
    ["FIVE", 0],
    ["TEN", 0],
    ["TWENTY", 0],
    ["ONE HUNDRED", 0]
];

// Calculate total cash in drawer
function calculateTotalCash(cid) {
    return cid.reduce((sum, [_, value]) => sum + value, 0);
}

// Function to calculate if exact change can be given
function canGiveExactChange(balanceDue, cid, currencyUnits) {
    let remainingBalance = balanceDue;
    let drawer = cid.map(arr => [...arr]);

    for (let { name, value } of currencyUnits) {
        let currency = drawer.find(([currencyName]) => currencyName === name);
        while (remainingBalance >= value && currency[1] >= value) {
            remainingBalance -= value;
            remainingBalance = Math.round(remainingBalance * 100) / 100; // Avoid floating point precision issues
            currency[1] -= value;
        }
    }
    return remainingBalance === 0;
}

// Determine status
const getStatus = (balanceDue, cid, totalCashInDrawer) => {
    if (totalCashInDrawer < balanceDue) {
        return "INSUFFICIENT_FUNDS";
    } else if (totalCashInDrawer === balanceDue) {
        return "CLOSED";
    } else if (totalCashInDrawer > balanceDue && canGiveExactChange(balanceDue, cid, currencyUnits)) {
        return "OPEN";
    }
    return "INSUFFICIENT_FUNDS";
};

// Calculate change to be paid
function calculateChange(balanceDue, cid, currencyUnits) {
    let remainingBalance = balanceDue;
    let change = [];
    let drawer = cid.map(arr => [...arr]);

    for (let { name, value } of currencyUnits) {
        let currency = drawer.find(([currencyName]) => currencyName === name);
        let amount = 0;
        let totalValue = 0;
        while (remainingBalance >= value && currency[1] >= value) {
            remainingBalance -= value;
            remainingBalance = Math.round(remainingBalance * 100) / 100; // Avoid floating point precision issues
            currency[1] -= value;
            amount++;
            totalValue += value;
        }
        if (amount > 0) {
            change.push({ name, totalValue });
        }
    }

    if (remainingBalance > 0) {
        return "INSUFFICIENT_FUNDS";
    }

    return change;
}

// Display result
function displayResult(status, change) {
    let result = `Status: ${status}`;
    if (status === "OPEN" || status === "CLOSED") {
        change.forEach(item => {
            result += ` ${item.name}: $${parseFloat(item.totalValue.toFixed(2))}`;
        });
    }
    changeDue.textContent = result;
}

// Event listener for purchase button
purchaseBtn.addEventListener("click", () => {
    cashPaid = parseFloat(cash.value);
    const balanceDue = cashPaid - price;

    const totalCashInDrawer = calculateTotalCash(cid);

    if (cashPaid < price) {
        alert("Customer does not have enough money to purchase the item");
        changeDue.textContent = "";
        return;
    } else if (cashPaid === price) {
        changeDue.textContent = "No change due - customer paid with exact cash";
        return;
    }

    const status = getStatus(balanceDue, cid, totalCashInDrawer);
    const change = status === "OPEN" || status === "CLOSED" ? calculateChange(balanceDue, cid, currencyUnits) : [];

    displayResult(status, change);
});