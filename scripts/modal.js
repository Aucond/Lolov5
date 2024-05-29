const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-body');
const span = document.getElementsByClassName('close')[0];

span.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

function openModal(url) {
    fetch('https://uptime-mercury-api.azurewebsites.net/webparser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
    })
    .then(response => response.json())
    .then(data => {
        modalContent.innerHTML = `
            <h2>${data.title}</h2>
            <p>${data.content}</p>
        `;
        modal.style.display = 'block';
    });
}
