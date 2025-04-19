fetch('navbar.html').then(res => res.text()).then(data => {
    document.getElementById('nav-section').innerHTML = data;
})