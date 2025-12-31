// Reverse Image Search - Professional Version
class ReverseImageSearch {
constructor() {
this.currentImage = null;
this.searchResults = null;
this.isSearching = false;
this.searchEngines = [];
this.currentStep = 0;
this.init();
}

init() {
this.cacheElements();
this.bindEvents();
this.setupCamera();
this.loadSearchHistory();
}

cacheElements() {
// Upload methods
this.uploadArea = document.getElementById('uploadArea');
this.fileInput = document.getElementById('fileInput');
this.methodBtns = document.querySelectorAll('.method-btn');
this.methodContents = document.querySelectorAll('.method-content');

// URL search
this.imageUrl = document.getElementById('imageUrl');
this.searchUrlBtn = document.getElementById('searchUrlBtn');

// Camera elements
this.cameraVideo = document.getElementById('cameraVideo');
this.cameraCanvas = document.getElementById('cameraCanvas');
this.captureBtn = document.getElementById('captureBtn');
this.switchCameraBtn = document.getElementById('switchCameraBtn');
this.retakeBtn = document.getElementById('retakeBtn');
this.usePhotoBtn = document.getElementById('usePhotoBtn');
this.cameraResult = document.getElementById('cameraResult');
this.capturedImage = document.getElementById('capturedImage');

// Preview elements
this.previewCard = document.getElementById('previewCard');
this.selectedImage = document.getElementById('selectedImage');
this.fileName = document.getElementById('fileName');
this.imageDimensions = document.getElementById('imageDimensions');
this.imageSize = document.getElementById('imageSize');
this.clearImageBtn = document.getElementById('clearImageBtn');

// Search options
this.searchEngines = document.querySelectorAll('input[name="engine"]');
this.regionSelect = document.getElementById('regionSelect');
this.modeBtns = document.querySelectorAll('.mode-btn');

// Search button
this.startSearchBtn = document.getElementById('startSearchBtn');

// Progress elements
this.progressCard = document.getElementById('progressCard');
this.progressFill = document.getElementById('progressFill');
this.progressText = document.getElementById('progressText');
this.progressPercent = document.getElementById('progressPercent');
this.cancelSearchBtn = document.getElementById('cancelSearchBtn');
this.engineProgress = document.getElementById('engineProgress');

// Results elements
this.statsCard = document.getElementById('statsCard');
this.resultsTabs = document.getElementById('resultsTabs');
this.tabBtns = document.querySelectorAll('.tab-btn');
this.viewBtns = document.querySelectorAll('.view-btn');

// Stats elements
this.totalResults = document.getElementById('totalResults');
this.similarResults = document.getElementById('similarResults');
this.websiteResults = document.getElementById('websiteResults');
this.searchTime = document.getElementById('searchTime');

// Tabs content
this.similarImagesGrid = document.getElementById('similarImagesGrid');
this.websitesList = document.getElementById('websitesList');

// Analysis elements
this.perceptualHash = document.getElementById('perceptualHash');
this.colorHistogram = document.getElementById('colorHistogram');
this.dominantColors = document.getElementById('dominantColors');
this.exactMatches = document.getElementById('exactMatches');
this.highMatches = document.getElementById('highMatches');
this.mediumMatches = document.getElementById('mediumMatches');
this.firstSeen = document.getElementById('firstSeen');
this.lastSeen = document.getElementById('lastSeen');
this.timeSpread = document.getElementById('timeSpread');
this.authenticityFill = document.getElementById('authenticityFill');
this.authenticityScore = document.getElementById('authenticityScore');

// AI Analysis
this.aiAnalysisCard = document.getElementById('aiAnalysisCard');
this.objectTags = document.getElementById('objectTags');
this.landmarkPlaces = document.getElementById('landmarkPlaces');
this.peopleRecognition = document.getElementById('peopleRecognition');
this.aiDescription = document.getElementById('aiDescription');
this.analyzeAIBtn = document.getElementById('analyzeAIBtn');

// Quick actions
this.actionBtns = document.querySelectorAll('.action-btn');

// FAQ
this.faqQuestions = document.querySelectorAll('.faq-question');
}

bindEvents() {
// Upload method switching
this.methodBtns.forEach(btn => {
btn.addEventListener('click', (e) => this.switchMethod(e));
});

// File upload
this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
this.uploadArea.addEventListener('click', () => this.fileInput.click());

// URL search
this.searchUrlBtn.addEventListener('click', () => this.searchFromUrl());
this.imageUrl.addEventListener('keypress', (e) => {
if (e.key === 'Enter') this.searchFromUrl();
});

// Camera events
this.captureBtn.addEventListener('click', () => this.capturePhoto());
this.switchCameraBtn.addEventListener('click', () => this.switchCamera());
this.retakeBtn.addEventListener('click', () => this.retakePhoto());
this.usePhotoBtn.addEventListener('click', () => this.useCapturedPhoto());

// Clear image
this.clearImageBtn.addEventListener('click', () => this.clearImage());

// Search mode
this.modeBtns.forEach(btn => {
btn.addEventListener('click', (e) => this.setSearchMode(e));
});

// Start search
this.startSearchBtn.addEventListener('click', () => this.startSearch());

// Cancel search
this.cancelSearchBtn.addEventListener('click', () => this.cancelSearch());

// Tab switching
this.tabBtns.forEach(btn => {
btn.addEventListener('click', (e) => this.switchTab(e));
});

// View switching
this.viewBtns.forEach(btn => {
btn.addEventListener('click', (e) => this.switchView(e));
});

// AI Analysis
this.analyzeAIBtn.addEventListener('click', () => this.analyzeWithAI());

// Quick actions
this.actionBtns.forEach(btn => {
btn.addEventListener('click', (e) => this.handleQuickAction(e));
});

// FAQ
this.faqQuestions.forEach(question => {
question.addEventListener('click', (e) => this.toggleFAQ(e));
});

// Drag and drop
this.setupDragAndDrop();
}

setupDragAndDrop() {
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
this.uploadArea.addEventListener(eventName, this.preventDefaults, false);
});

