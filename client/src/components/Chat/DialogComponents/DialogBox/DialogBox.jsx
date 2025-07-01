import styles from './DialogBox.module.sass';
import CONSTANTS from '../../../../constants';
import {
  FaHeart,
  FaMinusCircle,
  FaRegHeart,
  FaRegPlusSquare,
  FaUnlock,
  FaUserLock,
} from 'react-icons/fa';

const DialogBox = (props) => {
  const {
    chatPreview,
    userId,
    getTimeStr,
    changeFavorite,
    changeBlackList,
    catalogOperation,
    goToExpandedDialog,
    chatMode,
    interlocutor,
  } = props;

  const { favoriteList, participants, blackList, id, text, createdAt } =
    chatPreview;

  const isFavorite = favoriteList[participants.indexOf(userId)];
  const isBlocked = blackList[participants.indexOf(userId)];

  const handleFavorite = (event) => {
    changeFavorite(
      {
        participants,
        favoriteFlag: !isFavorite,
        currentFavoriteList: favoriteList,
      },
      event
    );
  };

  const handleBlock = (event) => {
    changeBlackList(
      {
        participants,
        blackListFlag: !isBlocked,
        currentBlackList: blackList,
      },
      event
    );
  };

  const handleShowCatalogCreation = (event) => {
    catalogOperation(event, id);
  };

  return (
    <div
      className={styles.previewChatBox}
      onClick={() =>
        goToExpandedDialog({
          interlocutor,
          conversationData: {
            participants,
            id,
            blackList,
            favoriteList,
          },
        })
      }
    >
      <img
        src={
          interlocutor.avatar === 'anon.png'
            ? CONSTANTS.ANONYM_IMAGE_PATH
            : `${CONSTANTS.publicURL}${interlocutor.avatar}`
        }
        alt="user"
      />
      <div className={styles.infoContainer}>
        <div className={styles.interlocutorInfo}>
          <span className={styles.interlocutorName}>
            {interlocutor.firstName}
          </span>
          <span className={styles.interlocutorMessage}>{text}</span>
        </div>
        <div className={styles.buttonsContainer}>
          <span className={styles.time}>{getTimeStr(createdAt)}</span>
          <i onClick={handleFavorite}>
            {isFavorite ? <FaHeart /> : <FaRegHeart />}
          </i>
          <i onClick={handleBlock}>
            {isBlocked ? <FaUnlock /> : <FaUserLock />}
          </i>
          <i onClick={handleShowCatalogCreation}>
            {chatMode !== CONSTANTS.CATALOG_PREVIEW_CHAT_MODE ? (
              <FaRegPlusSquare />
            ) : (
              <FaMinusCircle />
            )}
          </i>
        </div>
      </div>
    </div>
  );
};

export default DialogBox;
