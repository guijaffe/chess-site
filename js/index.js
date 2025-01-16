document.querySelector('.future-steps__arrow.left').addEventListener('click', function() {
	document.querySelector('.future-steps__list').scrollBy({ left: -300, behavior: 'smooth' });
});

document.querySelector('.future-steps__arrow.right').addEventListener('click', function() {
	document.querySelector('.future-steps__list').scrollBy({ left: 300, behavior: 'smooth' });
});