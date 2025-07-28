import { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  getCatalogList,
  removeChatFromCatalog,
} from '../../../../store/slices/chatSlice';
import CatalogList from '../CatalogList/CatalogList';
import DialogList from '../../DialogComponents/DialogList/DialogList';

const CatalogListContainer = (props) => {
  const { getCatalogList, removeChatFromCatalog, userId } = props;
  const { isShowChatsInCatalog, messagesPreview, currentCatalog, catalogList } = props.chatStore;

  useEffect(() => {
    getCatalogList();
  }, [getCatalogList]);

  const handleRemoveChatFromCatalog = (event, chatId) => {
    const { id } = currentCatalog;
    removeChatFromCatalog({ chatId, catalogId: id });
    event.stopPropagation();
  };

  const getDialogsPreview = () => {
    const { chats } = currentCatalog;
    const dialogsInCatalog = messagesPreview.filter((message) =>
      chats.some((chat) => chat.conversationId === message.id)
    );
    return dialogsInCatalog;
  };
  return (
    <>
      {isShowChatsInCatalog ? (
        <DialogList
          userId={userId}
          preview={getDialogsPreview()}
          removeChat={handleRemoveChatFromCatalog}
        />
      ) : (
        <CatalogList catalogList={catalogList} />
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  const { chatStore, userStore } = state;
  const userId = userStore.data.id;
  return { chatStore, userId };
};

const mapDispatchToProps = (dispatch) => ({
  getCatalogList: (data) => dispatch(getCatalogList(data)),
  removeChatFromCatalog: (data) => dispatch(removeChatFromCatalog(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CatalogListContainer);
