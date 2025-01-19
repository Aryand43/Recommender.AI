// DOM Elements
const imageUpload = document.getElementById('image-upload');
const analyzeBtn = document.getElementById('analyze-btn');
const resetBtn = document.getElementById('reset-btn');
const resultsSection = document.getElementById('results-section');
const productList = document.getElementById('product-list');
const imagePreviewContainer = document.createElement('div');
imagePreviewContainer.id = 'image-preview-container';
imageUpload.parentNode.insertBefore(imagePreviewContainer, imageUpload.nextSibling);

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
imageUpload.addEventListener('change', handleImagePreview);

function handleImagePreview(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      imagePreviewContainer.innerHTML = `
        <div class="image-preview">
          <img src="${e.target.result}" alt="Preview">
          <button class="remove-preview" onclick="removePreview()">×</button>
        </div>
      `;
    }
    reader.readAsDataURL(file);
  }
}

function removePreview() {
  imagePreviewContainer.innerHTML = '';
  imageUpload.value = '';
}

// Handle Image Analysis
async function handleAnalyze() {
  const file = imageUpload.files[0];

  if (!file) {
    alert('Please upload an image before analyzing!');
    return;
  }

  showLoadingIndicator();

  try {
    // Create form data to send to backend
    const formData = new FormData();
    formData.append('file', file);

    // Make API request to backend
    const response = await fetch('http://localhost:8000/analyze', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    hideLoadingIndicator();

    if (data.analysis && data.recommendations) {
      console.log('Analysis results:', data);
      displayRecommendations(data.recommendations);
    } else {
      console.log('No analysis results');
      alert('No analysis results found. Please try again with a different image.');
    }
  } catch (error) {
    hideLoadingIndicator();
    console.error('Error analyzing the image:', error);
    alert('An error occurred. Please try again.');
  }
}

// Display Recommendations
function displayRecommendations(recommendations) {
  resultsSection.hidden = false;
  productList.innerHTML = '';

  recommendations.forEach(category => {
    const categorySection = document.createElement('div');
    categorySection.classList.add('category-section');

    const categoryTitle = document.createElement('h2');
    categoryTitle.textContent = category.category;
    categoryTitle.classList.add('category-title');
    categorySection.appendChild(categoryTitle);

    const productsGrid = document.createElement('div');
    productsGrid.classList.add('products-grid');

    category.products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.classList.add('product-card');

      let priceDisplay = product.price ? `$${product.price.toFixed(2)}` : 'Price not available';
      let ratingDisplay = product.rating ? `${product.rating.toFixed(1)}/5` : 'No rating';
      let reviewsDisplay = product.reviews_count ? `(${product.reviews_count} reviews)` : '';

      productCard.innerHTML = `
        <div class="product-image-container">
          ${product.image_url
          ? `<img src="${product.image_url}" alt="${product.title}" loading="lazy">`
          : '<div class="no-image">No Image Available</div>'}
        </div>
        <div class="product-info">
          <h3 class="product-title">${product.title}</h3>
          <div class="product-details">
            <p class="price">${priceDisplay}</p>
            <p class="rating">${ratingDisplay} ${reviewsDisplay}</p>
          </div>
          <a href="${product.product_url}" target="_blank" class="btn product-btn">View on Amazon</a>
        </div>
      `;

      productsGrid.appendChild(productCard);
    });

    categorySection.appendChild(productsGrid);
    productList.appendChild(categorySection);
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
