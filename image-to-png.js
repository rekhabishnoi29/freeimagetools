// Image to PNG Converter - Professional Version
class ImageToPNGConverter {
constructor() {
this.images = [];
this.currentImageIndex = 0;
this.isConverting = false;
this.isPaused = false;
this.init();
}

init() {
this.cacheElements();
this.bindEvents();
this.loadFromLocalStorage();
}

cacheElements() {
// Upload elements
this.uploadArea = document.getElementById('uploadArea');
this.fileInput = document.getElementById('fileInput');
this.fileList = document.getElementById('fileList');
this.filesContainer = document.getElementById('filesContainer');
this.clearAllBtn = document.getElementById('clearAllBtn');

// URL upload elements
this.urlModal = document.getElementById('urlModal');
this.urlUploadBtn = document.getElementById('urlUploadBtn');
this.cancelUrlBtn = document.getElementById('cancelUrlBtn');
this.convertUrlBtn = document.getElementById('convertUrlBtn');
this.imageUrl = document.getElementById('imageUrl');

// Settings elements
this.pngQuality = document.getElementById('pngQuality');
this.qualityValue = document.getElementById('qualityValue');
this.preserveTransparency = document.getElementById('preserveTransparency');
this.resizeToggle = document.getElementById('resizeToggle');
this.resizeOptions = document.getElementById('resizeOptions');
this.resizeMode = document.querySelectorAll('input[name="resizeMode"]');
this.resizePercent = document.getElementById('resizePercent');
this.resizeWidth = document.getElementById('resizeWidth');
this.resizeHeight = document.getElementById('resizeHeight');
this.lockAspect = document.getElementById('lockAspect');
this.outputName = document.getElementById('outputName');

// Action buttons
this.convertAllBtn = document.getElementById('convertAllBtn');
this.convertSingleBtn = document.getElementById('convertSingleBtn');

// Progress elements
this.progressCard = document.getElementById('progressCard');
this.progressFill = document.getElementById('progressFill');
this.progressText = document.getElementById('progressText');
this.progressPercent = document.getElementById('progressPercent');
this.pauseBtn = document.getElementById('pauseBtn');
this.cancelConversionBtn = document.getElementById('cancelConversionBtn');

// Preview elements
this.previewCard = document.getElementById('previewCard');
this.originalImage = document.getElementById('originalImage');
this.convertedImage = document.getElementById('convertedImage');
this.tabBtns = document.querySelectorAll('.tab-btn');

// Info elements
this.infoFormat = document.getElementById('infoFormat');
this.infoDimensions = document.getElementById('infoDimensions');
this.infoSize = document.getElementById('infoSize');
this.infoDepth = document.getElementById('infoDepth');
this.pngDimensions = document.getElementById('pngDimensions');
this.pngSize = document.getElementById('pngSize');
this.pngCompression = document.getElementById('pngCompression');
this.pngSaved = document.getElementById('pngSaved');

// Results elements
this.resultsCard = document.getElementById('resultsCard');
this.resultsList = document.getElementById('resultsList');
this.downloadAllBtn = document.getElementById('downloadAllBtn');
this.totalFiles = document.getElementById('totalFiles');
this.totalSize = document.getElementById('totalSize');
this.totalSaved = document.getElementById('totalSaved');

// Share elements
this.copyLinkBtn = document.getElementById('copyLinkBtn');

// FAQ elements
this.faqQuestions = document.querySelectorAll('.faq-question');
}

bindEvents() {
// File upload events
this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
this.uploadArea.addEventListener('click', () => this.fileInput.click());
this.clearAllBtn.addEventListener('click', () => this.clearAllFiles());

// Drag and drop
this.setupDragAndDrop();

// URL upload
this.urlUploadBtn.addEventListener('click', () => this.showUrlModal());
this.cancelUrlBtn.addEventListener('click', () => this.hideUrlModal());
this.convertUrlBtn.addEventListener('click', () => this.convertFromUrl());

// Settings events
this.pngQuality.addEventListener('input', () => this.updateQualityDisplay());
this.resizeToggle.addEventListener('change', () => this.toggleResizeOptions());
this.resizeMode.forEach(radio => {
radio.addEventListener('change', () => this.updateResizeMode());
});
this.resizePercent.addEventListener('input', () => this.handleResizePercent());
this.resizeWidth.addEventListener('input', () => this.handleResizeDimensions());
this.resizeHeight.addEventListener('input', () => this.handleResizeDimensions());
this.lockAspect.addEventListener('change', () => this.updateAspectLock());

// Conversion events
this.convertAllBtn.addEventListener('click', () => this.convertAllImages());
this.convertSingleBtn.addEventListener('click', () => this.convertSelectedImage());

// Progress events
this.pauseBtn.addEventListener('click', () => this.togglePause());
this.cancelConversionBtn.addEventListener('click', () => this.cancelConversion());

// Preview events
this.tabBtns.forEach(btn => {
btn.addEventListener('click', (e) => this.switchTab(e));
});

// Results events
this.downloadAllBtn.addEventListener('click', () => this.downloadAllResults());

// Share events
this.copyLinkBtn.addEventListener('click', () => this.copyToolLink());

// FAQ events
this.faqQuestions.forEach(question => {
question.addEventListener('click', (e) => this.toggleFAQ(e));
});

// Save settings on change
this.outputName.addEventListener('change', () => this.saveSettings());
this.preserveTransparency.addEventListener('change', () => this.saveSettings());
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
this.handleFiles(files);
}, false);
}