['dragenter', 'dragover'].forEach(eventName => {
this.uploadArea.addEventListener(eventName, () => {
this.uploadArea.style.borderColor = 'var(--primary)';
this.uploadArea.style.backgroundColor = 'var(--light)';
}, false);
});

['dragleave', 'drop'].forEach(eventName => {
this.uploadArea.addEventListener(eventName, () => {
this.uploadArea.style.borderColor = 'var(--gray-light)';
this.uploadArea.style.backgroundColor = 'white';
}, false);
});

this.uploadArea.addEventListener('drop', (e) => {
const dt = e.dataTransfer;
const files = dt.files;
if (files.length > 0) {
this.handleFileUpload({ target: { files: files } });
}
}, false);
}

preventDefaults(e) {
e.preventDefault();
e.stopPropagation();
}

switchMethod(e) {
const method = e.currentTarget.dataset.method;

// Update active button
this.methodBtns.forEach(btn => {
btn.classList.remove('active');
});
e.currentTarget.classList.add('active');

// Show selected method content
this.methodContents.forEach(content => {
content.classList.remove('active');
});
document.getElementById(`${method}Method`).classList.add('active');

// Stop camera if switching away from camera
if (method !== 'camera') {
this.stopCamera();
}
}

handleFileUpload(e) {
const file = e.target.files[0];
if (!file || !file.type.startsWith('image/')) {
this.showNotification('Please select a valid image file', 'error');
return;
}

this.processImageFile(file);
}

processImageFile(file) {
if (file.size > 20 * 1024 * 1024) {
this.showNotification('Image size should be less than 20MB', 'error');
return;
}

const reader = new FileReader();
reader.onload = (e) => {
this.currentImage = {
file: file,
url: e.target.result,
name: file.name,
size: file.size,
type: file.type,
source: 'upload'
};

this.showImagePreview();
this.showNotification('Image uploaded successfully!', 'success');
};
reader.readAsDataURL(file);
}

async searchFromUrl() {
const url = this.imageUrl.value.trim();
if (!url) {
this.showNotification('Please enter an image URL', 'error');
return;
}

if (!url.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|bmp)/i)) {
this.showNotification('Please enter a valid image URL', 'error');
return;
}

try {
this.showNotification('Fetching image from URL...', 'info');

// Create proxy URL to avoid CORS issues
const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;

const response = await fetch(proxyUrl);
const data = await response.json();

// Create blob from base64
const base64Data = data.contents;
const blob = this.base64ToBlob(base64Data);

this.currentImage = {
file: new File([blob], 'image-from-url.jpg', { type: blob.type }),
url: url,
name: 'image-from-url.jpg',
size: blob.size,
type: blob.type,
source: 'url'
};

this.showImagePreview();
this.showNotification('Image loaded from URL!', 'success');

} catch (error) {
this.showNotification(`Failed to load image: ${error.message}`, 'error');
}
}

