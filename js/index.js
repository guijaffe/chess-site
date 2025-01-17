const wrapper = document.querySelector('.wrapper');
const carousel = document.querySelector('.carousel');
const arrowBtns = document.querySelectorAll('.participants__title__arrows button');
const participants = [
	{ name: "Хозе-Рауль Капабланка", description: "Чемпион мира по шахматам", image: "" },
	{ name: "Эммануил Ласкер", description: "Чемпион мира по шахматам", image: "" },
	{ name: "Александр Алехин", description: "Чемпион мира по шахматам", image: "" },
	{ name: "Арон  Нимцович", description: "Чемпион мира по шахматам", image: "" },
	{ name: "Рихард Рети", description: "Чемпион мира по шахматам", image: "" },
	{ name: "Остап Бендер", description: "Гроссмейстер", image: "" },
];

function createParticipantItem({ name, description, image }) {
	return `
	<li class="card">
      <img src="${image || 'images/participant.png'}" alt="${name}" draggable="false">
      <h4 class="participants__item__title">${name}</h4>
      <p class="participants__item__description">${description}</p>
      <div class="participants__item__button">
        <a href="#" class="btn btn--outline-secondary">Подробнее</a>
      </div>
     </li>
  `;
}
document.addEventListener('DOMContentLoaded', () => {
	const participantsList = document.querySelector('.carousel');
	participantsList.innerHTML = participants.map(createParticipantItem).join('');

	let carouselChildrens = [...carousel.children];

	const firstCardWidth = carousel.querySelector(".card").offsetWidth;
	let isDragging = false, startX, startScrollLeft, timeoutId;

	let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

	carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
		carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
	});
	carouselChildrens.slice(0, cardPerView).forEach(card => {
		carousel.insertAdjacentHTML("beforeend", card.outerHTML);
	});

	carousel.scrollLeft = firstCardWidth * cardPerView;

	arrowBtns.forEach(btn => {
		btn.addEventListener('click', () => {
			carousel.scrollLeft += btn.id === "prev" ? -firstCardWidth : firstCardWidth;
		});
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
	};

	const autoPlay = () => {
		if (window.innerWidth < 780) return; // решил убрать автоскролл для экранов меньше 780px
		timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 4000);
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

		clearTimeout(timeoutId);
		if (!wrapper.matches(":hover")) autoPlay();
	};

	autoPlay();

	carousel.addEventListener("mousedown", dragStart);
	carousel.addEventListener("mousemove", dragging);
	document.addEventListener("mouseup", dragStop);
	carousel.addEventListener("scroll", infiniteScroll);
	wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
	wrapper.addEventListener("mouseleave", autoPlay);
});