preventDefaults(e) {
e.preventDefault();
e.stopPropagation();
}

handleFileUpload(e) {
const files = e.target.files;
this.handleFiles(files);
}

handleFiles(files) {
for (let i = 0; i < files.length; i++) {
const file = files[i];
if (!file.type.startsWith('image/')) {
this.showNotification('Please select only image files', 'error');
continue;
}

if (file.size > 50 * 1024 * 1024) {
this.showNotification(`File ${file.name} is too large (max 50MB)`, 'error');
continue;
}

this.addImage(file);
}

if (this.images.length > 0) {
this.showFileList();
this.showNotification(`${this.images.length} image(s) added successfully`, 'success');
}
}

addImage(file) {
const reader = new FileReader();

reader.onload = (e) => {
const imageData = {
id: Date.now() + Math.random(),
file: file,
url: e.target.result,
name: file.name,
size: file.size,
type: file.type,
status: 'pending',
convertedBlob: null,
convertedSize: 0,
savedPercentage: 0
};

this.images.push(imageData);
this.renderFileItem(imageData);

if (this.images.length === 1) {
this.previewImage(imageData);
}

this.updateConvertButton();
this.saveToLocalStorage();
};

reader.readAsDataURL(file);
}

renderFileItem(imageData) {
const fileItem = document.createElement('div');
fileItem.className = 'file-item';
fileItem.dataset.id = imageData.id;

const format = imageData.name.split('.').pop().toUpperCase();
const size = this.formatBytes(imageData.size);

fileItem.innerHTML = `
<div class="file-info">
<i class="fas fa-file-image"></i>
<div class="file-details">
<span class="file-name">${imageData.name}</span>
<span class="file-meta">${format} • ${size}</span>
</div>
</div>
<div class="file-actions">
<button class="btn-preview" onclick="converter.previewImageById('${imageData.id}')">
<i class="fas fa-eye"></i>
</button>
<button class="btn-remove" onclick="converter.removeImage('${imageData.id}')">
<i class="fas fa-times"></i>
</button>
</div>
`;

this.filesContainer.appendChild(fileItem);
}

previewImage(imageData) {
this.originalImage.src = imageData.url;
this.previewCard.style.display = 'block';

// Extract image info
const img = new Image();
img.onload = () => {
this.infoFormat.textContent = imageData.type.split('/')[1].toUpperCase();
this.infoDimensions.textContent = `${img.width} × ${img.height}px`;
this.infoSize.textContent = this.formatBytes(imageData.size);
this.infoDepth.textContent = '24-bit'; // Default assumption

// Store dimensions for later use
imageData.width = img.width;
imageData.height = img.height;
};
img.src = imageData.url;
}

previewImageById(id) {
const imageData = this.images.find(img => img.id === id);
if (imageData) {
this.previewImage(imageData);
}
}

removeImage(id) {
this.images = this.images.filter(img => img.id !== id);
const fileItem = document.querySelector(`.file-item[data-id="${id}"]`);
if (fileItem) {
fileItem.remove();
}

if (this.images.length === 0) {
this.hideFileList();
this.previewCard.style.display = 'none';
} else {
this.previewImage(this.images[0]);
}

this.updateConvertButton();
this.saveToLocalStorage();
}

clearAllFiles() {
this.images = [];
this.filesContainer.innerHTML = '';
this.hideFileList();
this.previewCard.style.display = 'none';
this.resultsCard.style.display = 'none';
this.updateConvertButton();
this.saveToLocalStorage();
this.showNotification('All files cleared', 'info');
}