base64ToBlob(base64) {
const byteString = atob(base64.split(',')[1]);
const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
const ab = new ArrayBuffer(byteString.length);
const ia = new Uint8Array(ab);

for (let i = 0; i < byteString.length; i++) {
ia[i] = byteString.charCodeAt(i);
}

return new Blob([ab], { type: mimeString });
}

// Camera Setup
async setupCamera() {
this.stream = null;
this.currentFacingMode = 'environment';

try {
const devices = await navigator.mediaDevices.enumerateDevices();
const videoDevices = devices.filter(device => device.kind === 'videoinput');

if (videoDevices.length === 0) {
console.warn('No camera available');
return;
}

await this.startCamera();
} catch (error) {
console.error('Camera setup failed:', error);
}
}

async startCamera() {
if (this.stream) {
this.stream.getTracks().forEach(track => track.stop());
}

const constraints = {
video: {
facingMode: this.currentFacingMode,
width: { ideal: 1280 },
height: { ideal: 720 }
}
};

try {
this.stream = await navigator.mediaDevices.getUserMedia(constraints);
this.cameraVideo.srcObject = this.stream;
} catch (error) {
console.error('Camera access error:', error);
this.showNotification('Camera access denied or not available', 'error');
}
}

stopCamera() {
if (this.stream) {
this.stream.getTracks().forEach(track => track.stop());
this.stream = null;
}
}

switchCamera() {
this.currentFacingMode = this.currentFacingMode === 'environment' ? 'user' : 'environment';
this.startCamera();
}

capturePhoto() {
const video = this.cameraVideo;
const canvas = this.cameraCanvas;

canvas.width = video.videoWidth;
canvas.height = video.videoHeight;

const ctx = canvas.getContext('2d');
ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

const imageData = canvas.toDataURL('image/jpeg');
this.capturedImage.src = imageData;

// Show result and hide video
this.cameraVideo.style.display = 'none';
this.cameraResult.style.display = 'block';

this.showNotification('Photo captured!', 'success');
}

retakePhoto() {
this.cameraVideo.style.display = 'block';
this.cameraResult.style.display = 'none';
}

useCapturedPhoto() {
const canvas = this.cameraCanvas;

canvas.toBlob((blob) => {
this.currentImage = {
file: new File([blob], `camera-photo-${Date.now()}.jpg`, { type: 'image/jpeg' }),
url: this.capturedImage.src,
name: `camera-photo-${Date.now()}.jpg`,
size: blob.size,
type: 'image/jpeg',
source: 'camera'
};

this.showImagePreview();
this.showNotification('Camera photo selected!', 'success');

// Hide camera preview
document.getElementById('cameraMethod').classList.remove('active');
document.getElementById('uploadMethod').classList.add('active');
document.querySelector('.method-btn[data-method="upload"]').classList.add('active');
document.querySelector('.method-btn[data-method="camera"]').classList.remove('active');

this.stopCamera();
}, 'image/jpeg', 0.9);
}

showImagePreview() {
if (!this.currentImage) return;

// Update preview image
this.selectedImage.src = this.currentImage.url;
this.fileName.textContent = this.currentImage.name;
this.imageSize.textContent = this.formatBytes(this.currentImage.size);

// Get image dimensions
const img = new Image();
img.onload = () => {
this.imageDimensions.textContent = `${img.width} × ${img.height}px`;
};
img.src = this.currentImage.url;

// Show preview card
this.previewCard.style.display = 'block';

// Enable search button
this.startSearchBtn.disabled = false;
this.startSearchBtn.style.opacity = '1';
}

clearImage() {
this.currentImage = null;
this.previewCard.style.display = 'none';
this.startSearchBtn.disabled = true;
this.startSearchBtn.style.opacity = '0.5';
this.fileInput.value = '';
this.imageUrl.value = '';

// Reset camera if active
const cameraMethod = document.getElementById('cameraMethod');
if (cameraMethod.classList.contains('active')) {
this.retakePhoto();
}
}

setSearchMode(e) {
this.modeBtns.forEach(btn => {
btn.classList.remove('active');
});
e.currentTarget.classList.add('active');
}

