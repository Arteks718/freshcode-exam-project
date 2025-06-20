import { connect } from 'react-redux';
import styles from './RenderDialogList.module.sass';
import CONSTANTS from '../../../../../constants';
import CatalogListHeader from '../../../CatalogComponents/CatalogListHeader/CatalogListHeader';
import CatalogListContainer from '../../../CatalogComponents/CatalogListContainer/CatalogListContainer';
import DialogListContainer from '../../../DialogComponents/DialogListContainer/DialogListContainer';
import TabButton from './TabButton/TabButton';
import { setPreviewChatMode } from '../../../../../store/slices/chatSlice';

const TABS = [
  { title: 'Normal', mode: CONSTANTS.NORMAL_PREVIEW_CHAT_MODE },
  { title: 'Favorite', mode: CONSTANTS.FAVORITE_PREVIEW_CHAT_MODE },
  { title: 'Blocked', mode: CONSTANTS.BLOCKED_PREVIEW_CHAT_MODE },
  { title: 'Catalog', mode: CONSTANTS.CATALOG_PREVIEW_CHAT_MODE },
];

const RenderDialogList = (props) => {
  const { userId, isShowChatsInCatalog, chatMode, setPreviewChatMode } = props;

  return (
    <div>
      {isShowChatsInCatalog && <CatalogListHeader />}
      {!isShowChatsInCatalog && (
        <div className={styles.chatHeader}>
          <img src={`${CONSTANTS.STATIC_IMAGES_PATH}logo.png`} alt="logo" />
        </div>
      )}
      {!isShowChatsInCatalog && (
        <div className={styles.buttonsContainer}>
          {TABS.map((tab) => (
            <TabButton
              key={tab.mode}
              styles={styles}
              title={tab.title}
              isActive={chatMode === tab.mode}
              onClick={() => setPreviewChatMode(tab.mode)}
            />
          ))}
        </div>
      )}
      {chatMode === CONSTANTS.CATALOG_PREVIEW_CHAT_MODE ? (
        <CatalogListContainer />
      ) : (
        <DialogListContainer userId={userId} />
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  chatMode: state.chatStore.chatMode,
  isShowChatsInCatalog: state.chatStore.isShowChatsInCatalog,
});

const mapDispatchToProps = (dispatch) => ({
  setPreviewChatMode: (mode) => dispatch(setPreviewChatMode(mode)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RenderDialogList);