showFileList() {
this.fileList.style.display = 'block';
this.convertSingleBtn.style.display = 'inline-block';
}

hideFileList() {
this.fileList.style.display = 'none';
this.convertSingleBtn.style.display = 'none';
}

updateConvertButton() {
if (this.images.length === 0) {
this.convertAllBtn.disabled = true;
this.convertAllBtn.style.opacity = '0.5';
} else {
this.convertAllBtn.disabled = false;
this.convertAllBtn.style.opacity = '1';
}
}

showUrlModal() {
this.urlModal.style.display = 'block';
}

hideUrlModal() {
this.urlModal.style.display = 'none';
this.imageUrl.value = '';
}

async convertFromUrl() {
const url = this.imageUrl.value.trim();
if (!url) {
this.showNotification('Please enter a valid URL', 'error');
return;
}

try {
this.showNotification('Downloading image from URL...', 'info');

const response = await fetch(url);
if (!response.ok) throw new Error('Failed to fetch image');

const blob = await response.blob();
if (!blob.type.startsWith('image/')) {
throw new Error('URL does not point to an image');
}

const file = new File([blob], 'image-from-url.jpg', { type: blob.type });
this.addImage(file);
this.hideUrlModal();

} catch (error) {
this.showNotification(`Error: ${error.message}`, 'error');
}
}

updateQualityDisplay() {
const values = ['Low', 'Medium', 'High'];
this.qualityValue.textContent = values[this.pngQuality.value - 1];
this.saveSettings();
}

toggleResizeOptions() {
if (this.resizeToggle.checked) {
this.resizeOptions.style.display = 'block';
} else {
this.resizeOptions.style.display = 'none';
}
}

updateResizeMode() {
const mode = document.querySelector('input[name="resizeMode"]:checked').value;
if (mode === 'percentage') {
this.resizePercent.disabled = false;
this.resizeWidth.disabled = true;
this.resizeHeight.disabled = true;
} else {
this.resizePercent.disabled = true;
this.resizeWidth.disabled = false;
this.resizeHeight.disabled = false;
}
}

handleResizePercent() {
const percent = parseInt(this.resizePercent.value);
if (percent < 1 || percent > 500) {
this.showNotification('Percentage must be between 1% and 500%', 'error');
return;
}
}

handleResizeDimensions() {
if (!this.lockAspect.checked) return;

const currentImage = this.images[this.currentImageIndex];
if (!currentImage || !currentImage.width) return;

const aspectRatio = currentImage.width / currentImage.height;

if (this.resizeWidth === document.activeElement) {
const newWidth = parseInt(this.resizeWidth.value);
if (newWidth) {
this.resizeHeight.value = Math.round(newWidth / aspectRatio);
}
} else if (this.resizeHeight === document.activeElement) {
const newHeight = parseInt(this.resizeHeight.value);
if (newHeight) {
this.resizeWidth.value = Math.round(newHeight * aspectRatio);
}
}
}

updateAspectLock() {
// Nothing to do here, handled in handleResizeDimensions
}

async convertAllImages() {
if (this.images.length === 0) {
this.showNotification('Please add images first', 'error');
return;
}

this.isConverting = true;
this.isPaused = false;
this.currentImageIndex = 0;

this.showProgressCard();
this.hideResultsCard();

for (let i = 0; i < this.images.length; i++) {
if (this.isPaused) {
await this.waitForResume();
}

if (!this.isConverting) break;

this.currentImageIndex = i;
await this.convertSingleImage(this.images[i]);
this.updateProgress(i + 1, this.images.length);
}

if (this.isConverting) {
this.conversionComplete();
}
}