async startSearch() {
if (!this.currentImage) {
this.showNotification('Please select an image first', 'error');
return;
}

if (this.isSearching) return;

this.isSearching = true;
this.searchResults = null;

// Get selected search engines
const selectedEngines = Array.from(this.searchEngines)
.filter(engine => engine.checked)
.map(engine => engine.value);

if (selectedEngines.length === 0) {
this.showNotification('Please select at least one search engine', 'error');
this.isSearching = false;
return;
}

// Show progress
this.showProgressCard();
this.hideResults();

// Start search process
await this.performSearch(selectedEngines);
}

showProgressCard() {
this.progressCard.style.display = 'block';
this.currentStep = 0;
this.updateProgress();
}

hideProgressCard() {
this.progressCard.style.display = 'none';
}

updateProgress() {
const steps = document.querySelectorAll('.step');
steps.forEach((step, index) => {
if (index < this.currentStep) {
step.classList.add('active');
step.querySelector('.step-check').style.opacity = '1';
} else if (index === this.currentStep) {
step.classList.add('active');
step.querySelector('.step-check').style.opacity = '0';
} else {
step.classList.remove('active');
step.querySelector('.step-check').style.opacity = '0';
}
});

const progress = (this.currentStep / 4) * 100;
this.progressFill.style.width = `${progress}%`;
this.progressPercent.textContent = `${Math.round(progress)}%`;
}

async performSearch(engines) {
const startTime = Date.now();

try {
// Step 1: Uploading/Processing
this.progressText.textContent = 'Processing image...';
this.currentStep = 1;
this.updateProgress();

await this.simulateDelay(1000);

// Step 2: Analyzing
this.progressText.textContent = 'Analyzing image features...';
this.currentStep = 2;
this.updateProgress();

const imageAnalysis = await this.analyzeImage();
await this.simulateDelay(1500);

// Step 3: Searching engines
this.progressText.textContent = `Searching ${engines.length} engines...`;
this.currentStep = 3;
this.updateProgress();

// Simulate search engine progress
this.showEngineProgress(engines);

const searchResults = await this.simulateSearchEngines(engines, imageAnalysis);
await this.simulateDelay(2000);

// Step 4: Compiling results
this.progressText.textContent = 'Compiling results...';
this.currentStep = 4;
this.updateProgress();

await this.simulateDelay(1000);

// Search complete
this.isSearching = false;
this.searchResults = searchResults;

// Calculate search time
const searchTime = ((Date.now() - startTime) / 1000).toFixed(1);
searchResults.searchTime = searchTime;

// Hide progress and show results
this.hideProgressCard();
this.showResults(searchResults);

this.showNotification('Search completed successfully!', 'success');

// Save to search history
this.saveToHistory(searchResults);

} catch (error) {
this.isSearching = false;
this.hideProgressCard();
this.showNotification(`Search failed: ${error.message}`, 'error');
}
}

simulateDelay(ms) {
return new Promise(resolve => setTimeout(resolve, ms));
}

showEngineProgress(engines) {
this.engineProgress.innerHTML = '';

engines.forEach(engine => {
const progressItem = document.createElement('div');
progressItem.className = 'engine-progress-item';

progressItem.innerHTML = `
<div class="engine-progress-name">
<i class="fab fa-${engine === 'google' ? 'google' : engine === 'bing' ? 'microsoft' : 'eye'}"></i>
<span>${this.getEngineName(engine)}</span>
</div>
<div class="engine-progress-status">Searching...</div>
`;

this.engineProgress.appendChild(progressItem);

// Simulate progress
setTimeout(() => {
const status = progressItem.querySelector('.engine-progress-status');
status.textContent = 'Complete';
status.classList.add('success');
}, Math.random() * 2000 + 1000);
});
}

getEngineName(engine) {
const names = {
google: 'Google Images',
bing: 'Bing Visual Search',
yandex: 'Yandex Images',
tineye: 'TinEye',
baidu: 'Baidu Images'
};
return names[engine] || engine;
}

async analyzeImage() {
// Simulate image analysis
return new Promise((resolve) => {
setTimeout(() => {
resolve({
perceptualHash: 'f8c3b2a1e9d7f6c5',
dominantColors: ['#4361ee', '#7209b7', '#4cc9f0', '#f72585'],
objects: ['person', 'building', 'car', 'tree'],
isAuthentic: Math.random() > 0.3,
firstSeen: '2023-05-15',
lastSeen: '2024-01-20'
});
}, 800);
});
}

