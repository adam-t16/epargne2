document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const totalElement = document.getElementById('total');
    const resetButton = document.getElementById('reset');
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    
    let cells = [];
    
    // Load saved state from localStorage
    const loadSavedState = () => {
        const savedState = localStorage.getItem('savingsGrid');
        return savedState ? JSON.parse(savedState) : Array(400).fill(false);
    };
    
    // Save state to localStorage
    const saveState = () => {
        localStorage.setItem('savingsGrid', JSON.stringify(cells.map(cell => cell.checked)));
    };
    
    // Calculate and update total
    const updateTotal = () => {
        const total = cells.reduce((sum, cell) => {
            return sum + (cell.checked ? cell.amount : 0);
        }, 0);
        totalElement.textContent = `${total} DH`;
    };
    
    // Calculate amount for a given index (cycling from 5 to 100)
    const calculateAmount = (index) => {
        // Each cycle is 20 numbers (5 to 100, stepping by 5)
        const cycleLength = 20;
        const position = index % cycleLength;
        return (position + 1) * 5;
    };
    
    // Create grid cells
    const createGrid = () => {
        const savedState = loadSavedState();
        grid.innerHTML = '';
        cells = [];
        
        for (let i = 0; i < 400; i++) {
            const amount = calculateAmount(i);
            const day = days[i % 7];
            
            const cell = document.createElement('div');
            cell.className = `cell ${savedState[i] ? 'checked' : ''}`;
            cell.innerHTML = `
                <span class="amount">${amount} DH</span>
                <span class="day">${day}</span>
            `;
            
            const cellData = {
                element: cell,
                amount: amount,
                checked: savedState[i]
            };
            
            cell.addEventListener('click', () => {
                cellData.checked = !cellData.checked;
                cell.classList.toggle('checked');
                saveState();
                updateTotal();
            });
            
            cells.push(cellData);
            grid.appendChild(cell);
        }
        
        updateTotal();
    };
    
    // Reset grid
    resetButton.addEventListener('click', () => {
        if (confirm('Êtes-vous sûr de vouloir réinitialiser la grille ?')) {
            localStorage.removeItem('savingsGrid');
            createGrid();
        }
    });
    
    // Initialize grid
    createGrid();
});