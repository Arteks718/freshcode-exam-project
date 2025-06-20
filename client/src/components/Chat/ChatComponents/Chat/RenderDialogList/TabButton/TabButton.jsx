import classNames from 'classnames';

const TabButton = (props) => {
  const { isActive, onClick, title, styles } = props;
  return (
    <button
      onClick={onClick}
      className={classNames(styles.button, {
        [styles.activeButton]: isActive,
      })}
    >
      {title}
    </button>
  );
};

export default TabButton;
