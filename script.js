const upload = document.getElementById('upload');
const preview = document.getElementById('preview');
const metadataDiv = document.getElementById('metadata');
const dropZone = document.getElementById('dropZone');

dropZone.addEventListener('click', () => upload.click());

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.style.borderColor = '#6366f1';
});

dropZone.addEventListener('dragleave', () => {
  dropZone.style.borderColor = '#334155';
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  upload.files = e.dataTransfer.files;
  handleFile(upload.files[0]);
});

upload.addEventListener('change', () => {
  handleFile(upload.files[0]);
});

function addSection(title) {
  const el = document.createElement('div');
  el.className = 'section-title';
  el.textContent = title;
  metadataDiv.appendChild(el);
}

function addItem(key, value) {
  const el = document.createElement('div');
  el.textContent = key + ': ' + value;
  metadataDiv.appendChild(el);
}

function handleFile(file) {
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    preview.src = e.target.result;

    const img = new Image();
    img.onload = function () {
      metadataDiv.innerHTML = '';

      addSection('Basic Info');
      addItem('Name', file.name);
      addItem('Size (KB)', (file.size / 1024).toFixed(2));
      addItem('Type', file.type);
      addItem('Width', img.width);
      addItem('Height', img.height);

      EXIF.getData(img, function () {
        const data = EXIF.getAllTags(this);

        addSection('EXIF Data');

        if (Object.keys(data).length === 0) {
          addItem('Info', 'No EXIF data found');
          return;
        }

        for (let key in data) {
          addItem(key, data[key]);
        }

        addSection('Camera Info');
        addItem('Camera', EXIF.getTag(this, 'Model') || 'N/A');
        addItem('ISO', EXIF.getTag(this, 'ISOSpeedRatings') || 'N/A');
        addItem('Aperture', EXIF.getTag(this, 'FNumber') || 'N/A');
      });
    };

    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
}
