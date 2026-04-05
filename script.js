const upload = document.getElementById('upload');
const preview = document.getElementById('preview');
const metadataDiv = document.getElementById('metadata');

function addSection(title) {
  const section = document.createElement('div');
  section.className = 'section-title';
  section.textContent = title;
  metadataDiv.appendChild(section);
}

function addItem(key, value) {
  const div = document.createElement('div');
  div.textContent = key + ': ' + value;
  metadataDiv.appendChild(div);
}

upload.addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    preview.src = e.target.result;

    const img = new Image();
    img.onload = function () {
      metadataDiv.innerHTML = '';

      // Basic Info
      addSection('Basic Info');
      addItem('File Name', file.name);
      addItem('File Size (KB)', (file.size / 1024).toFixed(2));
      addItem('File Type', file.type);
      addItem('Width', img.width + ' px');
      addItem('Height', img.height + ' px');
      addItem('Last Modified', new Date(file.lastModified).toLocaleString());

      // EXIF Data
      EXIF.getData(img, function () {
        const allMetaData = EXIF.getAllTags(this);

        if (Object.keys(allMetaData).length === 0) {
          addSection('EXIF Data');
          addItem('Info', 'No EXIF metadata found');
          return;
        }

        addSection('EXIF Data');

        for (let tag in allMetaData) {
          let value = allMetaData[tag];

          if (tag === 'GPSLatitude' || tag === 'GPSLongitude') {
            value = value.join(', ');
          }

          addItem(tag, value);
        }

        // Key Camera Info
        addSection('Key Camera Info');
        addItem('Camera', EXIF.getTag(this, 'Model') || 'N/A');
        addItem('Lens', EXIF.getTag(this, 'LensModel') || 'N/A');
        addItem('ISO', EXIF.getTag(this, 'ISOSpeedRatings') || 'N/A');
        addItem('Aperture', EXIF.getTag(this, 'FNumber') || 'N/A');
        addItem('Shutter Speed', EXIF.getTag(this, 'ExposureTime') || 'N/A');
        addItem('Date Taken', EXIF.getTag(this, 'DateTimeOriginal') || 'N/A');
      });
    };

    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
});
