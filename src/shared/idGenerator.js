export const idGenerator = (tabla) => {
    const fecha = new Date().toLocaleString().slice(0,9).replace(/\//g, '');
    return ( tabla.slice(0,2) + '-'+ fecha.replace(/\//g, '') + '-' + Math.floor(Math.random() * 1000) );
    
}

console.log(idGenerator("User")); 