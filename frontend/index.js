import { backend } from "declarations/backend";

let lists = [];

async function loadLists() {
    try {
        lists = await backend.getLists();
        renderLists();
    } catch (error) {
        console.error("Failed to load lists:", error);
    }
}

function renderLists() {
    const container = document.getElementById('listsContainer');
    container.innerHTML = '';
    const template = document.getElementById('listTemplate');

    lists.forEach(list => {
        const listElement = template.content.cloneNode(true);
        const listCard = listElement.querySelector('.list-card');
        
        listCard.id = `list-${list.id}`;
        listCard.querySelector('.list-title').textContent = list.name;
        
        const addItemForm = listCard.querySelector('.add-item-form');
        const input = addItemForm.querySelector('.new-item-input');
        const addBtn = addItemForm.querySelector('.add-item-btn');
        
        addBtn.onclick = () => addItem(list.id, input);
        
        const itemsList = listCard.querySelector('.items-list');
        list.items.forEach(item => {
            const itemElement = createItemElement(item, list.id);
            itemsList.appendChild(itemElement);
        });
        
        container.appendChild(listCard);
    });
}

function createItemElement(item, listId) {
    const li = document.createElement('li');
    li.className = `item ${item.completed ? 'completed' : ''}`;
    li.id = `item-${item.id}`;
    
    const itemText = document.createElement('span');
    itemText.className = 'item-text';
    itemText.textContent = item.description;
    itemText.onclick = () => toggleItem(listId, item.id);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.onclick = () => deleteItem(listId, item.id);
    
    li.appendChild(itemText);
    li.appendChild(deleteBtn);
    return li;
}

async function createNewList() {
    const input = document.getElementById('newListInput');
    const name = input.value.trim();
    
    if (name) {
        try {
            await backend.createList(name);
            input.value = '';
            await loadLists();
        } catch (error) {
            console.error("Failed to create list:", error);
        }
    }
}

async function addItem(listId, input) {
    const description = input.value.trim();
    
    if (description) {
        try {
            await backend.addItem(listId, description);
            input.value = '';
            await loadLists();
        } catch (error) {
            console.error("Failed to add item:", error);
        }
    }
}

async function toggleItem(listId, itemId) {
    try {
        await backend.toggleItem(listId, itemId);
        await loadLists();
    } catch (error) {
        console.error("Failed to toggle item:", error);
    }
}

async function deleteItem(listId, itemId) {
    try {
        await backend.deleteItem(listId, itemId);
        await loadLists();
    } catch (error) {
        console.error("Failed to delete item:", error);
    }
}

// Make createNewList available globally
window.createNewList = createNewList;

// Initial load
document.addEventListener('DOMContentLoaded', loadLists);
