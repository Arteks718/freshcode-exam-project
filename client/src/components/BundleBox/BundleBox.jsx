import React, { useMemo, useRef } from 'react';
import styles from './BundleBox.module.sass';
import CONSTANTS from '../../constants';

const BundleBox = (props) => {
  const { setBundle, header, path, describe } = props;
  const bundleRef = useRef(null);
  const defaultPathToImages = `${CONSTANTS.STATIC_IMAGES_PATH}contestLabels/`;

  const renderImage = useMemo(() => {
    return path.map((p, i) => (
      <img
        src={defaultPathToImages + p}
        key={i}
        className={styles.imgContainer}
        alt={p.replace(/.png/g, 'Contest')}
      />
    ));
  }, [path, defaultPathToImages]);

  const mouseOverHandler = () => {
    const element = bundleRef.current;
    Array.from(element.children[0].children).forEach((img, i) => {
      img.src = `${defaultPathToImages}blue_${path[i]}`;
    });
  };

  const mouseOutHandler = () => {
    const element = bundleRef.current;
    Array.from(element.children[0].children).forEach((img, i) => {
      img.src = defaultPathToImages + path[i];
    });
  };

  const getBackClass = () =>
    path.length === 1 ? ' ' : ` ${styles.combinedBundle}`;

  return (
    <div
      onMouseOver={mouseOverHandler}
      onMouseOut={mouseOutHandler}
      onClick={() => setBundle(header)}
      ref={bundleRef}
      id={header}
      className={styles.bundleContainer + getBackClass()}
    >
      <div>{renderImage}</div>
      <div className={styles.infoContainer}>
        <span className={styles.bundleName}>{header}</span>
        <hr />
        <span className={styles.infoBundle}>{describe}</span>
      </div>
    </div>
  );
};

export default BundleBox;
