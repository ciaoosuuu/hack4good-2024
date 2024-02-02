import { useState } from 'react';

const withAuth = (Component, role) => {
  role = role || false;

  const getRole = async (userEmail) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_MAIN_SERVER_URL}/users/get-role?email=${userEmail}`);
      const jsonData = await response.json();
      return jsonData[0].role
    } catch (error) {
      console.log(error);
    }
  };

  return props => {
    const { user, isLoading } = useUser()
    const [userRole , setUserRole] = useState("");

    if (isLoading) {
      return <p>Loading...</p>
    }

    if (!user) {
      // return <redirect back to /account/login>
      return
    } else {
      if (role) {
        // console.log("role is :" + role);
        getRole(user.email).then(role => setUserRole(role));
      
        return <Component user={user} isLoading={isLoading} role={userRole} {...props}/>
      }
      // console.log("role is false!")
      return <Component user={user} isLoading={isLoading} {...props}/>  
    }
  }
};

export default withAuth;
