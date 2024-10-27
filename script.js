const correctPassword = "1234"; // Password per incrementare e decrementare i contatori
const SUPABASE_URL = 'https://tkgflpqtwclwlvxjngne.supabase.co'; // URL di Supabase
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZ2ZscHF0d2Nsd2x2eGpuZ25lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAwMjg3MjMsImV4cCI6MjA0NTYwNDcyM30.sqveiFpu_jjLPT_68Q9LFe-Qqy2Mc6ZUo4li65l6EeM'; // API Key di Supabase
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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
    saveCounts(); // Salva i contatori nel database Supabase
}

// Funzione per decrementare il contatore
function decrementCount(id) {
    const countElement = document.querySelector(`td[data-id="${id}"]`);
    let currentCount = parseInt(countElement.innerText);
    if (currentCount > 0) {
        currentCount--;
        countElement.innerText = currentCount;
        saveCounts(); // Salva i contatori nel database Supabase
    }
}

// Carica i valori dei contatori e aggiorna la classifica all'avvio della pagina
document.addEventListener('DOMContentLoaded', () => {
    loadCounts(); // Carica i contatori dal database Supabase
});

// Funzione per caricare i contatori dal database Supabase
async function loadCounts() {
    const { data, error } = await supabase
        .from('Counters') // Nome della tua tabella
        .select('*');

    if (error) {
        console.error('Error loading counter data:', error);
        return;
    }

    data.forEach(record => {
        const id = record.ID; // Usa il campo ID della tua tabella
        const countElement = document.querySelector(`td[data-id="${id}"]`);
        if (countElement) {
            countElement.innerText = record.Conteggio || 0; // Usa il campo Conteggio della tua tabella
        }
    });
    updateRanking(); // Aggiorna la classifica dopo il caricamento
}

// Funzione per salvare i contatori nel database Supabase
async function saveCounts() {
    document.querySelectorAll('td[data-id]').forEach(async (td) => {
        const id = td.getAttribute('data-id');
        const count = parseInt(td.innerText);
        await updateRecord(id, count);
    });
}

// Funzione per aggiornare i record nel database Supabase
async function updateRecord(id, count) {
    const { error } = await supabase
        .from('Counters') // Nome della tua tabella
        .upsert({ ID: id, Conteggio: count }); // Usa i nomi dei campi corretti

    if (error) {
        console.error('Error saving counter data:', error);
    } else {
        console.log(`Counter ${id} updated successfully`);
    }
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
