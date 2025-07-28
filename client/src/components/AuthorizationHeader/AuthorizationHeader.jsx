import { Link } from 'react-router-dom';
import styles from './AuthorizationHeader.module.sass';
import Logo from '../Logo';
import CONSTANTS from '../../constants';

const AuthorizationHeader = (props) => {
  const { children, linkTo, buttonTitle } = props;
  return (
    <div className={styles.authorizationContainer}>
      <div className={styles.authorizationHeader}>
        <Logo src={`${CONSTANTS.STATIC_IMAGES_PATH}logo.png`} />
        <Link
          to={linkTo}
          style={{ textDecoration: 'none' }}
          className={styles.button}
        >
          {buttonTitle}
        </Link>
      </div>
      {children}
    </div>
  );
};

export default AuthorizationHeader;
