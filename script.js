let transactions = [];
const toggleBtns = document.querySelectorAll(".toggle");
const formSection = document.querySelector(".formContent");
const form = document.querySelector('.form');
const transactionContainer = document.querySelector(".transactionContainer")
let editTransactionId = null;
const formTitle = document.querySelector(".formTitle");
const AddTransactionBtn = document.querySelector(".AddTransactionBtn");

toggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        editTransactionId = null;
        if (!editTransactionId) {
            form.reset();
            formTitle.textContent = "Add Transaction"
            AddTransactionBtn.textContent = "Add"
        }
        formSection.classList.toggle("show");
    });
});

document.addEventListener("DOMContentLoaded", () => {
    // check if cart is present in local storage
    transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    if (transactions.length == 0) {
        transactionContainer.innerHTML = "<h2>there are no transactions!</h2>"
    } else {
        transactions.forEach(item => renderTransactions(item));
    }
    // updatePrice()
});

formSection.addEventListener("click", (e) => {
    if (e.target === formSection) {
        formSection.classList.remove("show");
    }
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = form.querySelector("#transactionTitle").value;
    const category = form.querySelector("#transactionCategory").value;
    const amount = form.querySelector("#transactionAmount").value;
    const date = form.querySelector("#transactionDate").value;
    if (title.trim() === "" || date.trim() === "" || amount.trim() === "" || category === "") {
        alert("fill details properly");
        formSection.classList.remove("show");
        return;
    }

    const formattedDate = new Date(date).toISOString();

    const categories = ["income", "expense"];

    if (editTransactionId) {
        transactions = transactions.map(transaction => {
            if (transaction.id === editTransactionId) {
                return {
                    ...transaction,
                    title,
                    amount,
                    formattedDate,
                    category:categories[category]
                }
            }
            return transaction;
        });
        transactionContainer.innerHTML = "";
        console.log("tran ",transactions);
        

        // render all transactions again
        transactions.forEach(transaction => {
            renderTransactions(transaction);
        });

        saveToLocalStorage();

        editNoteID = null;
        formTitle.textContent = "Add Transaction"
        AddTransactionBtn.textContent = "Add"
    } else {
        if (transactions.length === 0) {
            transactionContainer.innerHTML = "";
        }
        addToFinanceArr(title, amount, categories[category], formattedDate);
        const newFinance = transactions[transactions.length - 1];
        renderTransactions(newFinance);
        saveToLocalStorage()
    }
    form.reset();
    formSection.classList.toggle("show");
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

const renderTransactions = (finaceEntry) => {
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
                    <span class="editTransaction" id="editTransaction" data-id="${finaceEntry.id}" ><i class="fa-solid fa-pen-to-square"></i></span>`

    transactionEntry.appendChild(transactionMainInfo)
    transactionEntry.appendChild(tansactionSubInfo);
    transactionEntry.appendChild(updateTransaction);

    transactionContainer.appendChild(transactionEntry);
}

transactionContainer.addEventListener("click", (e) => {

    // delete transaction 
    const deleteTransactionBtn = e.target.closest("#deleteTransaction");
    if (deleteTransactionBtn) {
        const id = Number(deleteTransactionBtn.dataset.id);
        transactions = transactions.filter(transaction => transaction.id != id);
        saveToLocalStorage();

        transactionContainer.innerHTML = ""
        if (transactions.length === 0) {
            transactionContainer.innerHTML = "<h2>there are no transactions!</h2>"
        } else {
            transactions.forEach(transaction => {
                renderTransactions(transaction)
            })
        }

        return;
    }

    // edit transaction
    const editTransactionBtn = e.target.closest("#editTransaction");
    if (editTransactionBtn) {
        const id = Number(editTransactionBtn.dataset.id);
        editTransactionId = id;
        const transaction = transactions.find(transaction => transaction.id === editTransactionId);

        formTitle.textContent = "Edit Transaction"
        AddTransactionBtn.textContent = "Edit"

        form.querySelector("#transactionTitle").value = transaction.title;
        form.querySelector("#transactionCategory").value = transaction.category == "income" ? 0 : 1;
        const d = new Date(transaction.date);
        form.querySelector("#transactionDate").value = d.toISOString().split("T")[0];
        form.querySelector("#transactionAmount").value = transaction.amount;

        formSection.classList.add("show");
    }
})

const saveToLocalStorage = () => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}