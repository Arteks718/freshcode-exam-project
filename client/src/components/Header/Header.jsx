import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { FaPhoneAlt } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';
import { IoMdArrowDropdown } from 'react-icons/io';
import styles from './Header.module.sass';
import CONSTANTS from '../../constants';
import { clearUserStore, getUser } from '../../store/slices/userSlice';
import { checkTime } from '../../store/slices/eventSlice';
import { clearOffersList } from '../../store/slices/offersSlice';
import EventNotification from '../Events/EventNotification/EventNotification';
import { changeChatShow } from '../../store/slices/chatSlice';

const Header = (props) => {
  const {
    clearUserStore,
    data,
    getUser,
    checkTime,
    finishedCount,
    reminderCount,
    history,
    isFetching,
    events,
    changeChatShow,
  } = props;

  useEffect(() => {
    if (!data) {
      getUser();
    }
  }, [data, getUser]);

  const logOut = () => {
    localStorage.clear();
    clearUserStore();
    clearOffersList();
    history.replace('/login');
  };

  const startContests = () => {
    history.push('/startContest');
  };

  const renderLoginButtons = () => {
    if (data) {
      return (
        <>
          <div className={styles.userInfo}>
            <img
              src={
                data.avatar === 'anon.png'
                  ? CONSTANTS.ANONYM_IMAGE_PATH
                  : `${CONSTANTS.publicURL}${data.avatar}`
              }
              alt="user"
            />
            <span>{`Hi, ${data.displayName}`}</span>
            <IoMdArrowDropdown color="#718888" alt="menu" />
            <ul>
              <li>
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                  <span>View Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/account" style={{ textDecoration: 'none' }}>
                  <span>My Account</span>
                </Link>
              </li>
              <li>
                <Link
                  to="http:/www.google.com"
                  style={{ textDecoration: 'none' }}
                >
                  <span>Messages</span>
                </Link>
              </li>
              <li>
                <Link
                  to="http:/www.google.com"
                  style={{ textDecoration: 'none' }}
                >
                  <span>Affiliate Dashboard</span>
                </Link>
              </li>
              <li>
                <span onClick={logOut}>Logout</span>
              </li>
            </ul>
          </div>
          <FiMail
            className={styles.icon}
            style={{ cursor: 'pointer' }}
            alt="email"
            onClick={() => changeChatShow()}
          />
          <EventNotification
            style={{ icon: styles.icon }}
            checkTime={checkTime}
            counts={{ finishedCount, reminderCount }}
            role={data.role}
            events={events}
          />
        </>
      );
    }
    return (
      <>
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <span className={styles.btn}>LOGIN</span>
        </Link>
        <Link to="/registration" style={{ textDecoration: 'none' }}>
          <span className={styles.btn}>SIGN UP</span>
        </Link>
      </>
    );
  };

  if (isFetching) {
    return null;
  }
  return (
    <div className={styles.headerContainer}>
      <div className={styles.fixedHeader}>
        <span className={styles.info}>
          Squadhelp recognized as one of the Most Innovative Companies by Inc
          Magazine.
        </span>
        <a
          href="http://www.google.com
        "
        >
          Read Announcement
        </a>
      </div>
      <div className={styles.loginSignnUpHeaders}>
        <div className={styles.numberContainer}>
          <FaPhoneAlt alt="phone" />
          <a href="tel:8773553585">
            <span>(877)&nbsp;355-3585</span>
          </a>
        </div>
        <div className={styles.userButtonsContainer}>
          {renderLoginButtons()}
        </div>
      </div>
      <div className={styles.navContainer}>
        <a href="/">
          <img
            src={`${CONSTANTS.STATIC_IMAGES_PATH}blue-logo.png`}
            className={styles.logo}
            alt="blue_logo"
          />
        </a>
        <div className={styles.leftNav}>
          <div className={styles.nav}>
            <ul className={styles.navList}>
              {CONSTANTS.HEADER_ITEMS.map((item, index) => (
                <li key={index} className={styles.navItem}>
                  <span>{item.title}</span>
                  {item.items && item.items.length > 0 && (
                    <>
                      <IoMdArrowDropdown color="#718888" alt="menu" />
                      <ul className={styles.navSubMenu}>
                        {item.items.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              to={subItem.link || '/404'}
                              style={{ textDecoration: 'none' }}
                            >
                              {subItem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
          {data && data.role === CONSTANTS.CUSTOMER && (
            <div className={styles.startContestBtn} onClick={startContests}>
              START CONTEST
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...state.userStore,
  ...(({ isFetching, error, ...rest }) => rest)(state.eventStore),
});
const mapDispatchToProps = (dispatch) => ({
  getUser: () => dispatch(getUser()),
  clearUserStore: () => dispatch(clearUserStore()),
  checkTime: (time) => dispatch(checkTime(time)),
  changeChatShow: () => dispatch(changeChatShow()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
