document.addEventListener('DOMContentLoaded', function() {
    const projectsImageData = [
        { images: ["images/project1.png", "images/project1_b.png"] },        // Discord Bot
        { images: ["images/project2_a.png", "images/project2_b.png"] },    // Weather Web App
        { images: ["images/project3_a.png", "images/project3_b.png"] },    // Locations Reminders
        { images: ["images/project4_a.png", "images/project4_b.png"] }     // Movie Database
    ];

    const slideshowInstances = [];

    function buildModernSlideshow(containerId, imagesArray) {
        const container = document.getElementById(containerId);
        if (!container) return null;
        container.innerHTML = '';

        const slidesContainer = document.createElement('div');
        slidesContainer.className = 'slides-container';

        const imgElements = [];
        imagesArray.forEach((src, idx) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = `Project screenshot ${idx + 1}`;
            img.classList.add('slide-img');
            if (idx === 0) img.classList.add('active');
            slidesContainer.appendChild(img);
            imgElements.push(img);
        });

        const prevBtn = document.createElement('button');
        prevBtn.className = 'slideshow-btn btn-prev';
        prevBtn.innerHTML = '‹';
        const nextBtn = document.createElement('button');
        nextBtn.className = 'slideshow-btn btn-next';
        nextBtn.innerHTML = '›';

        const dotsDiv = document.createElement('div');
        dotsDiv.className = 'dots-container';
        const dotsArr = [];

        for (let i = 0; i < imagesArray.length; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.dataset.index = i;
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                const slideIndex = parseInt(dot.dataset.index);
                goToSlide(slideIndex, instance, true);
            });
            dotsDiv.appendChild(dot);
            dotsArr.push(dot);
        }

        container.appendChild(slidesContainer);
        container.appendChild(prevBtn);
        container.appendChild(nextBtn);
        container.appendChild(dotsDiv);

        let currentIdx = 0;
        let cycleInterval = null;
        const totalSlides = imagesArray.length;

        function updateSlidesAndDots(index) {
            if (index < 0) index = 0;
            if (index >= totalSlides) index = totalSlides - 1;
            currentIdx = index;
            imgElements.forEach((img, i) => {
                if (i === currentIdx) img.classList.add('active');
                else img.classList.remove('active');
            });
            dotsArr.forEach((dot, i) => {
                if (i === currentIdx) dot.classList.add('active');
                else dot.classList.remove('active');
            });
        }

        function goToSlide(index, instanceRef, resetTimer = true) {
            if (index < 0) index = 0;
            if (index >= totalSlides) index = totalSlides - 1;
            updateSlidesAndDots(index);
            if (resetTimer && instanceRef && instanceRef.resetInterval) {
                instanceRef.resetInterval();
            }
        }

        function nextSlide(resetTimer = true) {
            let newIdx = currentIdx + 1;
            if (newIdx >= totalSlides) newIdx = 0;
            goToSlide(newIdx, instance, resetTimer);
        }

        function prevSlide(resetTimer = true) {
            let newIdx = currentIdx - 1;
            if (newIdx < 0) newIdx = totalSlides - 1;
            goToSlide(newIdx, instance, resetTimer);
        }

        function startAutoCycle() {
            if (cycleInterval) clearInterval(cycleInterval);
            if (totalSlides <= 1) return;
            cycleInterval = setInterval(() => {
                nextSlide(false);
            }, 3500);
        }

        function resetInterval() {
            if (cycleInterval) {
                clearInterval(cycleInterval);
                cycleInterval = null;
            }
            startAutoCycle();
        }

        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            prevSlide(true);
        });
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            nextSlide(true);
        });

        // pause on hover
        container.addEventListener('mouseenter', () => {
            if (cycleInterval) {
                clearInterval(cycleInterval);
                cycleInterval = null;
            }
        });
        container.addEventListener('mouseleave', () => {
            if (!cycleInterval) startAutoCycle();
        });

        startAutoCycle();

        const instance = {
            nextSlide,
            prevSlide,
            goToSlide: (idx) => goToSlide(idx, instance, true),
            resetInterval,
            destroy: () => { if (cycleInterval) clearInterval(cycleInterval); }
        };
        return instance;
    }

    function initAllSlideshows() {
        const projectCards = document.querySelectorAll('.project-card');
        for (let i = 0; i < projectCards.length && i < projectsImageData.length; i++) {
            const slideshowId = `slideshow-${i}`;
            const imageSet = projectsImageData[i].images;
            if (imageSet && imageSet.length) {
                const slideshow = buildModernSlideshow(slideshowId, imageSet);
                if (slideshow) slideshowInstances.push(slideshow);
            } else {
                const container = document.getElementById(slideshowId);
                if (container) {
                    container.innerHTML = `<div class="slides-container" style="display:flex; align-items:center; justify-content:center; background:#eef2f8;"><span style="padding:1rem; color:#5b6e8c;">📷 preview</span></div>`;
                }
            }
        }
    }

    initAllSlideshows();

    const allImgs = document.querySelectorAll('.slide-img');
    allImgs.forEach(img => {
        img.addEventListener('error', function() {
            if (!this.dataset.fallbackAttempt) {
                this.dataset.fallbackAttempt = 'true';
                this.style.background = "#e4e9f0";
                this.style.objectFit = "contain";
                this.style.padding = "12px";
                this.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23899bb0' width='72px' height='72px'%3E%3Cpath d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 8h-4v4h-4v-4H6V9h4V5h4v4h4v2z'/%3E%3C/svg%3E";
            }
        });
    });

    window.addEventListener('beforeunload', () => {
        slideshowInstances.forEach(inst => {
            if (inst && inst.destroy) inst.destroy();
        });
    });
});