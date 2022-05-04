function addClickListeners() {
    const items = document.querySelectorAll('.item');
    const hamburger = document.getElementsByClassName("hamburger")[0];

    hamburger.addEventListener('click', () => {
        toggleMenu();
    });

    items.forEach(item => {
        //Toggle 'item-active' class on click
        item.addEventListener('click', () => {
            setItemActive(Array.prototype.indexOf.call(items, item));
            closeMenu()
        });
    });
}

function setItemActive(itemIndex) {
    const items = document.querySelectorAll('.item');
    items.forEach(item => {
        if(items[itemIndex] === item){
            item.classList.remove('item-active');
            item.classList.add('item-active');
        }else{
            item.classList.remove('item-active');
        }
    });
}

function openMenu(){
    const hamburger = document.getElementsByClassName("hamburger")[0];
    hamburger.classList.remove("is-active");
    hamburger.classList.add("is-active");
    document.getElementById("hamburger-menu").classList.remove("hamb-active");
    document.getElementById("hamburger-menu").classList.add("hamb-active");
}
function closeMenu(){
    const hamburger = document.getElementsByClassName("hamburger")[0];
    hamburger.classList.remove("is-active");
    document.getElementById("hamburger-menu").classList.remove("hamb-active");
}

function toggleMenu(){
    const hamburger = document.getElementsByClassName("hamburger")[0];
    hamburger.classList.toggle("is-active");
    document.getElementById("hamburger-menu").classList.toggle("hamb-active");
}

function setItemActiveByHref(href){
    const items = document.querySelectorAll('.item');
    items.forEach(item => {
        item.getAttribute('href')
        if(item.getAttribute('href') === href){
            setItemActive(Array.prototype.indexOf.call(items, item));
        }
    });
}