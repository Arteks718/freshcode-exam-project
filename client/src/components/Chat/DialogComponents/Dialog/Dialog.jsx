import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { isEqual, formatISO, format } from 'date-fns';
import className from 'classnames';
import {
  getDialogMessages,
  clearMessageList,
} from '../../../../store/slices/chatSlice';
import ChatHeader from '../../ChatComponents/ChatHeader/ChatHeader';
import styles from './Dialog.module.sass';
import ChatInput from '../../ChatComponents/ChatInput/ChatInput';

const Dialog = (props) => {
  const {
    getDialog,
    clearMessageList,
    interlocutor,
    messages,
    userId,
    chatData,
  } = props;

  const messagesEnd = useRef(null);

  const scrollToBottom = () => {
    if (messagesEnd.current) {
      messagesEnd.current.scrollIntoView({ behavior: 'auto' });
    }
  };

  useEffect(() => {
    getDialog({ interlocutorId: interlocutor.id });
    scrollToBottom();
    return clearMessageList
  }, [interlocutor.id, getDialog, clearMessageList]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const renderMainDialog = () => {
    const messagesArray = [];
    let currentTime = new Date();

    messages.forEach((message, i) => {
      const messageDate = formatISO(message.createdAt, { representation: 'date' });
      const currentDate = formatISO(currentTime, { representation: 'date' });

      if (!isEqual(currentDate, messageDate)) {
        messagesArray.push(
          <div key={`date-${message.createdAt}`} className={styles.date}>
            {format(message.createdAt, 'MMMM dd, yyyy')}
          </div>
        );
        currentTime = new Date(message.createdAt);
      }

      messagesArray.push(
        <div
          key={`message-${i}`}
          className={className(
            userId === message.sender ? styles.ownMessage : styles.message
          )}
        >
          <span>{message.body}</span>
          <span className={styles.messageTime}>
            {format(message.createdAt, 'HH:mm')}
          </span>
          <div ref={messagesEnd} />
        </div>
      );
    });

    return <div className={styles.messageList}>{messagesArray}</div>;
  };

  const blockMessage = () => {
    const { blackList, participants } = chatData;
    const userIndex = participants.indexOf(userId);
    let message;
    if (chatData && blackList[userIndex]) {
      message = `You block ${interlocutor.firstName}`;
    } else if (chatData && blackList.includes(true)) {
      message = `${interlocutor.firstName} block you`;
    }
    return <span className={styles.messageBlock}>{message}</span>;
  };

  return (
    <>
      <ChatHeader userId={userId} />
      {renderMainDialog()}
      <div ref={messagesEnd} />
      {chatData && chatData.blackList.includes(true) ? (
        blockMessage()
      ) : (
        <ChatInput />
      )}
    </>
  );
};

const mapStateToProps = (state) => state.chatStore;

const mapDispatchToProps = {
  getDialog: getDialogMessages,
  clearMessageList,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dialog);