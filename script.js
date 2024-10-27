const correctPassword = "1234"; // Password per incrementare e decrementare i contatori

// Funzione per richiedere la password e incrementare il contatore
function requestPasswordAndIncrement(id) {
    if (!sessionStorage.getItem('isAuthorized')) {
        const userPassword = prompt("Enter the password to increment:");
        if (userPassword === correctPassword) {
            sessionStorage.setItem('isAuthorized', 'true'); // Salva l'autorizzazione per la sessione
            incrementCount(id);
        } else {
            alert("Password incorrect.");
        }
    } else {
        incrementCount(id);
    }
}

// Funzione per richiedere la password e decrementare il contatore
function requestPasswordAndDecrement(id) {
    if (!sessionStorage.getItem('isAuthorized')) {
        const userPassword = prompt("Enter the password to decrement:");
        if (userPassword === correctPassword) {
            sessionStorage.setItem('isAuthorized', 'true'); // Salva l'autorizzazione per la sessione
            decrementCount(id);
        } else {
            alert("Password incorrect.");
        }
    } else {
        decrementCount(id);
    }
}

// Funzione per incrementare il contatore
function incrementCount(id) {
    const countElement = document.querySelector(`td[data-id="${id}"]`);
    let currentCount = parseInt(countElement.innerText);
    currentCount++;
    countElement.innerText = currentCount;
    saveCounts(); // Salva i contatori nel localStorage
}

// Funzione per decrementare il contatore
function decrementCount(id) {
    const countElement = document.querySelector(`td[data-id="${id}"]`);
    let currentCount = parseInt(countElement.innerText);
    if (currentCount > 0) {
        currentCount--;
        countElement.innerText = currentCount;
        saveCounts(); // Salva i contatori nel localStorage
    }
}

// Carica i valori dei contatori all'avvio della pagina
document.addEventListener('DOMContentLoaded', () => {
    loadCounts(); // Carica i contatori dal localStorage
});

// Funzione per caricare i contatori dal localStorage
function loadCounts() {
    for (let i = 1; i <= 8; i++) {
        const countKey = `count${i}`;
        const savedCount = localStorage.getItem(countKey) || 0;
        const countElement = document.querySelector(`td[data-id="${countKey}"]`);
        if (countElement) {
            countElement.innerText = savedCount; // Aggiorna il conteggio
        }
    }
}

// Funzione per salvare i contatori nel localStorage
function saveCounts() {
    document.querySelectorAll('td[data-id]').forEach(td => {
        const id = td.getAttribute('data-id');
        const count = parseInt(td.innerText);
        localStorage.setItem(id, count); // Salva nel localStorage
    });
}
