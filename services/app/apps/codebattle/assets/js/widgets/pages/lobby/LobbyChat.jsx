import React, { useEffect, useMemo, useCallback } from 'react';

import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';
import groupBy from 'lodash/groupBy';
import { connect, useSelector } from 'react-redux';

import ChatContextMenu from '../../components/ChatContextMenu';
import ChatHeader from '../../components/ChatHeader';
import ChatInput from '../../components/ChatInput';
import Loading from '../../components/Loading';
import Messages from '../../components/Messages';
import UserInfo from '../../components/UserInfo';
import * as chatMiddlewares from '../../middlewares/Chat';
import * as selectors from '../../selectors';
import { shouldShowMessage } from '../../utils/chat';
import useChatContextMenu from '../../utils/useChatContextMenu';
import useChatRooms from '../../utils/useChatRooms';

function ChatGroupedPlayersList({ players, displayMenu }) {
  const {
    watching: watchingList = [],
    online: onlineList = [],
    lobby: lobbyList = [],
    playing: playingList = [],
    task: builderList = [],
  } = groupBy(players, 'currentState');

  return (
    <>
      {watchingList.length !== 0 && <div>Watching: </div>}
      {watchingList.map(player => (
        <div
          role="button"
          tabIndex={0}
          className="mb-1"
          key={player.id}
          data-user-id={player.id}
          data-user-name={player.user.name}
          onContextMenu={displayMenu}
          onClick={displayMenu}
          onKeyPress={displayMenu}
        >
          <UserInfo user={player.user} hideInfo hideOnlineIndicator />
        </div>
      ))}
      {playingList.length !== 0 && <div>Playing: </div>}
      {playingList.map(player => (
        <div
          role="button"
          tabIndex={0}
          className="mb-1"
          key={player.id}
          data-user-id={player.id}
          data-user-name={player.user.name}
          onContextMenu={displayMenu}
          onClick={displayMenu}
          onKeyPress={displayMenu}
        >
          <UserInfo user={player.user} hideInfo hideOnlineIndicator />
        </div>
      ))}
      {lobbyList.length !== 0 && <div>Lobby: </div>}
      {lobbyList.map(player => (
        <div
          role="button"
          tabIndex={0}
          className="mb-1"
          key={player.id}
          data-user-id={player.id}
          data-user-name={player.user.name}
          onContextMenu={displayMenu}
          onClick={displayMenu}
          onKeyPress={displayMenu}
        >
          <UserInfo user={player.user} hideInfo hideOnlineIndicator />
        </div>
      ))}
      {onlineList.length !== 0 && <div>Online: </div>}
      {onlineList.map(player => (
        <div
          role="button"
          tabIndex={0}
          className="mb-1"
          key={player.id}
          data-user-id={player.id}
          data-user-name={player.user.name}
          onContextMenu={displayMenu}
          onClick={displayMenu}
          onKeyPress={displayMenu}
        >
          <UserInfo user={player.user} hideInfo hideOnlineIndicator />
        </div>
      ))}
      {builderList.length !== 0 && <div>Edit task: </div>}
      {builderList.map(player => (
        <div
          role="button"
          tabIndex={0}
          className="mb-1"
          key={player.id}
          data-user-id={player.id}
          data-user-name={player.user.name}
          onContextMenu={displayMenu}
          onClick={displayMenu}
          onKeyPress={displayMenu}
        >
          <UserInfo user={player.user} hideInfo hideOnlineIndicator />
        </div>
      ))}
    </>
  );
}

const chatHeaderClassName = cn(
  'col-lg-8 col-md-8 d-flex flex-column position-relative',
  'p-0 bg-light rounded-left h-sm-100 cb-lobby-widget-container w-100',
);

function LobbyChat({
  connectToChat,
  presenceList,
  setOpenActionModalShowing,
  inputRef,
}) {
  const messages = useSelector(selectors.chatMessagesSelector);
  const isOnline = useSelector(selectors.chatChannelStateSelector);

  const users = useMemo(
    () => presenceList.map(({ user }) => user),
    [presenceList],
  );

  useEffect(() => {
    const channel = connectToChat();

    return () => {
      if (channel) {
        channel.leave();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { menuId, menuRequest, displayMenu } = useChatContextMenu({
    type: 'lobby',
    users,
    canInvite: true,
  });

  const openSendMessageModal = useCallback(() => {
    setOpenActionModalShowing({ opened: true, action: 'sendMessage' });
  }, [setOpenActionModalShowing]);

  const openSendInviteModal = useCallback(() => {
    setOpenActionModalShowing({ opened: true, action: 'sendInvite' });
  }, [setOpenActionModalShowing]);

  useChatRooms('page');

  const activeRoom = useSelector(selectors.activeRoomSelector);
  const filteredMessages = messages.filter(message => shouldShowMessage(message, activeRoom));

  if (!presenceList) {
    return null;
  }

  return (
    <ChatContextMenu menuId={menuId} inputRef={inputRef} request={menuRequest}>
      <div className="d-flex flex-column flex-lg-row flex-md-row rounded shadow-sm mt-2">
        <div
          className={chatHeaderClassName}
        >
          <ChatHeader disabled={!isOnline} showRooms />
          <Messages displayMenu={displayMenu} messages={filteredMessages} />
          <ChatInput disabled={!isOnline} inputRef={inputRef} />
        </div>
        <div className="col-lg-4 col-md-4 p-0 pb-3 pb-sm-4 border-left bg-light rounded-right cb-players-container">
          <div className="d-flex flex-column h-100">
            <div className="d-flex justify-content-between">
              {isOnline ? (
                <p className="px-3 pt-2 mb-2 text-nowrap">
                  {`Online players: ${presenceList.length}`}
                </p>
              ) : (
                <div className="px-3 pt-2 mb-2 text-nowrap">
                  <Loading adaptive />
                </div>
              )}
              <div className="d-flex justify-items-center p-2">
                <button
                  type="button"
                  className="btn btn-sm p-0 rounded-lg mr-1"
                  onClick={openSendMessageModal}
                  disabled={!isOnline || presenceList.length <= 1}
                >
                  <FontAwesomeIcon
                    title="Send message"
                    className="text-dark"
                    icon={faEnvelope}
                  />
                </button>
                <button
                  type="button"
                  className="btn btn-sm p-0 rounded-lg"
                  onClick={openSendInviteModal}
                  disabled={!isOnline || presenceList.length <= 1}
                >
                  <img
                    title="Send fight invite"
                    alt="fight"
                    style={{ width: '16px', height: '16px' }}
                    src="/assets/images/fight-black.png"
                  />
                </button>
              </div>
            </div>
            <div className="d-flex px-3 flex-column align-items-start overflow-auto">
              <ChatGroupedPlayersList
                players={presenceList}
                displayMenu={displayMenu}
              />
            </div>
          </div>
        </div>
      </div>
    </ChatContextMenu>
  );
}

const mapDispatchToProps = {
  connectToChat: chatMiddlewares.connectToChat,
};

export default connect(null, mapDispatchToProps)(LobbyChat);
