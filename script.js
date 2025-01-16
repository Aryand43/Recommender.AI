// DOM Elements
const imageUpload = document.getElementById('image-upload');
const analyzeBtn = document.getElementById('analyze-btn');
const resetBtn = document.getElementById('reset-btn');
const resultsSection = document.getElementById('results-section');
const productList = document.getElementById('product-list');

// Mock Product Dataset
const mockProducts = [
  { name: 'CeraVe Moisturizing Cream', link: 'https://www.amazon.com/dp/B000YJ2SLG', category: 'Skincare' },
  { name: 'La Roche-Posay Gentle Cleanser', link: 'https://www.amazon.com/dp/B01MSSDEPK', category: 'Skincare' },
  { name: 'Dyson Supersonic Hair Dryer', link: 'https://www.amazon.com/dp/B01N5IV1H8', category: 'Miscellaneous' },
  { name: 'Maybelline Matte Ink', link: 'https://www.amazon.com/dp/B071YS2JXZ', category: 'Cosmetics' }
];

// Load the AI Model
let faceModel;
async function loadModel() {
  faceModel = await blazeface.load();
  console.log('AI Model Loaded Successfully');
}
loadModel();

// Event Listeners
analyzeBtn.addEventListener('click', handleAnalyze);
resetBtn.addEventListener('click', resetApp);

// Handle Image Analysis
async function handleAnalyze() {
  const file = imageUpload.files[0];

  if (!file) {
    alert('Please upload an image before analyzing!');
    return;
  }

  showLoadingIndicator();

  try {
    const image = await readImage(file);
    const predictions = await faceModel.estimateFaces(image, false);

    hideLoadingIndicator();

    if (predictions.length > 0) {
      console.log('Face detected:', predictions);
      displayRecommendations('Skincare'); // Recommend Skincare
    } else {
      console.log('No face detected');
      displayRecommendations('Miscellaneous'); // Recommend Miscellaneous
    }
  } catch (error) {
    hideLoadingIndicator();
    console.error('Error analyzing the image:', error);
    alert('An error occurred. Please try again.');
  }
}

// Display Recommendations
function displayRecommendations(category) {
  resultsSection.hidden = false;

  productList.innerHTML = '';
  const recommendedProducts = mockProducts.filter(product => product.category === category);

  recommendedProducts.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.innerHTML = `
      <h3>${product.name}</h3>
      <a href="${product.link}" target="_blank" class="btn">Buy Now</a>
    `;
    productList.appendChild(productCard);
  });
}

// Utility: Convert Uploaded Image to Tensor
async function readImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.src = reader.result;
      img.onload = () => resolve(tf.browser.fromPixels(img));
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Reset Application
function resetApp() {
  resultsSection.hidden = true;
  productList.innerHTML = '';
  imageUpload.value = '';
  hideLoadingIndicator();
}

// Loading Indicators
function showLoadingIndicator() {
  analyzeBtn.textContent = 'Analyzing...';
  analyzeBtn.disabled = true;
}

function hideLoadingIndicator() {
  analyzeBtn.textContent = 'Analyze';
  analyzeBtn.disabled = false;
}
