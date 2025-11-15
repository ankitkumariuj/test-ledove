$(document).ready(() => {
    const stars = document.querySelectorAll('.svg-star');
    let rating = localStorage.getItem("product_rating");


   

    if (stars) {
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                const clickedIndex = index;
                stars.forEach((s, i) => {
                    if (i <= clickedIndex) {
                        s.classList.add('active');

                    } else {
                        s.classList.remove('active');
                    }
                });
                let product_rating = clickedIndex + 1;
                localStorage.setItem("product_rating" , product_rating);
            });
        });
    }
});

