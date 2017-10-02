if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw-cache.js')
        .then(console.log)
        .catch(console.error);
}