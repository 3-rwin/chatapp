import { useContext, createContext, useReducer } from 'react';
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({children}) => {
    const { currentUser } = useContext(AuthContext);
    // When you need to change 2 or more useState entries at the same time
    // Or when you need to update single or multiple values in large arrays
    // it is better to use useReducer
    const INITIAL_STATE = {
        chatId:"null",
        user:{},
    };

    const chatReducer = (state,action)=> {
        switch(action.type){
            case "CHANGE_USER":
                return {
                    user:action.payload,
                    chatId: 
                        currentUser.uid > action.payload.uid
                        ? currentUser.uid + action.payload.uid
                        : action.payload.uid + currentUser.uid,
                }
            
            default:
                return state;
        }
    }

    const [state,dispatch] = useReducer(chatReducer, INITIAL_STATE);

    return (
        // Route the children
        <ChatContext.Provider value={{data:state, dispatch}}>
            {children}
        </ChatContext.Provider>
    )
}