async convertSingleImage(imageData) {
return new Promise((resolve, reject) => {
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();

img.onload = () => {
// Get resize settings
let newWidth = img.width;
let newHeight = img.height;

if (this.resizeToggle.checked) {
const mode = document.querySelector('input[name="resizeMode"]:checked').value;

if (mode === 'percentage') {
const percent = parseInt(this.resizePercent.value) / 100;
newWidth = Math.round(img.width * percent);
newHeight = Math.round(img.height * percent);
} else {
newWidth = parseInt(this.resizeWidth.value) || img.width;
newHeight = parseInt(this.resizeHeight.value) || img.height;
}
}

canvas.width = newWidth;
canvas.height = newHeight;

// Preserve transparency if enabled and image has transparency
if (this.preserveTransparency.checked) {
ctx.clearRect(0, 0, canvas.width, canvas.height);
} else {
ctx.fillStyle = '#FFFFFF';
ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Draw image with new dimensions
ctx.drawImage(img, 0, 0, newWidth, newHeight);

// Get PNG quality setting
const quality = this.pngQuality.value;
const compressionLevel = quality === '1' ? 0.5 : quality === '2' ? 0.75 : 0.9;

// Convert to PNG blob
canvas.toBlob((blob) => {
imageData.convertedBlob = blob;
imageData.convertedSize = blob.size;
imageData.savedPercentage = Math.round((1 - (blob.size / imageData.size)) * 100);
imageData.status = 'converted';
imageData.pngDimensions = `${newWidth} × ${newHeight}px`;

// Update preview if this is the current image
if (this.currentImageIndex === this.images.indexOf(imageData)) {
this.updatePreviewAfterConversion(imageData);
}

resolve();
}, 'image/png', compressionLevel);
};

img.onerror = reject;
img.src = imageData.url;
});
}

updatePreviewAfterConversion(imageData) {
const convertedUrl = URL.createObjectURL(imageData.convertedBlob);
this.convertedImage.src = convertedUrl;

this.pngDimensions.textContent = imageData.pngDimensions;
this.pngSize.textContent = this.formatBytes(imageData.convertedSize);
this.pngCompression.textContent = this.getCompressionLevel();
this.pngSaved.textContent = `${imageData.savedPercentage}% smaller`;
}

getCompressionLevel() {
const values = ['Low', 'Medium', 'High'];
return values[this.pngQuality.value - 1];
}

async convertSelectedImage() {
// Implementation for single image conversion
// Similar to convertAllImages but for selected image only
}

showProgressCard() {
this.progressCard.style.display = 'block';
this.pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
}

hideProgressCard() {
this.progressCard.style.display = 'none';
}

updateProgress(current, total) {
const percentage = Math.round((current / total) * 100);
this.progressFill.style.width = `${percentage}%`;
this.progressText.textContent = `${current}/${total} files converted`;
this.progressPercent.textContent = `${percentage}%`;
}

waitForResume() {
return new Promise(resolve => {
const checkResume = () => {
if (!this.isPaused) {
resolve();
} else {
setTimeout(checkResume, 100);
}
};
checkResume();
});
}

togglePause() {
this.isPaused = !this.isPaused;
if (this.isPaused) {
this.pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
this.showNotification('Conversion paused', 'info');
} else {
this.pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
this.showNotification('Conversion resumed', 'info');
}
}

cancelConversion() {
this.isConverting = false;
this.isPaused = false;
this.hideProgressCard();
this.showNotification('Conversion cancelled', 'warning');
}

conversionComplete() {
this.isConverting = false;
this.hideProgressCard();
this.showResultsCard();
this.renderResults();
this.showNotification('All images converted successfully!', 'success');

// Track conversion in analytics
this.trackConversion('png', this.images.length);
}

showResultsCard() {
this.resultsCard.style.display = 'block';
}

hideResultsCard() {
this.resultsCard.style.display = 'none';
}

renderResults() {
this.resultsList.innerHTML = '';
let totalOriginalSize = 0;
let totalConvertedSize = 0;

this.images.forEach(imageData => {
totalOriginalSize += imageData.size;
totalConvertedSize += imageData.convertedSize;

const resultItem = document.createElement('div');
resultItem.className = 'result-item';

const fileName = this.generateOutputName(imageData.name);
const saved = imageData.savedPercentage > 0 ?
`${imageData.savedPercentage}% smaller` :
`${Math.abs(imageData.savedPercentage)}% larger`;

resultItem.innerHTML = `
<div class="result-info">
<i class="fas fa-check-circle result-icon"></i>
<div>
<div class="result-name">${fileName}</div>
<div class="result-stats">
${this.formatBytes(imageData.convertedSize)} • ${saved}
</div>
</div>
</div>
<div class="result-actions">
<button class="btn-preview" onclick="converter.previewResult('${imageData.id}')">
<i class="fas fa-eye"></i>
</button>
<button class="btn-download-single" onclick="converter.downloadSingleResult('${imageData.id}')">
<i class="fas fa-download"></i>
</button>
</div>
`;

this.resultsList.appendChild(resultItem);
});

// Update summary
this.totalFiles.textContent = this.images.length;
this.totalSize.textContent = this.formatBytes(totalConvertedSize);

const totalSavedPercentage = Math.round((1 - (totalConvertedSize / totalOriginalSize)) * 100);
this.totalSaved.textContent = `${totalSavedPercentage}%`;
}

generateOutputName(originalName) {
let nameTemplate = this.outputName.value || '{filename}.png';
const baseName = originalName.replace(/\.[^/.]+$/, "");

nameTemplate = nameTemplate
.replace('{filename}', baseName)
.replace('{timestamp}', Date.now())
.replace('{date}', new Date().toISOString().split('T')[0]);

if (!nameTemplate.endsWith('.png')) {
nameTemplate += '.png';
}

return nameTemplate;
}

previewResult(id) {
const imageData = this.images.find(img => img.id === id);
if (imageData) {
this.previewImage(imageData);
this.switchTab({ target: document.querySelector('.tab-btn[data-tab="converted"]') });
}
}

downloadSingleResult(id) {
const imageData = this.images.find(img => img.id === id);
if (imageData && imageData.convertedBlob) {
const fileName = this.generateOutputName(imageData.name);
this.downloadBlob(imageData.convertedBlob, fileName);
this.showNotification(`Downloading ${fileName}`, 'info');
}
}

downloadAllResults() {
if (this.images.length === 0) return;

if (this.images.length === 1) {
this.downloadSingleResult(this.images[0].id);
return;
}

// Create zip file for multiple images
this.createZipAndDownload();
}

async createZipAndDownload() {
this.showNotification('Creating ZIP file...', 'info');

try {
const JSZip = window.JSZip;
if (!JSZip) {
// Load JSZip dynamically
await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
}

const zip = new JSZip();

this.images.forEach(imageData => {
if (imageData.convertedBlob) {
const fileName = this.generateOutputName(imageData.name);
zip.file(fileName, imageData.convertedBlob);
}
});

const zipBlob = await zip.generateAsync({ type: 'blob' });
const zipName = `converted-images-${Date.now()}.zip`;

this.downloadBlob(zipBlob, zipName);
this.showNotification('ZIP file downloaded!', 'success');

} catch (error) {
this.showNotification('Error creating ZIP file', 'error');
console.error('ZIP creation error:', error);
}
}

downloadBlob(blob, fileName) {
const link = document.createElement('a');
link.href = URL.createObjectURL(blob);
link.download = fileName;
document.body.appendChild(link);
link.click();
document.body.removeChild(link);

// Clean up URL
setTimeout(() => URL.revokeObjectURL(link.href), 100);
}

loadScript(url) {
return new Promise((resolve, reject) => {
const script = document.createElement('script');
script.src = url;
script.onload = resolve;
script.onerror = reject;
document.head.appendChild(script);
});
}

switchTab(e) {
const tab = e.target.dataset.tab;

// Update active tab button
this.tabBtns.forEach(btn => {
btn.classList.remove('active');
});
e.target.classList.add('active');

// Show selected tab content
document.querySelectorAll('.tab-content').forEach(content => {
content.classList.remove('active');
});
document.getElementById(`${tab}Preview`).classList.add('active');
}

copyToolLink() {
const url = window.location.href;
navigator.clipboard.writeText(url)
.then(() => this.showNotification('Link copied to clipboard!', 'success'))
.catch(() => this.showNotification('Failed to copy link', 'error'));
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

saveSettings() {
const settings = {
quality: this.pngQuality.value,
preserveTransparency: this.preserveTransparency.checked,
outputName: this.outputName.value
};
localStorage.setItem('pngConverterSettings', JSON.stringify(settings));
}

saveToLocalStorage() {
// Save only metadata, not actual images
const imageMeta = this.images.map(img => ({
id: img.id,
name: img.name,
size: img.size,
type: img.type,
status: img.status
}));
localStorage.setItem('pngConverterImages', JSON.stringify(imageMeta));
}

loadFromLocalStorage() {
try {
const settings = localStorage.getItem('pngConverterSettings');
if (settings) {
const parsed = JSON.parse(settings);
this.pngQuality.value = parsed.quality || '2';
this.preserveTransparency.checked = parsed.preserveTransparency !== false;
this.outputName.value = parsed.outputName || '{filename}.png';
this.updateQualityDisplay();
}

const images = localStorage.getItem('pngConverterImages');
if (images) {
// Note: Actual images can't be restored from localStorage
// This is just for showing previous session info
}
} catch (error) {
console.error('Error loading from localStorage:', error);
}
}

trackConversion(format, count) {
// Implement analytics tracking here
if (typeof gtag !== 'undefined') {
gtag('event', 'conversion', {
'event_category': 'image_conversion',
'event_label': format,
'value': count
});
}
}
}

// Initialize converter when DOM is loaded
let converter;
document.addEventListener('DOMContentLoaded', () => {
converter = new ImageToPNGConverter();
});

// Make converter available globally for onclick handlers
window.converter = converter;
