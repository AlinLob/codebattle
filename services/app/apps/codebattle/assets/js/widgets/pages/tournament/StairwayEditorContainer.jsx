import React from 'react';

import find from 'lodash/find';
import { useSelector } from 'react-redux';

import Editor from '../../components/Editor';
import { currentUserIdSelector } from '../../selectors';

function StairwayEditorContainer({ playerId }) {
  const editable = useSelector(currentUserIdSelector) === playerId;
  // TODO: create selector
  const playerData = useSelector(state => find(state.stairwayGame.game?.players, { id: playerId }));

  if (!playerData) {
    return null;
  }
  return (
    <Editor
      value={playerData.editorText}
      editable={editable}
      syntax={playerData.editorLang}
      onChange={() => {}}
      checkResult={() => {}}
      mode="default"
      theme="vs-dark"
    />
  );
}

export default StairwayEditorContainer;
