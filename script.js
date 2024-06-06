let price = 2;
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100]
];

let totalCidArray = cid.map(subArray => subArray[1]);
let totalCid = totalCidArray.reduce((a, b) => a + b);

const cash = document.getElementById("cash");
const changeDue = document.getElementById("change-due");
const purchaseBtn = document.getElementById("purchase-btn");

purchaseBtn.addEventListener("click", () => {

  let cashValue = cash.value;
  let balanceDue = cashValue - price;
  console.log(balanceDue);

  if (cashValue < price) {
    changeDue.textContent = "";
    alert("Customer does not have enough money to purchase the item");
   
  } else if (cashValue == price) {
    changeDue.textContent = "No change due - customer paid with exact cash";
  }

})