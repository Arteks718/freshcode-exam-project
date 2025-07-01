import { connect } from 'react-redux';
import { isSameDay, isSameWeek, isSameYear, format } from 'date-fns';
import CONSTANTS from '../../../../constants';
import {
  goToExpandedDialog,
  changeChatFavorite,
  changeChatBlock,
  changeShowAddChatToCatalogMenu,
} from '../../../../store/slices/chatSlice';
import DialogBox from '../DialogBox/DialogBox';
import styles from './DialogList.module.sass';

const getTimeStr = (time) => {
  const currentTime = new Date();
  if (isSameDay(currentTime, time)) return format(time, 'HH:mm');
  if (isSameWeek(currentTime, time)) return format(time, 'E');
  if (isSameYear(currentTime, time)) return format(time, 'MMM dd');
  return format(time, 'MMMM dd, yyyy');
};

const FILTERS = {
  [CONSTANTS.FAVORITE_PREVIEW_CHAT_MODE]: (chatPreview, userId) =>
    chatPreview.favoriteList[chatPreview.participants.indexOf(userId)],
  [CONSTANTS.BLOCKED_PREVIEW_CHAT_MODE]: (chatPreview, userId) =>
    chatPreview.blackList[chatPreview.participants.indexOf(userId)],
};

const DialogList = (props) => {
  const {
    changeChatFavorite,
    changeChatBlock,
    changeShowAddChatToCatalogMenu,
    userId,
    preview,
    goToExpandedDialog,
    chatMode,
    removeChat,
  } = props;

  const handleFavorite = (data, event) => {
    changeChatFavorite(data);
    event.stopPropagation();
  };
  const handleBlackList = (data, event) => {
    changeChatBlock(data);
    event.stopPropagation();
  };
  const handleShowCatalogCreation = (event, chatId) => {
    changeShowAddChatToCatalogMenu(chatId);
    event.stopPropagation();
  };

  const filterFunc = FILTERS[chatMode];

  const dialogs = preview
    .filter((chat) => !filterFunc || filterFunc(chat, userId))
    .map((chat) => (
      <DialogBox
        interlocutor={chat.interlocutor}
        chatPreview={chat}
        userId={userId}
        key={`chat-${chat.id}`}
        getTimeStr={getTimeStr}
        changeFavorite={handleFavorite}
        changeBlackList={handleBlackList}
        chatMode={chatMode}
        catalogOperation={
          chatMode === CONSTANTS.CATALOG_PREVIEW_CHAT_MODE
            ? removeChat
            : handleShowCatalogCreation
        }
        goToExpandedDialog={goToExpandedDialog}
      />
    ));

  return (
    <div className={styles.previewContainer}>
      {dialogs.length ? (
        dialogs
      ) : (
        <span className={styles.notFound}>Not found</span>
      )}
    </div>
  );
};

const mapStateToProps = (state) => state.chatStore;

const mapDispatchToProps = (dispatch) => ({
  goToExpandedDialog: (data) => dispatch(goToExpandedDialog(data)),
  changeChatFavorite: (data) => dispatch(changeChatFavorite(data)),
  changeChatBlock: (data) => dispatch(changeChatBlock(data)),
  changeShowAddChatToCatalogMenu: (data) =>
    dispatch(changeShowAddChatToCatalogMenu(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DialogList);
