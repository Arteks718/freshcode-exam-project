import { useEffect } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import styles from './Chat.module.sass';
import Dialog from '../../DialogComponents/Dialog/Dialog';
import {
  changeChatShow,
  changeShowModeCatalog,
  clearChatError,
  clearChatStore,
  getPreviewChat,
} from '../../../../store/slices/chatSlice';
import { chatController } from '../../../../api/ws/socketController';
import CatalogCreation from '../../CatalogComponents/CatalogCreation/CatalogCreation';
import ChatError from '../../ChatError/ChatError';
import RenderDialogList from './RenderDialogList/RenderDialogList';

const Chat = (props) => {
  const {
    changeShow,
    clearChatStore,
    chatStore: {
      isExpanded,
      isShow,
      isShowCatalogCreation,
      error,
    },
    userStore: {
      data: { id },
    },
  } = props;

  useEffect(() => {
    chatController.subscribeChat(id);
    getPreviewChat()
    return () => {
      chatController.unsubscribeChat(id);
      clearChatStore()
    };
  }, [id]);

  return (
    <div
      className={classNames(styles.chatContainer, {
        [styles.showChat]: isShow,
      })}
    >
      {error && <ChatError getData={getPreviewChat} />}
      {isShowCatalogCreation && <CatalogCreation />}
      {isExpanded ? <Dialog userId={id} /> : <RenderDialogList userId={id} />}
      <div className={styles.toggleChat} onClick={() => changeShow()}>
        {isShow ? 'Hide Chat' : 'Show Chat'}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { chatStore, userStore } = state;
  return { chatStore, userStore };
};

const mapDispatchToProps = (dispatch) => ({
  changeShow: () => dispatch(changeChatShow()),
  changeShowModeCatalog: () => dispatch(changeShowModeCatalog()),
  clearChatError: () => dispatch(clearChatError()),
  getPreviewChat: () => dispatch(getPreviewChat()),
  clearChatStore: () => dispatch(clearChatStore()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
