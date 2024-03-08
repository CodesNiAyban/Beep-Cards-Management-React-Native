import React, { createContext, useContext, useEffect, useState } from 'react';
import UserInactivity from 'react-native-user-detector-active-inactive';
import RNExitApp from 'react-native-exit-app';
import SimpleToast from 'react-native-simple-toast'; // Import SimpleToast

interface UserInactivityContextType {
  resetTimer: () => void;
}

const UserInactivityContext = createContext<UserInactivityContextType>({ resetTimer: () => { } });

interface UserInactivityWrapperProps {
  children: React.ReactNode;
}

const UserInactivityWrapper: React.FC<UserInactivityWrapperProps> = ({ children }) => {
  const [timerKey, setTimerKey] = useState(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // const resetTimer = () => {
    //   clearTimeout(timeoutId); // Clear the previous timeout
    //   timeoutId = setTimeout(() => {
    //     // Perform the desired action on timeout (e.g., log out user)
    //     console.log('User inactive. Logging out...');
    //     SimpleToast.show('User inactive, closing app.', SimpleToast.SHORT, { tapToDismissEnabled: true, backgroundColor: '#172459' }); // Show error toast
    //     // RNExitApp.exitApp();
    //     // Add your logic here to log out the user or perform any other action
    //   }, 10000); // Timeout after 10 seconds
    // };

    resetTimer(); // Initial call to set the timer

    return () => {
      clearTimeout(timeoutId); // Clear the timeout when unmounting the component
    };
  }, []);

  const resetTimer = () => {
    // Generate a new key to reset the timer
    setTimerKey((prevKey) => prevKey + 1);
  };

  return (
    <UserInactivityContext.Provider value={{ resetTimer }}>
      <UserInactivity
        key={timerKey} // This key change will reset the timer
        timeForInactivity={3600} // 10 seconds of inactivity
        onHandleActiveInactive={() => {
          console.log('User inactive. Logging out...');
          SimpleToast.show('User inactive, closing app.', SimpleToast.SHORT, { tapToDismissEnabled: true, backgroundColor: '#172459' });
          RNExitApp.exitApp();
        }} // Reset the timer on activity
      >
        {children}
      </UserInactivity>
    </UserInactivityContext.Provider>
  );
};

export default UserInactivityWrapper;

export const useUserInactivity = () => useContext(UserInactivityContext);
