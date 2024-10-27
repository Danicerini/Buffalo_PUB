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
            localStorage.setItem(id, currentCount);
        }

        // Funzione per decrementare il contatore
        function decrementCount(id) {
            const countElement = document.querySelector(`td[data-id="${id}"]`);
            let currentCount = parseInt(countElement.innerText);
            if (currentCount > 0) {
                currentCount--;
                countElement.innerText = currentCount;
                localStorage.setItem(id, currentCount);
            }
        }

        // Carica i valori dei contatori e aggiorna la classifica all'avvio della pagina
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('td[data-id]').forEach(td => {
                const savedCount = localStorage.getItem(td.getAttribute('data-id'));
                if (savedCount) {
                    td.innerText = savedCount;
                }
            });
            updateRanking();
        });

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