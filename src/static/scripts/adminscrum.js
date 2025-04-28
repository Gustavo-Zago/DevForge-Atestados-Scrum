document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        
        try {
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                window.location.reload();  // Recarrega a página após sucesso
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});