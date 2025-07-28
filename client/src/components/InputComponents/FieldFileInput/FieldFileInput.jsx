import { useField } from 'formik';
import { IoCloseSharp } from 'react-icons/io5';

const FieldFileInput = (props) => {
  const { name } = props;
  const { fileUploadContainer, labelClass, fileNameClass, fileInput, fileBlockClass } =
    props.classes;

  const [{ value, ...field }, , helpers] = useField(name);

  const onChange = (e) => {
    helpers.setValue(e.target.files[0]);
  };

  const removeFile = () => {
    helpers.setValue(null);
  };

  return (
    <div className={fileUploadContainer}>
      {!value?.name ? (
        <div>
          <label htmlFor="fileInput" className={labelClass}>
            Choose file
          </label>
          <input
            {...field}
            className={fileInput}
            id="fileInput"
            type="file"
            onChange={onChange}
          />
        </div>
      ) : (
        <div className={fileBlockClass}>
          <span id="fileNameContainer" className={fileNameClass}>
            {value?.name}
          </span>
          <IoCloseSharp onClick={removeFile}/>
        </div>
      )}
    </div>
  );
};

export default FieldFileInput;
