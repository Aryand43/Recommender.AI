// DOM Elements
const imageUpload = document.getElementById('image-upload');
const analyzeBtn = document.getElementById('analyze-btn');
const resetBtn = document.getElementById('reset-btn');
const resultsSection = document.getElementById('results-section');
const productList = document.getElementById('product-list');

// Event Listeners
analyzeBtn.addEventListener('click', handleAnalyze);
resetBtn.addEventListener('click', resetApp);

// Handle Image Analysis
function handleAnalyze() {
  const file = imageUpload.files[0];

  if (!file) {
    alert('Please upload an image before analyzing!');
    return;
  }

  // Simulate loading and processing
  showLoadingIndicator();

  setTimeout(() => {
    hideLoadingIndicator();
    displayRecommendations(); // Replace with actual AI results when backend is integrated
  }, 2000); // Simulate processing time
}

// Display Recommendations
function displayRecommendations() {
  resultsSection.hidden = false;

  // Clear existing products
  productList.innerHTML = '';

  // Example recommended products
  const recommendations = [
    {
      name: 'Hydrating Serum',
      image: 'assets/placeholder.png',
      link: 'https://amazon.com/hydrating-serum'
    },
    {
      name: 'Brightening Cream',
      image: 'assets/placeholder.png',
      link: 'https://amazon.com/brightening-cream'
    },
    {
      name: 'Exfoliating Scrub',
      image: 'assets/placeholder.png',
      link: 'https://amazon.com/exfoliating-scrub'
    }
  ];

  // Populate recommendations
  recommendations.forEach(product => {
    const productCard = document.createElement('div');
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <p>${product.name}</p>
      <a href="${product.link}" target="_blank">Buy Now</a>
    `;
    productList.appendChild(productCard);
  });
}

// Reset Application
function resetApp() {
  resultsSection.hidden = true;
  productList.innerHTML = '';
  imageUpload.value = '';
}

// Show Loading Indicator
function showLoadingIndicator() {
  analyzeBtn.textContent = 'Analyzing...';
  analyzeBtn.disabled = true;
}

// Hide Loading Indicator
function hideLoadingIndicator() {
  analyzeBtn.textContent = 'Analyze';
  analyzeBtn.disabled = false;
}
