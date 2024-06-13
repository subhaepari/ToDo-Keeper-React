import React, { useState, useEffect } from "react";

const loginUserIdKey = "todo-keeper-loginuser-id";

const initialValue = 0;

// Read user id from local Storage 
function useGetLoginUserId() {

  const [value, setValue] = useState(() => {
    
            const loginUserId = localStorage.getItem(loginUserIdKey);
        
            try {
            if (typeof loginUserId != "undefined" && loginUserId != null)  return parseInt(loginUserId);
            } catch (err) {
            return initialValue;
            }
            
            return initialValue;
    
  });

         return [value, setValue];
}

export default useGetLoginUserId;
