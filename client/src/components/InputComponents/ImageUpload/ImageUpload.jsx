import React, { useRef, useCallback } from 'react';
import classNames from 'classnames';
import { useField } from 'formik';

const ImageUpload = (props) => {
  const [{ value, ...field }, , helpers] = useField(props.name);
  const { uploadContainer, inputContainer, imgStyle } = props.classes;
  const imagePreviewRef = useRef(null);

  const onChange = useCallback((e) => {
    const file = e.target.files[0];
    const imageType = /image.*/;

    if (!file.type.match(imageType)) {
      e.target.value = '';
      return
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
  }, [helpers]);

  return (
    <div className={uploadContainer}>
      <div className={inputContainer}>
        <span>Support only images (*.png, *.gif, *.jpg, *.jpeg)</span>
        <input
          {...field}
          id="fileInput"
          type="file"
          accept=".jpg, .png, .jpeg"
          onChange={onChange}
        />
        <label htmlFor="fileInput">Choose file</label>
      </div>
      <img
        id="imagePreview"
        ref={imagePreviewRef}
        className={classNames({ [imgStyle]: !!value })}
        alt="user"
      />
    </div>
  );
};

export default ImageUpload;