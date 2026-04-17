const sortConfig = { direction: 'ascending', key: 'v' };
const arr = [{v: 2}, {v: null}, {v: 1}, {v: null}, {v: 3}];
arr.sort((a, b) => {
    let valA = a[sortConfig.key];
    let valB = b[sortConfig.key];
    let isAEmpty = valA === null || valA === undefined || valA === '';
    let isBEmpty = valB === null || valB === undefined || valB === '';
    
    if (isAEmpty && isBEmpty) return 0;
    if (isAEmpty) return sortConfig.direction === 'ascending' ? -1 : 1;
    if (isBEmpty) return sortConfig.direction === 'ascending' ? 1 : -1;

    if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
    return 0;
});
console.log("ascending:", arr.map(x => x.v));

sortConfig.direction = 'descending';
arr.sort((a, b) => {
    let valA = a[sortConfig.key];
    let valB = b[sortConfig.key];
    let isAEmpty = valA === null || valA === undefined || valA === '';
    let isBEmpty = valB === null || valB === undefined || valB === '';
    
    if (isAEmpty && isBEmpty) return 0;
    if (isAEmpty) return sortConfig.direction === 'ascending' ? -1 : 1;
    if (isBEmpty) return sortConfig.direction === 'ascending' ? 1 : -1;

    if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
    return 0;
});
console.log("descending:", arr.map(x => x.v));