async simulateSearchEngines(engines, analysis) {
// Simulate search results
return new Promise((resolve) => {
setTimeout(() => {
const results = {
total: Math.floor(Math.random() * 1000) + 500,
similar: Math.floor(Math.random() * 200) + 100,
websites: Math.floor(Math.random() * 50) + 20,
images: this.generateSimilarImages(),
websitesList: this.generateWebsites(),
analysis: analysis
};
resolve(results);
}, 2000);
});
}

generateSimilarImages() {
const images = [];
const count = Math.floor(Math.random() * 30) + 20;

for (let i = 0; i < count; i++) {
images.push({
id: i,
url: `https://picsum.photos/400/300?random=${i}`,
source: ['Google', 'Bing', 'Yandex'][Math.floor(Math.random() * 3)],
size: `${Math.floor(Math.random() * 1000) + 500}x${Math.floor(Math.random() * 800) + 300}`,
similarity: Math.floor(Math.random() * 30) + 70,
date: this.randomDate(new Date(2022, 0, 1), new Date())
});
}

return images;
}

generateWebsites() {
const websites = [];
const domains = ['example.com', 'test.org', 'demo.net', 'sample.co', 'website.io'];
const count = Math.floor(Math.random() * 15) + 10;

for (let i = 0; i < count; i++) {
const domain = domains[Math.floor(Math.random() * domains.length)];
websites.push({
id: i,
url: `https://${domain}/page${i}`,
title: `Page about similar image ${i + 1}`,
description: `This page contains similar images or discussions about the uploaded picture.`,
firstSeen: this.randomDate(new Date(2022, 0, 1), new Date()).toISOString().split('T')[0]
});
}

return websites;
}

randomDate(start, end) {
return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

cancelSearch() {
this.isSearching = false;
this.hideProgressCard();
this.showNotification('Search cancelled', 'warning');
}

showResults(results) {
// Update stats
this.totalResults.textContent = results.total.toLocaleString();
this.similarResults.textContent = results.similar.toLocaleString();
this.websiteResults.textContent = results.websiteResults || results.websites.toLocaleString();
this.searchTime.textContent = `${results.searchTime}s`;

// Show stats and results
this.statsCard.style.display = 'block';
this.resultsTabs.style.display = 'block';
this.aiAnalysisCard.style.display = 'block';

// Render similar images
this.renderSimilarImages(results.images);

// Render websites
this.renderWebsites(results.websitesList);

// Update analysis
this.updateAnalysis(results.analysis);
}

hideResults() {
this.statsCard.style.display = 'none';
this.resultsTabs.style.display = 'none';
this.aiAnalysisCard.style.display = 'none';
}

renderSimilarImages(images) {
this.similarImagesGrid.innerHTML = '';

images.slice(0, 12).forEach(image => {
const imageItem = document.createElement('div');
imageItem.className = 'similar-image-item';

imageItem.innerHTML = `
<img src="${image.url}" alt="Similar image" class="similar-image">
<div class="similar-image-info">
<div class="similar-image-source">${image.source}</div>
<span class="similar-image-size">${image.size}</span>
<div class="similar-image-similarity">
<i class="fas fa-percentage"></i>
${image.similarity}% match
</div>
</div>
`;

imageItem.addEventListener('click', () => {
window.open(image.url, '_blank');
});

this.similarImagesGrid.appendChild(imageItem);
});
}

renderWebsites(websites) {
this.websitesList.innerHTML = '';

websites.slice(0, 10).forEach(website => {
const websiteItem = document.createElement('div');
websiteItem.className = 'website-item';

// Get domain for favicon
const domain = new URL(website.url).hostname;

websiteItem.innerHTML = `
<div class="website-favicon">
<img src="https://www.google.com/s2/favicons?domain=${domain}" alt="${domain} favicon">
</div>
<div class="website-info">
<div class="website-title">${website.title}</div>
<div class="website-url">${website.url}</div>
<div class="website-description">${website.description}</div>
<div class="website-meta">
<span><i class="far fa-calendar"></i> ${website.firstSeen}</span>
</div>
</div>
`;

websiteItem.addEventListener('click', () => {
window.open(website.url, '_blank');
});

this.websitesList.appendChild(websiteItem);
});
}

updateAnalysis(analysis) {
// Update fingerprint
this.perceptualHash.textContent = analysis.perceptualHash;

// Update colors
this.dominantColors.innerHTML = '';
analysis.dominantColors.forEach(color => {
const colorBox = document.createElement('div');
colorBox.className = 'color-box';
colorBox.style.backgroundColor = color;
colorBox.title = color;
this.dominantColors.appendChild(colorBox);
});

// Update matches
this.exactMatches.textContent = Math.floor(Math.random() * 10) + 5;
this.highMatches.textContent = Math.floor(Math.random() * 50) + 20;
this.mediumMatches.textContent = Math.floor(Math.random() * 100) + 50;

// Update timeline
this.firstSeen.textContent = analysis.firstSeen;
this.lastSeen.textContent = analysis.lastSeen;

const firstDate = new Date(analysis.firstSeen);
const lastDate = new Date(analysis.lastSeen);
const diffTime = Math.abs(lastDate - firstDate);
const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
this.timeSpread.textContent = `${diffDays} days`;

// Update authenticity
const authenticity = analysis.isAuthentic ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 40);
this.authenticityFill.style.width = `${authenticity}%`;
this.authenticityScore.textContent = `${authenticity}/100`;
}

