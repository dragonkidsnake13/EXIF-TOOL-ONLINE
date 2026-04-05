const upload = document.getElementById('upload');
const preview = document.getElementById('preview');
const metadataDiv = document.getElementById('metadata');
const dropZone = document.getElementById('dropZone');

dropZone.addEventListener('click', () => upload.click());

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('drag-active');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('drag-active');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('drag-active');
  upload.files = e.dataTransfer.files;
  handleFile(upload.files[0]);
});

upload.addEventListener('change', () => {
  handleFile(upload.files[0]);
});

function addSection(title) {
  const el = document.createElement('h3');
  el.className = 'section-title';
  el.textContent = title;
  metadataDiv.appendChild(el);
}

function addItem(key, value) {
  const el = document.createElement('div');
  el.className = 'meta-item';
  el.innerHTML = `<strong>${key}:</strong> ${value}`;
  metadataDiv.appendChild(el);
}

function convertDMSToDecimal(dms, ref) {
  if (!dms) return null;

  const degrees = dms[0].numerator / dms[0].denominator;
  const minutes = dms[1].numerator / dms[1].denominator;
  const seconds = dms[2].numerator / dms[2].denominator;

  let decimal = degrees + minutes / 60 + seconds / 3600;
  if (ref === "S" || ref === "W") decimal *= -1;

  return decimal.toFixed(6);
}

function handleFile(file) {
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    preview.src = e.target.result;

    const img = new Image();
    img.onload = function () {
      metadataDiv.innerHTML = '';

      // BASIC INFO
      addSection('Basic Info');
      addItem('Name', file.name);
      addItem('Size (KB)', (file.size / 1024).toFixed(2));
      addItem('Type', file.type);
      addItem('Width', img.width);
      addItem('Height', img.height);

      // EXIF
      EXIF.getData(img, function () {
        const data = EXIF.getAllTags(this);

        addSection('EXIF Data');

        if (Object.keys(data).length === 0) {
          addItem('Info', 'No EXIF data found');
          return;
        }

        // CAMERA INFO
        addSection('Camera Info');
        addItem('Camera Model', EXIF.getTag(this, 'Model') || 'N/A');
        addItem('Make', EXIF.getTag(this, 'Make') || 'N/A');
        addItem('ISO', EXIF.getTag(this, 'ISOSpeedRatings') || 'N/A');
        addItem('Aperture (FNumber)', EXIF.getTag(this, 'FNumber') || 'N/A');
        addItem('Exposure Time', EXIF.getTag(this, 'ExposureTime') || 'N/A');

        // GPS
        const lat = convertDMSToDecimal(EXIF.getTag(this, 'GPSLatitude'), EXIF.getTag(this, 'GPSLatitudeRef'));
        const lon = convertDMSToDecimal(EXIF.getTag(this, 'GPSLongitude'), EXIF.getTag(this, 'GPSLongitudeRef'));

        addSection('Location');

        if (lat && lon) {
          addItem('Latitude', lat);
          addItem('Longitude', lon);
          addItem('Map', `<a href="https://www.google.com/maps?q=${lat},${lon}" target="_blank">Open in Google Maps</a>`);
        } else {
          addItem('GPS', 'No GPS data found');
        }

        // RAW EXIF LIST
        addSection('All EXIF Tags');
        for (let key in data) {
          addItem(key, data[key]);
        }
      });
    };

    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
}
