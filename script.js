// Select the preloader elements
const progressBar = document.querySelector('.progress-bar');
const progressValue = document.getElementById('progressValue');
const preloader = document.getElementById('preloader');
const content = document.querySelector('.container'); // Container with start button and logo
const startButton = document.getElementById('submitButton'); // START button
const mainContent = document.getElementById('mainContent'); // Main content area

let progress = 0;
const totalDuration = 1000; // Duration for preloader (1 second)
const intervalDuration = 20; // Update every 20 milliseconds
const increment = (100 / (totalDuration / intervalDuration)); // Increment per interval

let currentSectionIndex = 0; // Track the currently visible section
const sections = document.querySelectorAll('.content-section'); // All content sections

// Function to update progress and show percentage
function updateProgress() {
    if (progress <= 100) {
        const offset = 440 - (progress / 100) * 440; // Update offset based on progress
        progressBar.style.strokeDashoffset = offset;
        progressValue.textContent = Math.round(progress) + '%';
        progress += increment; // Increment progress value
    }

    // When the progress reaches 100%, hide the preloader and show the content
    if (progress > 100) {
        clearInterval(progressInterval);
        setTimeout(() => {
            preloader.classList.add('hidden'); // Hide the preloader
            content.style.display = 'flex'; // Show the main content after preloader disappears
            progressValue.style.visibility = 'hidden'; // Hide the progress value
        }, 750); // Delay before hiding the preloader
    }
}

// Simulate page loading with the interval
const progressInterval = setInterval(updateProgress, intervalDuration);

// Automatically hide the preloader once the window loads completely
window.onload = function () {
    setTimeout(() => {
        progress = 100; // Ensure progress is 100% even on fast loads
        updateProgress();
    }, 100); // Small delay for smooth load
};


// Add an event listener to the START button
startButton.addEventListener('click', function() {
    // Ensure the preloader is fully completed before showing the main content
    if (progress >= 100) {
        content.style.display = 'none'; // Hide the start screen
        
        // Make sure main content fades in by setting display and triggering the fade-in effect
        mainContent.style.display = 'flex'; // Set display to flex
        setTimeout(() => {
            mainContent.classList.add('visible'); // Add the class to trigger the fade-in
        }, 200); // Small delay to allow transition
    }
});

// Function to show the selected content section and update the navbar
function showSection(index) {
    sections.forEach((section, idx) => {
        if (idx === index) {
            section.classList.add('visible'); // Show the selected section
            section.style.display = 'block'; // Make it visible
            // Highlight the active nav link
            navLinks[idx].style.textDecoration = 'underline';
        } else {
            section.classList.remove('visible'); // Hide the unselected section
            section.style.display = 'none'; // Hide the section
            // Remove underline from inactive nav links
            navLinks[idx].style.textDecoration = 'none';
        }
    });
}

// Add click event listeners to navbar items
const navLinks = document.querySelectorAll('.navbar ul li a');
navLinks.forEach((link, index) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        currentSectionIndex = index;
        showSection(currentSectionIndex);
        navbarMenu.classList.remove('visible'); // Close the menu on click
    });
});


// Handle mouse wheel scrolling
let lastScrollTime = 0;
window.addEventListener('wheel', (event) => {
    const now = new Date().getTime();
    if (now - lastScrollTime < 100) return; // Limit to one scroll event every 100ms

    lastScrollTime = now;
    if (event.deltaY > 0) {
        if (currentSectionIndex < sections.length - 1) {
            currentSectionIndex++;
            showSection(currentSectionIndex);
        }
    } else {
        if (currentSectionIndex > 0) {
            currentSectionIndex--;
            showSection(currentSectionIndex);
        }
    }
});

const hamburger = document.getElementById('hamburger');
const navbarMenu = document.getElementById('navbarMenu');

hamburger.addEventListener('click', () => {
    navbarMenu.classList.toggle('visible');
    hamburger.classList.toggle('active'); // Add a class that rotates the hamburger icon
});

// Handle touch scrolling (for mobile devices)
window.addEventListener('touchstart', handleTouchStart, false);
window.addEventListener('touchmove', handleTouchMove, false);

let xStart = null;

function handleTouchStart(event) {
    const firstTouch = event.touches[0];
    xStart = firstTouch.clientX;
}

function handleTouchMove(event) {
    if (!xStart) return;
    event.preventDefault(); // Prevent default touch scrolling behavior

    let xEnd = event.touches[0].clientX;
    let xDiff = xStart - xEnd;

    if (Math.abs(xDiff) > 50) { // Threshold to prevent small movements
    if (xDiff > 0 && currentSectionIndex < sections.length - 1) {
        currentSectionIndex++;
    } else if (xDiff < 0 && currentSectionIndex > 0) {
        currentSectionIndex--;
    }
    showSection(currentSectionIndex);
    }
    xStart = null; // Reset after swipe detection

}

// Close the menu when clicking outside of it
document.addEventListener('click', (event) => {
    const isClickInsideMenu = navbarMenu.contains(event.target);
    const isClickOnHamburger = hamburger.contains(event.target);

    if (!isClickInsideMenu && !isClickOnHamburger && navbarMenu.classList.contains('visible')) {
        navbarMenu.classList.remove('visible'); // Close the menu
    }
});


// Function to generate a random integer between min and max
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to create random keyframes for each icon
function createRandomKeyframes(icon, index) {
    const animationName = `fly-random-${index}`;

    // Generate random values for position and rotation
    const randomX1 = getRandomInt(-200, 200);
    const randomY1 = getRandomInt(-200, 200);
    const randomRotate1 = getRandomInt(-360, 360);

    const randomX2 = getRandomInt(-200, 200);
    const randomY2 = getRandomInt(-200, 200);
    const randomRotate2 = getRandomInt(-360, 360);

    // Create keyframes using random values
    const keyframes = `
        @keyframes ${animationName} {
            0% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(${randomX1}px, ${randomY1}px) rotate(${randomRotate1}deg); }
            100% { transform: translate(${randomX2}px, ${randomY2}px) rotate(${randomRotate2}deg); }
        }
    `;

    // Inject the keyframes into the document's stylesheet
    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

    // Apply the animation to the icon
    icon.style.animation = `${animationName} ${getRandomInt(10, 20)}s infinite alternate ease-in-out`;
}

// Apply random keyframes to each icon
document.addEventListener('DOMContentLoaded', () => {
    const icons = document.querySelectorAll('.flying-icons i');
    icons.forEach((icon, index) => {
        createRandomKeyframes(icon, index);
    });
});
