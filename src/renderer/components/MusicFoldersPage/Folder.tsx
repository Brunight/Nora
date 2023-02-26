/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { AppUpdateContext } from 'renderer/contexts/AppUpdateContext';
import { AppContext } from 'renderer/contexts/AppContext';

import Img from '../Img';

import FolderImg from '../../../../assets/images/webp/empty-folder.webp';
import RemoveFolderConfirmationPrompt from '../SettingsPage/RemoveFolderConfirmationPrompt';
import MultipleSelectionCheckbox from '../MultipleSelectionCheckbox';
import BlacklistFolderConfrimPrompt from './BlacklistFolderConfirmPrompt';

type Props = {
  folderPath: string;
  songIds: string[];
  isBlacklisted: boolean;
  index: number;
};

const Folder = (props: Props) => {
  const {
    currentlyActivePage,
    isMultipleSelectionEnabled,
    multipleSelectionsData,
  } = React.useContext(AppContext);
  const {
    changeCurrentActivePage,
    updateContextMenuData,
    addNewNotifications,
    changePromptMenuData,
    updateMultipleSelections,
    toggleMultipleSelections,
  } = React.useContext(AppUpdateContext);

  const { folderPath, songIds, index, isBlacklisted = true } = props;
  const { length: noOfSongs } = songIds;

  const { folderName, prevDir } = React.useMemo(() => {
    if (folderPath) {
      const path = folderPath.split('\\');
      const name = path.pop() || 'Unknown Folder Name';

      return { prevDir: path.join('\\'), folderName: name };
    }
    return { prevDir: undefined, folderName: undefined };
  }, [folderPath]);

  const isAMultipleSelection = React.useMemo(() => {
    if (!multipleSelectionsData.isEnabled) return false;
    if (multipleSelectionsData.selectionType !== 'folder') return false;
    if (multipleSelectionsData.multipleSelections.length <= 0) return false;
    if (
      multipleSelectionsData.multipleSelections.some(
        (selectionId) => selectionId === folderPath
      )
    )
      return true;
    return false;
  }, [multipleSelectionsData, folderPath]);

  const openMusicFolderInfoPage = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (folderPath) {
        if (
          isMultipleSelectionEnabled &&
          multipleSelectionsData.selectionType === 'folder'
        )
          return updateMultipleSelections(
            folderPath,
            'folder',
            isAMultipleSelection ? 'remove' : 'add'
          );
        if (e.getModifierState('Shift') === true) {
          toggleMultipleSelections(!isMultipleSelectionEnabled, 'folder');
          return updateMultipleSelections(
            folderPath,
            'folder',
            isAMultipleSelection ? 'remove' : 'add'
          );
        }
        return currentlyActivePage.pageTitle === 'MusicFolderInfo' &&
          currentlyActivePage.data?.folderPath === folderPath
          ? changeCurrentActivePage('Home')
          : changeCurrentActivePage('MusicFolderInfo', {
              folderPath,
            });
      }
      return undefined;
    },
    [
      changeCurrentActivePage,
      currentlyActivePage.data?.folderPath,
      currentlyActivePage.pageTitle,
      folderPath,
      isAMultipleSelection,
      isMultipleSelectionEnabled,
      multipleSelectionsData.selectionType,
      toggleMultipleSelections,
      updateMultipleSelections,
    ]
  );

  const contextMenuItems = React.useMemo((): ContextMenuItem[] => {
    const { multipleSelections: folderPaths } = multipleSelectionsData;
    return [
      {
        label: isAMultipleSelection
          ? 'Toggle blacklist Folder'
          : isBlacklisted
          ? 'Restore from Blacklist'
          : 'Blacklist Folder',
        iconName: isAMultipleSelection
          ? 'settings_backup_restore'
          : isBlacklisted
          ? 'settings_backup_restore'
          : 'block',
        handlerFunction: () => {
          if (isBlacklisted)
            window.api
              .restoreBlacklistedFolders(
                isMultipleSelectionEnabled ? folderPaths : [folderPath]
              )
              .then(() =>
                addNewNotifications([
                  {
                    id: `${folderName}RestoredFromBlacklisted`,
                    delay: 5000,
                    content: (
                      <span>
                        &apos;
                        {isMultipleSelectionEnabled
                          ? `${folderPaths.length} folders`
                          : folderName}
                        &apos; restored from the blacklist.
                      </span>
                    ),
                    icon: (
                      <span className="material-icons-round">
                        settings_backup_restore
                      </span>
                    ),
                  },
                ])
              )
              .catch((err) => console.error(err));
          else
            changePromptMenuData(
              true,
              <BlacklistFolderConfrimPrompt
                folderName={folderName}
                folderPaths={
                  isMultipleSelectionEnabled ? folderPaths : [folderPath]
                }
              />
            );

          toggleMultipleSelections(false, 'folder');
        },
      },
      {
        label: 'Remove Folder',
        iconName: 'delete',
        iconClassName: 'material-icons-round-outlined',
        handlerFunction: () =>
          changePromptMenuData(
            true,
            <RemoveFolderConfirmationPrompt
              folderName={folderName || folderPath}
              absolutePath={folderPath}
            />,
            'delete-folder-confirmation-prompt'
          ),
        isDisabled: isMultipleSelectionEnabled,
      },
    ];
  }, [
    addNewNotifications,
    changePromptMenuData,
    folderName,
    folderPath,
    isAMultipleSelection,
    isBlacklisted,
    isMultipleSelectionEnabled,
    multipleSelectionsData,
    toggleMultipleSelections,
  ]);

  const contextMenuItemData: ContextMenuAdditionalData | undefined =
    isMultipleSelectionEnabled &&
    multipleSelectionsData.selectionType === 'folder' &&
    isAMultipleSelection
      ? {
          title: `${multipleSelectionsData.multipleSelections.length} selected folders`,
          artworkClassName: '!w-6',
          artworkPath: FolderImg,
        }
      : undefined;

  return (
    <div
      className={`group mb-2 flex h-16 w-full cursor-pointer items-center justify-between rounded-md px-4 py-2 odd:bg-background-color-2/50 hover:bg-background-color-2 dark:text-font-color-white dark:odd:bg-dark-background-color-2/30 dark:hover:bg-dark-background-color-2 ${
        isAMultipleSelection &&
        '!bg-background-color-3/90 !text-font-color-black dark:!bg-dark-background-color-3/90 dark:!text-font-color-black'
      } ${isBlacklisted && '!opacity-50'}`}
      onClick={openMusicFolderInfoPage}
      title={isBlacklisted ? `'${folderName}' is blacklisted.` : undefined}
      onContextMenu={(e) =>
        updateContextMenuData(
          true,
          contextMenuItems,
          e.pageX,
          e.pageY,
          contextMenuItemData
        )
      }
    >
      <div className="folder-img-and-info-container flex items-center">
        {multipleSelectionsData.selectionType === 'folder' ? (
          <div className="relative ml-1 mr-4 flex h-fit items-center rounded-lg bg-background-color-1 p-1 text-font-color-highlight dark:bg-dark-background-color-1 dark:text-dark-background-color-3">
            <MultipleSelectionCheckbox id={folderPath} selectionType="folder" />
          </div>
        ) : (
          <div className="relative ml-1 mr-4 h-fit rounded-2xl bg-background-color-1 px-3 text-font-color-highlight group-even:bg-background-color-2/75 group-hover:bg-background-color-1 dark:bg-dark-background-color-1 dark:text-dark-background-color-3 dark:group-even:bg-dark-background-color-2/50 dark:group-hover:bg-dark-background-color-1">
            {index + 1}
          </div>
        )}
        <Img src={FolderImg} className="w-8 self-center" />
        <div className="folder-info ml-6 flex flex-col">
          <span className="folder-name" title={`${prevDir}\\${folderName}`}>
            {folderName}
          </span>
          <div className="flex items-center opacity-75">
            <span className="no-of-songs mr-2 text-xs font-thin">
              {noOfSongs} song{noOfSongs === 1 ? '' : 's'}
            </span>
            <span className="invisible text-xs font-thin opacity-0 transition-[visibility,opacity] group-hover:visible group-hover:opacity-100">
              &bull;
              <span className="folder-path ml-2">{prevDir}</span>
            </span>
          </div>
        </div>
      </div>
      <div className="folder-states-container">
        {isBlacklisted && (
          <span
            className="material-icons-round-outlined text-2xl"
            title="This folder is blacklisted."
          >
            block
          </span>
        )}
      </div>
    </div>
  );
};

export default Folder;