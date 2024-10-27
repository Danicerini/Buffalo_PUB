const correctPassword = "1234"; // Password per incrementare e decrementare i contatori

// Funzione per richiedere la password e incrementare il contatore
function requestPasswordAndIncrement(id) {
    if (!sessionStorage.getItem('isAuthorized')) {
        const userPassword = prompt("Enter the password to increment:");
        if (userPassword === correctPassword) {
            sessionStorage.setItem('isAuthorized', 'true'); // Salva l'autorizzazione per la sessione
            incrementCount(id);
            updateRanking();
        } else {
            alert("Password incorrect.");
        }
    } else {
        incrementCount(id);
        updateRanking();
    }
}

// Funzione per richiedere la password e decrementare il contatore
function requestPasswordAndDecrement(id) {
    if (!sessionStorage.getItem('isAuthorized')) {
        const userPassword = prompt("Enter the password to decrement:");
        if (userPassword === correctPassword) {
            sessionStorage.setItem('isAuthorized', 'true'); // Salva l'autorizzazione per la sessione
            decrementCount(id);
            updateRanking();
        } else {
            alert("Password incorrect.");
        }
    } else {
        decrementCount(id);
        updateRanking();
    }
}

// Funzione per incrementare il contatore
function incrementCount(id) {
    const countElement = document.querySelector(`td[data-id="${id}"]`);
    let currentCount = parseInt(countElement.innerText);
    currentCount++;
    countElement.innerText = currentCount;
    saveCounts(); // Salva i contatori nel file JSON
}

// Funzione per decrementare il contatore
function decrementCount(id) {
    const countElement = document.querySelector(`td[data-id="${id}"]`);
    let currentCount = parseInt(countElement.innerText);
    if (currentCount > 0) {
        currentCount--;
        countElement.innerText = currentCount;
        saveCounts(); // Salva i contatori nel file JSON
    }
}

// Carica i valori dei contatori e aggiorna la classifica all'avvio della pagina
document.addEventListener('DOMContentLoaded', () => {
    loadCounts(); // Carica i contatori dal file JSON
});

// Funzione per caricare i contatori dal file JSON
function loadCounts() {
    fetch('counter.json')
        .then(response => response.json())
        .then(data => {
            const counters = data.counters;
            for (const id in counters) {
                const countElement = document.querySelector(`td[data-id="${id}"]`);
                if (countElement) {
                    countElement.innerText = counters[id];
                }
            }
            updateRanking(); // Aggiorna la classifica dopo il caricamento
        })
        .catch(error => console.error('Error loading counter data:', error));
}

// Funzione per salvare i contatori nel file JSON
function saveCounts() {
    const counters = {};
    document.querySelectorAll('td[data-id]').forEach(td => {
        counters[td.getAttribute('data-id')] = parseInt(td.innerText);
    });

    const data = { counters };

    // Invio i dati a un server per salvarli
    fetch('save_counter.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log('Counter data saved successfully');
    })
    .catch(error => console.error('Error saving counter data:', error));
}

// Funzione per aggiornare la classifica
function updateRanking() {
    const rows = Array.from(document.querySelectorAll('#counterTable tr')).slice(1); // Ottieni tutte le righe tranne l'intestazione
    rows.sort((a, b) => {
        const countA = parseInt(a.querySelector('td[data-id]').innerText);
        const countB = parseInt(b.querySelector('td[data-id]').innerText);
        return countB - countA;
    });

    // Riordina la tabella e aggiorna i numeri di classifica
    const tableBody = document.querySelector('#counterTable tbody');
    rows.forEach((row, index) => {
        row.querySelector('td:first-child').innerText = index + 1; // Aggiorna il numero di classifica
        // Mantieni i colori fissi
        if (index === 0) {
            row.classList.add('gold');
            row.classList.remove('silver', 'bronze', 'green');
        } else if (index === 1) {
            row.classList.add('silver');
            row.classList.remove('gold', 'bronze', 'green');
        } else if (index === 2) {
            row.classList.add('bronze');
            row.classList.remove('gold', 'silver', 'green');
        } else {
            row.classList.add('green');
            row.classList.remove('gold', 'silver', 'bronze');
        }
    });

    // Aggiungi le righe riordinate di nuovo al body della tabella
    rows.forEach(row => tableBody.appendChild(row));
}
