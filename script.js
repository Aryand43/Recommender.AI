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
  { name: 'Maybelline Matte Ink', link: 'https://www.amazon.com/dp/B071YS2JXZ', category: 'Cosmetics' },
  { name: 'Rael Hydrocolloid Pimple Healing Patch', link: 'https://www.amazon.com/Rael-Hydrocolloid-Pimple-Healing-Patch/dp/B07G1VKCND', category: 'Skincare' },
  { name: 'COSRX Snail Mucin Peptide Booster', link: 'https://www.amazon.com/COSRX-Snail-Mucin-Peptide-Booster/dp/B0D663VWFC', category: 'Skincare' },
  { name: 'Paula’s Choice Skin Perfecting 2% BHA Liquid Exfoliant', link: 'https://www.amazon.com/Paulas-Choice-SKIN-PERFECTING-Exfoliant-Facial-Blackheads/dp/B00949CTQQ', category: 'Skincare' },
  { name: 'Korean Skin Solution Sunscreen (SPF 50)', link: 'https://www.amazon.com/Korean-Skin-Solution-Types-S-P-F50/dp/B0DG26H4YY', category: 'Skincare' },
  { name: 'Bio-Oil Skincare Oil (200ml)', link: 'https://www.amazon.com/Bio-Oil-200ml-Multiuse-Skincare-6-7oz/dp/B00AREGVUM', category: 'Skincare' },
  { name: 'Niacinamide + Tranexamic Acid Serum', link: 'https://www.amazon.com/Niacinamide-Tranexamic-Hyaluronic-Sensitive-Fragrance-Free/dp/B0CLLV2T1P', category: 'Skincare' },
  { name: 'Paula’s Choice C15 Super Booster', link: 'https://www.amazon.com/Paulas-Choice-Booster-Vitamin-Brightening/dp/B00EYVSOKY', category: 'Skincare' },
  { name: 'e.l.f. Hydrated Ever After Skincare Set', link: 'https://www.amazon.com/l-f-Hydrated-Skincare-Hydration-Cleanser/dp/B08T7DSZYD', category: 'Skincare' },
  { name: 'LAPCOS Cucumber Sheet Mask', link: 'https://www.amazon.com/LAPCOS-Cucumber-Moisturize-Korean-Favorite/dp/B07JMTMHGS', category: 'Skincare' },
  { name: 'TIRTIR Niacinamide Moisturizing Serum', link: 'https://www.amazon.com/TIRTIR-Moisturizing-Niacinamide-Paraben-Free-Nature-Oriented/dp/B0CG1H8YRS', category: 'Skincare' },
  { name: 'Clean Skin Club Disposable Towels', link: 'https://www.amazon.com/Clean-Skin-Club-Disposable-Sensitive/dp/B07PBXXNCY', category: 'Skincare' },
  { name: 'Tower 28 SOS Daily Rescue Facial Spray', link: 'https://www.amazon.com/Tower-28-Beauty-Rescue-Facial/dp/B0B3SCM1L6', category: 'Skincare' },
  { name: 'BYOMA Hydrating Serum', link: 'https://www.amazon.com/BYOMA-Hydrating-Serum-Moisturizing-Ceramides/dp/B0C7C88ZSK', category: 'Skincare' },
  { name: 'Glow Recipe Watermelon Glow Niacinamide Dew Drops', link: 'https://www.amazon.com/Glow-Recipe-Watermelon-Niacinamide-Drops/dp/B0BL2BB4GV', category: 'Skincare' },
  { name: 'Medicube Zero Pore Pads', link: 'https://www.amazon.com/Medicube-Zero-Pore-Pads-Dual-Textured/dp/B09V7Z4TJG', category: 'Skincare' },
  { name: 'Youth to the People Kale + Green Tea Superfood Cleanser', link: 'https://www.amazon.com/Youth-People-Kale-Superfood-Cleanser/dp/B018A0BO92', category: 'Skincare' }
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
