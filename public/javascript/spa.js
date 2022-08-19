function render(hashKey) {

    // Hide all page divs
    let pages = document.querySelectorAll(".page");
    for (let i = 0; i < pages.length; i++) {
        pages[i].style.display = 'none';
    }

    // Reveal requested div
    switch(hashKey){
        case 'game':
            pages[1].style.display = 'block';
            break;
        default:
            pages[0].style.display = 'block';
            break;
    }
}