import { useRef, useCallback } from 'react';
import { useField } from 'formik';
import classNames from 'classnames';
import CONSTANTS from '../../../constants';

const ImageUpload = (props) => {
  const { name, classes } = props;

  const [{ value, ...field }, , helpers] = useField(name);
  const { uploadContainer, inputContainer, imgStyle } = classes;
  const imagePreviewRef = useRef(null);
  console.log('tset', value)

  const imageTypes = CONSTANTS.UPLOAD_IMAGE_TYPES.join('|');
  const acceptedImageTypes = CONSTANTS.UPLOAD_IMAGE_TYPES.map(
    (img) => `.${img}`
  ).join(', ');

  const onChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      const imageTypeRegex = new RegExp(`image/(${imageTypes})`);

      if (!file.type.match(imageTypeRegex)) {
        e.target.value = '';
        return;
      } else {
        helpers.setValue(file);
        const reader = new FileReader();
        reader.onload = () => {
          if (imagePreviewRef.current) {
            imagePreviewRef.current.src = reader.result;
          }
        };
        reader.onerror = () => {
          console.error('An error occurred while reading the file.');
        };
        reader.readAsDataURL(file);
      }
    },
    [helpers, imageTypes]
  );

  return (
    <div className={uploadContainer}>
      <div className={inputContainer}>
        <span>Support only images ({acceptedImageTypes})</span>
        <input
          {...field}
          id="fileInput"
          type="file"
          accept={acceptedImageTypes}
          onChange={onChange}
        />
        <label htmlFor="fileInput">Choose file</label>
      </div>
      <img
        id="imagePreview"
        ref={imagePreviewRef}
        className={classNames({ [imgStyle]: value })}
        src={value}
        alt="user"
      />
    </div>
  );
};

export default ImageUpload;
