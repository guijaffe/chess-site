const wrapper = document.querySelector('.wrapper');
const carousel = document.querySelector('.carousel');
const participants = [
	{ name: "Хозе-Рауль Капабланка", description: "Чемпион мира по шахматам", image: "" },
	{ name: "Эммануил Ласкер", description: "Чемпион мира по шахматам", image: "" },
	{ name: "Александр Алехин", description: "Чемпион мира по шахматам", image: "" },
	{ name: "Арон Нимцович", description: "Чемпион мира по шахматам", image: "" },
	{ name: "Рихард Рети", description: "Чемпион мира по шахматам", image: "" },
	{ name: "Остап Бендер", description: "Гроссмейстер", image: "" },
];

function createParticipantItem({ name, description, image }) {
	return `
    <li class="card">
      <img src="${image || 'images/icon/participant.png'}" alt="${name}" draggable="false">
      <h4 class="participants__item__title">${name}</h4>
      <p class="participants__item__description">${description}</p>
      <div class="participants__item__button">
        <a href="#" class="btn btn--outline-secondary">Подробнее</a>
      </div>
    </li>
  `;
}

function initializeCarousel() {
	const participantsList = document.querySelector('.carousel');
	participantsList.innerHTML = participants.map(createParticipantItem).join('');

	let carouselChildren = [...carousel.children];
	let firstCardWidth = carousel.querySelector(".card").offsetWidth;
	let isDragging = false, startX, startScrollLeft, timeoutId;
	let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

	function updateCardMetrics() {
		firstCardWidth = carousel.querySelector(".card").offsetWidth;
		cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);
	}

	window.addEventListener('resize', updateCardMetrics);

	carouselChildren.slice(-cardPerView).reverse().forEach(card => {
		carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
	});
	carouselChildren.slice(0, cardPerView).forEach(card => {
		carousel.insertAdjacentHTML("beforeend", card.outerHTML);
	});

	carousel.scrollLeft = firstCardWidth * cardPerView;

	const totalSlides = participants.length;

	function updateCurrentSlide() {
		const scrollPosition = carousel.scrollLeft;
		const currentIndex = Math.round(scrollPosition / firstCardWidth);
		document.querySelector('.participants__current-slide').textContent = String((currentIndex % totalSlides) + 1);
		document.querySelector('.participants__total-slides').textContent = ` / ${totalSlides}`;
	}

	function scrollToCard(direction) {
		const scrollAmount = direction === "prev" ? -firstCardWidth : firstCardWidth;
		carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
	}

	const autoPlay = () => {
		if (window.innerWidth < 768) return; // Отключил автопрокрутку на экранах меньше 768px
		timeoutId = setTimeout(() => scrollToCard("next"), 4000);
	};

	const infiniteScroll = () => {
		if (carousel.scrollLeft <= 0) {
			carousel.classList.add('no-transition');
			carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
			carousel.classList.remove('no-transition');
		} else if (Math.ceil(carousel.scrollLeft) >= carousel.scrollWidth - carousel.offsetWidth) {
			carousel.classList.add('no-transition');
			carousel.scrollLeft = carousel.offsetWidth;
			carousel.classList.remove('no-transition');
		}
		updateCurrentSlide();
		clearTimeout(timeoutId);
		autoPlay();
	};

	const arrowBtns = document.querySelectorAll('.participants__title__arrows button');
	arrowBtns.forEach(btn => {
		btn.addEventListener('click', () => scrollToCard(btn.id));
	});

	const dragStart = (e) => {
		isDragging = true;
		carousel.classList.add('dragging');
		startX = e.pageX;
		startScrollLeft = carousel.scrollLeft;
	};

	const dragging = (e) => {
		if (!isDragging) return;
		carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
	};

	const dragStop = () => {
		isDragging = false;
		carousel.classList.remove('dragging');
		updateCurrentSlide();
	};

	autoPlay();

	carousel.addEventListener("mousedown", dragStart);
	carousel.addEventListener("mousemove", dragging);
	document.addEventListener("mouseup", dragStop);
	carousel.addEventListener("scroll", infiniteScroll);
	wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
	wrapper.addEventListener("mouseleave", autoPlay);

	updateCurrentSlide();
}

function initializeFutureSteps() {
	const futureSteps = document.querySelector('.future-steps');
	const leftButton = document.getElementById('left');
	const rightButton = document.getElementById('right');
	const dotsContainer = document.querySelector('.dots-container');

	const totalSlides = 7;
	let isScrolling = false;

	function getCurrentSlide() {
		const scrollLeft = futureSteps.scrollLeft;
		const cardWidth = futureSteps.offsetWidth;
		return Math.round(scrollLeft / cardWidth) + 1;
	}

	function scrollToCard(direction) {
		if (isScrolling) return;
		isScrolling = true;

		const scrollAmount = direction === 'left' ? -futureSteps.offsetWidth : futureSteps.offsetWidth;
		futureSteps.scrollBy({ left: scrollAmount, behavior: 'smooth' });


		setTimeout(() => {
			updateButtons();
			updateDots();
			isScrolling = false;
		}, 500);
	}

	function updateButtons() {
		const currentSlide = getCurrentSlide();
		leftButton.disabled = currentSlide === 1;
		rightButton.disabled = currentSlide === totalSlides;
	}

	function updateDots() {
		const currentSlide = getCurrentSlide();
		dotsContainer.innerHTML = '';

		for (let i = 1; i <= totalSlides; i++) {
			const dot = document.createElement('span');
			dot.classList.add('dot');
			if (i === currentSlide) dot.classList.add('active');
			dotsContainer.appendChild(dot);
		}
	}

	leftButton.addEventListener('click', () => scrollToCard('left'));
	rightButton.addEventListener('click', () => scrollToCard('right'));

	futureSteps.addEventListener('scroll', () => {
		if (!isScrolling) {
			updateButtons();
			updateDots();
		}
	});

	updateButtons();
	updateDots();

	function handleResize() {
		if (window.innerWidth > 780) {
			leftButton.style.display = 'none';
			rightButton.style.display = 'none';
		} else {
			leftButton.style.display = 'flex';
			rightButton.style.display = 'flex';
		}
	}

	window.addEventListener('resize', handleResize);
	handleResize();
}

document.addEventListener('DOMContentLoaded', () => {
	initializeCarousel();
	initializeFutureSteps();
});