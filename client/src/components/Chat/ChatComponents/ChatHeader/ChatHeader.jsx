import { connect } from 'react-redux';
import classNames from 'classnames';
import { FaArrowLeft, FaHeart, FaRegHeart, FaUnlock, FaUserLock } from 'react-icons/fa';
import {
  backToDialogList,
  changeChatFavorite,
  changeChatBlock,
} from '../../../../store/slices/chatSlice';
import styles from './ChatHeader.module.sass';
import CONSTANTS from '../../../../constants';
import { useCallback } from 'react';

const isFavorite = (chatData, userId) => {
  const { favoriteList, participants } = chatData;
  return favoriteList[participants.indexOf(userId)];
};

const isBlocked = (chatData, userId) => {
  const { participants, blackList } = chatData;
  return blackList[participants.indexOf(userId)];
};

const ChatHeader = (props) => {
  const {
    backToDialogList,
    chatData,
    userId,
    changeChatFavorite,
    changeChatBlock,
    interlocutor: { avatar, firstName },
  } = props;

  const handleFavorite = useCallback(
    (event) => {
      if (!chatData) return;
      changeChatFavorite({
        participants: chatData.participants,
        favoriteFlag: !isFavorite(chatData, userId),
        currentFavoriteList: chatData.favoriteList,
      });
      event.stopPropagation();
    },
    [chatData, userId, changeChatFavorite]
  );

  const handleBlock = useCallback(
    (event) => {
      if (!chatData) return;
      changeChatBlock({
        participants: chatData.participants,
        blackListFlag: !isBlocked(chatData, userId),
        currentBlackList: chatData.blackList,
      });
      event.stopPropagation();
    },
    [chatData, userId, changeChatBlock]
  );

  return (
    <div className={styles.chatHeader}>
      <div
        className={styles.buttonContainer}
        onClick={() => backToDialogList()}
      >
        <FaArrowLeft color="white" size="28" alt="back" />
      </div>
      <div className={styles.infoContainer}>
        <div>
          <img
            src={
              avatar === 'anon.png'
                ? CONSTANTS.ANONYM_IMAGE_PATH
                : `${CONSTANTS.publicURL}${avatar}`
            }
            alt="user"
          />
          <span>{firstName}</span>
        </div>
        {chatData && (
          <div>
            {/* <i
              onClick={handleFavorite}
              className={classNames({
                'far fa-heart': !isFavorite(chatData, userId),
                'fas fa-heart': isFavorite(chatData, userId),
              })}
            />
            <i
              onClick={handleBlock}
              className={classNames({
                'fas fa-user-lock': !isBlocked(chatData, userId),
                'fas fa-unlock': isBlocked(chatData, userId),
              })}
            /> */}
            <i onClick={handleFavorite}>
              {isFavorite(chatData, userId) ? (
                <FaHeart color="red" size={20} />
              ) : (
                <FaRegHeart color="black" size={20} />
              )}
            </i>
            <i onClick={handleBlock}>
              {isBlocked(chatData, userId) ? (
                <FaUnlock  color="red" size={20} />
              ) : (
                <FaUserLock color="black" size={20} />
              )}
            </i>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { interlocutor, chatData } = state.chatStore;
  const userId = state.userStore.data?.id;
  return { interlocutor, chatData, userId };
};

const mapDispatchToProps = (dispatch) => ({
  backToDialogList: () => dispatch(backToDialogList()),
  changeChatFavorite: (data) => dispatch(changeChatFavorite(data)),
  changeChatBlock: (data) => dispatch(changeChatBlock(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatHeader);
