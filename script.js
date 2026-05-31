let transactions = [];
const toggleBtns = document.querySelectorAll(".toggle");
const formSection = document.querySelector(".formContent");
const form = document.querySelector('.form');
const transactionContainer = document.querySelector(".transactionContainer")
const editFinanceId = null;

toggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        formSection.classList.toggle("show");
    });
});

formSection.addEventListener("click", (e) => {
    if (e.target === formSection) {
        formSection.classList.remove("show");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // check if cart is present in local storage
    transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    if (transactions.length == 0) {
        // cartItemsContainer.innerHTML = "<h2>The cart is empty!</h2>"
    } else {
        // transactions.forEach(item => renderCartItem(item));
    }
    // updatePrice()
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = form.querySelector("#transactionTitle").value;
    const category = form.querySelector("#transactionCategory").value;
    const amount = form.querySelector("#transactionAmount").value;
    const date = form.querySelector("#transactionDate").value;
    const formattedDate = new Date(date).toISOString();

    if (title.trim() === "" || date.trim() === "" || amount.trim() === "" || category === "") {
        alert("fill details properly");
        formSection.classList.remove("show");
        return;
    }

    const categories = ["income", "expense"];

    if (editFinanceId) {

    } else {
        addToFinanceArr(title, amount, categories[category], formattedDate);
        const newFinance = transactions[transactions.length - 1];
        renderFinance(newFinance);
        saveToLocalStorage()
    }
});

const addToFinanceArr = (title, amount, category, date) => {
    transactions.push({
        id: Date.now(),
        title,
        amount,
        category,
        date
    })
}

const renderFinance = (finaceEntry) => {
    const transactionEntry = document.createElement("div");
    transactionEntry.classList.add("transactionEntry");

    const transactionMainInfo = document.createElement("div");
    transactionMainInfo.classList.add("transactionMainInfo");
    transactionMainInfo.innerHTML = `   <p>${finaceEntry.title}</p>
                    <span>$${finaceEntry.amount}</span>`


    const tansactionSubInfo = document.createElement("div");
    tansactionSubInfo.classList.add("tansactionSubInfo");
    tansactionSubInfo.innerHTML = `<span>${finaceEntry.category}</span>
                    <span>${new Date(finaceEntry.date).toLocaleDateString()}</span>`

    const updateTransaction = document.createElement("div");
    updateTransaction.classList.add("updateTransaction")
    updateTransaction.innerHTML = ` <span class="deleteTransaction" id="deleteTransaction" data-id="${finaceEntry.id}"><i class="fa-solid fa-trash"></i></span>
                    <span class="editTransaction" id="editTransaction" data-id="${finaceEntry.id}><i class="fa-solid fa-pen-to-square" ></i></span>`
    
    transactionEntry.appendChild(transactionMainInfo)
    transactionEntry.appendChild(tansactionSubInfo);
    transactionEntry.appendChild(updateTransaction);

    transactionContainer.appendChild(transactionEntry);
}

const saveToLocalStorage = () => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}