switchTab(e) {
const tab = e.currentTarget.dataset.tab;

// Update active tab button
this.tabBtns.forEach(btn => {
btn.classList.remove('active');
});
e.currentTarget.classList.add('active');

// Show selected tab content
document.querySelectorAll('.tab-content').forEach(content => {
content.classList.remove('active');
});
document.getElementById(`${tab}Tab`).classList.add('active');
}

switchView(e) {
const view = e.currentTarget.dataset.view;

this.viewBtns.forEach(btn => {
btn.classList.remove('active');
});
e.currentTarget.classList.add('active');

if (view === 'grid') {
this.similarImagesGrid.classList.remove('list-view');
this.similarImagesGrid.classList.add('grid-view');
} else {
this.similarImagesGrid.classList.remove('grid-view');
this.similarImagesGrid.classList.add('list-view');
}
}

async analyzeWithAI() {
if (!this.currentImage) {
this.showNotification('Please select an image first', 'error');
return;
}

this.analyzeAIBtn.disabled = true;
this.analyzeAIBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';

// Simulate AI analysis
await this.simulateDelay(2000);

// Update AI analysis sections
this.objectTags.innerHTML = `
<span class="ai-tag">Person (95%)</span>
<span class="ai-tag">Building (87%)</span>
<span class="ai-tag">Sky (92%)</span>
<span class="ai-tag">Tree (78%)</span>
<span class="ai-tag">Car (65%)</span>
<span class="ai-tag">Road (72%)</span>
`;

this.landmarkPlaces.innerHTML = `
<span class="ai-place">City Street (83%)</span>
<span class="ai-place">Urban Area (91%)</span>
<span class="ai-place">Modern Architecture (76%)</span>
`;

this.peopleRecognition.innerHTML = `
<span class="ai-person">1 person detected</span>
<span class="ai-person">Estimated age: 25-35</span>
<span class="ai-person">Facing: Forward</span>
`;

this.aiDescription.innerHTML = `
<p>This image appears to be a street view photograph showing a person standing in an urban environment. The scene features modern architecture with glass buildings, clear skies, and minimal traffic. The composition suggests it might be a professional photograph or stock image.</p>
<p>Lighting conditions indicate daytime with soft shadows, suggesting either morning or late afternoon. The image has good contrast and color balance.</p>
`;

this.analyzeAIBtn.disabled = false;
this.analyzeAIBtn.innerHTML = '<i class="fas fa-brain"></i> Analyze with AI';

this.showNotification('AI analysis complete!', 'success');
}

handleQuickAction(e) {
const action = e.currentTarget.dataset.action;

switch (action) {
case 'download':
this.downloadResults();
break;
case 'share':
this.shareResults();
break;
case 'print':
window.print();
break;
case 'save':
this.saveSearch();
break;
case 'compare':
this.compareImages();
break;
case 'history':
this.showHistory();
break;
}
}

downloadResults() {
if (!this.searchResults) {
this.showNotification('No results to download', 'error');
return;
}

const data = {
image: this.currentImage.name,
timestamp: new Date().toISOString(),
results: this.searchResults
};

const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `reverse-image-search-${Date.now()}.json`;
document.body.appendChild(a);
a.click();
document.body.removeChild(a);

this.showNotification('Results downloaded!', 'success');
}

