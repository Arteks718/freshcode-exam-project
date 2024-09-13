import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  getCatalogList,
  removeChatFromCatalog,
} from '../../../../store/slices/chatSlice';
import CatalogList from '../CatalogList/CatalogList';
import DialogList from '../../DialogComponents/DialogList/DialogList';

const CatalogListContainer = (props) => {
  const { getCatalogList, isShowChatsInCatalog, id, chatStore } = props;
  useEffect(() => {
    getCatalogList()
  }, [])

  const handleRemoveChatFromCatalog = (event, chatId) => {
    const { _id } = chatStore.currentCatalog;
    removeChatFromCatalog({ chatId, catalogId: _id });
    event.stopPropagation();
  };

  const getDialogsPreview = () => {
    const { messagesPreview, currentCatalog } = chatStore;
    const { chats } = currentCatalog;
    const dialogsInCatalog = [];
    for (let i = 0; i < messagesPreview.length; i++) {
      for (let j = 0; j < chats.length; j++) {
        if (chats[j] === messagesPreview[i]._id) {
          dialogsInCatalog.push(messagesPreview[i]);
        }
      }
    }
    return dialogsInCatalog;
  };


  return (
    <>
        {isShowChatsInCatalog ? (
          <DialogList
            userId={id}
            preview={getDialogsPreview()}
            removeChat={handleRemoveChatFromCatalog}
          />
        ) : (
          <CatalogList catalogList={chatStore.catalogList} />
        )}
      </>
  )
}

const mapStateToProps = (state) => {
  const { chatStore, userStore } = state;
  return { chatStore, userStore };
};

const mapDispatchToProps = (dispatch) => ({
  getCatalogList: (data) => dispatch(getCatalogList(data)),
  removeChatFromCatalog: (data) => dispatch(removeChatFromCatalog(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CatalogListContainer);
