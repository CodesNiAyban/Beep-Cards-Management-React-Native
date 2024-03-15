// UserActivityDetector.tsx
import React, { createContext, useContext, useState } from 'react';
import UserInactivity from 'react-native-user-detector-active-inactive';
import AppTimeOutModal from './AppTimeOutModal'; // Import ConfirmationModal

interface UserInactivityContextType {
  resetTimer: () => void;
}

const UserInactivityContext = createContext<UserInactivityContextType>({ resetTimer: () => { } });

interface UserInactivityWrapperProps {
  children: React.ReactNode;
}

const UserInactivityWrapper: React.FC<UserInactivityWrapperProps> = ({ children }) => {
  const [timerKey, setTimerKey] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false); // State to manage modal visibilit

  const resetTimer = () => {
    setTimerKey(prevKey => prevKey + 1);
  };

  return (
    <>
      <UserInactivityContext.Provider value={{ resetTimer }}>
        <UserInactivity
          key={timerKey}
          timeForInactivity={300}
          onHandleActiveInactive={() => {
            setIsModalVisible(true);
          }}
          skipKeyboard={true}
        >
          {children}
        </UserInactivity>
      </UserInactivityContext.Provider>
      <AppTimeOutModal // Render the modal
        isVisible={isModalVisible}
        onClose={() => { }}
        title="Beep™ App Inactive"
        message="Launch the app again to use."
      />
    </>
  );
};

export default UserInactivityWrapper;

export const useUserInactivity = () => useContext(UserInactivityContext);
