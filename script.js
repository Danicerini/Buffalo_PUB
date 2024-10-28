import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://tkgflpqtwclwlvxjngne.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Configurazione Supabase
const SUPABASE_URL = 'https://tkgflpqtwclwlvxjngne.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZ2ZscHF0d2Nsd2x2eGpuZ25lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAwMjg3MjMsImV4cCI6MjA0NTYwNDcyM30.sqveiFpu_jjLPT_68Q9LFe-Qqy2Mc6ZUo4li65l6EeM';


const correctPassword = "1234"; // Password per incrementare e decrementare

// Funzione per incrementare il contatore
async function incrementCount(id) {
    const countElement = document.querySelector(`td[data-id="${id}"]`);
    let currentCount = parseInt(countElement.innerText);
    currentCount++;
    countElement.innerText = currentCount;
    await saveCounts(id, currentCount); // Salva il conteggio aggiornato
}

// Funzione per decrementare il contatore
async function decrementCount(id) {
    const countElement = document.querySelector(`td[data-id="${id}"]`);
    let currentCount = parseInt(countElement.innerText);
    if (currentCount > 0) {
        currentCount--;
        countElement.innerText = currentCount;
        await saveCounts(id, currentCount); // Salva il conteggio aggiornato
    }
}

// Richiede la password solo una volta per sessione
function requestPasswordAndIncrement(id) {
    if (!sessionStorage.getItem('isAuthorized')) {
        const userPassword = prompt("Enter the password:");
        if (userPassword === correctPassword) {
            sessionStorage.setItem('isAuthorized', 'true');
            incrementCount(id);
        } else {
            alert("Password incorrect.");
        }
    } else {
        incrementCount(id);
    }
}

function requestPasswordAndDecrement(id) {
    if (!sessionStorage.getItem('isAuthorized')) {
        const userPassword = prompt("Enter the password:");
        if (userPassword === correctPassword) {
            sessionStorage.setItem('isAuthorized', 'true');
            decrementCount(id);
        } else {
            alert("Password incorrect.");
        }
    } else {
        decrementCount(id);
    }
}

// Carica i valori dei contatori all'avvio
document.addEventListener('DOMContentLoaded', loadCounts);

// Funzione per caricare i contatori da Supabase
async function loadCounts() {
    const { data, error } = await supabase
        .from('Counters')
        .select('ID, Conteggio');
    
    if (error) {
        console.error('Errore nel caricamento dei contatori:', error);
        return;
    }

    data.forEach(record => {
        const countElement = document.querySelector(`td[data-id="${record.ID}"]`);
        if (countElement) {
            countElement.innerText = record.Conteggio || 0;
        }
    });
    updateRanking();
}

// Salva il conteggio aggiornato su Supabase
async function saveCounts(id, count) {
    const { error } = await supabase
        .from('Counters')
        .upsert({ ID: id, Conteggio: count });
    
    if (error) {
        console.error('Errore nel salvataggio del contatore:', error);
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

    const tableBody = document.querySelector('#counterTable tbody');
    rows.forEach((row, index) => {
        row.querySelector('td:first-child').innerText = index + 1; // Aggiorna il numero di classifica
        if (index === 0) row.classList.add('gold');
        else if (index === 1) row.classList.add('silver');
        else if (index === 2) row.classList.add('bronze');
        else row.classList.add('green');
    });

    // Riaggiunge le righe riordinate al body della tabella
    rows.forEach(row => tableBody.appendChild(row));
}
