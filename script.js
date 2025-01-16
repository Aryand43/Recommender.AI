document.getElementById('analyze-btn').addEventListener('click', () => {
    const fileInput = document.getElementById('image-upload');
    if (fileInput.files.length === 0) {
      alert('Please upload an image!');
      return;
    }
  
    const resultsSection = document.getElementById('results-section');
    resultsSection.hidden = false;
  
    const productList = document.getElementById('product-list');
    productList.innerHTML = `
      <div>
        <img src="assets/placeholder.png" alt="Product A" width="100">
        <p>Product A - Skincare</p>
        <a href="https://amazon.com">Buy Now</a>
      </div>
    `;
  });
  
  document.getElementById('reset-btn').addEventListener('click', () => {
    document.getElementById('results-section').hidden = true;
    document.getElementById('image-upload').value = '';
  });
  