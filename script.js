document.addEventListener("DOMContentLoaded", function() {
    let slideIndices = [];
    let slideContainers = document.querySelectorAll(".slideshow-container");

    slideContainers.forEach((container, index) => {
        slideIndices[index] = 0;
        showSlides(container, index);
    });

    function showSlides(container, index) {
        let slides = container.querySelectorAll(".mySlides");
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";  
        }
        slideIndices[index]++;
        if (slideIndices[index] > slides.length) {
            slideIndices[index] = 1;
        }
        slides[slideIndices[index] - 1].style.display = "block";  
        setTimeout(() => showSlides(container, index), 3000); // Change image every 3 seconds
    }
});