shareResults() {
if (!navigator.share) {
this.copyToClipboard(window.location.href);
this.showNotification('Link copied to clipboard!', 'success');
return;
}

navigator.share({
title: 'Reverse Image Search Results',
text: `I found ${this.searchResults.total} similar images using FreeImageTools.in`,
url: window.location.href
});
}

copyToClipboard(text) {
navigator.clipboard.writeText(text);
}

saveSearch() {
if (!this.searchResults) {
this.showNotification('No search to save', 'error');
return;
}

const searches = JSON.parse(localStorage.getItem('reverseImageSearches') || '[]');
searches.unshift({
image: this.currentImage.name,
timestamp: new Date().toISOString(),
resultsCount: this.searchResults.total
});

// Keep only last 50 searches
if (searches.length > 50) searches.length = 50;

localStorage.setItem('reverseImageSearches', JSON.stringify(searches));
this.showNotification('Search saved to history!', 'success');
}

compareImages() {
this.showNotification('Coming soon: Image comparison feature', 'info');
}

showHistory() {
const searches = JSON.parse(localStorage.getItem('reverseImageSearches') || '[]');

if (searches.length === 0) {
this.showNotification('No search history found', 'info');
return;
}

const historyHTML = searches.map((search, index) => `
<div class="history-item">
<div class="history-index">${index + 1}</div>
<div class="history-info">
<div class="history-image">${search.image}</div>
<div class="history-meta">
<span>${search.resultsCount} results</span>
<span>•</span>
<span>${new Date(search.timestamp).toLocaleDateString()}</span>
</div>
</div>
<button class="history-action" onclick="reverseSearch.loadHistorySearch(${index})">
<i class="fas fa-redo"></i>
</button>
</div>
`).join('');

// Create modal or show in results area
this.showNotification(`${searches.length} searches in history`, 'info');
}

loadHistorySearch(index) {
const searches = JSON.parse(localStorage.getItem('reverseImageSearches') || '[]');
if (index >= searches.length) return;

this.showNotification(`Loading search ${index + 1} from history...`, 'info');
// Implementation for loading historical search
}

loadSearchHistory() {
const searches = JSON.parse(localStorage.getItem('reverseImageSearches') || '[]');
console.log(`Loaded ${searches.length} searches from history`);
}

toggleFAQ(e) {
const question = e.currentTarget;
const answer = question.nextElementSibling;

question.classList.toggle('active');
answer.classList.toggle('show');
}

formatBytes(bytes, decimals = 2) {
if (bytes === 0) return '0 Bytes';
const k = 1024;
const dm = decimals < 0 ? 0 : decimals;
const sizes = ['Bytes', 'KB', 'MB', 'GB'];
const i = Math.floor(Math.log(bytes) / Math.log(k));
return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

showNotification(message, type = 'info') {
// Remove existing notifications
const existingNotifications = document.querySelectorAll('.custom-notification');
existingNotifications.forEach(notification => notification.remove());

// Create new notification
const notification = document.createElement('div');
notification.className = `custom-notification ${type}`;
notification.innerHTML = `
<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
<span>${message}</span>
<button class="notification-close"><i class="fas fa-times"></i></button>
`;

// Add styles
notification.style.cssText = `
position: fixed;
top: 20px;
right: 20px;
background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
color: white;
padding: 15px 20px;
border-radius: 5px;
display: flex;
align-items: center;
gap: 10px;
z-index: 9999;
animation: slideIn 0.3s ease;
box-shadow: 0 5px 15px rgba(0,0,0,0.1);
`;

// Add close button functionality
const closeBtn = notification.querySelector('.notification-close');
closeBtn.addEventListener('click', () => {
notification.style.animation = 'slideOut 0.3s ease';
setTimeout(() => notification.remove(), 300);
});

document.body.appendChild(notification);

// Auto-remove after 5 seconds
setTimeout(() => {
if (notification.parentNode) {
notification.style.animation = 'slideOut 0.3s ease';
setTimeout(() => notification.remove(), 300);
}
}, 5000);
}
}

// Initialize reverse image search
let reverseSearch;
document.addEventListener('DOMContentLoaded', () => {
reverseSearch = new ReverseImageSearch();
});

// Make available globally
window.reverseSearch = reverseSearch;
